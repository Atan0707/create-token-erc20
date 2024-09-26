import { useEffect, useState } from 'react';
import './App.css';
import MintToken from './MintToken.json';
import { ethers } from 'ethers';
import MintNFT from './MintNFT.json';

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState(null);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  const contractAddress = '0x5F3Afe566A00582498Dc1B62fD5E3239bF0903a7';
  const contractABI = MintToken.abi;
  // const MintAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3" // Network localhost btw
  // const MintABI = MintNFT.abi;

  // Function to connect the wallet and set up the contract
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);

        // Store the wallet address in localStorage
        localStorage.setItem('walletAddress', address);

        // Instantiate the contract
        const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(contractInstance);

        // Get ATAN balance
        const balance = await contractInstance.balanceOf(address);
        setBalance(balance.toString());
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Load wallet from localStorage on page load
  useEffect(() => {
    const storedWalletAddress = localStorage.getItem('walletAddress');
    if (storedWalletAddress) {
      setWalletAddress(storedWalletAddress);
      
    }
  }, []);

  // Function to change wallet manually
  const changeWallet = async (e) => {
    e.preventDefault();
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });
        await connectWallet(); // Reconnect after changing wallets
      } catch (error) {
        console.error('Error changing wallet:', error);
      }
    }
  };

  // Listen to MetaMask account change events
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          localStorage.setItem('walletAddress', accounts[0]); // Store new account address
          
        } else {
          setWalletAddress(null);
          setContract(null);
          localStorage.removeItem('walletAddress'); // Remove wallet address if no accounts are found
        }
      });

      return () => {
        window.ethereum.removeListener('accountsChanged', () => {});
      };
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);

        // Instantiate the contract
        const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(contractInstance);

        // Transfer tokens
        const tx = await contractInstance.transfer(recipient, amount);
        await tx.wait();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <div className="wallet">
        {walletAddress ? (
          <>
            <p>
              Connected Wallet Address: {walletAddress.slice(0, 5) + '...' + walletAddress.slice(-5)}
            </p>
            <p>Current Balance: {balance !== null ? balance : 'Loading...'} ATAN</p>
            <button onClick={changeWallet}>Change Wallet</button>
            <form onSubmit={handleSubmit}>
              <input
                type="number"
                placeholder="Amount"
                style={{ padding: '10px' }}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <input
                type="text"
                placeholder="Recipient Address"
                style={{ padding: '10px', margin: '10px' }}
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
              <button type="submit">Transfer</button>
            </form>
          </>
        ) : (
          <button onClick={connectWallet}>Connect Wallet</button>
        )}
      </div>
      <div className="Mint">

      </div>
    </>
  );
}

export default App;
