import { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./styles/main.css";

import contractABI from "./ServiceMarketplace.json";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Footer from "./components/Footer";
import LandingFooter from "./components/LandingFooter";


const CONTRACT_ADDRESS = "0x651Ef3Bc4C9a5c811de2b77C9ff8eE859Af52354";
const ADMIN_ADDRESS = "0x91ABcC00AE1ba976bDa475153a1c7dAe19ade231";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [services, setServices] = useState([]);
  const [serviceDesc, setServiceDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [applicantsMap, setApplicantsMap] = useState({});

  useEffect(() => {
    async function init() {
      if (!window.ethereum) return alert("Please install MetaMask");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const instance = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
      setAccount(address);
      setContract(instance);
    }
    init();
  }, []);

  useEffect(() => {
    if (contract) fetchServices();
  }, [contract]);

  const fetchApplicants = async () => {
    const newMap = {};
    const total = await contract.serviceCount();
    
    for (let serviceId = 0; serviceId < total; serviceId++) {
      try {
        const applicants = await contract.getApplicants(serviceId);
        newMap[serviceId] = applicants;
      } catch (e) {
        console.error(`Error fetching applicants for service ${serviceId}:`, e);
      }
    }
    setApplicantsMap(newMap);
  };

  useEffect(() => {
    if (contract && services.length > 0) {
      fetchApplicants();
    }
  }, [contract, services]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const total = await contract.serviceCount();
      const list = [];
      for (let i = 0; i < total; i++) {
        list.push(await contract.services(i));
      }
      setServices(list);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const createService = async () => {
    if (!serviceDesc.trim()) {
      alert("Please enter a service description");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      const tx = await contract.createService(serviceDesc, { 
        value: ethers.parseEther(amount) 
      });
      await tx.wait();
      alert("✅ Service created successfully!");
      setServiceDesc("");
      setAmount("");
      fetchServices();
    } catch (error) {
      console.error("Create service failed:", error);
      alert("❌ Failed to create service: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const applyForService = async (id) => {
    setLoading(true);
    try {
      const tx = await contract.applyForService(id);
      await tx.wait();
      alert("✅ Applied successfully!");
      fetchServices();
    } catch (error) {
      console.error("Apply failed:", error);
      if (error.message.includes("Already applied")) {
        alert("❌ You've already applied to this service");
      } else if (error.message.includes("Service not open")) {
        alert("❌ This service is no longer accepting applications");
      } else {
        alert("❌ Application failed: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const deliverWork = async (id) => {
    setLoading(true);
    try {
      const tx = await contract.markDelivered(id);
      await tx.wait();
      alert("✅ Work marked as delivered!");
      fetchServices();
    } catch (error) {
      console.error("Delivery failed:", error);
      alert("❌ Failed to mark as delivered: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const approveService = async (id) => {
    setLoading(true);
    try {
      const tx = await contract.approveService(id);
      await tx.wait();
      alert("✅ Service approved and payment sent!");
      fetchServices();
    } catch (error) {
      console.error("Approval failed:", error);
      alert("❌ Failed to approve service: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const assignProvider = async (serviceId, providerAddress) => {
    setLoading(true);
    try {
      const tx = await contract.assignProvider(serviceId, providerAddress);
      await tx.wait();
      alert("✅ Provider assigned successfully!");
      fetchServices();
    } catch (error) {
      console.error("Assignment failed:", error);
      alert("❌ Failed to assign provider: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const disputeService = async (id) => {
    setLoading(true);
    try {
      const tx = await contract.raiseDispute(id);
      await tx.wait();
      alert("⚠️ Dispute raised. Admin will review.");
      fetchServices();
    } catch (error) {
      console.error("Dispute failed:", error);
      alert("❌ Failed to raise dispute: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resolveDispute = async (id, refundClient = false) => {
    setLoading(true);
    try {
      const tx = await contract.adminResolve(id, refundClient);
      await tx.wait();
      alert(`✅ Dispute resolved - ${refundClient ? 'Client refunded' : 'Provider paid'}`);
      fetchServices();
    } catch (error) {
      console.error("Resolution failed:", error);
      alert("❌ Failed to resolve dispute: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const chooseRole = (role) => {
    localStorage.setItem("userRole", role);
    setUserRole(role);
  };

  const switchRole = () => {
    localStorage.removeItem("userRole");
    setUserRole("");
  };

  const statusMap = ["Created", "Funded", "Assigned", "Delivered", "Approved", "Disputed", "Resolved"];
  const getStatusColor = (status) => {
    const colors = {
      0: "#667eea", // Created
      1: "#4facfe", // Funded  
      2: "#f093fb", // Assigned
      3: "#fbbf24", // Delivered
      4: "#10b981", // Approved
      5: "#ef4444", // Disputed
      6: "#6b7280"  // Resolved
    };
    return colors[status] || "#6b7280";
  };

  const myRequests = services.filter(s => s.client === account);
  const myJobs = services.filter(s => s.provider === account);
  const isAdmin = account.toLowerCase() === ADMIN_ADDRESS.toLowerCase();

  if (!userRole) {
    return (
      <div className="app">
        <Navbar account={account} />
        <Hero onChooseRole={chooseRole} />
        <Features />
        <LandingFooter />
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar account={account} />
      
      <div className="container">
        <div className="role-switch">
          <p><b>Connected Wallet:</b> {account.slice(0, 6)}...{account.slice(-4)}</p>
          <button className="button-switch" onClick={switchRole}>
            🔁 Switch Role
          </button>
        </div>

        {loading && <div className="loading-overlay">Loading...</div>}

        {/* CLIENT VIEW */}
        {userRole === "client" && (
          <>
            <section className="dashboard-section">
              <h2 className="section-title">Create New Service</h2>
              <div className="form-container">
                <input 
                  placeholder="Service description (e.g., Create a landing page)" 
                  className="input" 
                  value={serviceDesc}
                  onChange={e => setServiceDesc(e.target.value)} 
                />
                <input 
                  placeholder="Amount in ETH (e.g., 0.1)" 
                  className="input" 
                  value={amount}
                  onChange={e => setAmount(e.target.value)} 
                  type="number"
                  step="0.001"
                />
                <button 
                  className={`button ${loading ? 'loading' : ''}`} 
                  onClick={createService}
                  disabled={loading}
                >
                  {loading ? 'Creating...' : '🚀 Create Service'}
                </button>
              </div>
            </section>

            <section className="dashboard-section">
              <h2 className="section-title">My Service Requests</h2>
              {myRequests.length === 0 ? (
                <div className="empty-state">
                  <p>No service requests yet. Create your first service above!</p>
                </div>
              ) : (
                myRequests.map((s, i) => {
                  const serviceStatus = Number(s.status);
                  const hasApplicants = applicantsMap[i]?.length > 0;
                  
                  return (
                    <div key={i} className="card service-card">
                      <div className="card-header">
                        <h3>Service #{i}</h3>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(serviceStatus) }}
                        >
                          {statusMap[serviceStatus]}
                        </span>
                      </div>
                      
                      <div className="card-content">
                        <p><b>Description:</b> {s.description}</p>
                        <p><b>Amount:</b> {ethers.formatEther(s.amount)} ETH</p>
                        
                        {serviceStatus === 0 && hasApplicants && (
                          <div className="applicants-section">
                            <p><b>Applications Received:</b></p>
                            {applicantsMap[i].map((applicant, idx) => (
                              <div key={idx} className="applicant-row">
                                <span>{applicant.slice(0, 6)}...{applicant.slice(-4)}</span>
                                <button 
                                  className="inline-button"
                                  onClick={() => assignProvider(i, applicant)}
                                  disabled={loading}
                                >
                                  🎯 Assign Provider
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {serviceStatus === 3 && (
                          <div className="action-buttons">
                            <button 
                              className="inline-button success"
                              onClick={() => approveService(i)}
                              disabled={loading}
                            >
                              ✅ Approve & Pay
                            </button>
                            <button 
                              className="inline-button warning"
                              onClick={() => disputeService(i)}
                              disabled={loading}
                            >
                              ⚠️ Raise Dispute
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </section>
          </>
        )}

        {/* PROVIDER VIEW */}
        {userRole === "provider" && (
          <>
            <section className="dashboard-section">
              <h2 className="section-title">📋 Available Jobs</h2>
              {services
                .filter((s) => Number(s.status) === 0 && s.client.toLowerCase() !== account.toLowerCase())
                .length === 0 ? (
                <div className="empty-state">
                  <p>No available jobs right now. Check back later!</p>
                </div>
              ) : (
                services
                  .filter((s) => Number(s.status) === 0 && s.client.toLowerCase() !== account.toLowerCase())
                  .map((s, i) => (
                    <div key={i} className="card job-card">
                      <div className="card-header">
                        <h3>Job #{services.indexOf(s)}</h3>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(0) }}
                        >
                          Open
                        </span>
                      </div>
                      
                      <div className="card-content">
                        <p><b>Description:</b> {s.description}</p>
                        <p><b>Payment:</b> {ethers.formatEther(s.amount)} ETH</p>
                        <p><b>Client:</b> {s.client.slice(0, 6)}...{s.client.slice(-4)}</p>
                        
                        <button 
                          className={`button ${loading ? 'loading' : ''}`}
                          onClick={() => applyForService(services.indexOf(s))}
                          disabled={loading}
                        >
                          {loading ? 'Applying...' : '🙋 Apply for Job'}
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </section>

            <section className="dashboard-section">
              <h2 className="section-title">My Assigned Jobs</h2>
              {myJobs.length === 0 ? (
                <div className="empty-state">
                  <p>No assigned jobs yet. Apply to available jobs above!</p>
                </div>
              ) : (
                myJobs.map((s, i) => {
                  const serviceId = services.indexOf(s);
                  const serviceStatus = Number(s.status);
                  
                  return (
                    <div key={i} className="card job-card assigned">
                      <div className="card-header">
                        <h3>Job #{serviceId}</h3>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(serviceStatus) }}
                        >
                          {statusMap[serviceStatus]}
                        </span>
                      </div>
                      
                      <div className="card-content">
                        <p><b>Description:</b> {s.description}</p>
                        <p><b>Payment:</b> {ethers.formatEther(s.amount)} ETH</p>
                        <p><b>Client:</b> {s.client.slice(0, 6)}...{s.client.slice(-4)}</p>
                        
                        {serviceStatus === 2 && (
                          <button 
                            className={`button ${loading ? 'loading' : ''}`}
                            onClick={() => deliverWork(serviceId)}
                            disabled={loading}
                          >
                            {loading ? 'Submitting...' : '📤 Mark as Delivered'}
                          </button>
                        )}
                        
                        {serviceStatus === 3 && (
                          <div className="status-message success">
                            ✅ Work delivered! Waiting for client approval.
                          </div>
                        )}
                        
                        {serviceStatus === 4 && (
                          <div className="status-message success">
                            🎉 Work approved and payment received!
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </section>
          </>
        )}

        {/* ADMIN VIEW */}
        {isAdmin && (
          <section className="dashboard-section admin">
            <h2 className="section-title">⚖️ Dispute Resolution</h2>
            {services.filter(s => s.status === 5).length === 0 ? (
              <div className="empty-state">
                <p>No pending disputes. All services are running smoothly!</p>
              </div>
            ) : (
              services.filter(s => s.status === 5).map((s, i) => {
                const serviceId = services.indexOf(s);
                return (
                  <div className="card dispute-card" key={serviceId}>
                    <div className="card-header">
                      <h3>Dispute #{serviceId}</h3>
                      <span className="status-badge danger">Disputed</span>
                    </div>
                    
                    <div className="card-content">
                      <p><b>Description:</b> {s.description}</p>
                      <p><b>Amount:</b> {ethers.formatEther(s.amount)} ETH</p>
                      <p><b>Client:</b> {s.client.slice(0, 6)}...{s.client.slice(-4)}</p>
                      <p><b>Provider:</b> {s.provider.slice(0, 6)}...{s.provider.slice(-4)}</p>
                      
                      <div className="dispute-actions">
                        <button 
                          className="inline-button success"
                          onClick={() => resolveDispute(serviceId, false)}
                          disabled={loading}
                        >
                          💰 Pay Provider
                        </button>
                        <button 
                          className="inline-button warning"
                          onClick={() => resolveDispute(serviceId, true)}
                          disabled={loading}
                        >
                          🔄 Refund Client
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </section>
        )}
      
      </div>
      <Footer />
    </div>
  );
}

export default App;