// Hedera Token Service (HTS) Integration
// Used for responder reward tokens

import {
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  TransferTransaction,
  AccountId,
  TokenId,
  TokenAssociateTransaction,
} from "@hashgraph/sdk"
import { getHederaClient } from "./client"

export interface TokenReward {
  responderId: string
  amount: number
  reason: "response" | "fast_response" | "rating_bonus"
  alertId: string
  timestamp: number
}

// Create PulsePoint reward token
export async function createRewardToken(): Promise<string> {
  const client = getHederaClient()

  const transaction = new TokenCreateTransaction()
    .setTokenName("PulsePoint Reward Token")
    .setTokenSymbol("PULSE")
    .setTokenType(TokenType.FungibleCommon)
    .setDecimals(2)
    .setInitialSupply(1000000) // 1 million tokens
    .setTreasuryAccountId(client.operatorAccountId!)
    .setSupplyType(TokenSupplyType.Infinite)
    .setSupplyKey(client.operatorPublicKey!)

  const txResponse = await transaction.execute(client)
  const receipt = await txResponse.getReceipt(client)

  const tokenId = receipt.tokenId
  if (!tokenId) {
    throw new Error("Failed to create token")
  }

  console.log(`[v0] Created PULSE token: ${tokenId.toString()}`)
  return tokenId.toString()
}

// Associate token with responder account
export async function associateTokenWithAccount(accountId: string, tokenId: string): Promise<void> {
  const client = getHederaClient()

  const transaction = new TokenAssociateTransaction()
    .setAccountId(AccountId.fromString(accountId))
    .setTokenIds([TokenId.fromString(tokenId)])

  await transaction.execute(client)

  console.log(`[v0] Associated token ${tokenId} with account ${accountId}`)
}

// Reward responder with tokens
export async function rewardResponder(reward: TokenReward): Promise<string> {
  const client = getHederaClient()
  const tokenId = process.env.HEDERA_REWARD_TOKEN_ID || "0.0.YOUR_TOKEN_ID"

  // Transfer tokens from treasury to responder
  const transaction = new TransferTransaction()
    .addTokenTransfer(TokenId.fromString(tokenId), client.operatorAccountId!, -reward.amount)
    .addTokenTransfer(TokenId.fromString(tokenId), AccountId.fromString(reward.responderId), reward.amount)

  const txResponse = await transaction.execute(client)
  const receipt = await txResponse.getReceipt(client)

  console.log(`[v0] Rewarded ${reward.amount} PULSE tokens to ${reward.responderId}`)
  return receipt.status.toString()
}

// Calculate reward amount based on response
export function calculateReward(responseTime: number, rating: number): number {
  let reward = 50 // Base reward

  // Fast response bonus (under 3 minutes)
  if (responseTime < 180) {
    reward += 25
  }

  // Rating bonus (5 stars)
  if (rating === 5) {
    reward += 10
  }

  return reward
}
