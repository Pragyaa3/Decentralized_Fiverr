// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ServiceMarketplace {
    enum Status { Created, Funded, Assigned, Delivered, Approved, Disputed, Resolved }

    struct Service {
        address client;
        address provider;
        string description;
        uint256 amount;
        Status status;
        address[] applicants;
    }

    address public admin;
    uint256 public serviceCount;
    mapping(uint256 => Service) public services;

    // Events for major actions
    event ServiceCreated(uint256 indexed serviceId, address indexed client, string description, uint256 amount);
    event ProviderApplied(uint256 indexed serviceId, address indexed provider);
    event ProviderAssigned(uint256 indexed serviceId, address indexed client, address indexed provider);
    event WorkDelivered(uint256 indexed serviceId, address indexed provider);
    event ServiceApproved(uint256 indexed serviceId, address indexed client, address indexed provider, uint256 amount);
    event DisputeRaised(uint256 indexed serviceId, address indexed client);
    event DisputeResolved(uint256 indexed serviceId, address indexed admin, bool refundedToClient, uint256 amount);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyClient(uint256 id) {
        require(msg.sender == services[id].client, "Not client");
        _;
    }

    modifier onlyProvider(uint256 id) {
        require(msg.sender == services[id].provider, "Not provider");
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    function createService(string memory description) external payable {
        services[serviceCount].client = msg.sender;
        services[serviceCount].description = description;
        services[serviceCount].amount = msg.value;
        services[serviceCount].status = Status.Created;
        
        emit ServiceCreated(serviceCount, msg.sender, description, msg.value);
        serviceCount++;
    }

    function applyForService(uint256 id) external {
        require(id < serviceCount, "Service does not exist");
        require(services[id].status == Status.Created, "Service not open");
        // Avoid duplicate applications
        for (uint i = 0; i < services[id].applicants.length; i++) {
            require(services[id].applicants[i] != msg.sender, "Already applied");
        }
        services[id].applicants.push(msg.sender);
        
        emit ProviderApplied(id, msg.sender);
    }

    function assignProvider(uint256 id, address provider) external onlyClient(id) {
        Service storage s = services[id];
        require(s.status == Status.Created, "Not in Created status");
        bool validApplicant = false;
        for (uint i = 0; i < s.applicants.length; i++) {
            if (s.applicants[i] == provider) {
                validApplicant = true;
                break;
            }
        }
        require(validApplicant, "Provider not in applicants");
        s.provider = provider;
        s.status = Status.Assigned;
        
        emit ProviderAssigned(id, msg.sender, provider);
    }

    function markDelivered(uint256 id) external onlyProvider(id) {
        Service storage s = services[id];
        require(s.status == Status.Assigned, "Not in Assigned status");
        s.status = Status.Delivered;
        
        emit WorkDelivered(id, msg.sender);
    }

    function approveService(uint256 id) external onlyClient(id) {
        Service storage s = services[id];
        require(s.status == Status.Delivered, "Not delivered yet");
        s.status = Status.Approved;
        payable(s.provider).transfer(s.amount);
        
        emit ServiceApproved(id, msg.sender, s.provider, s.amount);
    }

    function raiseDispute(uint256 id) external onlyClient(id) {
        Service storage s = services[id];
        require(s.status == Status.Delivered, "Can only dispute delivered");
        s.status = Status.Disputed;
        
        emit DisputeRaised(id, msg.sender);
    }

    function adminResolve(uint256 id, bool refundToClient) external onlyAdmin {
        Service storage s = services[id];
        require(s.status == Status.Disputed, "Not disputed");
        s.status = Status.Resolved;
        if (refundToClient) {
            payable(s.client).transfer(s.amount);
        } else {
            payable(s.provider).transfer(s.amount);
        }
        
        emit DisputeResolved(id, msg.sender, refundToClient, s.amount);
    }

    function getApplicants(uint256 id) external view returns (address[] memory) {
        return services[id].applicants;
    }
}