function Hero({ onChooseRole }) {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <h1>Decentralized Freelancing, Reimagined.</h1>
        <p>
          Secure jobs and services via blockchain-powered smart contracts. 
          No middlemen, lower fees, instant payments, and complete transparency.
        </p>
        <div className="role-buttons">
          <button onClick={() => onChooseRole("client")}>
            🔧 I need a service
          </button>
          <button onClick={() => onChooseRole("provider")}>
            🎨 I provide services
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;