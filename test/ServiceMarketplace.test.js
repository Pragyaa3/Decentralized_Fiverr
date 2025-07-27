const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ServiceMarketplace", function () {
  let marketplace;
  let owner, client, provider, admin, otherProvider;
  const SERVICE_AMOUNT = ethers.parseEther("0.1");

  beforeEach(async function () {
    [owner, client, provider, admin, otherProvider] = await ethers.getSigners();
    
    const ServiceMarketplace = await ethers.getContractFactory("ServiceMarketplace");
    marketplace = await ServiceMarketplace.deploy();
    await marketplace.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right admin", async function () {
      expect(await marketplace.admin()).to.equal(owner.address);
    });

    it("Should start with zero services", async function () {
      expect(await marketplace.serviceCount()).to.equal(0);
    });
  });

  describe("Service Creation", function () {
    it("Should create a service successfully", async function () {
      const description = "Create a logo";
      
      await expect(marketplace.connect(client).createService(description, { value: SERVICE_AMOUNT }))
        .to.emit(marketplace, "ServiceCreated")
        .withArgs(0, client.address, description, SERVICE_AMOUNT);
      
      const service = await marketplace.services(0);
      expect(service.client).to.equal(client.address);
      expect(service.description).to.equal(description);
      expect(service.amount).to.equal(SERVICE_AMOUNT);
      expect(service.status).to.equal(0); // Created
      expect(await marketplace.serviceCount()).to.equal(1);
    });

    it("Should create multiple services", async function () {
      await marketplace.connect(client).createService("Logo design", { value: SERVICE_AMOUNT });
      await marketplace.connect(client).createService("Website development", { value: ethers.parseEther("0.5") });
      
      expect(await marketplace.serviceCount()).to.equal(2);
      
      const service1 = await marketplace.services(0);
      const service2 = await marketplace.services(1);
      
      expect(service1.description).to.equal("Logo design");
      expect(service2.description).to.equal("Website development");
    });
  });

  describe("Provider Application", function () {
    beforeEach(async function () {
      await marketplace.connect(client).createService("Logo design", { 
        value: SERVICE_AMOUNT 
      });
    });

    it("Should allow provider to apply", async function () {
      await expect(marketplace.connect(provider).applyForService(0))
        .to.emit(marketplace, "ProviderApplied")
        .withArgs(0, provider.address);
      
      const applicants = await marketplace.getApplicants(0);
      expect(applicants).to.include(provider.address);
      expect(applicants.length).to.equal(1);
    });

    it("Should allow multiple providers to apply", async function () {
      await marketplace.connect(provider).applyForService(0);
      await marketplace.connect(otherProvider).applyForService(0);
      
      const applicants = await marketplace.getApplicants(0);
      expect(applicants).to.include(provider.address);
      expect(applicants).to.include(otherProvider.address);
      expect(applicants.length).to.equal(2);
    });

    it("Should prevent duplicate applications", async function () {
      await marketplace.connect(provider).applyForService(0);
      
      await expect(marketplace.connect(provider).applyForService(0))
        .to.be.revertedWith("Already applied");
    });

    it("Should reject applications to non-existent services", async function () {
      await expect(marketplace.connect(provider).applyForService(999))
        .to.be.reverted;
    });

    it("Should reject applications to non-open services", async function () {
      // First apply and assign
      await marketplace.connect(provider).applyForService(0);
      await marketplace.connect(client).assignProvider(0, provider.address);
      
      // Now try to apply again (service is no longer "Created")
      await expect(marketplace.connect(otherProvider).applyForService(0))
        .to.be.revertedWith("Service not open");
    });
  });

  describe("Provider Assignment", function () {
    beforeEach(async function () {
      await marketplace.connect(client).createService("Logo design", { 
        value: SERVICE_AMOUNT 
      });
      await marketplace.connect(provider).applyForService(0);
    });

    it("Should assign provider successfully", async function () {
      await expect(marketplace.connect(client).assignProvider(0, provider.address))
        .to.emit(marketplace, "ProviderAssigned")
        .withArgs(0, client.address, provider.address);
      
      const service = await marketplace.services(0);
      expect(service.provider).to.equal(provider.address);
      expect(service.status).to.equal(2); // Assigned
    });

    it("Should reject assignment by non-client", async function () {
      await expect(marketplace.connect(provider).assignProvider(0, provider.address))
        .to.be.revertedWith("Not client");
    });

    it("Should reject assignment of non-applicant", async function () {
      await expect(marketplace.connect(client).assignProvider(0, otherProvider.address))
        .to.be.revertedWith("Provider not in applicants");
    });

    it("Should reject assignment to non-created service", async function () {
      // Assign provider first
      await marketplace.connect(client).assignProvider(0, provider.address);
      
      // Try to assign again
      await expect(marketplace.connect(client).assignProvider(0, provider.address))
        .to.be.revertedWith("Not in Created status");
    });
  });

  describe("Work Delivery", function () {
    beforeEach(async function () {
      await marketplace.connect(client).createService("Logo design", { 
        value: SERVICE_AMOUNT 
      });
      await marketplace.connect(provider).applyForService(0);
      await marketplace.connect(client).assignProvider(0, provider.address);
    });

    it("Should allow provider to mark as delivered", async function () {
      await expect(marketplace.connect(provider).markDelivered(0))
        .to.emit(marketplace, "WorkDelivered")
        .withArgs(0, provider.address);
      
      const service = await marketplace.services(0);
      expect(service.status).to.equal(3); // Delivered
    });

    it("Should reject delivery by non-provider", async function () {
      await expect(marketplace.connect(client).markDelivered(0))
        .to.be.revertedWith("Not provider");
    });

    it("Should reject delivery of non-assigned service", async function () {
      // Create another service but don't assign it
      await marketplace.connect(client).createService("Website", { value: SERVICE_AMOUNT });
      
      await expect(marketplace.connect(provider).markDelivered(1))
        .to.be.revertedWith("Not provider");
    });
  });

  describe("Service Approval and Payment", function () {
    beforeEach(async function () {
      await marketplace.connect(client).createService("Logo design", { 
        value: SERVICE_AMOUNT 
      });
      await marketplace.connect(provider).applyForService(0);
      await marketplace.connect(client).assignProvider(0, provider.address);
      await marketplace.connect(provider).markDelivered(0);
    });

    it("Should allow client to approve and pay provider", async function () {
      const initialBalance = await ethers.provider.getBalance(provider.address);
      
      await expect(marketplace.connect(client).approveService(0))
        .to.emit(marketplace, "ServiceApproved")
        .withArgs(0, client.address, provider.address, SERVICE_AMOUNT);
      
      const finalBalance = await ethers.provider.getBalance(provider.address);
      expect(finalBalance - initialBalance).to.equal(SERVICE_AMOUNT);
      
      const service = await marketplace.services(0);
      expect(service.status).to.equal(4); // Approved
    });

    it("Should reject approval by non-client", async function () {
      await expect(marketplace.connect(provider).approveService(0))
        .to.be.revertedWith("Not client");
    });

    it("Should reject approval of non-delivered service", async function () {
      // Create new service in assigned state
      await marketplace.connect(client).createService("Website", { value: SERVICE_AMOUNT });
      await marketplace.connect(provider).applyForService(1);
      await marketplace.connect(client).assignProvider(1, provider.address);
      
      await expect(marketplace.connect(client).approveService(1))
        .to.be.revertedWith("Not delivered yet");
    });
  });

  describe("Dispute Management", function () {
    beforeEach(async function () {
      await marketplace.connect(client).createService("Logo design", { 
        value: SERVICE_AMOUNT 
      });
      await marketplace.connect(provider).applyForService(0);
      await marketplace.connect(client).assignProvider(0, provider.address);
      await marketplace.connect(provider).markDelivered(0);
    });

    it("Should allow client to raise dispute", async function () {
      await expect(marketplace.connect(client).raiseDispute(0))
        .to.emit(marketplace, "DisputeRaised")
        .withArgs(0, client.address);
      
      const service = await marketplace.services(0);
      expect(service.status).to.equal(5); // Disputed
    });

    it("Should allow admin to resolve dispute in favor of provider", async function () {
      await marketplace.connect(client).raiseDispute(0);
      
      const initialBalance = await ethers.provider.getBalance(provider.address);
      
      await expect(marketplace.connect(owner).adminResolve(0, false))
        .to.emit(marketplace, "DisputeResolved")
        .withArgs(0, owner.address, false, SERVICE_AMOUNT);
      
      const finalBalance = await ethers.provider.getBalance(provider.address);
      expect(finalBalance - initialBalance).to.equal(SERVICE_AMOUNT);
      
      const service = await marketplace.services(0);
      expect(service.status).to.equal(6); // Resolved
    });

    it("Should allow admin to resolve dispute in favor of client", async function () {
      await marketplace.connect(client).raiseDispute(0);
      
      const initialBalance = await ethers.provider.getBalance(client.address);
      
      await expect(marketplace.connect(owner).adminResolve(0, true))
        .to.emit(marketplace, "DisputeResolved")
        .withArgs(0, owner.address, true, SERVICE_AMOUNT);
      
      const finalBalance = await ethers.provider.getBalance(client.address);
      expect(finalBalance - initialBalance).to.equal(SERVICE_AMOUNT);
    });

    it("Should reject dispute resolution by non-admin", async function () {
      await marketplace.connect(client).raiseDispute(0);
      
      await expect(marketplace.connect(provider).adminResolve(0, false))
        .to.be.revertedWith("Not admin");
    });

    it("Should reject dispute on non-disputed service", async function () {
      await expect(marketplace.connect(owner).adminResolve(0, false))
        .to.be.revertedWith("Not disputed");
    });
  });

  describe("Edge Cases", function () {
    it("Should handle empty description", async function () {
      await expect(marketplace.connect(client).createService("", { value: SERVICE_AMOUNT }))
        .to.emit(marketplace, "ServiceCreated");
      
      const service = await marketplace.services(0);
      expect(service.description).to.equal("");
    });

    it("Should handle zero amount service", async function () {
      await expect(marketplace.connect(client).createService("Free service", { value: 0 }))
        .to.emit(marketplace, "ServiceCreated");
      
      const service = await marketplace.services(0);
      expect(service.amount).to.equal(0);
    });

    it("Should return empty array for service with no applicants", async function () {
      await marketplace.connect(client).createService("Logo design", { value: SERVICE_AMOUNT });
      
      const applicants = await marketplace.getApplicants(0);
      expect(applicants.length).to.equal(0);
    });
  });
});