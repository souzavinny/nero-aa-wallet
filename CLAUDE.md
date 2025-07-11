# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**NERO AA Wallet** is a React-based Account Abstraction (ERC-4337) wallet application and library. It supports gasless transactions, social authentication, and multi-account management with deterministic account generation.

## Development Commands

### Basic Development

- `yarn dev` - Start development server (library mode)
- `yarn dev:demo` - Start development server (demo mode)
- `yarn build` - Build library with TypeScript declarations
- `yarn build:demo` - Build demo application
- `yarn preview` - Preview built application

### Code Quality

- `yarn lint` - Run ESLint + Prettier checks
- `yarn fix` - Auto-fix linting and formatting issues
- `yarn lint:eslint` - ESLint only
- `yarn lint:prettier` - Prettier check only

### Testing

- `yarn test` - Run all security-focused tests
- `yarn test:watch` - Watch mode for core tests
- `yarn test:coverage` - Generate test coverage reports
- `yarn test:security-core` - Run core security tests only
- `yarn test:utils-security` - Run security utility tests only
- Run single test file: `vitest run --reporter=verbose src/__tests__/[filename].test.ts`

### Package Management

- Uses **Yarn 3.8.3** (enforced) - do not use npm
- Node.js version **22.4.1** (managed by Volta)

## Architecture & Key Concepts

### Dual Build System

The project builds in two modes:

- **Library mode** (default): Exports reusable components with external React dependencies
- **Demo mode**: Standalone application for testing and demonstration

### Account Abstraction Implementation

- Uses ERC-4337 standard with SimpleAccount contracts
- **Deterministic account generation**: `CREATE2(EOA + index + chainId + salt)`
- First account uses `salt=0`, subsequent accounts use deterministic salts
- No private key storage for AA accounts - only deterministic recovery

### Context-Based State Management

The app uses 15+ React contexts for feature-specific state:

- `AccountManagerProvider` - Core AA account management
- `PaymasterProvider` - Gasless transaction support
- `TokenProvider` - ERC-20 token management
- `NFTProvider` - ERC-721 NFT handling
- Located in `src/contexts/`

### Testing Strategy

Tests focus heavily on security functions:

- Core security: `src/__tests__/security-core.test.ts`
- Security utilities: `src/__tests__/utils-security.test.ts`
- Storage management: `src/__tests__/storage-quota-component.test.ts`

## Key Directories

```
src/
├── components/
│   ├── features/          # Feature-specific components (AccountSelector, paymaster, etc.)
│   ├── screens/           # Main app screens (Send, NFT, Token, Settings)
│   ├── ui/               # Reusable UI components (buttons, modals, layout)
│   └── debug/            # Development/debugging components
├── contexts/             # React context providers (15+ contexts)
├── hooks/               # Custom hooks organized by feature
├── utils/               # Utility functions (security, validation, formatting)
├── types/               # TypeScript type definitions
├── constants/           # App constants and contract ABIs
├── config/              # Configuration (wagmi, Web3Auth)
├── helper/              # Transaction and operation helpers
└── assets/              # Static assets and images
```

## Technology Stack Notes

### Core Dependencies

- **React 18.3.1** with TypeScript 5.2.2
- **Vite 5.3.1** for building (dual-mode configuration)
- **Wagmi 2.10.10** + **Viem 2.x** for Ethereum interactions
- **Web3Auth 9.x** for social authentication
- **Tailwind CSS 3.4.4** for styling
- **Custom userop SDK** from nerochain/aa-userop-sdk

### Development Stack

- **Vitest** for testing with jsdom environment
- **ESLint 9.6.0** + **Prettier 3.5.3** for code quality
- **Husky + lint-staged** for pre-commit hooks
- **Storybook** for component development

## Important Patterns

### Path Aliases

- `@/*` resolves to `src/*` (configured in tsconfig.json and vite.config.ts)

### CSS and Styling

- Uses Tailwind with custom NERO brand colors
- CSS modules with scoped naming: `[name]__[local]___[hash:base64:5]`
- Professional dark theme with gradient system

### Security Considerations

- Input sanitization throughout the application
- Deterministic salt generation for account recovery
- Encrypted storage with authentication-specific keys
- No private key storage for AA accounts

### Environment Variables

Required for full functionality:

- `VITE_WEB3AUTH_CLIENT_ID` - Web3Auth social login
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth
- `VITE_PAYMASTER_URL` - Gasless transaction support

## Build Configuration

### Library Build

- Entry: `src/index.tsx`
- Output: `dist/app/bundle.js` (ES modules)
- Externals: React, React-DOM (peer dependencies)
- Includes TypeScript declarations

### Demo Build

- Entry: `index.html`
- Output: IIFE format for standalone application
- Includes all dependencies bundled

## Debugging and Development

### Component Development

- Storybook available: `yarn storybook`
- Debug components in `src/components/debug/`

### Node.js Polyfills

- Vite includes Node.js polyfills for Web3 compatibility
- Buffer and process globals are available

## Critical Implementation Notes

### Git Workflow

- Current working branch: `feat/wallet-gas-config`
- Main branch for PRs: `main`
- Always run `yarn lint` and `yarn fix` before committing
- Only 3 test files exist: `security-core.test.ts`, `utils-security.test.ts`, and `storage-quota-component.test.ts`

### Account Abstraction Context

- AA accounts use the active account's salt from `activeAccount.salt` (not primary EOA)
- Builder initialization requires `activeAccount` to be available
- Critical: When working with accounts, remember they are deterministic and recoverable by index
- Follow the existing context pattern when adding new features
- Add appropriate tests in the security test suite for any new functionality

## Critical Development Reminders

### Instruction Adherence

Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (\*.md) or README files. Only create documentation files if explicitly requested by the User.
