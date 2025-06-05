# Deployment Steps for Dusa NFT

## ✅ Completed
- All smart contracts created
- Frontend interface ready
- Dependencies installed
- Project structure set up

## 📋 What You Need to Do:

### 1. Add Your Private Key
Edit the `.env` file and add your wallet's private key:
```
PRIVATE_KEY=your_private_key_here
```
⚠️ **IMPORTANT**: 
- Never share your private key
- Make sure your wallet has METIS tokens for gas fees
- You'll need approximately 0.1-0.2 METIS for deployment

### 2. Upload Metadata to IPFS
1. Go to [Pinata Cloud](https://app.pinata.cloud/)
2. Upload the file: `metadata/dusa-nft-metadata.json`
3. Copy the CID (it will look like: `QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`)
4. Save this CID - you'll need it after deployment

### 3. Deploy the Contract
Run this command:
```bash
npm run deploy
```

This will:
- Deploy your NFT contract to Metis Andromeda
- Show you the deployed contract address
- Wait for confirmations

### 4. Update Frontend with Contract Details
After deployment, you need to update `app.js`:

1. Find this line (around line 4):
   ```javascript
   const CONTRACT_ADDRESS = '';
   ```
   Replace with your deployed address

2. Find this line (around line 5):
   ```javascript
   const METADATA_URI = 'ipfs://YOUR_METADATA_CID';
   ```
   Replace with: `ipfs://[YOUR_CID_FROM_STEP_2]`

### 5. Test Your Minting Page
- Open `index.html` in your browser
- Connect your MetaMask wallet
- Make sure you're on Metis Andromeda network
- Try minting!

## 🌐 Going Live
To make your minting page public:
- Host on GitHub Pages
- Upload to IPFS
- Use any web hosting service
- Or run locally for private minting

## 💡 Need METIS Tokens?
- Bridge from Ethereum: https://bridge.metis.io/
- Buy on exchanges that support Metis

## 🔧 Troubleshooting
- If deployment fails: Check you have enough METIS for gas
- If MetaMask doesn't show Metis: The site will auto-add the network
- Contract verification: Use the Metis block explorer