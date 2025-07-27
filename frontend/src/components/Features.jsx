function Features() {
  return (
    <section className="features" id="about">
      <div className="features-container">
        <h2>How It Works</h2>
        <p className="features-subtitle">
          Three simple steps to secure, decentralized freelancing
        </p>
        
        <div className="feature-cards">
          <div className="feature-card">
            <span className="feature-icon">📝</span>
            <h3>Post & Escrow</h3>
            <p>
              Clients post service requests with ETH deposits automatically 
              locked in smart contracts for maximum security and trust.
            </p>
          </div>
          
          <div className="feature-card">
            <span className="feature-icon">💼</span>
            <h3>Apply & Deliver</h3>
            <p>
              Providers apply for jobs they love. Clients assign work to 
              the best candidates and track progress transparently.
            </p>
          </div>
          
          <div className="feature-card">
            <span className="feature-icon">✅</span>
            <h3>Approve & Pay</h3>
            <p>
              Clients approve delivery for instant payment, or raise disputes 
              resolved by decentralized governance. Fair and fast.
            </p>
          </div>
        </div>
        
        <div className="feature-cards" style={{ marginTop: '3rem' }}>
          <div className="feature-card">
            <span className="feature-icon">🔒</span>
            <h3>Secure Escrow</h3>
            <p>
              Smart contracts automatically hold funds until work is delivered 
              and approved, protecting both clients and providers.
            </p>
          </div>
          
          <div className="feature-card">
            <span className="feature-icon">⚡</span>
            <h3>Instant Payments</h3>
            <p>
              No waiting for bank transfers. Get paid immediately upon 
              approval with cryptocurrency directly to your wallet.
            </p>
          </div>
          
          <div className="feature-card">
            <span className="feature-icon">🌐</span>
            <h3>Global Access</h3>
            <p>
              Work with anyone, anywhere in the world. No geographic 
              restrictions, currency conversions, or platform limitations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;