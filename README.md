# FOC Fun - Starknet App Engine

<div align="center">
  <img src="frontend/public/logo/logo-high-res.png" alt="FOC Fun Logo" width="200" height="200">
  
  <p><strong>A platform for deploying and managing smart contracts on the Starknet blockchain</strong></p>

  ![Next.js](https://img.shields.io/badge/Next.js-15.1.7-black?style=flat-square&logo=next.js)
  ![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=flat-square&logo=react)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)
  ![Go](https://img.shields.io/badge/Go-1.23.1-00ADD8?style=flat-square&logo=go)
  ![Cairo](https://img.shields.io/badge/Cairo-2024_07-FF6B35?style=flat-square)
  ![Starknet](https://img.shields.io/badge/Starknet-Sepolia-29296B?style=flat-square)
  ![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14.11-336791?style=flat-square&logo=postgresql)
  ![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?style=flat-square&logo=mongodb)
  ![Redis](https://img.shields.io/badge/Redis-7.2.4-DC382D?style=flat-square&logo=redis)
</div>

## Overview

FOC Fun is a comprehensive Starknet App Engine that provides a registry system for contract classes, automated deployment, event indexing, and a web interface for contract interaction. It serves as a platform for developers to deploy and manage smart contracts on the Starknet blockchain with ease.

## Features

- 🔗 **Smart Contract Registry**: Central registry for managing contract classes and deployments
- 🚀 **Automated Deployment**: Streamlined contract deployment process
- 📊 **Event Indexing**: Real-time blockchain event monitoring and processing
- 🌐 **Web Interface**: User-friendly frontend for contract interaction
- 🔐 **Wallet Integration**: Support for Starknet wallets via Starknet React
- 📈 **Analytics**: Contract usage tracking and metrics

## Tech Stack

### Frontend
- **Next.js 15.1.7** with App Router
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **Starknet React** for blockchain integration
- **pnpm** package manager

### Backend
- **Go 1.23.1** REST API server
- **PostgreSQL 14.11** for structured data
- **MongoDB** for flexible event storage
- **Redis 7.2.4** for caching
- **Apibara** for blockchain indexing

### Smart Contracts
- **Cairo** (Starknet edition 2024_07)
- **Scarb** build tool
- **Starknet Foundry** for testing

### Infrastructure
- **Docker & Docker Compose** for development
- **Kubernetes with Helm** for production deployment

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Go 1.23.1+
- Node.js 18+ with pnpm
- Scarb (Cairo build tool)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd foc-fun
   ```

2. **Start all services**
   ```bash
   docker-compose up
   ```

3. **Frontend development** (separate terminal)
   ```bash
   cd frontend
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

## Essential Commands

### Development
```bash
# Start all services locally
docker-compose up

# Frontend development (port 3000)
cd frontend && npm run dev

# Lint and fix frontend code
cd frontend && npm run lint:fix

# Build everything
make build

# Run smart contract tests
make test
```

### Building
```bash
# Build all components
make build

# Individual builds
make build-backend     # Go backend
make build-frontend    # Next.js frontend  
make build-contracts   # Cairo contracts

# Docker builds
make docker-build      # Build all Docker images
make docker-push       # Push images to registry
```

### Testing
```bash
# Smart contract tests
cd onchain && scarb test
# or
make contracts-test

# Frontend linting
cd frontend && npm run lint
```

### Deployment
```bash
# Kubernetes deployment
make helm-install      # Initial deploy
make helm-upgrade      # Update deployment
make helm-uninstall    # Remove deployment
```

## Architecture

### Core Components

1. **Registry Contract** (`onchain/src/registry.cairo`): Central smart contract managing class registration, contract deployment, and event tracking
2. **Backend API** (`backend/cmd/backend/`): REST API server providing endpoints for contract interaction
3. **Consumer Service** (`backend/cmd/consumer/`): Processes indexed blockchain events from Apibara
4. **Indexer Service** (`indexer/`): Monitors blockchain for registry events
5. **Frontend** (`frontend/`): Next.js app for user interaction with contracts

### Key Directories

```
├── frontend/           # Next.js frontend application
│   ├── src/app/       # App Router pages
│   ├── src/components/ # React components
│   └── src/contract/  # Smart contract interaction logic
├── backend/           # Go backend services
│   ├── routes/        # HTTP route handlers
│   └── indexer/       # Event processing logic
├── onchain/           # Cairo smart contracts
│   └── src/           # Contract source files
├── abis/              # Contract ABI JSON files
└── indexer/           # Blockchain event indexer
```

## Environment Configuration

Key environment variables:
- `FOC_FUN_REGISTRY_CONTRACT`: Registry contract address
- `POSTGRES_PASSWORD`: Database password
- `MONGO_URI`: MongoDB connection string
- `AUTH_TOKEN` / `APIBARA_AUTH_TOKEN`: Apibara authentication
- `NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS`: Frontend registry address
- `NEXT_PUBLIC_BACKEND_URL`: Backend API URL

## Development Workflow

1. **Smart contract changes**: Edit in `onchain/src/`, run `scarb build` and `scarb test`
2. **Backend changes**: Edit Go files, rebuild with `make build-backend`
3. **Frontend changes**: Edit in `frontend/src/`, changes hot-reload in `npm run dev`
4. **Full stack testing**: Use `docker-compose up` to run all services together

## Contract Deployment

Contracts are deployed to Starknet Sepolia testnet. The registry contract address is configured in docker-compose.yml and environment configs.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository.