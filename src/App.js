import React, { useState, useEffect } from 'react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, Token, AccountLayout } from '@solana/spl-token';
import './App.css';
import Web3 from 'web3';
import contractABI from './contractABI.json';

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState('0x9551A90912aBa11aC7CD2F4bFbc6f0035a9F096C');
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('GSQwh1KTTXf5fnJDsZjtbQVWzeo1xhQUyxkXPHfkNeEa');
  const [stakedAmount, setAmount] = useState('');
  const [tokenBalance, setTokenBalance] = useState(0);
  const [solBalance, setSolBalance] = useState(0);
  const [tokenMint, setTokenMint] = useState('7wpRRpdycAHhYsR8tCbbHip6kR9NxAVrN21Auq5g8CFk');

  const apr = 20;

  const solanaRpcUrl = "https://api.devnet.solana.com";
  const connection = new Connection(solanaRpcUrl);

  useEffect(() => {
    setTokenMint('7wpRRpdycAHhYsR8tCbbHip6kR9NxAVrN21Auq5g8CFk');
    getTokenBalance();
    getSolBalance();
  }, [walletAddress, tokenMint]);

  const connectWallet = async () => {
    try {
      const { solana } = window;
      if (solana && solana.isPhantom) {
        await solana.connect();
        setIsConnected(true);
        setWalletAddress(solana.publicKey.toString());
        getTokenBalance();
      } else {
        alert('Solana Fantom wallet extension not found!');
      }
    } catch (error) {
      console.error('Error connecting to wallet:', error);
    }
  };

  const disconnectWallet = async () => {
    try {
      const { solana } = window;
      if (solana && solana.isPhantom) {
        await solana.disconnect();
        setIsConnected(false);
        setWalletAddress('');
        setTokenBalance(0);
        setSolBalance(0);
        setAmount('');
      }
    } catch (error) {
      console.error('Error disconnecting from wallet:', error);
    }
  };

  const getTokenBalance = async () => {
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
        console.log(`Token Account Info: ${tokenAccountInfo.data}`);
        if (tokenAccountInfo) {
          const tokenAccountData = AccountLayout.decode(tokenAccountInfo.data);
          const dataView = new DataView(tokenAccountData.stakedAmount.buffer);
          const rawBalance = dataView.getBigUint64(0, true);
          const balance = Number(rawBalance) / 10 ** 9;
          setTokenBalance(balance);
        } else {
          setTokenBalance(0);
        }
      }
    } catch (error) {
      console.error('Error fetching token balance:', error);
    }
  };
  
  const getSolBalance = async () => {
    try {
      if (isConnected && walletAddress) {
        const publicKey = new PublicKey(walletAddress);
        const balanceInfo = await connection.getBalance(publicKey);
        const balance = balanceInfo / 10 ** 9;
        setSolBalance(balance);
      }
    } catch (error) {
      console.error('Error fetching SOL balance:', error);
    }
  };

  const stakeToken = async () => {
    try {
      // Get the public key from the connected wallet
      const { solana } = window;
      const publicKey = solana.publicKey;
  
      // Fetch the recent block hash
      const recentBlockhash = await connection.getRecentBlockhash();
  
      // Derive the associated token account for the recipient
      const recipientPublicKey = new PublicKey(recipientAddress);
      const recipientAssociatedTokenAccount = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        new PublicKey(tokenMint),
        recipientPublicKey
      );
  
      // Check if the recipient's associated token account exists
      const recipientAccountInfo = await connection.getAccountInfo(recipientAssociatedTokenAccount);
  
      // Create a new transaction
      const transaction = new Transaction({
        recentBlockhash: recentBlockhash.blockhash,
        feePayer: publicKey,
      });
  
      if (!recipientAccountInfo) {
        // If it doesn't exist, create it
        const createRecipientAccountInstruction = Token.createAssociatedTokenAccountInstruction(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          new PublicKey(tokenMint),
          recipientAssociatedTokenAccount,
          recipientPublicKey,
          publicKey
        );
        transaction.add(createRecipientAccountInstruction);
      }
  
      // Derive the associated token account for the sender
      const senderAssociatedTokenAccount = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        new PublicKey(tokenMint),
        publicKey
      );
  
      // Add a transfer instruction to the transaction
      transaction.add(
        Token.createTransferInstruction(
          TOKEN_PROGRAM_ID,
          senderAssociatedTokenAccount,
          recipientAssociatedTokenAccount,
          publicKey,
          [],
          stakedAmount * 10 ** 9 // Convert to the token's decimal places (e.g., 9 for USDC-SPL)
        )
      );
  
      // Sign and send the transaction
      const signature = await solana.signTransaction(transaction);
      const txid = await connection.sendRawTransaction(signature.serialize());
      await connection.confirmTransaction(txid);
  
      console.log(`Transaction successful: https://explorer.solana.com/tx/${txid}?cluster=devnet`);
    } catch (error) {
      console.error('Error depositing token:', error);
    }
  };
  
  const unstakeToken = async () => {
    try {
      // Get the public key from the connected wallet
      const { solana } = window;
      const publicKey = solana.publicKey;
  
      // Fetch the recent block hash
      const recentBlockhash = await connection.getRecentBlockhash();
  
      // Derive the associated token account for the sender (the connected wallet)
      const senderAssociatedTokenAccount = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        new PublicKey(tokenMint),
        publicKey
      );
  
      // Derive the associated token account for the recipient
      const recipientPublicKey = new PublicKey(recipientAddress);
      const recipientAssociatedTokenAccount = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        new PublicKey(tokenMint),
        recipientPublicKey
      );
  
      // Create a transaction to transfer the token
      const transaction = new Transaction({
        recentBlockhash: recentBlockhash.blockhash,
        feePayer: publicKey,
      }).add(
        Token.createTransferInstruction(
          TOKEN_PROGRAM_ID,
          senderAssociatedTokenAccount,
          recipientAssociatedTokenAccount,
          publicKey,
          [],
          stakedAmount * 10 ** 9 // Convert to the token's decimal places (e.g., 9 for USDC-SPL)
        )
      );
  
      // Sign and send the transaction
      const signature = await solana.signTransaction(transaction);
      const txid = await connection.sendRawTransaction(signature.serialize());
      await connection.confirmTransaction(txid);
  
      console.log(`Transaction successful: https://explorer.solana.com/tx/${txid}?cluster=devnet`);
    } catch (error) {
      console.error('Error withdrawing token:', error);
    }
  };
  
  const handleMaxClick = () => {
    setAmount(tokenBalance.toString());
  };
  
  return (
    <div>
      <header className="header">
        <div className="header-left">
        </div>
        <div className="header-right">
          {isConnected ? (
            <button onClick={disconnectWallet}>Disconnect Wallet</button>
          ) : (
            <button onClick={connectWallet}>Connect Wallet</button>
          )}
        </div>
      </header>
      <main className="main">
        <div className="deposit-section">
          <div className="stakedAmount-input">
            <input type="number" placeholder='0' value={stakedAmount} onChange={(e) => setAmount(e.target.value)} />
          </div>
        </div>
        <div className="deposit-button">
            <button className='stakeBtn' onClick={stakeToken} disabled={!isConnected}>
              Stake
            </button>
            <button className='unstakeBtn' disabled={!isConnected}>
              Unstake
            </button>
        </div>
        <div className="info-section">
          <p><b>APR: {apr}%</b></p>
          <p className='infoContainer'>
            <span className='infoLeft'><b>Your Total Stake:</b></span>
            <span className='infoRight'><b>{stakedAmount} $BARK</b></span>
          </p>
          <p className='infoContainer'>
            <span className='infoLeft'><b>Your Total Earning:</b></span>
            <span className='infoRight'><b>{stakedAmount} $BARK</b></span>
          </p>
        </div>
        <div className='claimBtn'>
          <button>
            Claim Your <span>129.076 $BARK</span>
          </button>
        </div>
      </main>
      <footer className="footer">
        <p>© 2024 BARK Protocol. All rights reserved.</p>
      </footer>
    </div>
);
};

export default App;
