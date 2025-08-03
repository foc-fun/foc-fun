# FOC Fun Frontend

<div align="center">
  <img src="public/logo/logo-high-res.png" alt="FOC Fun Logo" width="150" height="150">
  
  <p><strong>Frontend for the Starknet App Engine</strong></p>

  ![Next.js](https://img.shields.io/badge/Next.js-15.1.7-black?style=flat-square&logo=next.js)
  ![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=flat-square&logo=react)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=flat-square&logo=tailwind-css)
  ![Starknet React](https://img.shields.io/badge/Starknet_React-3.7.2-FF6B35?style=flat-square)
  ![pnpm](https://img.shields.io/badge/pnpm-Package_Manager-F69220?style=flat-square&logo=pnpm)
</div>

## Overview

This is the frontend application for FOC Fun, built with Next.js and React. It provides a user-friendly interface for interacting with Starknet smart contracts, managing deployments, and monitoring blockchain events.

## Features

- 🔐 **Wallet Integration**: Connect with Starknet wallets using Cartridge and StarknetKit
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS
- ⚡ **Real-time Updates**: WebSocket integration for live contract events
- 🎨 **Modern UI**: Clean and intuitive user interface
- 🔄 **Hot Reload**: Development server with instant updates
- 📊 **Contract Interaction**: Direct interaction with deployed smart contracts

## Tech Stack

- **Framework**: Next.js 15.1.7 with App Router
- **React**: Version 19.0.0 with TypeScript
- **Styling**: Tailwind CSS 3.4.1
- **Blockchain**: Starknet React 3.7.2, StarknetKit 2.6.1
- **HTTP Client**: Axios 1.8.4
- **WebSockets**: React Use WebSocket 4.13.0
- **Package Manager**: npm (with pnpm support)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

1. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Set up environment variables**
   Create a `.env.local` file with:
   ```env
   NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS=your_contract_address
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint code
npm run lint

# Lint and fix issues
npm run lint:fix
```

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── ui/            # Reusable UI components
│   └── ...            # Feature-specific components
└── contract/          # Smart contract interaction
    ├── abis/          # Contract ABIs
    └── hooks/         # Contract hooks
```

## Key Dependencies

### Starknet Integration
- `@starknet-react/core`: React hooks for Starknet
- `@starknet-react/chains`: Starknet chain configurations
- `@cartridge/connector`: Cartridge wallet integration
- `starknetkit`: Multi-wallet support
- `starknet`: Core Starknet library

### UI & Styling
- `tailwindcss`: Utility-first CSS framework
- `@next/font`: Font optimization
- `react-transition-group`: Animation components

### Development
- `typescript`: Static type checking
- `eslint`: Code linting
- `eslint-config-next`: Next.js ESLint configuration

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS` | Smart contract address | `0x...` |
| `NEXT_PUBLIC_BACKEND_URL` | Backend API URL | `http://localhost:8080` |

## Development Guidelines

### Code Style
- Use TypeScript for all components and utilities
- Follow React 19 patterns and best practices
- Use Tailwind CSS for styling
- Implement responsive design principles

### Component Structure
- Place reusable components in `src/components/ui/`
- Feature-specific components in `src/components/`
- Use React hooks for state management
- Implement proper error boundaries

### Smart Contract Integration
- Use Starknet React hooks for blockchain interactions
- Handle wallet connection states properly
- Implement proper error handling for contract calls
- Cache contract data when appropriate

## Build and Deployment

### Local Build
```bash
npm run build
npm run start
```

### Production Deployment
The application is optimized for deployment on Vercel and other Next.js-compatible platforms.

## Troubleshooting

### Common Issues

1. **Wallet Connection Issues**
   - Ensure wallet extensions are installed
   - Check network configuration
   - Verify contract addresses

2. **Build Errors**
   - Run `npm run lint:fix` to fix linting issues
   - Check TypeScript errors with `npx tsc --noEmit`
   - Ensure all dependencies are installed

3. **Contract Interaction Issues**
   - Verify contract addresses in environment variables
   - Check network connectivity
   - Ensure wallet is connected to correct network

## Contributing

1. Follow the existing code style and conventions
2. Write TypeScript with proper type definitions
3. Test components thoroughly before submitting
4. Use semantic commit messages
5. Update documentation as needed

## Support

For frontend-specific issues, please check:
1. Browser console for errors
2. Network tab for failed requests
3. React DevTools for component state
4. Starknet wallet connection status

For general project support, refer to the main project README.