import { Client, TopicCreateTransaction, PrivateKey } from "@hashgraph/sdk"

async function setupHederaTopic() {
  // Get credentials from environment
  const operatorId = process.env.OPERATOR_ID
  const operatorKey = process.env.OPERATOR_KEY

  if (!operatorId || !operatorKey) {
    console.error("❌ Missing HEDERA_OPERATOR_ID or HEDERA_OPERATOR_KEY")
    return
  }

  try {
    // Connect to Hedera testnet
    const client = Client.forTestnet()
    client.setOperator(operatorId, operatorKey)

    console.log("🔗 Connected to Hedera Testnet")
    console.log(`📋 Operator ID: ${operatorId}`)

    // Create HCS topic for emergency alerts
    console.log("\n📝 Creating HCS topic for emergency alerts...")

    const transaction = new TopicCreateTransaction()
      .setTopicMemo("Vita Emergency Response System - Alert Logs")
      .setAdminKey(PrivateKey.fromString(operatorKey))

    const response = await transaction.execute(client)
    const receipt = await response.getReceipt(client)
    const topicId = receipt.topicId

    console.log("✅ HCS Topic created successfully!")
    console.log(`\n📌 Topic ID: ${topicId?.toString()}`)

    console.log("\n" + "=".repeat(60))
    console.log("🎉 Setup Complete! Add this to your environment variables:")
    console.log("=".repeat(60))
    console.log(`\nHEDERA_EMERGENCY_TOPIC_ID=${topicId?.toString()}`)
    console.log("\n" + "=".repeat(60))

    client.close()
  } catch (error) {
    console.error("❌ Setup failed:", error)
  }
}

setupHederaTopic()
