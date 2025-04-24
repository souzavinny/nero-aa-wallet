// src/index.tsx
import React from 'react'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Sentry from './utils/sentry'
import App from '@/App'
import {
  ClientProvider,
  ConfigProvider,
  MultiSendProvider,
  NFTProvider,
  PaymasterProvider,
  ScreenManagerProvider,
  SendProvider,
  SendUserOpProvider,
  SignatureProvider,
  TokenProvider,
  TransactionProvider,
  WrapWagmiProvider,
} from '@/contexts'
import { useSignature, useAAtransfer, useSendUserOp, useConfig } from '@/hooks'
import '@rainbow-me/rainbowkit/styles.css'
import '@/index.css'
import { WalletConfig } from '@/types'

interface SocialWalletProps {
  config: WalletConfig
  zIndex?: number
  children?: React.ReactNode
  mode?: 'sidebar' | 'button'
  onError?: boolean
}

export const SocialWallet: React.FC<SocialWalletProps> = ({
  config,
  zIndex = 9999,
  children,
  mode = 'sidebar',
  onError = false,
}) => {
  const queryClient = new QueryClient()

  return (
    <ConfigProvider config={config}>
      <Sentry.ErrorBoundary>
        <WrapWagmiProvider>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider modalSize='compact'>
              <SignatureProvider>
                <ScreenManagerProvider>
                  <PaymasterProvider onError={onError}>
                    <TokenProvider>
                      <NFTProvider>
                        <SendProvider>
                          <MultiSendProvider>
                            <ClientProvider>
                              <SendUserOpProvider onError={onError}>
                                <TransactionProvider>
                                  {children}
                                  <div style={{ position: 'relative', zIndex: zIndex }}>
                                    <App mode={mode} />
                                  </div>
                                </TransactionProvider>
                              </SendUserOpProvider>
                            </ClientProvider>
                          </MultiSendProvider>
                        </SendProvider>
                      </NFTProvider>
                    </TokenProvider>
                  </PaymasterProvider>
                </ScreenManagerProvider>
              </SignatureProvider>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WrapWagmiProvider>
      </Sentry.ErrorBoundary>
    </ConfigProvider>
  )
}

export { useAAtransfer, useSignature, useSendUserOp, useConfig }
