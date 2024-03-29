# BARK Staking dApp

The BARK Staking dApp (Proof of Concept) is a decentralized application built on the Solana blockchain that allows users to stake their cryptocurrency tokens and earn rewards. This dApp provides a user-friendly interface for staking, tracking rewards, and managing transactions securely.

## Features

- **User Authentication**: Users can create accounts or log in using existing credentials.
- **Wallet Integration**: Integration with user account-based wallet connectors for seamless transactions.
- **Staking Interface**: User-friendly interface for staking tokens with options for duration and rewards.
- **Unstaking Functionality**: Allows users to withdraw their staked tokens before the end of the staking duration.
- **Rewards Calculation**: Calculates rewards earned based on staking duration and amount of tokens staked.
- **User Dashboard**: Provides a dashboard to track staking activities, rewards earned, and transaction history.
- **Transaction History**: Maintains a record of all staking, unstaking, and reward distribution activities for transparency.

## Annual Percentage Yield (APY) Calculation

To calculate the Annual Percentage Yield (APY) for staking in the BARK Staking dApp, consider factors such as the staking duration, the amount of tokens staked, and the reward mechanism implemented in the smart contract. Adjust the APY calculation formula based on how often rewards are compounded.

**Example Calculation**:

Let's say you stake 1,000,000 BARK tokens for a year with an expected annual reward rate of 20% (compounded monthly). We'll use the following formula to calculate APY:

![APY Calculation](https://github.com/bark-community/bark-staking-dapp-dev/blob/main/assets/apy.png)

Therefore, the Annual Percentage Yield (APY) for staking 1,000,000 BARK tokens for a year with an expected annual reward rate of 20% (compounded monthly) is approximately 2.12%.

## Technology Stack

- **React.js**: Frontend development framework for building the user interface.
- **User Account-based Wallet Connector**: Integration with user account-based wallet connectors for secure transactions and user authentication.
- **Chakra UI**: Component library for React applications, providing customizable UI components for a better user experience.
- **Anchor Framework**: Framework for building Solana smart contracts and applications, providing tools and utilities for smart contract development.
- **JavaScript**: Programming language used for frontend and backend development, providing flexibility and versatility.

## Getting Started

To run the BARK Staking dApp locally, follow these steps:

1. Clone the repository:

   ```
   git clone https://github.com/bark-community/bark-staking-dapp.git
   ```

2. Install dependencies:

   ```
   cd bark-staking-dapp
   npm install
   ```

3. Start the development server:

   ```
   npm start
   ```

4. Open your web browser and navigate to `http://localhost:3000` to view the dApp.

## Contributing

Contributions to the BARK Staking dApp are welcome! Please fork the repository, make changes, and submit a pull request. For major changes, please open an issue first to discuss your ideas.

## Documentation

## License

 [LICENSE](LICENSE)

## Acknowledgements

- [Solana](https://solana.com/): Blockchain platform for decentralized applications.
- [React](https://reactjs.org/): JavaScript library for building user interfaces.
- [Chakra UI](https://chakra-ui.com/): Component library for React applications.
- [Anchor Framework](https://project-serum.github.io/anchor/): Framework for building Solana smart contracts and applications.