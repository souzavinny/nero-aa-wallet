import React from 'react';
import { BytesLike, ethers } from 'ethers';
import { useSignature, useAAtransfer, useSendUserOp, useConfig } from '@/hooks';
import '@rainbow-me/rainbowkit/styles.css';
import '@/index.css';
import { WalletConfig } from '@/types';
interface SocialWalletProps {
    config: WalletConfig;
    zIndex?: number;
    children?: React.ReactNode;
    mode?: 'sidebar' | 'button';
    onError?: (error: any, aaAddress?: string, title?: string, operations?: {
        to: string;
        value: ethers.BigNumberish;
        data: BytesLike;
    }[]) => void;
}
export declare const SocialWallet: React.FC<SocialWalletProps>;
export { useAAtransfer, useSignature, useSendUserOp, useConfig };
