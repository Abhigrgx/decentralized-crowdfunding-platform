export default function ConnectWallet({ connectMetamask }) {
  return (
    <div className="connectWallet">
      <div className="typingContainer">
        <div className="typing">Welcome to DeFindStarter</div>
      </div>
      <div className="walletButtonContainer">
        <button className="walletButton" onClick={connectMetamask}>
          <span>Connect Wallet</span>
        </button>
      </div>
    </div>
  );
}
