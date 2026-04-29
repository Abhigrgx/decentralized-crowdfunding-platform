import { useState } from "react";
import { ethers } from "ethers";

export default function PaymentModal({ setModalShow, contract, index }) {
  const [amount, setAmount] = useState(1);

  async function sendFund() {
    if (amount <= 0) { alert("Amount must be greater than 0"); return; }
    try {
      const txn = await contract.fundProject(index, { value: ethers.parseEther(amount.toString()) });
      await txn.wait();
      alert(`${amount} AVAX successfully funded`);
      setAmount(1);
      setModalShow(false);
    } catch (error) {
      console.error("Funding error:", error);
      alert("Error sending AVAX: " + error.message);
    }
  }

  return (
    <div className="modal">
      <div className="modalHeader">
        <h1>Payment <span className="closeBtn" onClick={() => setModalShow(false)}>&times;</span></h1>
      </div>
      <div className="modalContent">
        <label className="paymentLabel">Amount (AVAX)</label>
        <input
          type="number" className="payment" placeholder="Enter AVAX amount"
          min="1" step="1" value={amount}
          onChange={(e) => setAmount(e.target.value)} required
        />
        <button className="submit" onClick={sendFund}>Fund</button>
      </div>
    </div>
  );
}
