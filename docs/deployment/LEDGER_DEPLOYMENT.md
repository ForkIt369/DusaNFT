# Deploying with Ledger Nano

Since Ledger doesn't expose private keys, here are your options:

## Option 1: Deploy Using Remix (Easiest with Ledger)

1. **Connect Ledger to MetaMask**
   - Open MetaMask
   - Click account icon → Connect Hardware Wallet
   - Follow prompts to connect Ledger
   - Make sure Ledger has Ethereum app open

2. **Add Metis Network to MetaMask**
   - Network Name: Metis Andromeda Mainnet
   - RPC URL: https://andromeda.metis.io/?owner=1088
   - Chain ID: 1088
   - Symbol: METIS
   - Explorer: https://andromeda-explorer.metis.io/

3. **Deploy via Remix**
   - Go to https://remix.ethereum.org
   - Create new file: DusaNFT.sol
   - Copy contract code from `contracts/DusaNFT.sol`
   - Compile with Solidity 0.8.19
   - In Deploy tab: Select "Injected Provider - MetaMask"
   - Deploy the contract
   - Copy the deployed address

## Option 2: Create Deployment Wallet

1. **Create a temporary wallet in MetaMask**
   - Create new account in MetaMask
   - Export its private key
   - Send 0.2 METIS from Ledger to this wallet

2. **Deploy normally**
   ```bash
   npm run deploy
   ```

3. **Transfer ownership** (optional)
   - After deployment, transfer contract ownership to Ledger address
   - Add this function to interact with contract

## Option 3: Manual Deployment Steps

If you prefer maximum security:

1. **Prepare transaction offline**
2. **Sign with Ledger**
3. **Broadcast to network**

This is more complex and requires additional tools.

## Recommended: Option 2
- Most straightforward
- Still secure (only risk 0.2 METIS)
- Can transfer ownership after deployment
- Keeps your main Ledger funds safe

Would you like help setting up the deployment wallet?