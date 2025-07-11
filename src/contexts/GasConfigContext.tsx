/**
 * Gas Configuration Context
 *
 * This context provides advanced gas configuration for ERC-4337 UserOperations.
 *
 * Features:
 * - Automatic gas estimation with priority levels (slow, standard, fast, aggressive)
 * - Manual gas limit configuration for advanced users
 * - Real-time validation of gas limits
 * - Integration with UserOperationBuilder
 *
 * Usage:
 * ```typescript
 * const { gasConfig, setGasConfig, applyGasLimits } = useGasConfig()
 * ```
 */
import React, { createContext, useState, useCallback, useContext } from 'react'
import { ethers } from 'ethers'
import {
  GasConfig,
  GasConfigContextType,
  GasLimits,
  DEFAULT_GAS_CONFIG,
  GAS_PRIORITY_MULTIPLIERS,
  MIN_GAS_LIMITS,
  MAX_GAS_LIMITS,
  ProviderProps,
} from '@/types'

export const GasConfigContext = createContext<GasConfigContextType | undefined>(undefined)

export const GasConfigProvider: React.FC<ProviderProps> = ({ children }) => {
  const [gasConfig, setGasConfig] = useState<GasConfig>(DEFAULT_GAS_CONFIG)
  const [isCustomGasEnabled, setCustomGasEnabled] = useState(false)

  const resetGasConfig = useCallback(() => {
    setGasConfig(DEFAULT_GAS_CONFIG)
    setCustomGasEnabled(false)
  }, [])

  const getGasMultiplier = useCallback(() => {
    return GAS_PRIORITY_MULTIPLIERS[gasConfig.priorityLevel]
  }, [gasConfig.priorityLevel])

  const validateGasLimits = useCallback((limits: GasLimits): boolean => {
    try {
      // Check if all provided limits are valid numbers
      for (const [key, value] of Object.entries(limits)) {
        if (value && value !== '') {
          const gasValue = ethers.BigNumber.from(value)

          // Check minimum limits
          if (key in MIN_GAS_LIMITS) {
            const minLimit = ethers.BigNumber.from(
              MIN_GAS_LIMITS[key as keyof typeof MIN_GAS_LIMITS],
            )
            if (gasValue.lt(minLimit)) {
              console.warn(`${key} below minimum limit`)
              return false
            }
          }

          // Check maximum limits
          if (key in MAX_GAS_LIMITS) {
            const maxLimit = ethers.BigNumber.from(
              MAX_GAS_LIMITS[key as keyof typeof MAX_GAS_LIMITS],
            )
            if (gasValue.gt(maxLimit)) {
              console.warn(`${key} above maximum limit`)
              return false
            }
          }
        }
      }
      return true
    } catch (error) {
      console.error('Invalid gas limits:', error)
      return false
    }
  }, [])

  const applyGasLimits = useCallback(
    (userOp: any) => {
      if (!gasConfig.enabled || gasConfig.mode === 'automatic') {
        return userOp
      }

      const modifiedOp = { ...userOp }
      const multiplier = getGasMultiplier()

      // Apply custom gas limits if provided
      if (gasConfig.customLimits.callGasLimit) {
        modifiedOp.callGasLimit = ethers.BigNumber.from(gasConfig.customLimits.callGasLimit)
      } else if (userOp.callGasLimit && multiplier !== 1.0) {
        modifiedOp.callGasLimit = ethers.BigNumber.from(userOp.callGasLimit)
          .mul(Math.floor(multiplier * 100))
          .div(100)
      }

      if (gasConfig.customLimits.verificationGasLimit) {
        modifiedOp.verificationGasLimit = ethers.BigNumber.from(
          gasConfig.customLimits.verificationGasLimit,
        )
      } else if (userOp.verificationGasLimit && multiplier !== 1.0) {
        modifiedOp.verificationGasLimit = ethers.BigNumber.from(userOp.verificationGasLimit)
          .mul(Math.floor(multiplier * 100))
          .div(100)
      }

      if (gasConfig.customLimits.preVerificationGas) {
        modifiedOp.preVerificationGas = ethers.BigNumber.from(
          gasConfig.customLimits.preVerificationGas,
        )
      } else if (userOp.preVerificationGas && multiplier !== 1.0) {
        modifiedOp.preVerificationGas = ethers.BigNumber.from(userOp.preVerificationGas)
          .mul(Math.floor(multiplier * 100))
          .div(100)
      }

      if (gasConfig.customLimits.maxFeePerGas) {
        modifiedOp.maxFeePerGas = ethers.BigNumber.from(gasConfig.customLimits.maxFeePerGas)
      }

      if (gasConfig.customLimits.maxPriorityFeePerGas) {
        modifiedOp.maxPriorityFeePerGas = ethers.BigNumber.from(
          gasConfig.customLimits.maxPriorityFeePerGas,
        )
      }

      return modifiedOp
    },
    [gasConfig, getGasMultiplier],
  )

  return (
    <GasConfigContext.Provider
      value={{
        gasConfig,
        setGasConfig,
        resetGasConfig,
        isCustomGasEnabled,
        setCustomGasEnabled,
        getGasMultiplier,
        validateGasLimits,
        applyGasLimits,
      }}
    >
      {children}
    </GasConfigContext.Provider>
  )
}

export const useGasConfig = () => {
  const context = useContext(GasConfigContext)
  if (!context) {
    throw new Error('useGasConfig must be used within a GasConfigProvider')
  }
  return context
}
