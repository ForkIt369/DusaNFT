# Deploy with Remix IDE - Step by Step

Your Ledger wallet: `0x6Cb5365ADfC0fdFc2aD7C02151A04e9f0F9eBeCA`

## Step 1: Open Remix
Go to: https://remix.ethereum.org

## Step 2: Create Contract File
1. In the File Explorer (left panel), click "+" to create new file
2. Name it: `DusaNFT.sol`
3. Copy ALL contents from `DusaNFT_Remix.sol` and paste it

## Step 3: Compile Contract
1. Click on "Solidity Compiler" tab (left sidebar)
2. Select compiler version: `0.8.19`
3. Click "Compile DusaNFT.sol"
4. You should see green checkmarks

## Step 4: Add Metis Network to MetaMask
1. In MetaMask, click network dropdown
2. Click "Add Network" 
3. Add manually:
   - Network Name: `Metis Andromeda Mainnet`
   - RPC URL: `https://andromeda.metis.io/?owner=1088`
   - Chain ID: `1088`
   - Symbol: `METIS`
   - Explorer: `https://andromeda-explorer.metis.io/`
4. Switch to Metis network

## Step 5: Deploy Contract
1. Click "Deploy & Run Transactions" tab (left sidebar)
2. IMPORTANT: Set "Environment" to `Injected Provider - MetaMask`
3. MetaMask will popup - make sure it shows:
   - Your Ledger address: 0x6Cb5365ADfC0fdFc2aD7C02151A04e9f0F9eBeCA
   - Network: Metis Andromeda
4. Click "Deploy" button
5. MetaMask will open - confirm on your Ledger device
6. Wait for transaction to complete

## Step 6: Get Contract Address
After deployment:
1. Look in Remix under "Deployed Contracts"
2. Copy the contract address (looks like: 0x...)
3. Save this address!

## Step 7: Verify on Explorer (Optional)
1. Go to: https://andromeda-explorer.metis.io/
2. Search for your contract address
3. Click "Verify and Publish"

## NEXT: Update Your Frontend
Once deployed, you need to update `app.js`:
- Line 4: Add your contract address
- Line 5: Add your metadata IPFS CID (after uploading to Pinata)

## Need METIS for Gas?
- Deployment costs ~0.1-0.2 METIS
- Bridge from Ethereum: https://bridge.metis.io/
- Or buy on exchanges that support Metis