import { FaTwitter, FaGithub, FaInstagram } from "react-icons/fa";

export default function FooterComponent() {
  return (
    <div className="footer">
      <div className="footerContainer">
        <div className="trademarkSection">
          <span>© {new Date().getFullYear()} DeFindStarter</span>
        </div>
        <div className="externalLinks">
          <div className="icon">
            <a href="https://twitter.com" className="twitter-icon" target="_blank" rel="noreferrer">
              <FaTwitter />
            </a>
          </div>
          <div className="icon">
            <a href="https://github.com/SayanKar" className="github-icon" target="_blank" rel="noreferrer">
              <FaGithub />
            </a>
          </div>
          <div className="icon">
            <div className="insta-icon-wrapper">
              <a href="https://www.instagram.com/sayan.kar2000/" className="insta-icon" target="_blank" rel="noreferrer">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
