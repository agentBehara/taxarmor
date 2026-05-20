import { randomBytes, createCipheriv, createDecipheriv } from "crypto"

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
if (!ENCRYPTION_KEY) throw new Error("ENCRYPTION_KEY not set")

const KEY = Buffer.from(ENCRYPTION_KEY, "hex")
const ALGORITHM = "aes-256-gcm"

export function encrypt(plainText: string): { encrypted: string; iv: string; authTag: string } {
  const iv = randomBytes(16)
  const cipher = createCipheriv(ALGORITHM, KEY, iv)
  let encrypted = cipher.update(plainText, "utf8", "base64")
  encrypted += cipher.final("base64")
  const authTag = cipher.getAuthTag().toString("base64")
  return { encrypted, iv: iv.toString("base64"), authTag }
}

export function decrypt(encrypted: string, iv: string, authTag: string): string {
  const decipher = createDecipheriv(ALGORITHM, KEY, Buffer.from(iv, "base64"))
  decipher.setAuthTag(Buffer.from(authTag, "base64"))
  let decrypted = decipher.update(encrypted, "base64", "utf8")
  decrypted += decipher.final("utf8")
  return decrypted
}
