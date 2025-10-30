# Ktor 3.3.1 Client & Server Best Practices

## Ktor Client (Multiplatform)

### Client Configuration

```kotlin
fun createHttpClient(): HttpClient {
    return HttpClient {
        // JSON serialization
        install(ContentNegotiation) {
            json(Json {
                ignoreUnknownKeys = true
                isLenient = true
                encodeDefaults = true
                prettyPrint = true
            })
        }
        
        // Logging
        install(Logging) {
            logger = Logger.DEFAULT
            level = LogLevel.INFO
        }
        
        // Timeouts
        install(HttpTimeout) {
            requestTimeoutMillis = 30_000
            connectTimeoutMillis = 10_000
        }
        
        // Authentication
        install(Auth) {
            bearer {
                loadTokens {
                    BearerTokens(
                        accessToken = tokenStorage.getAccessToken(),
                        refreshToken = tokenStorage.getRefreshToken()
                    )
                }
                refreshTokens {
                    val refreshToken = tokenStorage.getRefreshToken()
                    val response = client.post("auth/refresh") {
                        setBody(RefreshTokenRequest(refreshToken))
                    }.body<TokenResponse>()
                    
                    tokenStorage.saveTokens(response.accessToken, response.refreshToken)
                    
                    BearerTokens(
                        accessToken = response.accessToken,
                        refreshToken = response.refreshToken
                    )
                }
            }
        }
        
        // Default request config
        defaultRequest {
            url("https://api.auraflow.com/")
            contentType(ContentType.Application.Json)
        }
    }
}
```

### API Client Implementation

```kotlin
class ProductApiClient(private val client: HttpClient) {
    
    suspend fun getProducts(): List<ProductDto> {
        return client.get("products").body()
    }
    
    suspend fun getProductById(id: String): ProductDto {
        return client.get("products/$id").body()
    }
    
    suspend fun createProduct(product: CreateProductRequest): ProductDto {
        return client.post("products") {
            setBody(product)
        }.body()
    }
    
    suspend fun updateProduct(id: String, product: UpdateProductRequest): ProductDto {
        return client.put("products/$id") {
            setBody(product)
        }.body()
    }
    
    suspend fun deleteProduct(id: String) {
        client.delete("products/$id")
    }
    
    suspend fun searchProducts(query: String): List<ProductDto> {
        return client.get("products/search") {
            parameter("q", query)
        }.body()
    }
}
```

### WebSocket Client

```kotlin
class WebSocketClient(private val client: HttpClient) {
    private var session: DefaultClientWebSocketSession? = null
    
    suspend fun connect(token: String) {
        session = client.webSocketSession {
            url("wss://api.auraflow.com/ws/orders")
            header("Authorization", "Bearer $token")
        }
        
        session?.incoming?.consumeEach { frame ->
            when (frame) {
                is Frame.Text -> {
                    val message = Json.decodeFromString<WSMessage>(frame.readText())
                    handleMessage(message)
                }
            }
        }
    }
    
    suspend fun send(message: WSMessage) {
        session?.send(Frame.Text(Json.encodeToString(message)))
    }
    
    fun disconnect() {
        session?.cancel()
        session = null
    }
}
```

### Client Best Practices

**DO ✅**

- Use `ContentNegotiation` with kotlinx.serialization
- Add `Logging` for debugging
- Set `HttpTimeout` for all requests
- Use `Auth` plugin for JWT tokens
- Implement token refresh logic
- Use `.body<T>()` for response parsing (Ktor 3.0+)
- Handle network errors with try-catch
- Close client when done
- Use platform-specific engines (OkHttp/Darwin/CIO)

**DON'T ❌**

- Create multiple HttpClient instances
- Forget to close HttpClient
- Block main thread with network calls
- Skip error handling
- Hardcode URLs
- Log sensitive data (tokens, passwords)

---

## Ktor Server (JVM)

### Server Setup

