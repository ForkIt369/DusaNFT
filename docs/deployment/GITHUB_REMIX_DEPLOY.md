# Deploy via GitHub + Remix Integration

This is the BEST method for Ledger users! 

## Step 1: Push to GitHub

1. Create a new repository on GitHub:
   - Go to https://github.com/new
   - Name: `DusaNFT`
   - Set to Public (or Private)
   - Don't initialize with README

2. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/DusaNFT.git
git branch -M main
git push -u origin main
```

## Step 2: Connect Remix to GitHub

1. Open https://remix.ethereum.org
2. Click the "Home" icon (top left)
3. Under "LOAD FROM", click **GitHub**
4. Authorize Remix to access your GitHub
5. Select your `DusaNFT` repository
6. Remix will clone your entire project!

## Step 3: Deploy with Ledger

1. In Remix, navigate to `contracts/DusaNFT.sol`
2. Go to "Solidity Compiler" tab
3. Compile with version 0.8.19
4. Go to "Deploy & Run" tab
5. Set Environment: **Injected Provider - MetaMask**
6. Ensure MetaMask shows:
   - Ledger account: 0x6Cb5365ADfC0fdFc2aD7C02151A04e9f0F9eBeCA
   - Network: Metis Andromeda
7. Click **Deploy**
8. Confirm on your Ledger device

## Step 4: After Deployment

1. Copy the contract address from Remix
2. Update `app.js` in your local files:
   - Line 4: Add contract address
   - Line 5: Add metadata IPFS CID
3. Commit and push updates:
```bash
git add app.js
git commit -m "Add deployed contract address"
git push
```

## Why This is Best

✅ **Version Control** - All changes tracked in Git
✅ **Ledger Safe** - No private keys needed
✅ **Reusable** - Pull updates anytime in Remix
✅ **Collaborative** - Share with team members
✅ **Backup** - Code safely stored on GitHub

## Bonus: Continuous Deployment

After initial setup, future updates are easy:
1. Edit locally
2. Push to GitHub
3. In Remix: Pull latest changes
4. Redeploy if needed

This creates a professional deployment workflow!