import { Client, AccountId, PrivateKey } from "@hashgraph/sdk"

let client: Client | null = null

export function getHederaClient(): Client {
  if (client) {
    return client
  }

  const operatorId = process.env.HEDERA_OPERATOR_ID || "0.0.YOUR_ACCOUNT_ID"
  const operatorKey = process.env.HEDERA_OPERATOR_KEY || "YOUR_PRIVATE_KEY"

  client = Client.forTestnet()

  if (operatorId && operatorKey) {
    client.setOperator(AccountId.fromString(operatorId), PrivateKey.fromString(operatorKey))
  }

  return client
}

export function closeHederaClient() {
  if (client) {
    client.close()
    client = null
  }
}
