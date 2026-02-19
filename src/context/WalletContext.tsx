import { createContext, useContext, useState, ReactNode } from 'react';
import { WalletState } from '../types';

interface WalletContextType {
  wallet: WalletState;
  connectWallet: () => void;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: null,
    balance: 0,
  });

  const connectWallet = () => {
    const mockAddress = 'ALGO' + Math.random().toString(36).substring(2, 15).toUpperCase();
    const mockBalance = Math.random() * 1000;

    setWallet({
      connected: true,
      address: mockAddress,
      balance: parseFloat(mockBalance.toFixed(2)),
    });
  };

  const disconnectWallet = () => {
    setWallet({
      connected: false,
      address: null,
      balance: 0,
    });
  };

  return (
    <WalletContext.Provider value={{ wallet, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
