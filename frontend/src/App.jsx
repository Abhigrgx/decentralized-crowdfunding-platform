import "./style.css";
import NavbarComponent from "./components/NavbarComponent";
import HomeComponent from "./components/HomeComponent";
import FooterComponent from "./components/FooterComponent";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CreateProjectComponent from "./components/CreateProjectComponent";
import ConnectWallet from "./components/ConnectWallet";
import DiscoverComponent from "./components/DiscoverComponent";
import ProjectComponent from "./components/ProjectComponent";
import ProfileComponent from "./components/ProfileComponent";
import { useState } from "react";
import { ethers } from "ethers";
import { abi } from "./abi";

const CONTRACT_ADDRESS = "0x5d89a30c8B83232831AEf137863dDEb3BddfB68a";

function App() {
  const [myContract, setMyContract] = useState(null);
  const [address, setAddress] = useState("");

  async function changeNetwork() {
    if (!window.ethereum) {
      throw new Error("MetaMask is not available");
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xa869" }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0xa869",
                chainName: "Avalanche Fuji Testnet",
                nativeCurrency: { name: "Avalanche", symbol: "AVAX", decimals: 18 },
                rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
              },
            ],
          });
        } catch {
          alert("Error adding Avalanche FUJI testnet");
        }
      }
    }
  }

  async function connect() {
    try {
      if (!window.ethereum) {
        alert("MetaMask is required to use this app");
        return;
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });
      await changeNetwork();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const add = await signer.getAddress();
      setAddress(add);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
      setMyContract(contract);
    } catch (err) {
      console.error("Connect error:", err);
      alert("Couldn't connect to MetaMask");
    }
  }

  const checkConnected = (component) =>
    !myContract ? <ConnectWallet connectMetamask={connect} /> : component;

  return (
    <div className="app">
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        {myContract && <NavbarComponent address={address} />}
        <Routes>
          <Route path="/" element={checkConnected(<HomeComponent contract={myContract} />)} />
          <Route path="create_project" element={checkConnected(<CreateProjectComponent contract={myContract} />)} />
          <Route path="discover" element={checkConnected(<DiscoverComponent contract={myContract} />)} />
          <Route path="profile" element={checkConnected(<ProfileComponent contract={myContract} userAddress={address} />)} />
          <Route path="project" element={checkConnected(<ProjectComponent contract={myContract} userAddress={address} />)} />
        </Routes>
        {myContract && <FooterComponent />}
      </BrowserRouter>
    </div>
  );
}

export default App;