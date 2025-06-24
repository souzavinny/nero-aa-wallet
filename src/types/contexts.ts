import { ReactNode } from 'react'
import { WEB3AUTH_NETWORK_TYPE } from '@web3auth/base'
import { ContractInterface, BigNumberish } from 'ethers'
import { Client, UserOperationMiddlewareFn } from 'userop'
import { Presets } from 'userop'
import { SimpleAccount } from '@/helper/simpleAccount'
import {
  PaymasterToken,
  PaymasterData,
  PaymasterMode,
  PaymasterModeValue,
  SponsorshipInfo,
  NFTCardType,
  Screen,
  Token,
  WalletConfig,
} from '@/types'

export interface ProviderProps {
  children: ReactNode
}

export interface BaseTransferContextType {
  recipientAddress: string
  setRecipientAddress: (address: string) => void
  clearRecipientAddress: () => void
  paymaster: boolean
  setPaymaster: (value: boolean) => void
  isTransferEnabled: boolean
  setIsTransferEnabled: (value: boolean) => void
}

export interface NFTContextType extends BaseTransferContextType {
  selectedNFT: NFTCardType | null
  selectNFT: (nft: NFTCardType) => void
  clearNFT: () => void
}

export interface TokenContextType extends BaseTransferContextType {
  selectedToken: Token | null
  selectToken: (token: Token) => void
  clearToken: () => void
}

export interface SendContextProps extends BaseTransferContextType {
  selectedToken: Token
  setSelectedToken: (token: Token) => void
  clearSelectedToken: () => void
  balance: string
  setBalance: (balance: string) => void
  clearBalance: () => void
  lastSentToken: Token | null
  setLastSentToken: (token: Token | null) => void
}

export interface RecipientData {
  address: string
  amount: string
  token: Token | null
}

export interface MultiSendContextProps {
  recipients: RecipientData[]
  setRecipients: (recipients: RecipientData[]) => void
  addRecipient: () => void
  removeRecipient: (index: number) => void
  updateRecipient: (index: number, field: 'address' | 'amount' | 'token', value: any) => void
  isTransferEnabled: boolean
  activeTokenModalIndex: number | null
  setActiveTokenModalIndex: (index: number | null) => void
  clearAll: () => void
  totalAmountByToken: Record<string, number>
}

export interface TransactionContextProps {
  transactionAddress: string
  setTransactionAddress: (contractAddress: string) => void
  balance: string
  setBalance: (balance: string) => void
}

export interface ClientContextType extends Client {}

export interface ConfigContextProps {
  projectId: string
  rpcUrl: string
  paymasterUrl: string
  paymasterApi: string
  clientId: string
  walletName: string
  walletLogo: string
  walletBackground: string
  explorerUrl: string
  explorerAPI: string
  chainId: number
  chainName: string
  networkType: WEB3AUTH_NETWORK_TYPE
  bundlerUrl: string
  contactAs: string
  PrivacyPolicy: string
  ServiceTerms: string
  tokenDecimals: Number
  tokenName: string
  tokenSymbol: string
  entryPoint: string
  accountFactory: string
  tokenPaymaster: string
  uiConfig: {
    appName: string
    mode: string
    useLogoLoader: boolean
    defaultLanguage: string
    theme: {
      primary: string
    }
    loginMethodsOrder: string[]
  }
  loginConfig: {
    google: {
      name: string
      verifier: string
      typeOfLogin: string
      clientId: string
    }
    facebook: {
      name: string
      verifier: string
      typeOfLogin: string
      clientId: string
    }
  }
  currentNetworkIndex: number
  switchNetwork: () => void
  chains: WalletConfig['chains']
  switchToNetwork: (index: number) => void
  hasWeb3AuthConfig: boolean
}

export interface ConfigProviderProps extends ProviderProps {
  config: WalletConfig
}

export interface SignatureContextProps {
  loading: boolean
  AAaddress: `0x${string}`
  isConnected: boolean
  simpleAccountInstance?: SimpleAccount
  signMessage: (pm?: 'token' | 'verifying' | 'legacy-token') => Promise<void>
  resetSignature: () => void
  getPaymasterMiddleware: (
    pm?: 'token' | 'verifying' | 'legacy-token',
  ) => UserOperationMiddlewareFn | undefined
}

export interface ScreenManagerContextType {
  currentScreen: Screen
  previousScreen: Screen
  navigateTo: (screen: Screen) => void
}

