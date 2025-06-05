# Dusa NFT - Metis Andromeda

Video NFT minting dApp for Metis Andromeda blockchain.

## Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   - Copy `.env.example` to `.env`
   - Add your wallet private key (with METIS for deployment)

3. **Upload metadata to IPFS**
   - Upload `metadata/dusa-nft-metadata.json` to Pinata or another IPFS service
   - Note the CID

4. **Deploy contract**
   ```bash
   npm run deploy
   ```

5. **Update frontend**
   - Update `CONTRACT_ADDRESS` in `app.js` with deployed address
   - Update `METADATA_URI` in `app.js` with IPFS metadata CID

6. **Host frontend**
   - Open `index.html` in a web browser
   - Or host on IPFS/web server

## Contract Details

- **Network**: Metis Andromeda (Chain ID: 1088)
- **Token Standard**: ERC-721
- **Mint Price**: 0.01 METIS
- **Max Supply**: 10,000

## Video IPFS Hash
`bafybeigipzvliwhovucye4nv2ivk4qxr5r2bgs3kejaf3xz4i6yhnn3a5m`