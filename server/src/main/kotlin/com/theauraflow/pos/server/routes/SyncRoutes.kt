package com.theauraflow.pos.server.routes

import com.theauraflow.pos.domain.model.*
import com.theauraflow.pos.server.database.tables.*
import com.theauraflow.pos.server.util.ErrorResponse
import com.theauraflow.pos.server.util.TimeUtils
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.SqlExpressionBuilder.neq
import org.jetbrains.exposed.sql.SqlExpressionBuilder.greater
import org.jetbrains.exposed.sql.transactions.transaction
import co.touchlab.kermit.Logger
import java.security.MessageDigest
import org.jetbrains.exposed.sql.kotlin.datetime.CurrentDateTime

/**
 * Sync API routes for synchronizing data between client and server.
 */
fun Route.syncRoutes() {
    val logger = Logger.withTag("SyncRoutes")

    route("/sync") {
        /**
         * Batch sync endpoint - handles multiple orders and transactions in one request.
         * POST /api/sync/batch
         */
        post("/batch") {
            try {
                val request = call.receive<BatchSyncRequest>()
                logger.i { "Batch sync request from device: ${request.deviceId}" }
                logger.i { "Orders: ${request.orders.size}, Transactions: ${request.transactions.size}" }

                val response = transaction {
                    val syncedOrders = request.orders.map { syncableOrder ->
                        syncOrder(syncableOrder, logger)
                    }

                    val syncedTransactions = request.transactions.map { syncableTransaction ->
                        syncTransaction(syncableTransaction, logger)
                    }

                    // Get server updates (other devices' changes) since last sync
                    val serverUpdates =
                        getServerUpdates(request.deviceId, request.lastSyncTimestamp)

                    BatchSyncResponse(
                        success = true,
                        syncedOrders = syncedOrders,
                        syncedTransactions = syncedTransactions,
                        serverUpdates = serverUpdates,
                        nextSyncToken = TimeUtils.nowEpochMillis().toString()
                    )
                }

                call.respond(HttpStatusCode.OK, response)
            } catch (e: Exception) {
                logger.e(e) { "Batch sync failed" }
                call.respond(
                    HttpStatusCode.InternalServerError,
                    ErrorResponse(
                        error = "SYNC_FAILED",
                        message = e.message ?: "Failed to sync data",
                        statusCode = 500,
                        timestamp = TimeUtils.nowEpochMillis()
                    )
                )
            }
        }

        /**
         * Sync single order.
         * POST /api/sync/order
         */
        post("/order") {
            try {
                val syncableOrder = call.receive<SyncableOrder>()
                logger.i { "Syncing order: ${syncableOrder.localId}" }

                val response = transaction {
                    syncOrder(syncableOrder, logger)
                }

                call.respond(HttpStatusCode.OK, response)
            } catch (e: Exception) {
                logger.e(e) { "Order sync failed" }
                call.respond(
                    HttpStatusCode.InternalServerError,
                    ErrorResponse(
                        error = "SYNC_FAILED",
                        message = e.message ?: "Failed to sync order",
                        statusCode = 500,
                        timestamp = TimeUtils.nowEpochMillis()
                    )
                )
            }
        }

        /**
         * Sync single transaction.
         * POST /api/sync/transaction
         */
        post("/transaction") {
            try {
                val syncableTransaction = call.receive<SyncableTransaction>()
                logger.i { "Syncing transaction: ${syncableTransaction.localId}" }

                val response = transaction {
                    syncTransaction(syncableTransaction, logger)
                }

                call.respond(HttpStatusCode.OK, response)
            } catch (e: Exception) {
                logger.e(e) { "Transaction sync failed" }
                call.respond(
                    HttpStatusCode.InternalServerError,
                    ErrorResponse(
                        error = "SYNC_FAILED",
                        message = e.message ?: "Failed to sync transaction",
                        statusCode = 500,
                        timestamp = TimeUtils.nowEpochMillis()
                    )
                )
            }
        }

        /**
         * Get server updates for a device.
         * GET /api/sync/updates?deviceId={deviceId}&since={timestamp}
         */
        get("/updates") {
            try {
                val deviceId = call.request.queryParameters["deviceId"]
                    ?: return@get call.respond(
                        HttpStatusCode.BadRequest,
                        ErrorResponse(
                            error = "MISSING_DEVICE_ID",
                            message = "Device ID is required",
                            statusCode = 400,
                            timestamp = TimeUtils.nowEpochMillis()
                        )
                    )

                val since = call.request.queryParameters["since"]?.toLongOrNull()

                val serverUpdates = transaction {
                    getServerUpdates(deviceId, since)
                }

                call.respond(HttpStatusCode.OK, serverUpdates)
            } catch (e: Exception) {
                logger.e(e) { "Failed to get server updates" }
                call.respond(
                    HttpStatusCode.InternalServerError,
                    ErrorResponse(
                        error = "FETCH_FAILED",
                        message = e.message ?: "Failed to fetch server updates",
                        statusCode = 500,
                        timestamp = TimeUtils.nowEpochMillis()
                    )
                )
            }
        }
    }
}

