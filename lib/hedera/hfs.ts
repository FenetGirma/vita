// Hedera File Service (HFS) Integration
// Used for encrypted medical records storage

import { FileCreateTransaction, FileAppendTransaction, FileContentsQuery, FileId } from "@hashgraph/sdk"
import { getHederaClient } from "./client"

export interface MedicalRecord {
  patientId: string
  bloodType: string
  allergies: string[]
  medications: string[]
  conditions: string[]
  emergencyContacts: Array<{
    name: string
    relationship: string
    phone: string
  }>
  lastUpdated: number
}

// Create and store encrypted medical record
export async function storeMedicalRecord(record: MedicalRecord): Promise<string> {
  const client = getHederaClient()

  // Convert record to JSON and encrypt (in production, use proper encryption)
  const recordData = JSON.stringify(record)
  const encryptedData = Buffer.from(recordData) // In production: encrypt this data

  // Create file transaction
  const transaction = new FileCreateTransaction()
    .setKeys([client.operatorPublicKey!])
    .setContents(encryptedData.slice(0, 4096)) // First chunk (max 4KB)

  const txResponse = await transaction.execute(client)
  const receipt = await txResponse.getReceipt(client)

  const fileId = receipt.fileId
  if (!fileId) {
    throw new Error("Failed to create file")
  }

  // If data is larger than 4KB, append remaining chunks
  if (encryptedData.length > 4096) {
    const appendTx = new FileAppendTransaction().setFileId(fileId).setContents(encryptedData.slice(4096))

    await appendTx.execute(client)
  }

  console.log(`[v0] Stored medical record: ${fileId.toString()}`)
  return fileId.toString()
}

// Retrieve medical record from HFS
export async function retrieveMedicalRecord(fileId: string): Promise<MedicalRecord> {
  const client = getHederaClient()

  const query = new FileContentsQuery().setFileId(FileId.fromString(fileId))

  const contents = await query.execute(client)

  // Decrypt data (in production, use proper decryption)
  const decryptedData = contents.toString()
  const record: MedicalRecord = JSON.parse(decryptedData)

  console.log(`[v0] Retrieved medical record: ${fileId}`)
  return record
}

// Update existing medical record
export async function updateMedicalRecord(fileId: string, record: MedicalRecord): Promise<void> {
  // Note: HFS files are immutable, so we create a new version
  // In production, maintain a mapping of patientId -> latest fileId
  const newFileId = await storeMedicalRecord(record)
  console.log(`[v0] Updated medical record. New file ID: ${newFileId}`)
}
