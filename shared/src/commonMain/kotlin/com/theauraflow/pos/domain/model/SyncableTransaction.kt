package com.theauraflow.pos.domain.model

import kotlinx.serialization.Serializable

/**
 * Syncable version of Transaction with sync metadata.
 * This wraps the Transaction model with sync tracking information.
 */
@Serializable
data class SyncableTransaction(
    val transaction: Transaction,
    override val localId: String, // UUID generated on device (never changes)
    override val syncStatus: SyncStatus = SyncStatus.PENDING,
    override val lastSyncedAt: Long? = null,
    override val syncVersion: Int = 1, // Incremented on each local modification
    override val deviceId: String, // Device that created this transaction
    val serverHash: String? = null // Hash of server state for conflict detection
) : SyncableEntity {
    override val id: String
        get() = transaction.id

    /**
     * Mark as synced with server response.
     */
    fun markAsSynced(syncResponse: SyncResponse): SyncableTransaction {
        return copy(
            syncStatus = SyncStatus.SYNCED,
            lastSyncedAt = syncResponse.syncedAt,
            transaction = syncResponse.serverId?.let { transaction.copy(id = it) } ?: transaction
        )
    }

    /**
     * Mark as modified locally (needs re-sync).
     */
    fun markAsModified(): SyncableTransaction {
        return copy(
            syncStatus = SyncStatus.MODIFIED,
            syncVersion = syncVersion + 1
        )
    }

    /**
     * Mark as syncing (in progress).
     */
    fun markAsSyncing(): SyncableTransaction {
        return copy(syncStatus = SyncStatus.SYNCING)
    }

    /**
     * Mark as failed.
     */
    fun markAsFailed(): SyncableTransaction {
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
         * Create a new syncable transaction from a regular transaction.
         */
        fun fromTransaction(
            transaction: Transaction,
            deviceId: String,
            localId: String = transaction.id
        ): SyncableTransaction {
            return SyncableTransaction(
                transaction = transaction,
                localId = localId,
                deviceId = deviceId
            )
        }
    }
}
