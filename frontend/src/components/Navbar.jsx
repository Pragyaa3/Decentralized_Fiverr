import "../styles/main.css";

function Navbar({ account }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="logo-box">
            <span className="logo-text">DF</span>
          </div>
          DeFiverr
        </div>
        <div className="navbar-nav">
          <a href="#home">Home</a>
          <a href="#dashboard">Dashboard</a>
          <a href="#about">About</a>
          {account && (
            <div className="wallet">
              {account.slice(0, 6)}...{account.slice(-4)}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
