import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, SystemProgram, Transaction, PublicKey } from '@solana/web3.js';
import { Token } from '@solana/spl-token';

const TransferToken = () => {
  const wallet = useWallet();
  const [amount, setAmount] = useState('');

  const recipientAddress = 'BARKhLzdWbyZiP3LNoD9boy7MrAy4CVXEToDyYGeEBKF';

  const transferTokens = async () => {
    try {
      const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
      const token = new Token(connection, new PublicKey('BarkJCMP9hjDVW11EaRD6HkRDEU5qd2ovNGXdjgzZAj1'), new PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'), wallet.publicKey);

      const senderTokenAccount = await token.getOrCreateAssociatedAccountInfo(wallet.publicKey);
      const receiverTokenAccount = await token.getOrCreateAssociatedAccountInfo(new PublicKey(recipientAddress));

      const tx = new Transaction()
        .add(
          Token.createTransferInstruction(
            new PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'),
            senderTokenAccount.address,
            receiverTokenAccount.address,
            wallet.publicKey,
            [],
            parseInt(amount, 10)
          )
        )
        .add(SystemProgram.transfer({ fromPubkey: wallet.publicKey, toPubkey: new PublicKey(recipientAddress), lamports: 10000 }));

      const signature = await wallet.signTransaction(tx);
      const txid = await connection.sendRawTransaction(signature.serialize());

      console.log('Transaction ID:', txid);
    } catch (error) {
      console.error('Error transferring BARK tokens:', error);
    }
  };

  return (
    <div>
      <h2>Transfer BARK Tokens</h2>
      <label>Amount:</label>
      <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button onClick={transferTokens}>Transfer</button>
    </div>
  );
};

export default TransferToken;
