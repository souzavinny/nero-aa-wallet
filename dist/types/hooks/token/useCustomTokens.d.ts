import { ERC20Token, NftWithImages } from '@/types';
export declare const useCustomERC20Tokens: () => {
    erc20Tokens: ERC20Token[];
    addERC20Token: (token: ERC20Token) => Promise<void>;
    removeERC20Token: (contractAddress: string) => Promise<void>;
    isLoading: boolean;
    error: Error | null;
};
export declare const useCustomERC721Tokens: () => {
    erc721Tokens: NftWithImages[];
    addERC721Token: (token: NftWithImages) => Promise<void>;
    removeERC721Token: (contractAddress: string, tokenId?: number) => Promise<void>;
    isLoading: boolean;
    error: Error | null;
};
