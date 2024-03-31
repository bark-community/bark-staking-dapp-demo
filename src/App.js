import React, { useState, useEffect } from 'react';
import { Connection, PublicKey, SystemProgram, Token, Transaction } from '@solana/web3.js';
import { TOKEN_2022_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, AccountLayout } from '@solana/spl-token';
import './App.css';
import logo from './bark-logo-dark.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faDiscord, faGithub } from '@fortawesome/free-brands-svg-icons';

const App = () => {
  // State variables
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [stakedAmount, setStakedAmount] = useState('');
  const [tokenBalance, setTokenBalance] = useState(0);
  const [solBalance, setSolBalance] = useState(0);
  const [tokenMint, setTokenMint] = useState('BARKqD1TXydxHLwgptihguwUKrXRzaMwvYY9Yz6UGrZ3');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const apr = 20;
  const solanaRpcUrl = "https://api.devnet.solana.com";
  const connection = new Connection(solanaRpcUrl);

  // Fetch BARK token and SOL balances on component mount and when wallet address changes
  useEffect(() => {
    setTokenMint('BARKqD1TXydxHLwgptihguwUKrXRzaMwvYY9Yz6UGrZ3');
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
          TOKEN_2022_PROGRAM_ID,
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

  // Select staked cryptocurrency function
  // Logic here.

  // Stake token function
  const stakeToken = async () => {
    setLoading(true);
    try {
      // Validate staked amount
      if (parseFloat(stakedAmount) <= 0) {
        setError('Please enter a valid amount to stake');
        return;
      }

      // Check if recipient address is valid
      if (!PublicKey.isOnCurve(recipientAddress, 'ed25519') || recipientAddress.length !== 44) {
        setError('Please enter a valid recipient address');
        return;
      }

      // Convert staked amount to lamports
      const lamports = parseFloat(stakedAmount) * 10 ** 9;

      // Stake BARK tokens
      if (tokenMint === 'BARKhLzdWbyZiP3LNoD9boy7MrAy4CVXEToDyYGeEBKF') {
        const publicKey = new PublicKey(walletAddress);
        const recipientPublicKey = new PublicKey(recipientAddress);
        const transaction = new Transaction().add(
          Token.createTransferInstruction(TOKEN_2022_PROGRAM_ID, publicKey, recipientPublicKey, publicKey, [], lamports)
        );
        const signature = await connection.sendTransaction(transaction, [publicKey]);
      } else { // Stake SOL
        const publicKey = new PublicKey(walletAddress);
        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: recipientAddress,
            lamports: lamports,
          })
        );
        const signature = await connection.sendTransaction(transaction, [publicKey]);
      }

      // Update balances after staking
      await getTokenBalance();
      await getSolBalance();
      setError(null); // Clear error state
    } catch (error) {
      setError('Error staking tokens: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Unstake function
  const unstakeToken = async () => {
    setLoading(true);
    try {
      if (!isConnected || !walletAddress) {
        setError('Please connect wallet');
        return;
      }
  
      // Check if the user has enough BARK tokens staked
      if (tokenBalance < parseFloat(stakedAmount)) {
        setError('Insufficient BARK token balance');
        return;
      }
  
      // Create instructions for unstaking SOL
      const publicKey = new PublicKey(walletAddress);
      const solTransaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: "Your recipient's public key",
          lamports: "Amount of SOL or BARK to unstake",
        })
      );
  
      // Create instruction for unstaking BARK tokens
      const recipientPublicKey = new PublicKey(walletAddress); // Transfer BARK tokens to the user's account
      const token = new Token(connection, new PublicKey(tokenMint), TOKEN_2022_PROGRAM_ID, publicKey);
      const amount = parseFloat(stakedAmount) * 10 ** 9;
      const barkTransaction = new Transaction().add(
        Token.createTransferInstruction(TOKEN_2022_PROGRAM_ID, publicKey, recipientPublicKey, publicKey, [], amount)
      );
  
      // Combine both transactions into a single transaction
      const transaction = Transaction.merge([solTransaction, barkTransaction]);
  
      // Sign and send the transaction
      const signature = await connection.sendTransaction(transaction, [publicKey]);
  
      // Update balances after unstaking
      await getTokenBalance();
      await getSolBalance();
      setError(null); // Set error to null if unstake is successful
    } catch (error) {
      setError('Error unstaking BARK tokens: ' + error.message);
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
          <img src={logo} alt="Bark Logo" className="logo" />
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
              <p className="white-400"><b>Your Total Stake: {stakedAmount} $BARK</b></p>
              <p className="white-400"><b>Your Total Earning: {stakedAmount} $BARK</b></p>
            </div>
            <div className="infoRight">
              <p className="white-400"><b>SOL Balance: {solBalance.toFixed(2)} SOL</b></p>
              <p className="white-400"><b>Token Balance: {tokenBalance.toFixed(2)} $BARK</b></p>
            </div>
          </div>
        </div>
        <div className='claimBtn'>
          <button onClick={handleClaim} disabled={!isConnected || loading} className="dark">Claim Your $BARK Tokens</button>
        </div>
      </main>
      <footer className="footer white-400">
        <div>
          <p>Follow Us</p>
          <div className="social-icons">
            <FontAwesomeIcon icon={faTwitter} className="social-icon" />
            <FontAwesomeIcon icon={faDiscord} className="social-icon" />
            <FontAwesomeIcon icon={faGithub} className="social-icon" />
          </div>
        </div>
        <p>© 2024 BARK Protocol. All rights reserved.</p>
      </footer>
      {loading && <div className="overlay">Loading...</div>}
      {error && <div className="overlay error">{error}</div>}
    </div>
  );
};

export default App;