/**
 * Sync a single order to the server.
 * Handles duplicate detection and conflict resolution.
 */
private fun syncOrder(syncableOrder: SyncableOrder, logger: Logger): SyncResponse {
    val order = syncableOrder.order
    val nowExpr = CurrentDateTime

    // Check if order already exists by localId (prevents duplicates)
    val existingOrder = SyncOrdersTable
        .selectAll()
        .where { SyncOrdersTable.localId eq syncableOrder.localId }
        .singleOrNull()

    return if (existingOrder == null) {
        // New order - insert
        logger.i { "Inserting new order: ${syncableOrder.localId}" }

        SyncOrdersTable.insert {
             it[id] = order.id
             it[localId] = syncableOrder.localId
             it[orderNumber] = order.orderNumber
             it[customerId] = order.customerId
             it[customerName] = order.customerName
             it[tableId] = order.tableId
             it[orderTableName] = order.tableName
             it[subtotal] = order.subtotal.toBigDecimal()
             it[tax] = order.tax.toBigDecimal()
             it[discount] = order.discount.toBigDecimal()
             it[total] = order.total.toBigDecimal()
             it[paymentMethod] = order.paymentMethod.name
             it[paymentStatus] = order.paymentStatus.name
             it[orderStatus] = order.orderStatus.name
             it[notes] = order.notes
             it[deviceId] = syncableOrder.deviceId
             it[syncVersion] = syncableOrder.syncVersion
             it[serverHash] = calculateHash(order)
            it[createdAt] = nowExpr
            it[completedAt] = null
            it[updatedAt] = nowExpr
        }

        // Insert order items
        order.items.forEach { item ->
            SyncOrderItemsTable.insert {
                it[id] = "${order.id}_${item.product.id}"
                it[orderId] = order.id
                it[productId] = item.product.id
                it[productName] = item.product.name
                it[quantity] = item.quantity
                it[unitPrice] = item.product.price.toBigDecimal()
                it[subtotal] = item.subtotal.toBigDecimal()
                it[notes] = item.notes
                it[createdAt] = nowExpr
            }
        }

        SyncResponse(
            success = true,
            serverId = order.id,
            syncedAt = TimeUtils.nowEpochMillis()
        )
    } else {
        // Order exists - check for conflicts
        val serverVersion = existingOrder[SyncOrdersTable.syncVersion]
        val serverHash = existingOrder[SyncOrdersTable.serverHash]
        val clientHash = calculateHash(order)

        if (serverHash == clientHash) {
            // No changes - already in sync
            logger.i { "Order ${syncableOrder.localId} already in sync" }
            SyncResponse(
                success = true,
                serverId = existingOrder[SyncOrdersTable.id],
                syncedAt = TimeUtils.nowEpochMillis(),
                message = "Already in sync"
            )
        } else if (syncableOrder.syncVersion > serverVersion) {
            // Client version is newer - update server
            logger.i { "Updating order ${syncableOrder.localId} with client version" }
            SyncOrdersTable.update({ SyncOrdersTable.localId eq syncableOrder.localId }) { statement ->
                statement[SyncOrdersTable.subtotal] = order.subtotal.toBigDecimal()
                statement[SyncOrdersTable.tax] = order.tax.toBigDecimal()
                statement[SyncOrdersTable.discount] = order.discount.toBigDecimal()
                statement[SyncOrdersTable.total] = order.total.toBigDecimal()
                statement[SyncOrdersTable.paymentStatus] = order.paymentStatus.name
                statement[SyncOrdersTable.orderStatus] = order.orderStatus.name
                statement[SyncOrdersTable.notes] = order.notes
                statement[SyncOrdersTable.syncVersion] = syncableOrder.syncVersion
                statement[SyncOrdersTable.serverHash] = clientHash
                statement[SyncOrdersTable.updatedAt] = CurrentDateTime
            }

            SyncResponse(
                success = true,
                serverId = existingOrder[SyncOrdersTable.id],
                syncedAt = TimeUtils.nowEpochMillis()
            )
        } else {
            // Server version is newer - conflict!
            logger.w { "Conflict detected for order ${syncableOrder.localId}" }

            SyncResponse(
                success = false,
                serverId = existingOrder[SyncOrdersTable.id],
                syncedAt = TimeUtils.nowEpochMillis(),
                message = "Conflict detected - server version is newer",
                conflicts = listOf(
                    ConflictInfo(
                        field = "order",
                        localValue = clientHash ?: "",
                        serverValue = serverHash ?: "",
                        resolution = ConflictResolution.SERVER_WINS
                    )
                )
            )
        }
    }
}

