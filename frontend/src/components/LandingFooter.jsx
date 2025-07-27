import React from "react";
import "../styles/main.css";

const LandingFooter = () => {
  return (
    <footer className="footer landing-footer fade-in-up">
      <div className="footer-top">
        <h2 className="brand">DeFiverr</h2>
        <p className="tagline">Decentralized freedom for creators & builders.</p>
      </div>

      <div className="footer-grid">
        <div className="footer-block">
          <h4>Made with 💜 by Pragya Hurmade</h4>
          <p>Blockchain enthusiast & full-stack dev building trustless systems.</p>
          <div className="social-links">
            <a href="https://github.com/Pragyaa3" target="_blank" rel="noreferrer" aria-label="GitHub">
              <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .3a12 12 0 00-3.79 23.4c.6.1.82-.26.82-.58v-2.2c-3.34.73-4-1.6-4-1.6a3.1 3.1 0 00-1.3-1.7c-1.1-.8.1-.8.1-.8a2.5 2.5 0 011.9 1.3 2.5 2.5 0 003.4 1 2.5 2.5 0 01.75-1.6c-2.67-.3-5.47-1.3-5.47-5.8a4.5 4.5 0 011.2-3.1 4.2 4.2 0 01.1-3.1s1-.3 3.2 1.2a11 11 0 015.8 0c2.2-1.5 3.2-1.2 3.2-1.2a4.2 4.2 0 01.1 3.1 4.5 4.5 0 011.2 3.1c0 4.5-2.8 5.5-5.5 5.8a2.8 2.8 0 01.8 2.2v3.2c0 .3.2.7.8.58A12 12 0 0012 .3z" />
              </svg>
            </a>
            <a href="https://x.com/Pragyaxh3" target="_blank" rel="noreferrer" aria-label="Twitter">
              <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.46 6c-.77.35-1.6.59-2.46.7a4.2 4.2 0 001.84-2.3c-.83.5-1.75.84-2.72 1A4.2 4.2 0 0012 9a12 12 0 01-8.7-4.4 4.2 4.2 0 001.3 5.6 4.3 4.3 0 01-1.9-.5v.05c0 2.1 1.5 3.9 3.5 4.3a4.2 4.2 0 01-1.9.07 4.2 4.2 0 003.9 2.9 8.5 8.5 0 01-5.3 1.8c-.34 0-.68 0-1.02-.05A12 12 0 0010.5 21c7.5 0 11.6-6.2 11.6-11.6v-.5a8.3 8.3 0 002-2.1z" />
              </svg>
            </a>
            <a href="https://www.instagram.com/_.prag.yaayy/?hl=en" target="_blank" rel="noreferrer" aria-label="Instagram">
              <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 2 .3 2.5.6a4.9 4.9 0 011.8 1.8c.3.5.5 1.3.6 2.5.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 2-.6 2.5a4.9 4.9 0 01-1.8 1.8c-.5.3-1.3.5-2.5.6-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-2-.3-2.5-.6a4.9 4.9 0 01-1.8-1.8c-.3-.5-.5-1.3-.6-2.5C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-2 .6-2.5a4.9 4.9 0 011.8-1.8c.5-.3 1.3-.5 2.5-.6C8.4 2.2 8.8 2.2 12 2.2m0-2.2C8.7 0 8.3 0 7 .1 5.6.2 4.5.5 3.6 1a7.1 7.1 0 00-2.6 2.6C.5 4.5.2 5.6.1 7 0 8.3 0 8.7 0 12s0 3.7.1 5c.1 1.4.4 2.5.9 3.4a7.1 7.1 0 002.6 2.6c.9.5 2 .8 3.4.9 1.3.1 1.7.1 5 .1s3.7 0 5-.1c1.4-.1 2.5-.4 3.4-.9a7.1 7.1 0 002.6-2.6c.5-.9.8-2 .9-3.4.1-1.3.1-1.7.1-5s0-3.7-.1-5c-.1-1.4-.4-2.5-.9-3.4a7.1 7.1 0 00-2.6-2.6C19.5.5 18.4.2 17 .1 15.7 0 15.3 0 12 0zM12 5.8a6.2 6.2 0 100 12.4 6.2 6.2 0 000-12.4zm0 10.2a4 4 0 110-8 4 4 0 010 8zm6.4-11.6a1.4 1.4 0 100 2.8 1.4 1.4 0 000-2.8z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-block">
          <h4>No Middlemen</h4>
          <p>Smart contracts handle trust. No fees. No gatekeepers.</p>
        </div>

        <div className="footer-block">
          <h4>Open Source</h4>
          <p>Check out the code, contribute, or build your own DeFiverr fork.</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 DeFiverr — Crafted with ❤️ on Ethereum & React</p>
      </div>
    </footer>
  );
};

export default LandingFooter;
