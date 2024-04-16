![UI Screenshot](https://github.com/bark-community/bark-staking-dapp/blob/b541e5aedaaf7c6ee664e5cdfcf0367b9ed7748f/github/screenshot2.png)

# BARK Staking dApp Demo

**A decentralized application for staking BARK tokens and earning rewards**

## Overview

The BARK Staking dApp (Proof of Concept) is a decentralized application built on the Solana blockchain that empowers users to stake their cryptocurrency tokens and earn rewards. With a user-friendly interface, it facilitates seamless staking, transparent reward tracking, and secure transaction management.

## Features:

- **User Authentication**: Users can create accounts or log in using existing credentials, ensuring secure access to the dApp.
- **Wallet Integration**: Seamlessly connect user accounts to their Solana wallets, enabling convenient transactions and account management.
- **Staking Interface**: Intuitive interface for staking BARK tokens, providing options for duration and rewards to enhance user experience.
- **Unstaking Functionality**: Allows users to withdraw their staked tokens at any time, providing flexibility and liquidity.
- **Rewards Calculation**: Accurately calculates rewards based on staking duration and amount of tokens staked, ensuring transparency and fairness.
- **User Dashboard**: Offers a comprehensive dashboard where users can monitor their staking activities, view earned rewards, and track transaction history efficiently.
- **Transaction History**: Maintains a detailed record of all staking, unstaking, and reward distribution transactions, promoting transparency and accountability.
- **Support for Solana Extension**: Compatible with Solana wallets and supports staking of SPL 2022 Tokens, ensuring accessibility to a wide range of users.

## Accounts

### Staking Program (not implemented)

- **BARK Staking Program CA**:
  - **Public Key**: BARKhLzdWbyZiP3LNoD9boy7MrAy4CVXEToDyYGeEBKF

- **Solana Token Extension**:
  - **SPL 2022 Program ID**: TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb

## Annual Percentage Yield (APY) Calculation

To calculate the Annual Percentage Yield (APY) for staking in the BARK Staking dApp, consider factors such as the staking duration, the amount of tokens staked, and the reward mechanism implemented in the smart contract. Adjust the APY calculation formula based on how often rewards are compounded.

**Example Calculation**:

Let's say you stake 1,000,000 BARK tokens for a year with an expected annual reward rate of 20% (compounded monthly), using the following formula to calculate APY:

![APY Calculation](https://github.com/bark-community/bark-staking-dapp-dev/blob/main/assets/apy.png)

Therefore, the Annual Percentage Yield (APY) for staking 1,000,000 BARK tokens for a year with an expected annual reward rate of 20% (compounded monthly) is approximately 2.12%.

## Tech Stack

- **React.js**: Frontend development framework for building the user interface.
- **User Account-based Wallet Connector**: Integration with user account-based wallet connectors for secure transactions and user authentication.
- **Chakra UI**: Component library for React applications, providing customizable UI components for a better user experience.
- **Anchor Framework**: Framework for building Solana smart contracts and applications, providing tools and utilities for smart contract development.
- **Solana Extensions** SPL 2022 Token Standard
- **JavaScript**: Programming language used for frontend and backend development, providing flexibility and versatility.
- **Solidy**: Ethereum smart contracts

## Installation

To run the BARK Staking dApp locally, follow these steps:

1. Clone this repository.
2. Install dependencies using `npm install`.
3. Start the development server using `npm start`.
4. Open your web browser and navigate to `http://localhost:3000` to view the BARK Staking dApp Demo.

## Usage

1. Connect your Solana wallet to the dApp.
2. Stake your BARK tokens using the staking interface.
3. Track your staking activities, rewards earned, and transaction history on the user dashboard.
4. Withdraw your staked tokens using the unstaking functionality when desired.

## Contributing

Contributions to the BARK Staking dApp are welcome! Please fork the repository, make changes, and submit a pull request. For major changes, please open an issue first to discuss your ideas.

### ToDo

- Ethereum Smart Contract
- SPL Staking Program and implement BARK token
- Solana extensions and SPL Token 2022 programs and staking support
- UI/UX Improvements
- Documentation
  
## Documentation

[Documentation](https://): BARK Staking dApp Technical Documentation

## Acknowledgements

- [Solana](https://solana.com/): Blockchain platform for decentralized applications.
- [React](https://reactjs.org/): JavaScript library for building user interfaces.
- [Chakra UI](https://chakra-ui.com/): Component library for React applications.
- [Anchor Framework](https://project-serum.github.io/anchor/): Framework for building Solana smart contracts and applications.
- [Web3.js](https://web3js.readthedocs.io/en/v1.3.4/): Ethereum JavaScript API for interacting with the Ethereum blockchain.
- [Wallet Adapter](https://github.com/anza-xyz/wallet-adapter): Solana Wallet Adapter.

## License

 [LICENSE](LICENSE)