/**
 * Sync a single transaction to the server.
 */
private fun syncTransaction(
    syncableTransaction: SyncableTransaction,
    logger: Logger
): SyncResponse {
    val txn = syncableTransaction.transaction
    val nowExpr2 = CurrentDateTime

    // Check if transaction already exists by localId
    val existingTransaction = TransactionsTable
        .selectAll()
        .where { TransactionsTable.localId eq syncableTransaction.localId }
        .singleOrNull()

    return if (existingTransaction == null) {
        // New transaction - insert
        logger.i { "Inserting new transaction: ${syncableTransaction.localId}" }

        TransactionsTable.insert {
             it[id] = txn.id
             it[localId] = syncableTransaction.localId
             it[referenceNumber] = txn.referenceNumber
             it[orderId] = txn.orderId
             it[orderNumber] = txn.orderNumber
             it[type] = txn.type.name
             it[amount] = txn.amount.toBigDecimal()
             it[paymentMethod] = txn.paymentMethod.name
             it[status] = txn.status.name
             it[userId] = txn.userId
             it[userName] = txn.userName
             it[notes] = txn.notes
             it[deviceId] = syncableTransaction.deviceId
             it[syncVersion] = syncableTransaction.syncVersion
             it[serverHash] = calculateHash(txn)
            it[createdAt] = nowExpr2
            it[completedAt] = null
            it[updatedAt] = nowExpr2
         }

        SyncResponse(
            success = true,
            serverId = txn.id,
            syncedAt = TimeUtils.nowEpochMillis()
        )
    } else {
        // Transaction exists - check for conflicts
        val serverHash = existingTransaction[TransactionsTable.serverHash]
        val clientHash = calculateHash(txn)

        if (serverHash == clientHash) {
            // Already in sync
            logger.i { "Transaction ${syncableTransaction.localId} already in sync" }
            SyncResponse(
                success = true,
                serverId = existingTransaction[TransactionsTable.id],
                syncedAt = TimeUtils.nowEpochMillis(),
                message = "Already in sync"
            )
        } else {
            // Transactions are immutable - conflicts shouldn't happen
            logger.w { "Unexpected conflict for transaction ${syncableTransaction.localId}" }
            SyncResponse(
                success = false,
                serverId = existingTransaction[TransactionsTable.id],
                syncedAt = TimeUtils.nowEpochMillis(),
                message = "Transaction already exists with different data"
            )
        }
    }
}

/**
 * Get server updates for a device.
 * Returns orders and transactions created/modified by other devices.
 */
