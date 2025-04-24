import React, { createContext, useCallback, useState } from 'react'
import { BytesLike, ethers } from 'ethers'
import {
  UserOperation,
  UserOperationResultInterface,
  SendUserOpContextProps,
  ProviderProps,
} from '@/types'
import Sentry from '@/utils/sentry'

export const SendUserOpContext = createContext<SendUserOpContextProps | undefined>(undefined)

export const SendUserOpProvider: React.FC<ProviderProps> = ({ children, onError }) => {
  const [paymaster, setPaymaster] = useState(false)
  const [userOperations, setUserOperations] = useState<UserOperation[]>([])
  const [latestUserOpResult, setLatestUserOpResult] = useState<UserOperationResultInterface | null>(
    null,
  )
  const [isWalletPanel, setIsWalletPanel] = useState(false)

  const [reportedErrors] = useState(new Set())

  const clearUserOperations = () => {
    setUserOperations([])
  }

  const forceOpenPanel = () => {
    setIsWalletPanel(true)
  }

  const handleError = useCallback(
    (
      error: any,
      aaAddress: string,
      title: string,
      operations?: { to: string; value: ethers.BigNumberish; data: BytesLike }[],
    ) => {
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

          if (operations && operations.length > 0) {
            scope.setExtra('operations', operations)
          }

          Sentry.captureException(error)
        })
      }
    },
    [onError, reportedErrors],
  )

  return (
    <SendUserOpContext.Provider
      value={{
        paymaster,
        setPaymaster,
        userOperations,
        setUserOperations,
        clearUserOperations,
        latestUserOpResult,
        setLatestUserOpResult,
        isWalletPanel,
        setIsWalletPanel,
        forceOpenPanel,
        handleError,
      }}
    >
      {children}
    </SendUserOpContext.Provider>
  )
}