```kotlin
fun main() {
    embeddedServer(
        factory = Netty,
        port = System.getenv("PORT")?.toIntOrNull() ?: 8080,
        host = "0.0.0.0",
        module = Application::module
    ).start(wait = true)
}

fun Application.module() {
    configureContentNegotiation()
    configureCORS()
    configureStatusPages()
    configureWebSockets()
    configureAuthentication()
    configureCallLogging()
    configureRouting()
    configureDatabase()
}
```

### Server Plugins

```kotlin
// Content Negotiation
fun Application.configureContentNegotiation() {
    install(ContentNegotiation) {
        json(Json {
            prettyPrint = true
            isLenient = true
            ignoreUnknownKeys = true
            encodeDefaults = true
        })
    }
}

// CORS
fun Application.configureCORS() {
    install(CORS) {
        val allowedHosts = System.getenv("ALLOWED_HOSTS")?.split(",") ?: listOf("*")
        
        if (allowedHosts.contains("*")) {
            anyHost()
        } else {
            allowedHosts.forEach { host ->
                allowHost(host, schemes = listOf("http", "https"))
            }
        }
        
        allowHeader(HttpHeaders.ContentType)
        allowHeader(HttpHeaders.Authorization)
        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Post)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Delete)
        allowCredentials = true
        maxAgeInSeconds = 3600
    }
}

// Status Pages (Error Handling)
fun Application.configureStatusPages() {
    install(StatusPages) {
        exception<Throwable> { call, cause ->
            logger.error("Unhandled exception", cause)
            
            val (status, message) = when (cause) {
                is IllegalArgumentException -> HttpStatusCode.BadRequest to cause.message
                is NoSuchElementException -> HttpStatusCode.NotFound to cause.message
                is SecurityException -> HttpStatusCode.Forbidden to "Access denied"
                else -> HttpStatusCode.InternalServerError to "Internal server error"
            }
            
            call.respond(
                status,
                ErrorResponse(
                    error = status.description,
                    message = message ?: "Error occurred",
                    statusCode = status.value
                )
            )
        }
    }
}

// JWT Authentication
fun Application.configureAuthentication() {
    install(Authentication) {
        jwt("auth-jwt") {
            realm = JwtConfig.realm
            verifier(JwtConfig.verifier)
            
            validate { credential ->
                val userId = credential.payload.getClaim("userId").asString()
                if (!userId.isNullOrEmpty()) {
                    JWTPrincipal(credential.payload)
                } else null
            }
            
            challenge { _, _ ->
                call.respond(
                    HttpStatusCode.Unauthorized,
                    ErrorResponse("Unauthorized", "Invalid or expired token", 401)
                )
            }
        }
    }
}

// WebSocket
fun Application.configureWebSockets() {
    install(WebSockets) {
        pingPeriod = Duration.ofSeconds(15)
        timeout = Duration.ofSeconds(15)
        maxFrameSize = Long.MAX_VALUE
        masking = false
    }
}

// Call Logging
fun Application.configureCallLogging() {
    install(CallLogging) {
        level = Level.INFO
        filter { call -> call.request.path().startsWith("/api") }
        format { call ->
            val status = call.response.status()
            val method = call.request.httpMethod.value
            val path = call.request.path()
            "[$method] $path - $status"
        }
    }
}
```

### Route Implementation

