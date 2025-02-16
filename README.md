# Fantasy Game Master Agent

An onchain based fantasy game system where players interact with AI generated levels and challenges. The game master agent listens to onchain events, processes player interactions using OpenAI, and updates the game state accordingly.

Frontend: https://github.com/0xrouss/agentic

## Features

-   **AI-Generated Levels**: Dynamic level generation using OpenAI with fantasy themes
-   **Blockchain Integration**: Smart contract manages game state and interactions
-   **Nillion Integration**: Secure storage of level data using Nillion's secret vault
-   **Event-Driven Architecture**: Listens to blockchain events and processes them in real-time
-   **REST API**: Provides endpoints for game data retrieval
-   **Privy Server Wallet**: Implements privy server wallet

## Tech Stack

-   **Blockchain**: Arbitrum Sepolia
-   **Smart Contracts**: Solidity
-   **Backend**: Bun (TypeScript runtime)
-   **AI**: OpenAI API
-   **Secret Management**: Nillion Network

## Getting Started

### Prerequisites

-   [Bun](https://bun.sh) v1.1.42 or later
-   Node.js v18+
-   An OpenAI API key
-   A Privy Server wallet with testnet ETH on Arbitrum Sepolia
-

### Installation

1. Clone the repository:

```bash
git clone https://github.com/0xrouss/agent
cd agent
```

2. Install dependencies:

```bash
bun install
```

3. Create a `.env` file in the root directory with the following variables:

```env
CONTRACT_ADDRESS=0xYourContractAddress

# OpenAI
OPENAI_API_KEY=your_api_key
OPENAI_MODEL=yourmodel/model
OPENAI_TEMPERATURE=0.7
OPENAI_MAX_TOKENS=500
OPENAI_API_URL=https://openrouter.ai/api/v1

# Privy
APP_ID=your_app_id
APP_SECRET=your_app_secret
WALLET_ID=your_wallet_id
WALLET_ADDRESS=your_wallet_address

# Nillion
NILLION_DID=nillion_did
NILLION_PUBLIC_KEY=nillion_public_key
NILLION_SECRET_KEY=nillion_secret_key
NILLION_SCHEMA=nillion_schema_id
```

### Running the Agent

Start the agent:

```bash
bun run src/index.ts
```

The agent will:

1. Start blockchain event listeners
2. Initialize the API server
3. Begin processing game events

## Project Structure

```
src/
├── api/               # REST API server
├── config/            # Configuration management
├── gameMaster/        # Game logic processors
├── nillion/           # Nillion integration
├── onchain/           # Blockchain interaction
└── ABI/               # Smart contract ABIs
```

## API Endpoints

-   `GET /games/:userAddress` - Get all games for a user
-   `GET /game/:gameId/current-level` - Get current level description for a game

## Smart Contract

The game logic is managed by the `FantasyGameMaster` contract, which handles:

-   Game creation
-   Level assignment
-   Player interactions
-   Game state updates

Key events:

-   `GameCreated`
-   `LevelCreated`
-   `InteractionCreated`
-   `InteractionUpdated`

## License

MIT License
