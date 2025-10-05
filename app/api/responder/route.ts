// app/api/responder/route.ts
import { NextResponse } from "next/server";

// --- App Router API handler for GET ---
export async function GET() {
  try {
    const topicId = process.env.HEDERA_TOPIC_ID!;
    if (!topicId) throw new Error("Missing HEDERA_TOPIC_ID in .env");

    // Hedera Testnet Mirror Node REST API
    const mirrorNodeUrl = `https://testnet.mirrornode.hedera.com/api/v1/topics/${topicId}/messages`;

    // Fetch messages
    const res = await fetch(mirrorNodeUrl);
    if (!res.ok) throw new Error(`Mirror node request failed: ${res.status}`);

    const data = await res.json();

    // Map messages for easier use
    const alerts = data.messages.map((msg: any) => ({
      sequenceNumber: msg.sequence_number,
      consensusTimestamp: msg.consensus_timestamp,
      message: Buffer.from(msg.message, "base64").toString(), // decode base64
    }));

    return NextResponse.json({ topicId, alerts });
  } catch (error: any) {
    console.error("❌ Responder handler error:", error);
    return NextResponse.json(
      { error: "Failed to fetch alerts", details: String(error) },
      { status: 500 }
    );
  }
}
