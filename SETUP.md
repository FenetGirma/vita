# Vita - Hedera Setup Guide

## Quick Start

### 1. Get Hedera Testnet Credentials

Visit [Hedera Portal](https://portal.hedera.com) and create a testnet account. You'll receive:
- Account ID (format: `0.0.xxxxx`)
- Private Key (format: `302e...`)

### 2. Add Environment Variables

Add these to your project settings:

\`\`\`
HEDERA_OPERATOR_ID=0.0.xxxxx
HEDERA_OPERATOR_KEY=302e...
\`\`\`

### 3. Create HCS Topic

Run the setup script to create your emergency alert topic:

\`\`\`bash
# The script will output your topic ID
# Add it to your environment variables
\`\`\`

You'll get a topic ID like `0.0.xxxxx` - add it as:

\`\`\`
HEDERA_EMERGENCY_TOPIC_ID=0.0.xxxxx
\`\`\`

## What's Implemented

### HCS (Hedera Consensus Service)
All emergency events are logged immutably:
- **SOS Alerts** - Patient emergency requests with GPS location
- **Response Acceptance** - Responder accepts alert
- **Arrival** - Responder arrives at scene
- **Completion** - Response completed

### Real-time GPS Tracking
- Patient location captured when SOS is pressed
- Responder location tracked during response
- All coordinates logged to HCS for transparency

## Architecture

\`\`\`
Patient presses SOS
    ↓
Browser gets GPS location
    ↓
POST /api/emergency/sos
    ↓
Submit to HCS Topic
    ↓
Alert visible to nearby responders
    ↓
Responder accepts → logged to HCS
    ↓
Responder arrives → logged to HCS
    ↓
Response complete → logged to HCS
\`\`\`

## Testing

1. Open patient dashboard - allow location access
2. Press SOS button - alert sent to HCS
3. Open responder dashboard - see nearby alerts
4. Accept alert - logged to HCS
5. Mark arrived - logged to HCS
6. Complete response - logged to HCS

All events are permanently recorded on Hedera testnet.
