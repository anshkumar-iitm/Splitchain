import { useState } from 'react';
import { WalletProvider, useWallet } from './context/WalletContext';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { Modal } from './components/ui/Modal';
import { Button } from './components/ui/Button';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'dashboard'>('landing');
  const [currentView, setCurrentView] = useState('overview');
  const [walletModal, setWalletModal] = useState(false);
  const { wallet, connectWallet } = useWallet();

  const handleConnectWallet = () => {
    if (!wallet.connected) {
      setWalletModal(true);
    }
  };

  const handleWalletConnect = () => {
    connectWallet();
    setWalletModal(false);
  };

  const handleNavigate = (page: string) => {
    if (page === 'dashboard') {
      setCurrentPage('dashboard');
      setCurrentView('overview');
    } else {
      setCurrentPage('landing');
    }
  };

  return (
    <>
      {currentPage === 'landing' ? (
        <LandingPage
          onNavigate={handleNavigate}
          onConnectWallet={handleConnectWallet}
        />
      ) : (
        <Dashboard currentView={currentView} onViewChange={setCurrentView} />
      )}

      <Modal
        isOpen={walletModal}
        onClose={() => setWalletModal(false)}
        title="Connect Wallet"
      >
        <div className="space-y-4">
          <p className="text-[#B3B3B3] mb-4">
            Choose a wallet provider to connect to SplitChain
          </p>
          <button
            onClick={handleWalletConnect}
            className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#B11226] rounded-lg transition-all text-left"
          >
            <div className="font-semibold text-white mb-1">Pera Wallet</div>
            <div className="text-sm text-[#B3B3B3]">
              Connect using Pera Algorand Wallet
            </div>
          </button>
          <button
            onClick={handleWalletConnect}
            className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#B11226] rounded-lg transition-all text-left"
          >
            <div className="font-semibold text-white mb-1">MyAlgo Wallet</div>
            <div className="text-sm text-[#B3B3B3]">
              Connect using MyAlgo Wallet
            </div>
          </button>
          <button
            onClick={handleWalletConnect}
            className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#B11226] rounded-lg transition-all text-left"
          >
            <div className="font-semibold text-white mb-1">Defly Wallet</div>
            <div className="text-sm text-[#B3B3B3]">
              Connect using Defly Wallet
            </div>
          </button>
        </div>
      </Modal>
    </>
  );
}

function App() {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  );
}

export default App;
