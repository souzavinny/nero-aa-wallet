import { ethers } from 'ethers'

export interface GasLimits {
  callGasLimit?: string
  verificationGasLimit?: string
  preVerificationGas?: string
  maxFeePerGas?: string
  maxPriorityFeePerGas?: string
}

export interface GasConfig {
  enabled: boolean
  mode: 'automatic' | 'manual'
  customLimits: GasLimits
  maxGasLimit: string
  priorityLevel: 'slow' | 'standard' | 'fast' | 'aggressive'
}

export interface GasConfigContextType {
  gasConfig: GasConfig
  setGasConfig: (config: GasConfig) => void
  resetGasConfig: () => void
  isCustomGasEnabled: boolean
  setCustomGasEnabled: (enabled: boolean) => void
  getGasMultiplier: () => number
  validateGasLimits: (limits: GasLimits) => boolean
  applyGasLimits: (userOp: any) => any
}

export const DEFAULT_GAS_CONFIG: GasConfig = {
  enabled: false,
  mode: 'automatic',
  customLimits: {},
  maxGasLimit: '10000000', // 10M gas limit
  priorityLevel: 'standard',
}

export const GAS_PRIORITY_MULTIPLIERS = {
  slow: 0.8,
  standard: 1.0,
  fast: 1.2,
  aggressive: 1.5,
}

export const MIN_GAS_LIMITS = {
  callGasLimit: '21000',
  verificationGasLimit: '50000',
  preVerificationGas: '21000',
}

export const MAX_GAS_LIMITS = {
  callGasLimit: '10000000',
  verificationGasLimit: '5000000',
  preVerificationGas: '1000000',
}
