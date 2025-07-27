# DeFiverr - Decentralized Freelance Marketplace

A blockchain-based peer-to-peer service marketplace built on Ethereum, where users can act as clients posting service requests or providers offering their skills.

## 🚀 Features

- **Role-based Access**: Client, Provider, and Admin roles  
- **Escrow System**: Secure ETH deposits with state transitions  
- **Dispute Resolution**: Admin-mediated conflict resolution  
- **Real-time Updates**: Live service status and applicant tracking  
- **MetaMask Integration**: Seamless wallet connection  

## 🛠️ Tech Stack

- **Smart Contracts**: Solidity ^0.8.0  
- **Frontend**: React.js + Ethers.js  
- **Development**: Hardhat  
- **Wallet**: MetaMask integration  
- **Deployment**: Sepolia Testnet  

## 📋 Project Structure

```
decentralized-fiverr/
├── contracts/
│   └── ServiceMarketplace.sol
├── scripts/
│   └── deploy.js
├── test/
│   └── ServiceMarketplace.test.js
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   └── styles/
│   └── package.json
├── hardhat.config.js
└── README.md
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js v16+
- MetaMask browser extension
- Sepolia ETH for testing

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd decentralized-fiverr
```

2. **Install dependencies**
```bash
npm install
cd frontend && npm install
```

3. **Configure environment**
```bash
cp .env.example .env
# Add your private key and Infura/Alchemy URL
```

4. **Compile contracts**
```bash
npx hardhat compile
```

5. **Run tests**
```bash
npx hardhat test
```

6. **Deploy to testnet**
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

7. **Start frontend**
```bash
cd frontend
npm start
```

## 🎮 Usage Instructions

### As a Client:
1. Connect MetaMask wallet  
2. Select "Client" role  
3. Create service request with ETH deposit  
4. Review provider applications  
5. Assign preferred provider  
6. Approve work or raise disputes  

### As a Provider:
1. Connect MetaMask wallet  
2. Select "Provider" role  
3. Browse available services  
4. Apply to relevant opportunities  
5. Deliver work when assigned  
6. Receive payment upon approval  

### As an Admin:
1. Connect with admin wallet  
2. Review disputed services  
3. Resolve conflicts by choosing refund or payment  

## 🧪 Test Accounts

```
Admin: 0x91ABcC00AE1ba976bDa475153a1c7dAe19ade231
Client: [Your test wallet address]
Provider: [Second test wallet address]
```

## 📱 Contract Addresses

- **Sepolia Testnet**: `0x651Ef3Bc4C9a5c811de2b77C9ff8eE859Af52354`

## 🎯 Core Workflow

1. **Service Creation**: Client posts request with ETH escrow  
2. **Provider Application**: Providers apply to open services  
3. **Assignment**: Client selects and assigns provider  
4. **Delivery**: Provider marks work as completed  
5. **Resolution**: Client approves (payment) or disputes (admin resolves)  

## 🔒 Security Features

- Role-based access control  
- Escrow protection for payments  
- Duplicate application prevention  
- Admin-only dispute resolution  
- Comprehensive event logging  

## 🚀 Future Enhancements

- Multi-token support (USDC, USDT)  
- Reputation and rating system  
- Service categories and filtering  
- Milestone-based payments  
- IPFS integration for file sharing  

## 📄 License

MIT License - see LICENSE.md for details

## 🤝 Contributing

1. Fork the repository  
2. Create feature branch  
3. Commit changes  
4. Push to branch  
5. Create Pull Request  

---

*Built for blockchain internship demonstration - showcasing full-stack dApp development skills*
