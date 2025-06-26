import { NftWithImages, ERC20Token } from '@/types'

const CUSTOM_ERC20_TOKENS_KEY = 'customERC20Tokens'
const CUSTOM_ERC721_TOKENS_KEY = 'customERC721Tokens'

/**
 * Simple localStorage quota check
 * Returns true if storage is full or nearly full
 */
export const isLocalStorageNearFull = (): { isFull: boolean; message?: string } => {
  try {
    // Try to estimate current usage by checking existing keys
    const testKey = '__nero_storage_test__'
    const testData = 'x'.repeat(100000) // 100KB test data

    try {
      localStorage.setItem(testKey, testData)
      localStorage.removeItem(testKey)
      return { isFull: false }
    } catch (error: any) {
      if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
        return {
          isFull: true,
          message:
            "Your browser's local storage is full. Please clear some data or increase storage quota to create new accounts.",
        }
      }
      throw error
    }
  } catch (error) {
    console.error('Error checking localStorage quota:', error)
    return {
      isFull: true,
      message: 'Unable to check storage availability. Please try again or clear your browser data.',
    }
  }
}

export const saveCustomERC20Token = (token: ERC20Token) => {
  const existingTokens = getCustomERC20Tokens()
  const updatedTokens = [...existingTokens, token]
  localStorage.setItem(CUSTOM_ERC20_TOKENS_KEY, JSON.stringify(updatedTokens))
}

export const getCustomERC20Tokens = (): ERC20Token[] => {
  const tokensJson = localStorage.getItem(CUSTOM_ERC20_TOKENS_KEY)
  return tokensJson ? JSON.parse(tokensJson) : []
}

export const removeCustomERC20Token = (contractAddress: string) => {
  const existingTokens = getCustomERC20Tokens()

  const normalizedAddress = contractAddress.toLowerCase()
  const updatedTokens = existingTokens.filter(
    (token) => token.contractAddress.toLowerCase() !== normalizedAddress,
  )
  try {
    localStorage.setItem(CUSTOM_ERC20_TOKENS_KEY, JSON.stringify(updatedTokens))
    const verifyTokens = getCustomERC20Tokens()
    if (verifyTokens.some((token) => token.contractAddress.toLowerCase() === normalizedAddress)) {
      console.error('Token was not properly removed')
    }
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

export const saveCustomERC721Token = (token: NftWithImages) => {
  const existingTokens = getCustomERC721Tokens()
  const existingToken = existingTokens.find(
    (t) => t.contractAddress.toLowerCase() === token.contractAddress.toLowerCase(),
  )

  if (existingToken) {
    const uniqueTokenData = token.tokenData
      .filter(
        (newData) =>
          !existingToken.tokenData.some((existingData) => existingData.tokenId === newData.tokenId),
      )
      .map((data) => ({
        ...data,
        hidden: false,
      }))

    existingToken.tokenData.push(...uniqueTokenData)
    existingToken.balance = (parseInt(existingToken.balance) + uniqueTokenData.length).toString()
  } else {
    token.tokenData = token.tokenData.map((data) => ({
      ...data,
      hidden: false,
    }))
    existingTokens.push(token)
  }

  localStorage.setItem(CUSTOM_ERC721_TOKENS_KEY, JSON.stringify(existingTokens))
}

export const getCustomERC721Tokens = (): NftWithImages[] => {
  const tokensJson = localStorage.getItem(CUSTOM_ERC721_TOKENS_KEY)
  return tokensJson ? JSON.parse(tokensJson) : []
}

export const removeCustomERC721Token = (contractAddress: string) => {
  const existingTokens = getCustomERC721Tokens()
  const updatedTokens = existingTokens.filter((token) => token.contractAddress !== contractAddress)
  localStorage.setItem(CUSTOM_ERC721_TOKENS_KEY, JSON.stringify(updatedTokens))
}

export const updateCustomERC721Token = (updatedToken: NftWithImages) => {
  const existingTokens = getCustomERC721Tokens()
  const updatedTokens = existingTokens.map((token) =>
    token.contractAddress === updatedToken.contractAddress ? updatedToken : token,
  )
  localStorage.setItem(CUSTOM_ERC721_TOKENS_KEY, JSON.stringify(updatedTokens))
}

export const getCustomERC721TokenByAddress = (
  contractAddress: string,
): NftWithImages | undefined => {
  const existingTokens = getCustomERC721Tokens()
  return existingTokens.find((token) => token.contractAddress === contractAddress)
}

export const toggleNFTVisibility = (contractAddress: string, tokenId: number) => {
  const existingTokens = getCustomERC721Tokens()
  const updatedTokens = existingTokens.map((token) => {
    if (token.contractAddress.toLowerCase() === contractAddress.toLowerCase()) {
      return {
        ...token,
        tokenData: token.tokenData.map((data) => {
          if (data.tokenId === tokenId) {
            return { ...data, hidden: !data.hidden }
          }
          return data
        }),
      }
    }
    return token
  })
  localStorage.setItem(CUSTOM_ERC721_TOKENS_KEY, JSON.stringify(updatedTokens))
}
