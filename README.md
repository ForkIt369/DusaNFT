# Dusa NFT - Metis Andromeda

A video NFT minting dApp with an innovative reputation system for the Metis Andromeda blockchain.

## 🚀 Features

- **Video NFT Minting**: Mint unique NFTs featuring custom video content
- **Reputation System**: Track holder engagement with BITS across 4 categories
- **Tier Progression**: Visual ring-based progress through 4 tiers
- **Admin Dashboard**: Manage whitelist and reputation points
- **Zen UI Design**: Clean, minimalist interface with smooth animations

## 📁 Project Structure

```
DusaNFT/
├── contracts/              # Smart contracts
│   ├── DusaNFT.sol        # Main NFT contract
│   └── DusaReputation.sol # Reputation tracking contract
├── frontend/              # Web interface
│   ├── index.html         # Minting page
│   ├── admin.html         # Admin dashboard
│   ├── reputation-admin.html  # Reputation manager
│   └── reputation-preview.html # Visual preview
├── scripts/               # Deployment scripts
├── metadata/              # NFT metadata
├── assets/                # Media files
└── docs/                  # Documentation
    ├── deployment/        # Deployment guides
    └── features/          # Feature documentation
```

## 🎮 Reputation System

The Dusa NFT Reputation System tracks holder engagement through BITS (points) across 4 categories:

### Categories
- **🎯 Align** (White): Alignment with values & mission
- **⚡ Action** (Orange): Actions taken & tasks completed  
- **✨ Karma** (Violet): Good deeds & positive impact
- **🤝 Synergy** (Green): Collaboration & teamwork

### Tier System
- **Tier 1**: 0 - 999 BITS
- **Tier 2**: 1,000 - 2,499 BITS
- **Tier 3**: 2,500 - 4,999 BITS
- **Tier 4**: 5,000+ BITS

## 🛠 Setup Instructions

### Prerequisites
- Node.js v16+
- MetaMask wallet with METIS
- Ledger hardware wallet (for deployment)

### Installation

1. **Clone repository**
   ```bash
   git clone https://github.com/ForkIt369/DusaNFT.git
   cd DusaNFT
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Add your configuration
   ```

### Deployment

1. **Using Remix (Recommended for Ledger)**
   - Open [Remix IDE](https://remix.ethereum.org)
   - Connect GitHub: Settings > GitHub > Connect
   - Load contracts from this repository
   - See `docs/deployment/REMIX_GITHUB_QUICKSTART.md`

2. **Deploy Contracts**
   - DusaNFT.sol first
   - DusaReputation.sol with NFT contract address

3. **Update Frontend**
   - Update contract addresses in `frontend/app.js`
   - Update metadata URI with IPFS hash

4. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

## 📊 Contract Details

### DusaNFT Contract
- **Network**: Metis Andromeda (Chain ID: 1088)
- **Token Standard**: ERC-721
- **Mint Price**: 0.01 METIS
- **Max Supply**: 10,000
- **Contract**: `0x5C30e1552d37d3e119dAC4Fc4e364258f8809Bd8`

### DusaReputation Contract
- **XP per Level**: 1,000 BITS
- **Max Level**: 100
- **Update Access**: Owner + Managers

## 🎥 Media Assets

- **Video IPFS**: `bafybeigipzvliwhovucye4nv2ivk4qxr5r2bgs3kejaf3xz4i6yhnn3a5m`
- **Metadata IPFS**: `bafkreiazyhrirhlyeyxkvw7kukkcts2glji5vryobbqdcnnmz2otkvyjk4`

## 🔧 Development

### Local Development
```bash
# Run local server
npx http-server frontend -p 8080

# Run tests
npx hardhat test

# Compile contracts
npx hardhat compile
```

### GitHub Actions
This project includes CI/CD workflows for:
- Contract testing and compilation
- Code linting and formatting
- Security analysis with Slither
- Automatic deployment previews

## 📚 Documentation

- **Deployment Guides**: See `docs/deployment/`
- **Reputation System**: See `docs/features/REPUTATION_IMPLEMENTATION.md`
- **Quest Setup**: See `docs/features/QUEST_SETUP.md`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- **GitHub**: [ForkIt369/DusaNFT](https://github.com/ForkIt369/DusaNFT)
- **Live Demo**: [Coming Soon]
- **Metis Explorer**: [Contract on Explorer](https://andromeda-explorer.metis.io/address/0x5C30e1552d37d3e119dAC4Fc4e364258f8809Bd8)

---

Built with ❤️ for the Metis community