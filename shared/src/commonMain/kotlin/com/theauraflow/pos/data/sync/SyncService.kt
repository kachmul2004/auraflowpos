package com.theauraflow.pos.data.sync

import com.theauraflow.pos.domain.model.*
import com.theauraflow.pos.data.local.LocalStorage
import com.theauraflow.pos.util.currentTimeMillis
import co.touchlab.kermit.Logger
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.http.*
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

/**
 * Service for syncing data with the server.
 * Handles background sync, conflict resolution, and offline-first behavior.
 */
class SyncService(
    private val httpClient: HttpClient,
    private val localStorage: LocalStorage,
    private val deviceId: String,
    private val baseUrl: String = "http://localhost:8080"
) {
    private val logger = Logger.withTag("SyncService")
    private val json = Json { ignoreUnknownKeys = true }

    // Sync state
    private val _syncState = MutableStateFlow<SyncState>(SyncState.Idle)
    val syncState: StateFlow<SyncState> = _syncState.asStateFlow()

    private var syncJob: Job? = null

    // Keys for local storage
    private companion object {
        const val KEY_SYNCABLE_ORDERS = "syncable_orders"
        const val KEY_SYNCABLE_TRANSACTIONS = "syncable_transactions"
        const val KEY_LAST_SYNC_TIMESTAMP = "last_sync_timestamp"
        const val KEY_DEVICE_ID = "device_id"
    }

    /**
     * Initialize sync service and start background sync.
     */
    suspend fun initialize() {
        logger.i { "Initializing SyncService for device: $deviceId" }

        // Save device ID
        saveDeviceId(deviceId)

        // Start background sync (every 30 seconds)
        startBackgroundSync(intervalSeconds = 30)
    }

    /**
     * Start periodic background sync.
     */
    fun startBackgroundSync(intervalSeconds: Int = 30) {
        syncJob?.cancel()
        syncJob = CoroutineScope(Dispatchers.Default).launch {
            while (isActive) {
                try {
                    syncWithServer()
                    delay(intervalSeconds * 1000L)
                } catch (e: Exception) {
                    logger.e(e) { "Background sync failed" }
                    delay(intervalSeconds * 1000L) // Retry after interval
                }
            }
        }
        logger.i { "Background sync started (interval: ${intervalSeconds}s)" }
    }

    /**
     * Stop background sync.
     */
    fun stopBackgroundSync() {
        syncJob?.cancel()
        syncJob = null
        logger.i { "Background sync stopped" }
    }

    /**
     * Save an order for syncing.
     */
    suspend fun saveOrderForSync(order: Order) {
        val syncableOrder = SyncableOrder.fromOrder(
            order = order,
            deviceId = deviceId,
            localId = order.id // Use order.id as localId
        )

        val orders = loadSyncableOrders().toMutableList()
        orders.add(syncableOrder)
        saveSyncableOrders(orders)

        logger.i { "Order ${order.id} marked for sync" }

        // Try immediate sync if online
        tryImmediateSync()
    }

    /**
     * Save a transaction for syncing.
     */
    suspend fun saveTransactionForSync(transaction: Transaction) {
        val syncableTransaction = SyncableTransaction.fromTransaction(
            transaction = transaction,
            deviceId = deviceId,
            localId = transaction.id
        )

        val transactions = loadSyncableTransactions().toMutableList()
        transactions.add(syncableTransaction)
        saveSyncableTransactions(transactions)

        logger.i { "Transaction ${transaction.id} marked for sync" }

        // Try immediate sync if online
        tryImmediateSync()
    }

    /**
     * Sync all pending data with server.
     */
    suspend fun syncWithServer(): Result<BatchSyncResponse> {
        if (_syncState.value is SyncState.Syncing) {
            logger.w { "Sync already in progress, skipping" }
            return Result.failure(Exception("Sync already in progress"))
        }

        _syncState.value = SyncState.Syncing

        return try {
            // Load pending data
            val orders = loadSyncableOrders().filter { it.needsSync() }
            val transactions = loadSyncableTransactions().filter { it.needsSync() }

            if (orders.isEmpty() && transactions.isEmpty()) {
                logger.i { "No pending data to sync" }
                _syncState.value = SyncState.Idle
                return Result.success(
                    BatchSyncResponse(
                        success = true,
                        syncedOrders = emptyList(),
                        syncedTransactions = emptyList()
                    )
                )
            }

            logger.i { "Syncing ${orders.size} orders and ${transactions.size} transactions" }

            // Mark as syncing
            val syncingOrders = orders.map { it.markAsSyncing() }
            val syncingTransactions = transactions.map { it.markAsSyncing() }

            // Create sync request
            val lastSyncTimestamp = getLastSyncTimestamp()
            val request = BatchSyncRequest(
                deviceId = deviceId,
                orders = syncingOrders,
                transactions = syncingTransactions,
                lastSyncTimestamp = lastSyncTimestamp
            )

            // Send to server
            val response = httpClient.post("$baseUrl/api/sync/batch") {
                contentType(ContentType.Application.Json)
                setBody(request)
            }.body<BatchSyncResponse>()

            // Handle response
            handleSyncResponse(response, syncingOrders, syncingTransactions)

            _syncState.value = SyncState.Success(
                syncedOrders = response.syncedOrders.size,
                syncedTransactions = response.syncedTransactions.size
            )

            logger.i { "Sync successful: ${response.syncedOrders.size} orders, ${response.syncedTransactions.size} transactions" }

            Result.success(response)
        } catch (e: Exception) {
            logger.e(e) { "Sync failed" }
            _syncState.value = SyncState.Error(e.message ?: "Sync failed")

            // Mark failed items
            markFailedItems()

            Result.failure(e)
        }
    }

    /**
     * Try immediate sync (fire-and-forget).
     */
    private fun tryImmediateSync() {
        CoroutineScope(Dispatchers.Default).launch {
            try {
                syncWithServer()
            } catch (e: Exception) {
                // Silently fail - will retry in background
                logger.w { "Immediate sync failed, will retry in background: ${e.message}" }
            }
        }
    }

    /**
     * Handle sync response from server.
     */
    private suspend fun handleSyncResponse(
        response: BatchSyncResponse,
        syncedOrders: List<SyncableOrder>,
        syncedTransactions: List<SyncableTransaction>
    ) {
        val allOrders = loadSyncableOrders().toMutableList()
        val allTransactions = loadSyncableTransactions().toMutableList()

        // Update synced orders
        response.syncedOrders.forEachIndexed { index, syncResponse ->
            if (syncResponse.success) {
                val syncableOrder = syncedOrders[index]
                val updatedOrder = syncableOrder.markAsSynced(syncResponse)

                // Replace in list
                val idx = allOrders.indexOfFirst { it.localId == syncableOrder.localId }
                if (idx >= 0) {
                    allOrders[idx] = updatedOrder
                }
            }
        }

        // Update synced transactions
        response.syncedTransactions.forEachIndexed { index, syncResponse ->
            if (syncResponse.success) {
                val syncableTransaction = syncedTransactions[index]
                val updatedTransaction = syncableTransaction.markAsSynced(syncResponse)

                // Replace in list
                val idx = allTransactions.indexOfFirst { it.localId == syncableTransaction.localId }
                if (idx >= 0) {
                    allTransactions[idx] = updatedTransaction
                }
            }
        }

        // Apply server updates (from other devices)
        response.serverUpdates?.let { updates ->
            logger.i { "Applying server updates: ${updates.orders.size} orders, ${updates.transactions.size} transactions" }

            // Merge server orders (avoid duplicates by localId)
            updates.orders.forEach { serverOrder ->
                val existingIdx = allOrders.indexOfFirst { it.localId == serverOrder.localId }
                if (existingIdx >= 0) {
                    // Update existing
                    allOrders[existingIdx] = serverOrder
                } else {
                    // Add new
                    allOrders.add(serverOrder)
                }
            }

            // Merge server transactions
            updates.transactions.forEach { serverTransaction ->
                val existingIdx =
                    allTransactions.indexOfFirst { it.localId == serverTransaction.localId }
                if (existingIdx >= 0) {
                    allTransactions[existingIdx] = serverTransaction
                } else {
                    allTransactions.add(serverTransaction)
                }
            }

            // Remove deleted items
            allOrders.removeAll { it.localId in updates.deletedOrderIds }
            allTransactions.removeAll { it.localId in updates.deletedTransactionIds }
        }

        // Save updated lists
        saveSyncableOrders(allOrders)
        saveSyncableTransactions(allTransactions)

        // Update last sync timestamp
        saveLastSyncTimestamp(currentTimeMillis())
    }

    /**
     * Mark failed items (set status back to FAILED for retry).
     */
    private suspend fun markFailedItems() {
        val orders = loadSyncableOrders().map {
            if (it.syncStatus == SyncStatus.SYNCING) it.markAsFailed() else it
        }
        val transactions = loadSyncableTransactions().map {
            if (it.syncStatus == SyncStatus.SYNCING) it.markAsFailed() else it
        }

        saveSyncableOrders(orders)
        saveSyncableTransactions(transactions)
    }

    /**
     * Get all synced orders (for UI display).
     */
    suspend fun getSyncedOrders(): List<Order> {
        return loadSyncableOrders()
            .filter { it.syncStatus == SyncStatus.SYNCED }
            .map { it.order }
    }

    /**
     * Get all synced transactions (for UI display).
     */
    suspend fun getSyncedTransactions(): List<Transaction> {
        return loadSyncableTransactions()
            .filter { it.syncStatus == SyncStatus.SYNCED }
            .map { it.transaction }
    }

    /**
     * Get sync statistics.
     */
    suspend fun getSyncStats(): SyncStats {
        val orders = loadSyncableOrders()
        val transactions = loadSyncableTransactions()

        return SyncStats(
            pendingOrders = orders.count { it.syncStatus == SyncStatus.PENDING },
            syncedOrders = orders.count { it.syncStatus == SyncStatus.SYNCED },
            failedOrders = orders.count { it.syncStatus == SyncStatus.FAILED },
            pendingTransactions = transactions.count { it.syncStatus == SyncStatus.PENDING },
            syncedTransactions = transactions.count { it.syncStatus == SyncStatus.SYNCED },
            failedTransactions = transactions.count { it.syncStatus == SyncStatus.FAILED },
            lastSyncTimestamp = getLastSyncTimestamp()
        )
    }

    // Storage helpers

    private suspend fun saveDeviceId(deviceId: String) {
        localStorage.saveString(KEY_DEVICE_ID, deviceId)
    }

    private suspend fun loadSyncableOrders(): List<SyncableOrder> {
        val json = localStorage.getString(KEY_SYNCABLE_ORDERS) ?: return emptyList()
        return try {
            Json.decodeFromString(json)
        } catch (e: Exception) {
            logger.e(e) { "Failed to load syncable orders" }
            emptyList()
        }
    }

    private suspend fun saveSyncableOrders(orders: List<SyncableOrder>) {
        val json = Json.encodeToString(orders)
        localStorage.saveString(KEY_SYNCABLE_ORDERS, json)
    }

    private suspend fun loadSyncableTransactions(): List<SyncableTransaction> {
        val json = localStorage.getString(KEY_SYNCABLE_TRANSACTIONS) ?: return emptyList()
        return try {
            Json.decodeFromString(json)
        } catch (e: Exception) {
            logger.e(e) { "Failed to load syncable transactions" }
            emptyList()
        }
    }

    private suspend fun saveSyncableTransactions(transactions: List<SyncableTransaction>) {
        val json = Json.encodeToString(transactions)
        localStorage.saveString(KEY_SYNCABLE_TRANSACTIONS, json)
    }

    private suspend fun getLastSyncTimestamp(): Long? {
        return localStorage.getString(KEY_LAST_SYNC_TIMESTAMP)?.toLongOrNull()
    }

    private suspend fun saveLastSyncTimestamp(timestamp: Long) {
        localStorage.saveString(KEY_LAST_SYNC_TIMESTAMP, timestamp.toString())
    }
}

/**
 * Sync state for UI.
 */
sealed class SyncState {
    object Idle : SyncState()
    object Syncing : SyncState()
    data class Success(val syncedOrders: Int, val syncedTransactions: Int) : SyncState()
    data class Error(val message: String) : SyncState()
}

/**
 * Sync statistics.
 */
data class SyncStats(
    val pendingOrders: Int,
    val syncedOrders: Int,
    val failedOrders: Int,
    val pendingTransactions: Int,
    val syncedTransactions: Int,
    val failedTransactions: Int,
    val lastSyncTimestamp: Long?
)
