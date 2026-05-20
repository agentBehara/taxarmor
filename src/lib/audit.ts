import { prisma } from "./db"

interface AuditLogEntry {
  userId: string
  action: "LOGIN" | "LOGOUT" | "DOCUMENT_UPLOAD" | "DOCUMENT_DOWNLOAD" | "DOCUMENT_DELETE" | "FILING_CREATE" | "FILING_SUBMIT" | "SUBSCRIPTION_CREATE" | "SUBSCRIPTION_UPDATE" | "SUBSCRIPTION_CANCEL" | "PROFILE_UPDATE" | "MFA_ENABLE" | "MFA_DISABLE" | "DATA_PURGE_REQUEST"
  entity?: string
  entityId?: string
  ipAddress?: string
  userAgent?: string
  details?: string
}

export async function createAuditLog(entry: AuditLogEntry) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: entry.userId,
        action: entry.action,
        entity: entry.entity,
        entityId: entry.entityId,
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
        details: entry.details,
      },
    })
  } catch (error) {
    console.error("Audit log creation failed:", error)
  }
}
