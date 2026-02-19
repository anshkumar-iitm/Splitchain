import { Wallet as WalletIcon, Copy, CheckCircle, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useWallet } from '../context/WalletContext';
import { Modal } from './ui/Modal';

export function WalletView() {
  const { wallet, connectWallet, disconnectWallet } = useWallet();
  const [copied, setCopied] = useState(false);
  const [connectModal, setConnectModal] = useState(false);

  const copyAddress = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConnect = () => {
    connectWallet();
    setConnectModal(false);
  };

  if (!wallet.connected) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Wallet</h1>
          <p className="text-[#B3B3B3]">Connect your Algorand wallet</p>
        </div>

        <Card className="p-12 text-center max-w-2xl mx-auto">
          <WalletIcon size={64} className="mx-auto text-[#B11226] mb-6" />
          <h3 className="text-2xl font-bold text-white mb-4">
            Connect Your Wallet
          </h3>
          <p className="text-[#B3B3B3] mb-8 max-w-md mx-auto">
            Connect your Algorand wallet to start managing expenses and settling payments
            on-chain with complete transparency.
          </p>
          <Button size="lg" onClick={() => setConnectModal(true)}>
            Connect Wallet
          </Button>
        </Card>

        <Modal
          isOpen={connectModal}
          onClose={() => setConnectModal(false)}
          title="Connect Wallet"
        >
          <div className="space-y-4">
            <button
              onClick={handleConnect}
              className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#B11226] rounded-lg transition-all text-left"
            >
              <div className="font-semibold text-white mb-1">Pera Wallet</div>
              <div className="text-sm text-[#B3B3B3]">
                Connect using Pera Algorand Wallet
              </div>
            </button>
            <button
              onClick={handleConnect}
              className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#B11226] rounded-lg transition-all text-left"
            >
              <div className="font-semibold text-white mb-1">MyAlgo Wallet</div>
              <div className="text-sm text-[#B3B3B3]">
                Connect using MyAlgo Wallet
              </div>
            </button>
            <button
              onClick={handleConnect}
              className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#B11226] rounded-lg transition-all text-left"
            >
              <div className="font-semibold text-white mb-1">Defly Wallet</div>
              <div className="text-sm text-[#B3B3B3]">
                Connect using Defly Wallet
              </div>
            </button>
          </div>
        </Modal>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Wallet</h1>
        <p className="text-[#B3B3B3]">Manage your Algorand wallet</p>
      </div>

      <div className="max-w-2xl">
        <Card className="p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#8B0000] to-[#B11226] rounded-full flex items-center justify-center">
                <WalletIcon size={24} className="text-white" />
              </div>
              <div>
                <div className="text-sm text-[#B3B3B3]">Connected Wallet</div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-mono text-sm">
                    {wallet.address?.slice(0, 8)}...{wallet.address?.slice(-8)}
                  </span>
                  <button
                    onClick={copyAddress}
                    className="text-[#B3B3B3] hover:text-white transition-colors"
                  >
                    {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={disconnectWallet}>
              Disconnect
            </Button>
          </div>

          <div className="text-center py-8 bg-white/5 rounded-lg">
            <div className="text-sm text-[#B3B3B3] mb-2">Balance</div>
            <div className="text-5xl font-bold text-white mb-1">
              {wallet.balance.toFixed(2)}
            </div>
            <div className="text-[#B3B3B3]">ALGO</div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#B11226] rounded-lg transition-all text-left flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">View on Algorand Explorer</div>
                <div className="text-sm text-[#B3B3B3]">
                  See your transactions on-chain
                </div>
              </div>
              <ExternalLink size={20} className="text-[#B3B3B3]" />
            </button>
            <button className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#B11226] rounded-lg transition-all text-left">
              <div className="font-semibold text-white">Transaction History</div>
              <div className="text-sm text-[#B3B3B3]">
                View all your SplitChain transactions
              </div>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
