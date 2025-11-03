package com.theauraflow.pos.server.plugins

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import io.ktor.server.application.*
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction
import com.theauraflow.pos.server.database.tables.*
import co.touchlab.kermit.Logger

/**
 * Configures database connection and creates tables.
 */
fun Application.configureDatabase() {
    val logger = Logger.withTag("Database")

    try {
        // Database configuration from environment variables
        val databaseUrl =
            System.getenv("DATABASE_URL") ?: "jdbc:postgresql://localhost:5432/auraflow_pos"
        val dbUser = System.getenv("DATABASE_USER") ?: "postgres"
        val dbPassword = System.getenv("DATABASE_PASSWORD") ?: "postgres"

        // Configure HikariCP connection pool
        val config = HikariConfig().apply {
            jdbcUrl = databaseUrl
            username = dbUser
            password = dbPassword
            driverClassName = "org.postgresql.Driver"
            maximumPoolSize = 10
            isAutoCommit = false
            transactionIsolation = "TRANSACTION_REPEATABLE_READ"
            validate()
        }

        val dataSource = HikariDataSource(config)

        // Connect Exposed to the database
        Database.connect(dataSource)

        // Create tables if they don't exist
        transaction {
            logger.i { "Creating database tables..." }

            SchemaUtils.create(
                UsersTable,
                ProductsTable,
                CategoriesTable,
                CustomersTable,
                OrdersTable,
                OrderItemsTable,
                SyncOrdersTable,
                SyncOrderItemsTable,
                TransactionsTable
            )

            logger.i { "Database tables created successfully" }
        }
    } catch (t: Throwable) {
        logger.w { "Skipping database initialization: ${t.message}" }
    }
}
