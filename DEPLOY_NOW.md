# 🚀 Deploy Your NFT Contract NOW

## Critical Step: Set Environment
In the Deploy & Run tab, look for **"ENVIRONMENT"** dropdown at the top.

**MUST SELECT:** `Injected Provider - MetaMask`

(NOT "Remix VM" or "JavaScript VM")

## Deploy Steps:

1. **ENVIRONMENT**: Select `Injected Provider - MetaMask`
   - MetaMask will popup
   - Make sure it shows:
     - Network: Metis Andromeda
     - Account: Your Ledger (0x6Cb5...)

2. **CONTRACT**: Should show `DusaNFT - contracts/DusaNFT_RemixReady.sol`

3. **Click Orange "Deploy" Button**

4. **MetaMask Opens**:
   - Check gas fee (should be ~0.1 METIS)
   - **Confirm on your Ledger device**
   - Click Confirm in MetaMask

5. **Wait for Success**
   - Takes 10-30 seconds
   - Look for contract address in Remix console

## After Deploy:
You'll see your contract under "Deployed Contracts" with an address like:
`0x1234...abcd`

COPY THIS ADDRESS - You need it for the frontend!