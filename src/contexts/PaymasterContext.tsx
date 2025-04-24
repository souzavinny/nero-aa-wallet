import React, { createContext, useCallback, useState } from 'react'
import { Presets } from 'userop'
import { PaymasterContextType, ProviderProps } from '@/types'
import {
  PaymasterToken,
  PaymasterData,
  PaymasterMode,
  PaymasterModeValue,
  PAYMASTER_MODE,
  SponsorshipInfo,
} from '@/types/Paymaster'
import Sentry from '@/utils/sentry'

export const PaymasterContext = createContext<PaymasterContextType | undefined>(undefined)

export const PaymasterProvider: React.FC<ProviderProps> = ({ children, onError }) => {
  const [paymaster, setPaymaster] = useState(false)
  const [selectedToken, setSelectedToken] = useState<string | null>(null)
  const [supportedTokens, setSupportedTokens] = useState<PaymasterToken[]>([])
  const [freeGas, setFreeGas] = useState(false)
  const [paymasterData, setPaymasterData] = useState<PaymasterData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [builder, setBuilder] = useState<Presets.Builder.Kernel | null>(null)
  const [selectedMode, setSelectedMode] = useState<PaymasterMode>({
    value: PAYMASTER_MODE.FREE_GAS,
  })

  const [sponsorshipInfo, setSponsorshipInfo] = useState<SponsorshipInfo>({
    balance: '0',
    freeGas: false,
  })

  const [isPaymentSelected, setIsPaymentSelected] = useState(false)

  const [reportedErrors] = useState(new Set())

  const clearPaymasterStates = () => {
    setPaymaster(false)
    setSelectedToken(null)
    setFreeGas(false)
    setSelectedMode({ value: PAYMASTER_MODE.FREE_GAS })
    setSponsorshipInfo((prev) => ({ ...prev, freeGas: false }))
    setIsPaymentSelected(false)
  }

  const setSponsoredGas = () => {
    clearPaymasterStates()
    setPaymaster(true)
    setFreeGas(true)
    setSelectedMode({ value: PAYMASTER_MODE.FREE_GAS })
    setSponsorshipInfo((prev) => ({ ...prev, freeGas: true }))
  }

  const setTokenPayment = (
    token: string | null,
    mode: PaymasterModeValue = PAYMASTER_MODE.POST_FUND,
  ) => {
    clearPaymasterStates()
    if (token) {
      if (mode === PAYMASTER_MODE.NATIVE) {
        setPaymaster(false)
      } else {
        setPaymaster(true)
      }
      setSelectedToken(token)
      setFreeGas(false)
      setSelectedMode({ value: mode })
      setSponsorshipInfo((prev) => ({ ...prev, freeGas: false }))
    }
  }

  const clearToken = () => {
    setPaymaster(false)
    setSelectedToken(null)
    setFreeGas(false)
    setSelectedMode({ value: PAYMASTER_MODE.FREE_GAS })
    setSponsorshipInfo((prev) => ({ ...prev, freeGas: false }))
  }

  const handleError = useCallback(
    (error: any, aaAddress: string, title: string) => {
      const errorId = `${title}:${error.message || String(error)}`

      if (reportedErrors.has(errorId)) {
        return
      }

      reportedErrors.add(errorId)

      if (onError) {
        Sentry.withScope(function (scope) {
          scope.setUser({ id: aaAddress })
          scope.setTag('error.title', title)
          scope.setTag('error.id', errorId)
          Sentry.captureException(error)
        })
      }
    },
    [onError, reportedErrors],
  )

  return (
    <PaymasterContext.Provider
      value={{
        paymaster,
        setPaymaster,
        selectedToken,
        setSelectedToken,
        supportedTokens,
        setSupportedTokens,
        freeGas,
        setFreeGas,
        paymasterData,
        setPaymasterData,
        error,
        setError,
        builder,
        setBuilder,
        selectedMode,
        setSelectedMode,
        sponsorshipInfo,
        setSponsorshipInfo,
        clearPaymasterStates,
        setSponsoredGas,
        setTokenPayment,
        clearToken,
        isPaymentSelected,
        setIsPaymentSelected,
        handleError,
      }}
    >
      {children}
    </PaymasterContext.Provider>
  )
}
