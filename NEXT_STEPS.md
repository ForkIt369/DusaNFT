# 🎉 Your NFT Contract is Live!

**Contract Address:** `0x5C30e1552d37d3e119dAC4Fc4e364258f8809Bd8`
**Explorer:** https://andromeda-explorer.metis.io/address/0x5C30e1552d37d3e119dAC4Fc4e364258f8809Bd8

## What You Can Do Now:

### 1. Upload Metadata to Pinata
- Go to [Pinata](https://app.pinata.cloud/)
- Upload `metadata/dusa-nft-metadata.json`
- Get the CID and update line 5 in `app.js`

### 2. Test Your Minting Page
- Open `index.html` in your browser
- Connect with MetaMask
- Your address is already whitelisted!

### 3. Add More Whitelisted Addresses
Edit `app.js` line 8-11:
```javascript
const WHITELIST = [
    '0x6Cb5365ADfC0fdFc2aD7C02151A04e9f0F9eBeCA', // You
    '0xFriend1Address',
    '0xFriend2Address',
];
```

### 4. Manage Your Contract
Through Remix or Etherscan, you can:
- `setMintPrice()` - Change mint price
- `setMintingEnabled()` - Pause/resume minting
- `withdraw()` - Withdraw collected METIS

### 5. Share Your Minting Page
- Host on GitHub Pages
- Upload to IPFS
- Share `index.html` directly

## Features Added:
✅ Deployed on Metis Andromeda
✅ Whitelist functionality (only approved addresses can mint)
✅ Beautiful dark UI
✅ MetaMask integration
✅ Contract verified and live!

Your NFT project is ready! 🚀