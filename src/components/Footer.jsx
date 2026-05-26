export default function Footer() {
  return (
    <footer id="apply">
      <div className="wrap">
        <div className="subscribe">
          <div className="subscribe__cell">
            <span className="subscribe__logo">
              <img src="/logo.png" alt="" className="subscribe__logo-img" width="28" height="28" />
              Metamorphs
            </span>
          </div>
          <div className="subscribe__cell">
            <div className="subscribe__head">Subscribe to be in touch*</div>
            <input className="subscribe__input" type="email" placeholder="Your e-mail" />
          </div>
          <div className="subscribe__cell">
            <div className="subscribe__hint">* Only valuable resources</div>
          </div>
          <div className="subscribe__cell">
            <button className="btn">Subscribe</button>
          </div>
        </div>

        <div className="footer-cols">
          <div className="footer-col">
            <span className="footer-col__head">Ecosystem</span>
            <a href="#">Metamorphs Studio</a>
            <a href="#">Agent Library</a>
          </div>
          <div className="footer-col">
            <span className="footer-col__head">Quick Links</span>
            <a href="#/">Home</a>
            <a href="#/dashboard">Dashboard</a>
            <a href="#/#portfolio">Portfolio</a>
            <a href="#/#team">Agents</a>
          </div>
          <div className="footer-col">
            <span className="footer-col__head">Legal</span>
            <a href="#">Privacy Policy</a>
            <a href="#">Cookie Policy</a>
            <a href="#">Terms of Service</a>
          </div>
          <div className="footer-col footer-col__social">
            <a href="#">TELEGRAM</a>
            <a href="#">X / TWITTER</a>
            <a href="#">LINKEDIN</a>
            <a href="#">MEDIUM</a>
          </div>
        </div>

        <div className="footer-bar">
          <span>© 2026 — All rights reserved by metamorphs.xyz</span>
          <span>v0.1 · open-source agents that build</span>
        </div>
      </div>
    </footer>
  )
}
