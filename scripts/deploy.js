const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying ServiceMarketplace...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  
  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy the contract
  const ServiceMarketplace = await ethers.getContractFactory("ServiceMarketplace");
  const marketplace = await ServiceMarketplace.deploy();
  
  await marketplace.waitForDeployment();
  
  const contractAddress = await marketplace.getAddress();
  
  console.log("✅ ServiceMarketplace deployed to:", contractAddress);
  console.log("👤 Admin address:", deployer.address);
  
  // Verify deployment
  const admin = await marketplace.admin();
  const serviceCount = await marketplace.serviceCount();
  
  console.log("\n📋 Contract Details:");
  console.log("   Admin:", admin);
  console.log("   Initial Service Count:", serviceCount.toString());
  
  console.log("\n🔧 Frontend Setup:");
  console.log(`   Update CONTRACT_ADDRESS in App.jsx to: "${contractAddress}"`);
  console.log(`   Update ADMIN_ADDRESS in App.jsx to: "${deployer.address}"`);
  
  console.log("\n🌐 View on Explorer:");
  console.log(`   https://sepolia.etherscan.io/address/${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });