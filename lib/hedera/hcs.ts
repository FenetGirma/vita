// pages/api/demo-hcs.ts
import type { NextApiRequest, NextApiResponse } from "next";
import {
  Client,
  AccountId,
  PrivateKey,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  TopicId,
} from "@hashgraph/sdk";

// Cached topic ID so we don’t recreate every time
let cachedTopicId: string | null = null;

// Create Hedera client
function getHederaClient() {
  const operatorId = process.env.HEDERA_OPERATOR_ID!;
  const operatorKey = process.env.HEDERA_OPERATOR_KEY!;
  const client = Client.forTestnet();
  client.setOperator(AccountId.fromString(operatorId), PrivateKey.fromString(operatorKey));
  return client;
}

// Create or return existing topic
async function getOrCreateTopic(client: Client): Promise<string> {
  if (cachedTopicId) return cachedTopicId;

  const transaction = new TopicCreateTransaction().setTopicMemo("Vita Emergency Logs");
  const txResponse = await transaction.execute(client);
  const receipt = await txResponse.getReceipt(client);
  const topicId = receipt.topicId!.toString();
  cachedTopicId = topicId;

  console.log("✅ Created Topic ID:", topicId);
  return topicId;
}

// Submit a message to HCS
async function submitToHCS(client: Client, topicId: string, message: Record<string, any>) {
  const tx = new TopicMessageSubmitTransaction({
    topicId: TopicId.fromString(topicId),
    message: JSON.stringify(message),
  });

  const txResponse = await tx.execute(client);
  const receipt = await txResponse.getReceipt(client);
  return receipt.status.toString();
}

// Next.js API route
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = getHederaClient();
    const topicId = await getOrCreateTopic(client);

    // Dummy SOS alert
    const dummySOS = {
      alertId: "ALERT_001",
      type: "SOS",
      patientId: "PATIENT_123",
      responderId: null,
      location: { lat: 9.03, lng: 38.74, address: "Addis Ababa" },
      timestamp: Date.now(),
    };

    const sosStatus = await submitToHCS(client, topicId, dummySOS);

    // Dummy ACCEPT alert
    const dummyAccept = {
      alertId: "ALERT_001",
      type: "ACCEPT",
      patientId: "PATIENT_123",
      responderId: "RESPONDER_456",
      location: { lat: 9.05, lng: 38.75, address: "En route" },
      timestamp: Date.now(),
    };

    const acceptStatus = await submitToHCS(client, topicId, dummyAccept);

    res.status(200).json({
      topicId,
      sosStatus,
      acceptStatus,
      message: "✅ Dummy SOS + ACCEPT submitted to HCS successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit to HCS", details: error });
  }
}