export interface PaymasterContextType {
  paymaster: boolean
  setPaymaster: (value: boolean) => void
  selectedToken: string | null
  setSelectedToken: (value: string | null) => void
  supportedTokens: PaymasterToken[]
  setSupportedTokens: (value: PaymasterToken[]) => void
  freeGas: boolean
  setFreeGas: (value: boolean) => void
  paymasterData: PaymasterData | null
  setPaymasterData: (value: PaymasterData | null) => void
  error: string | null
  setError: (value: string | null) => void
  builder: Presets.Builder.Kernel | null
  setBuilder: (value: Presets.Builder.Kernel | null) => void
  selectedMode: PaymasterMode
  setSelectedMode: (mode: PaymasterMode) => void
  sponsorshipInfo: SponsorshipInfo
  setSponsorshipInfo: (info: SponsorshipInfo) => void
  clearPaymasterStates: () => void
  setSponsoredGas: () => void
  setTokenPayment: (token: string | null, mode?: PaymasterModeValue) => void
  clearToken: () => void
  isPaymentSelected: boolean
  setIsPaymentSelected: (selected: boolean) => void
}

export interface UserOperation {
  function: string
  contractAddress: string
  abi: ContractInterface
  value: BigNumberish
  params: any[]
}

export interface UserOperationResultInterface {
  userOpHash: string
  result: boolean
  transactionHash: string
}

export interface SendUserOpContextProps {
  paymaster: boolean
  setPaymaster: (value: boolean) => void
  userOperations: UserOperation[]
  setUserOperations: (userOperations: UserOperation[]) => void
  clearUserOperations: () => void
  latestUserOpResult: UserOperationResultInterface | null
  setLatestUserOpResult: (result: UserOperationResultInterface | null) => void
  isWalletPanel: boolean
  setIsWalletPanel: (value: boolean) => void
  forceOpenPanel: () => void
}

export interface AccountData {
  id: string
  name: string
  AAaddress: `0x${string}`
  salt: number
  simpleAccountInstance?: SimpleAccount
  createdAt: number
  hidden?: boolean
}

export interface AccountDropdownProps {
  onClose: () => void
  onCreateAccount: () => void
}

export interface AccountManagerContextProps {
  accounts: AccountData[]
  visibleAccounts: AccountData[]
  hiddenAccounts: AccountData[]
  activeAccountId: string | null
  activeAccount: AccountData | null
  loading: boolean
  isCreatingAccount: boolean
  createAccount: (name?: string) => Promise<void>
  switchAccount: (accountId: string) => void
  updateAccountName: (accountId: string, name: string) => void
  hideAccount: (accountId: string) => void
  unhideAccount: (accountId: string) => void
  showHiddenAccounts: boolean
  setShowHiddenAccounts: (show: boolean) => void
  refreshActiveAccount: (pm?: 'token' | 'verifying' | 'legacy-token') => Promise<void>
  recoverAccountByIndex: (accountIndex: number, accountName?: string) => Promise<AccountData | null>
  discoverAccounts: (
    maxIndex?: number,
  ) => Promise<Array<{ index: number; address: string; salt: number }>>
  getRecoveryInfo: () => Promise<{
    signerAddress: string
    authMethod: string
    userId?: string
    walletName?: string
    chainId: number
    accountFactory: string
    entryPoint: string
    currentAccountCount: number
    storageKey?: string
  } | null>
  demoRecoveryScenario: () => Promise<void>
}

export interface TokenBalance {
  token: Token
  balance: string
  formattedBalance: string
  valueInUSD?: string
}

export interface AccountTokenBalances {
  accountId: string
  accountName: string
  AAaddress: `0x${string}`
  nativeBalance: string
  tokenBalances: TokenBalance[]
  totalValueUSD?: string
}

export interface ConsolidationPlan {
  fromAccounts: AccountTokenBalances[]
  toAccount: AccountData
  totalTransfers: number
  estimatedGasNeeded: string
  canExecute: boolean
  warnings: string[]
}

export interface ConsolidationProgress {
  accountId: string
  accountName: string
  transfers: {
    tokenSymbol: string
    status: 'pending' | 'processing' | 'completed' | 'failed'
    txHash?: string
    error?: string
  }[]
}

export interface AccountConsolidationContextProps {
  isScanning: boolean
  isConsolidating: boolean
  consolidationPlan: ConsolidationPlan | null
  consolidationProgress: ConsolidationProgress[]
  scanAccountBalances: () => Promise<void>
  executeConsolidation: () => Promise<void>
  clearConsolidation: () => void
  canConsolidate: boolean
  // Modal state management
  showConsolidationModal: 'none' | 'preview' | 'progress'
  openPreviewModal: () => void
  openProgressModal: () => void
  closeConsolidationModals: () => boolean
}
