package com.theauraflow.pos.domain.model

import kotlinx.serialization.Serializable

/**
 * Syncable version of Order with sync metadata.
 * This wraps the Order model with sync tracking information.
 */
@Serializable
data class SyncableOrder(
    val order: Order,
    override val localId: String, // UUID generated on device (never changes)
    override val syncStatus: SyncStatus = SyncStatus.PENDING,
    override val lastSyncedAt: Long? = null,
    override val syncVersion: Int = 1, // Incremented on each local modification
    override val deviceId: String, // Device that created this order
    val serverHash: String? = null // Hash of server state for conflict detection
) : SyncableEntity {
    override val id: String
        get() = order.id

    /**
     * Mark as synced with server response.
     */
    fun markAsSynced(syncResponse: SyncResponse): SyncableOrder {
        return copy(
            syncStatus = SyncStatus.SYNCED,
            lastSyncedAt = syncResponse.syncedAt,
            order = syncResponse.serverId?.let { order.copy(id = it) } ?: order
        )
    }

    /**
     * Mark as modified locally (needs re-sync).
     */
    fun markAsModified(): SyncableOrder {
        return copy(
            syncStatus = SyncStatus.MODIFIED,
            syncVersion = syncVersion + 1
        )
    }

    /**
     * Mark as syncing (in progress).
     */
    fun markAsSyncing(): SyncableOrder {
        return copy(syncStatus = SyncStatus.SYNCING)
    }

    /**
     * Mark as failed.
     */
    fun markAsFailed(): SyncableOrder {
        return copy(syncStatus = SyncStatus.FAILED)
    }

    /**
     * Check if needs sync (PENDING, MODIFIED, or FAILED).
     */
    fun needsSync(): Boolean {
        return syncStatus in listOf(SyncStatus.PENDING, SyncStatus.MODIFIED, SyncStatus.FAILED)
    }

    companion object {
        /**
         * Create a new syncable order from a regular order.
         */
        fun fromOrder(order: Order, deviceId: String, localId: String = order.id): SyncableOrder {
            return SyncableOrder(
                order = order,
                localId = localId,
                deviceId = deviceId
            )
        }
    }
}