```kotlin
fun Route.productRoutes(repository: ProductRepository) {
    authenticate("auth-jwt") {
        route("/api/products") {
            // Get all products
            get {
                val products = repository.getAll()
                call.respond(HttpStatusCode.OK, SuccessResponse(data = products))
            }
            
            // Get by ID
            get("/{id}") {
                val id = call.parameters["id"] 
                    ?: throw IllegalArgumentException("Invalid ID")
                
                val product = repository.getById(id)
                    ?: throw NoSuchElementException("Product not found")
                
                call.respond(HttpStatusCode.OK, SuccessResponse(data = product))
            }
            
            // Create
            post {
                val request = call.receive<CreateProductRequest>()
                validateProduct(request) // Throws ValidationException
                
                val product = repository.create(request)
                call.respond(
                    HttpStatusCode.Created,
                    SuccessResponse(data = product, message = "Product created")
                )
            }
            
            // Update
            put("/{id}") {
                val id = call.parameters["id"]
                    ?: throw IllegalArgumentException("Invalid ID")
                val request = call.receive<UpdateProductRequest>()
                
                val product = repository.update(id, request)
                    ?: throw NoSuchElementException("Product not found")
                
                call.respond(
                    HttpStatusCode.OK,
                    SuccessResponse(data = product, message = "Product updated")
                )
            }
            
            // Delete
            delete("/{id}") {
                val id = call.parameters["id"]
                    ?: throw IllegalArgumentException("Invalid ID")
                
                repository.delete(id)
                call.respond(
                    HttpStatusCode.OK,
                    SuccessResponse(data = mapOf("deleted" to true))
                )
            }
        }
    }
}
```

### Server Best Practices

**DO ✅**

- Install all necessary plugins (ContentNegotiation, CORS, StatusPages, etc.)
- Use JWT for authentication
- Implement proper error handling with StatusPages
- Use environment variables for configuration
- Log requests with CallLogging
- Use authentication on protected routes
- Return consistent response formats
- Validate input
- Use proper HTTP status codes
- Handle database transactions properly

**DON'T ❌**

- Hardcode secrets
- Expose stack traces to clients
- Skip error handling
- Allow any origin in production CORS
- Forget to validate input
- Block threads with blocking operations
- Log sensitive data
- Return raw database entities
- Use synchronous database calls

---

## Environment Configuration

### Server `.env`

```bash
# Server
PORT=8080
HOST=0.0.0.0

# Database
DATABASE_URL=jdbc:postgresql://localhost:5432/auraflow_pos
DATABASE_USER=postgres
DATABASE_PASSWORD=secure_password

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_ISSUER=auraflow-pos
JWT_AUDIENCE=auraflow-clients

# CORS
ALLOWED_HOSTS=http://localhost:3000,https://yourdomain.com

# Environment
KTOR_ENV=development

# Redis (optional)
REDIS_URL=redis://localhost:6379
```

### Client Configuration

```kotlin
object ApiConfig {
    val BASE_URL = when {
        BuildConfig.DEBUG -> "http://localhost:8080/"
        else -> "https://api.auraflow.com/"
    }
    
    const val TIMEOUT_MS = 30_000L
    const val CONNECT_TIMEOUT_MS = 10_000L
}
```

---

## Error Response Format

```kotlin
@Serializable
data class ErrorResponse(
    val error: String,
    val message: String,
    val statusCode: Int,
    val timestamp: Long = System.currentTimeMillis()
)

@Serializable
data class ValidationErrorResponse(
    val error: String = "Validation Error",
    val message: String,
    val statusCode: Int = 400,
    val fieldErrors: Map<String, String>,
    val timestamp: Long = System.currentTimeMillis()
)

@Serializable
data class SuccessResponse<T>(
    val success: Boolean = true,
    val data: T,
    val message: String? = null,
    val timestamp: Long = System.currentTimeMillis()
)
```

---

## Summary

### Client Checklist

- ✅ Use ContentNegotiation with JSON
- ✅ Add Logging for debugging
- ✅ Set timeouts
- ✅ Implement JWT auth with refresh
- ✅ Handle errors gracefully
- ✅ Use platform-specific engines
- ✅ Close client when done

### Server Checklist

- ✅ Install all plugins
- ✅ Configure CORS properly
- ✅ Implement JWT authentication
- ✅ Add error handling (StatusPages)
- ✅ Use environment variables
- ✅ Log requests
- ✅ Validate input
- ✅ Return consistent responses
- ✅ Use proper HTTP status codes
