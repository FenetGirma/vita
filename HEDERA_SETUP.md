# Hedera Integration Setup Guide

This guide will help you set up the Hedera blockchain integration for PulsePoint.

## Prerequisites

1. Create a Hedera testnet account at [portal.hedera.com](https://portal.hedera.com)
2. Get your Account ID and Private Key from the portal
3. Install dependencies: `npm install @hashgraph/sdk`

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

\`\`\`bash
HEDERA_OPERATOR_ID=0.0.YOUR_ACCOUNT_ID
HEDERA_OPERATOR_KEY=YOUR_PRIVATE_KEY
HEDERA_NETWORK=testnet
\`\`\`

## Setup Steps

### 1. Create Emergency Alert Topic (HCS)

Run this once to create your emergency alert topic:

\`\`\`typescript
import { createEmergencyTopic } from '@/lib/hedera/hcs'

const topicId = await createEmergencyTopic()
console.log('Emergency Topic ID:', topicId)
\`\`\`

Add the topic ID to your `.env.local`:
\`\`\`
HEDERA_EMERGENCY_TOPIC_ID=0.0.YOUR_TOPIC_ID
\`\`\`

### 2. Create Reward Token (HTS)

Run this once to create the PULSE reward token:

\`\`\`typescript
import { createRewardToken } from '@/lib/hedera/hts'

const tokenId = await createRewardToken()
console.log('PULSE Token ID:', tokenId)
\`\`\`

Add the token ID to your `.env.local`:
\`\`\`
HEDERA_REWARD_TOKEN_ID=0.0.YOUR_TOKEN_ID
\`\`\`

### 3. Associate Tokens with Responder Accounts

Before responders can receive tokens, they must associate the token with their account:

\`\`\`typescript
import { associateTokenWithAccount } from '@/lib/hedera/hts'

await associateTokenWithAccount(responderAccountId, tokenId)
\`\`\`

## API Endpoints

### Emergency Alerts

- **POST /api/emergency/sos** - Log SOS alert to HCS
- **POST /api/emergency/accept** - Log responder acceptance to HCS
- **POST /api/emergency/complete** - Complete response and award tokens

### Medical Records

- **POST /api/medical/store** - Store encrypted medical record on HFS
- **GET /api/medical/retrieve** - Retrieve medical record from HFS

## How It Works

### HCS (Consensus Service)
Every emergency event (SOS, Accept, Arrive, Complete) is logged immutably to a Hedera topic. This creates a transparent, auditable record of all emergency responses.

### HFS (File Service)
Patient medical records are encrypted and stored on Hedera's file service. Only authorized responders can access these records during an emergency.

### HTS (Token Service)
Responders earn PULSE tokens for successful responses. Tokens are distributed based on:
- Base reward: 50 tokens
- Fast response bonus: +25 tokens (under 3 minutes)
- 5-star rating bonus: +10 tokens

## Testing

For hackathon demo purposes, you can simulate the blockchain calls without actual Hedera credentials by using mock data in development mode.

## Production Considerations

1. **Encryption**: Implement proper encryption for medical records before storing on HFS
2. **Access Control**: Add proper authentication and authorization
3. **Key Management**: Use secure key management solutions (HSM, KMS)
4. **Mainnet Migration**: Switch from testnet to mainnet for production
5. **Gas Optimization**: Batch transactions where possible to reduce costs

## Resources

- [Hedera Documentation](https://docs.hedera.com)
- [Hedera SDK](https://github.com/hashgraph/hedera-sdk-js)
- [Hedera Portal](https://portal.hedera.com)
\`\`\`