private fun getServerUpdates(deviceId: String, sinceTimestamp: Long?): ServerUpdates {
    // Get orders from other devices
    val ordersQuery = SyncOrdersTable
        .selectAll()
        .where { SyncOrdersTable.deviceId neq deviceId }

    val orders = ordersQuery.map { row ->
        // Convert database row to SyncableOrder
        val order = com.theauraflow.pos.domain.model.Order(
            id = row[SyncOrdersTable.id],
            orderNumber = row[SyncOrdersTable.orderNumber],
            items = emptyList(), // TODO: Load items from SyncOrderItemsTable
            customerId = row[SyncOrdersTable.customerId],
            customerName = row[SyncOrdersTable.customerName],
            tableId = row[SyncOrdersTable.tableId],
            tableName = row[SyncOrdersTable.orderTableName],
            subtotal = row[SyncOrdersTable.subtotal].toDouble(),
            tax = row[SyncOrdersTable.tax].toDouble(),
            discount = row[SyncOrdersTable.discount].toDouble(),
            total = row[SyncOrdersTable.total].toDouble(),
            paymentMethod = com.theauraflow.pos.domain.model.PaymentMethod.valueOf(row[SyncOrdersTable.paymentMethod]),
            paymentStatus = com.theauraflow.pos.domain.model.PaymentStatus.valueOf(row[SyncOrdersTable.paymentStatus]),
            orderStatus = com.theauraflow.pos.domain.model.OrderStatus.valueOf(row[SyncOrdersTable.orderStatus]),
            notes = row[SyncOrdersTable.notes],
            createdAt = TimeUtils.nowEpochMillis(),
            completedAt = null
        )

        SyncableOrder(
            order = order,
            localId = row[SyncOrdersTable.localId],
            syncStatus = SyncStatus.SYNCED,
            lastSyncedAt = TimeUtils.nowEpochMillis(),
            syncVersion = row[SyncOrdersTable.syncVersion],
            deviceId = row[SyncOrdersTable.deviceId],
            serverHash = row[SyncOrdersTable.serverHash]
        )
    }

    // Get transactions from other devices
    val transactionsQuery = TransactionsTable
        .selectAll()
        .where { TransactionsTable.deviceId neq deviceId }

    val transactions = transactionsQuery.map { row ->
        val txn = com.theauraflow.pos.domain.model.Transaction(
            id = row[TransactionsTable.id],
            referenceNumber = row[TransactionsTable.referenceNumber],
            orderId = row[TransactionsTable.orderId],
            orderNumber = row[TransactionsTable.orderNumber],
            type = com.theauraflow.pos.domain.model.TransactionType.valueOf(row[TransactionsTable.type]),
            amount = row[TransactionsTable.amount].toDouble(),
            paymentMethod = com.theauraflow.pos.domain.model.PaymentMethod.valueOf(row[TransactionsTable.paymentMethod]),
            status = com.theauraflow.pos.domain.model.TransactionStatus.valueOf(row[TransactionsTable.status]),
            userId = row[TransactionsTable.userId],
            userName = row[TransactionsTable.userName],
            notes = row[TransactionsTable.notes],
            createdAt = TimeUtils.nowEpochMillis(),
            completedAt = null
        )

        SyncableTransaction(
            transaction = txn,
            localId = row[TransactionsTable.localId],
            syncStatus = SyncStatus.SYNCED,
            lastSyncedAt = TimeUtils.nowEpochMillis(),
            syncVersion = row[TransactionsTable.syncVersion],
            deviceId = row[TransactionsTable.deviceId],
            serverHash = row[TransactionsTable.serverHash]
        )
    }

    return ServerUpdates(
        orders = orders,
        transactions = transactions
    )
}

/**
 * Calculate hash of entity for conflict detection.
 */
private fun calculateHash(entity: Any): String {
    val md = MessageDigest.getInstance("SHA-256")
    val bytes = entity.toString().toByteArray()
    val digest = md.digest(bytes)
    return digest.joinToString("") { "%02x".format(it) }
}
