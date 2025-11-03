package com.theauraflow.pos.domain.model

import kotlinx.serialization.Serializable

/**
 * Interface for entities that can be synced with the server.
 * Provides metadata for tracking sync status and preventing duplicates.
 */
interface SyncableEntity {
    val id: String
    val localId: String // Unique local identifier (UUID generated on device)
    val syncStatus: SyncStatus
    val lastSyncedAt: Long? // Timestamp of last successful sync
    val syncVersion: Int // Incremented each time entity is modified locally
    val deviceId: String // Device that created/last modified this entity
}

/**
 * Sync status of an entity.
 */
@Serializable
enum class SyncStatus {
    /**
     * Entity exists only locally, not yet synced to server.
     */
    PENDING,

    /**
     * Entity is currently being synced to server.
     */
    SYNCING,

    /**
     * Entity has been successfully synced to server.
     */
    SYNCED,

    /**
     * Sync failed, will retry later.
     */
    FAILED,

    /**
     * Entity was modified locally after last sync.
     * Needs to be re-synced.
     */
    MODIFIED,

    /**
     * Entity was deleted locally, needs to be deleted on server.
     */
    DELETED
}

/**
 * Response from server after sync operation.
 */
@Serializable
data class SyncResponse(
    val success: Boolean,
    val serverId: String?, // Server-assigned ID if different from local ID
    val syncedAt: Long, // Server timestamp
    val message: String? = null,
    val conflicts: List<ConflictInfo>? = null
)

/**
 * Information about a sync conflict.
 */
@Serializable
data class ConflictInfo(
    val field: String,
    val localValue: String,
    val serverValue: String,
    val resolution: ConflictResolution
)

/**
 * How to resolve sync conflicts.
 */
@Serializable
enum class ConflictResolution {
    /**
     * Server version wins (server value is kept).
     */
    SERVER_WINS,

    /**
     * Local version wins (local value is uploaded).
     */
    CLIENT_WINS,

    /**
     * Merge both versions (application-specific logic).
     */
    MERGE,

    /**
     * Manual resolution required by user.
     */
    MANUAL
}

/**
 * Batch sync request to server.
 */
@Serializable
data class BatchSyncRequest(
    val deviceId: String,
    val orders: List<SyncableOrder> = emptyList(),
    val transactions: List<SyncableTransaction> = emptyList(),
    val lastSyncTimestamp: Long? = null // For incremental sync
)

/**
 * Batch sync response from server.
 */
@Serializable
data class BatchSyncResponse(
    val success: Boolean,
    val syncedOrders: List<SyncResponse> = emptyList(),
    val syncedTransactions: List<SyncResponse> = emptyList(),
    val serverUpdates: ServerUpdates? = null, // Updates from server to apply locally
    val nextSyncToken: String? = null // Token for next incremental sync
)

/**
 * Updates from server to be applied locally.
 */
@Serializable
data class ServerUpdates(
    val orders: List<SyncableOrder> = emptyList(),
    val transactions: List<SyncableTransaction> = emptyList(),
    val deletedOrderIds: List<String> = emptyList(),
    val deletedTransactionIds: List<String> = emptyList()
)
