import React, { useState, useEffect } from 'react';
import { Connection, PublicKey, Token, Transaction } from '@solana/web3.js';
import { TOKEN_2022_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, AccountLayout } from '@solana/spl-token';
import logo from './bark-staking-light.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faDiscord, faMedium, faTelegramPlane, faGithub } from '@fortawesome/free-brands-svg-icons';
import './App.css';

const App = () => {
  // State variables
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [stakedAmount, setStakedAmount] = useState('');
  const [tokenBalance, setTokenBalance] = useState(0);
  const [solBalance, setSolBalance] = useState(0);
  const [tokenMint, setTokenMint] = useState('BARKhLzdWbyZiP3LNoD9boy7MrAy4CVXEToDyYGeEBKF');
  const TOKEN_2022_PROGRAM_ID = 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb';
  const BARK_STAKING_PROGRAM_ID = '';
  const [recipientAddress, setRecipientAddress] = useState('BARKvK3zbiy9DTzhAjrv7GgPuiJ3eHQ3QuvRvvfNBhKd');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const apr = 20;
  const solanaRpcUrl = "https://api.devnet.solana.com";
  const connection = new Connection(solanaRpcUrl);

  // Fetch token and SOL balances on component mount and when wallet address changes
  useEffect(() => {
    setTokenMint('BARKhLzdWbyZiP3LNoD9boy7MrAy4CVXEToDyYGeEBKF');
    getTokenBalance();
    getSolBalance();
  }, [walletAddress, tokenMint]);

  // Connect wallet function
  const connectWallet = async () => {
    try {
      const { solana } = window;
      if (solana && solana.isPhantom) {
        await solana.connect();
        setIsConnected(true);
        setWalletAddress(solana.publicKey.toString());
        getTokenBalance();
      } else {
        setError('Solana wallet extension not found!');
      }
    } catch (error) {
      setError('Error connecting to wallet: ' + error.message);
    }
  };

  // Disconnect wallet function
  const disconnectWallet = async () => {
    try {
      const { solana } = window;
      if (solana && solana.isPhantom) {
        await solana.disconnect();
        setIsConnected(false);
        setWalletAddress('');
        setTokenBalance(0);
        setSolBalance(0);
        setStakedAmount('');
      }
    } catch (error) {
      setError('Error disconnecting from wallet: ' + error.message);
    }
  };

  // Fetch token balance function
  const getTokenBalance = async () => {
    setLoading(true);
    try {
      if (isConnected && walletAddress) {
        const publicKey = new PublicKey(walletAddress);
        const senderAssociatedTokenAccount = await Token.getAssociatedTokenAddress(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          new PublicKey(tokenMint),
          publicKey
        );
        const tokenAccountInfo = await connection.getAccountInfo(senderAssociatedTokenAccount);
        if (tokenAccountInfo) {
          const tokenAccountData = AccountLayout.decode(tokenAccountInfo.data);
          const balance = tokenAccountData.amount.toNumber() / 10 ** 9;
          setTokenBalance(balance);
        } else {
          setTokenBalance(0);
        }
      }
      setError(null);
    } catch (error) {
      setError('Error fetching BARK token balance: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch SOL balance function
  const getSolBalance = async () => {
    setLoading(true);
    try {
      if (isConnected && walletAddress) {
        const publicKey = new PublicKey(walletAddress);
        const balanceInfo = await connection.getBalance(publicKey);
        const balance = balanceInfo / 10 ** 9;
        setSolBalance(balance);
      }
      setError(null);
    } catch (error) {
      setError('Error fetching BARK or SOL balance: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Stake token function
  const stakeToken = async () => {
    setLoading(true);
    try {
      const publicKey = new PublicKey(walletAddress);
      const token = new Token(connection, new PublicKey(tokenMint), TOKEN_2022_PROGRAM_ID, publicKey);
      const recipientPublicKey = new PublicKey(recipientAddress);
      const amount = parseFloat(stakedAmount) * 10 ** 9;
      const transaction = new Transaction().add(
        Token.createTransferInstruction(TOKEN_2022_PROGRAM_ID, publicKey, recipientPublicKey, publicKey, [], amount)
      );
      const signature = await connection.sendTransaction(transaction, [publicKey]);
      await getTokenBalance();
      await getSolBalance();
      setError(null);
    } catch (error) {
      setError('Error staking BARK token: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Unstake token function
  const unstakeToken = async () => {
    setLoading(true);
    try {
      // Implement unstake logic
    } catch (error) {
      setError('Error unstaking BARK token: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle claim function
  const handleClaim = async () => {
    setLoading(true);
    try {
      // Implement claim logic
    } catch (error) {
      setError('Error claiming BARK tokens: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header className="header">
        <div className="header-left">
          <img src={logo} alt="Bark Logo" className="logo" /> {/* Adding the logo */}
        </div>
        <div className="header-right">
          {isConnected ? (
            <button onClick={disconnectWallet} className="white-600">Disconnect Wallet</button>
          ) : (
            <button onClick={connectWallet} className="white-600">Connect Wallet</button>
          )}
        </div>
      </header>
      <main className="main">
        <div className="deposit-section">
          <div className="stakedAmount-input">
            <input type="number" placeholder='0' value={stakedAmount} onChange={(e) => setStakedAmount(e.target.value)} />
          </div>
          <div className="recipient-address">
            <label htmlFor="recipient">Recipient Address:</label>
            <input type="text" id="recipient" value={recipientAddress} onChange={(e) => setRecipientAddress(e.target.value)} />
          </div>
        </div>
        <div className="button-container">
          <button className='stakeBtn' onClick={stakeToken} disabled={!isConnected || loading}>
            Stake
          </button>
          <button className='unstakeBtn' onClick={unstakeToken} disabled={!isConnected || loading}>
            Unstake
          </button>
        </div>
        <div className="info-section">
          <div className="infoContainer">
            <div className="infoLeft">
              <p className="white-400"><b>APR: {apr}%</b></p>
              <p className="white-400"><b>Total Stake: {stakedAmount} $BARK</b></p>
              <p className="white-400"><b>Total Earning: {stakedAmount} $BARK</b></p>
            </div>
            <div className="infoRight">
              <p className="white-400"><b>SOL Balance: {solBalance.toFixed(2)} SOL</b></p>
              <p className="white-400"><b>Token Balance: {tokenBalance.toFixed(2)} $BARK</b></p>
            </div>
          </div>
        </div>
        <div className='claimBtn'>
          <button onClick={handleClaim} disabled={!isConnected || loading} className="dark">Stake Your Tokens</button>
        </div>
      </main>
      <footer className="footer white-400">
        <div>
          <p>Follow Us</p>
          <div className="social-icons">
            <a href="https://twitter.com/bark_protocol" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faTwitter} className="social-icon" />
            </a>
            <a href="https://discord.gg/H9en8eHzn2" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faDiscord} className="social-icon" />
            </a>
            <a href="https://medium.com/@barkprotocol" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faMedium} className="social-icon" />
            </a>
            <a href="https://t.me/+EnczyzzKS_k2NmQ0" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faTelegramPlane} className="social-icon" />
            </a>
            <a href="https://github.com/bark-community" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faGithub} className="social-icon" />
            </a>
          </div>
        </div>
        <p>© 2024 BARK Protocol. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
