# 🚀 Quick Deploy with Remix + GitHub

Your repo is live at: https://github.com/ForkIt369/DusaNFT

## Deploy in 3 Minutes:

### 1. Open Remix & Connect GitHub
👉 Go to: https://remix.ethereum.org

Click **GitHub** button in Remix and authorize if needed.

### 2. Clone Your Repository
- In the popup, enter: `ForkIt369/DusaNFT`
- Click **OK**
- Your contracts will load automatically!

### 3. Deploy with Ledger
1. Navigate to `contracts/DusaNFT.sol` in Remix
2. **Compile** → Select 0.8.19
3. **Deploy** → Injected Provider (MetaMask)
4. Confirm on your Ledger
5. Copy the deployed contract address

### 4. Update & Push Changes
After deployment, update locally:
```bash
# Edit app.js with contract address
# Then push updates:
git add app.js
git commit -m "Add deployed contract: 0x..."
git push
```

## Your Setup:
- **GitHub**: https://github.com/ForkIt369/DusaNFT
- **Wallet**: 0x6Cb5365ADfC0fdFc2aD7C02151A04e9f0F9eBeCA
- **Network**: Metis Andromeda (Chain ID: 1088)

Ready to deploy! Just need METIS for gas fees.