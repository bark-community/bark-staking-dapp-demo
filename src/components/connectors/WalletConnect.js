import { useState } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { WalletModalProvider, useWalletModal } from '@solana/wallet-adapter-react-ui';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletDialogProvider } from '@solana/wallet-adapter-material-ui';
import { WalletAdapterNetworkCluster } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const WalletConnect = () => {
    const connection = useConnection();

    // You can choose the network based on your requirements
    const network = WalletAdapterNetwork.Devnet;

    const { setVisible } = useWalletModal();

    const handleClick = () => {
        setVisible(true);
    };

    return (
        <div>
            <WalletModalProvider>
                <WalletDialogProvider>
                    <WalletMultiButton />
                </WalletDialogProvider>
            </WalletModalProvider>
        </div>
    );
};

export default WalletConnect;
