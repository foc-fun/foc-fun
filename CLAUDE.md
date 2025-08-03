# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

foc-fun is a Starknet App Engine - a platform for deploying and managing smart contracts on the Starknet blockchain. It provides a registry system for contract classes, automated deployment, event indexing, and a web interface for contract interaction.

## Tech Stack

- **Frontend**: Next.js 15.1.7, React 19, TypeScript, Tailwind CSS, Starknet React
- **Backend**: Go 1.23.1, PostgreSQL 14.11, MongoDB, Redis 7.2.4
- **Smart Contracts**: Cairo (Starknet edition 2024_07), Scarb, Starknet Foundry
- **Infrastructure**: Docker, Docker Compose, Kubernetes (Helm)
- **Package Manager**: pnpm (frontend)

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

- `frontend/src/app/`: Next.js App Router pages
- `frontend/src/components/`: React components  
- `frontend/src/contract/`: Smart contract interaction logic
- `backend/routes/`: HTTP route handlers
- `backend/indexer/`: Event processing logic
- `onchain/src/`: Cairo smart contracts
- `abis/`: Contract ABI JSON files

### Database Schema

PostgreSQL tables are initialized from `backend/postgres/init.sql`. MongoDB is used for flexible event storage.

### Environment Variables

Key environment variables used across services:
- `FOC_FUN_REGISTRY_CONTRACT`: Registry contract address
- `POSTGRES_PASSWORD`: Database password
- `MONGO_URI`: MongoDB connection string
- `AUTH_TOKEN` / `APIBARA_AUTH_TOKEN`: Apibara authentication
- `NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS`: Frontend registry address
- `NEXT_PUBLIC_BACKEND_URL`: Backend API URL

## Development Workflow

1. Smart contract changes: Edit in `onchain/src/`, run `scarb build` and `scarb test`
2. Backend changes: Edit Go files, rebuild with `make build-backend`
3. Frontend changes: Edit in `frontend/src/`, changes hot-reload in `npm run dev`
4. Full stack testing: Use `docker-compose up` to run all services together

## Contract Deployment

Contracts are deployed to Starknet Sepolia testnet. The registry contract address is hardcoded in docker-compose.yml and environment configs.