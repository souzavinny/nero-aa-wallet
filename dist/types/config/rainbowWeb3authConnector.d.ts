import { Wallet } from '@rainbow-me/rainbowkit';
import { Chain } from 'viem';
interface Web3AuthConfig {
    chain: Chain;
    walletConfig: {
        name: string;
        logo: string;
        walletBackground: string;
        clientId: string;
        uiConfig: {
            appName: string;
            mode: string;
            useLogoLoader: boolean;
            defaultLanguage: string;
            theme: {
                primary: string;
            };
            loginMethodsOrder: string[];
            uxMode: string;
            modalZIndex: string;
        };
        loginConfig: {
            google: {
                name: string;
                verifier: string;
                typeOfLogin: string;
                clientId: string;
            };
            facebook: {
                name: string;
                verifier: string;
                typeOfLogin: string;
                clientId: string;
            };
        };
    };
}
type WalletFunction = () => Wallet;
export declare const rainbowWeb3AuthConnector: ({ chain, walletConfig, }: Web3AuthConfig) => WalletFunction;
export {};
