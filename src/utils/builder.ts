import { useContext, useCallback } from 'react'
import { ethers } from 'ethers'
import { Presets } from 'userop'
import { ConfigContext } from '@/contexts'
import { useAccountManager } from '@/hooks'
import { useGasConfig } from '@/contexts/GasConfigContext'

export const useBuilderWithPaymaster = (signer: ethers.Signer | undefined) => {
  const config = useContext(ConfigContext)
  const { activeAccount } = useAccountManager()
  const { applyGasLimits } = useGasConfig()

  const initBuilder = useCallback(
    async (usePaymaster: boolean, paymasterTokenAddress?: string, type: number = 0) => {
      if (!signer || !config) return undefined

      // Get the active account's salt
      if (!activeAccount) {
        console.warn('No active account available for builder')
        return undefined
      }

      const builder = await Presets.Builder.SimpleAccount.init(signer, config.rpcUrl, {
        overrideBundlerRpc: config.bundlerUrl,
        entryPoint: config.entryPoint,
        factory: config.accountFactory,
        salt: activeAccount.salt, // Use the active account's salt
      })

      if (usePaymaster) {
        const paymasterOptions = {
          apikey: config.paymasterApi,
          rpc: config.paymasterUrl,
          type,
          ...(type !== 0 && paymasterTokenAddress ? { token: paymasterTokenAddress } : {}),
        }
        builder.setPaymasterOptions(paymasterOptions)
      } else {
        builder.setPaymasterOptions(undefined)
      }

      // Override the original execute method to apply gas limits
      const originalExecute = builder.execute.bind(builder)
      builder.execute = (to: string, value: any, data: any) => {
        const result = originalExecute(to, value, data)
        return applyGasLimits(result)
      }

      // Override the original executeBatch method to apply gas limits
      const originalExecuteBatch = builder.executeBatch.bind(builder)
      builder.executeBatch = (to: string[], data: any[]) => {
        const result = originalExecuteBatch(to, data)
        return applyGasLimits(result)
      }

      return builder
    },
    [signer, config, activeAccount, applyGasLimits],
  )

  return { initBuilder }
}
