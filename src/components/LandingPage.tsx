import { Users, DollarSign, Calculator, Zap } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Logo } from './Logo';

interface LandingPageProps {
  onNavigate: (page: string) => void;
  onConnectWallet: () => void;
}

export function LandingPage({ onNavigate, onConnectWallet }: LandingPageProps) {
  const features = [
    {
      icon: Users,
      title: 'Create Groups',
      description: 'Organize expenses with friends, roommates, or teams. Add participants by wallet address.',
    },
    {
      icon: DollarSign,
      title: 'Add Expenses',
      description: 'Log shared expenses instantly. Split bills equally or customize shares for each person.',
    },
    {
      icon: Calculator,
      title: 'Automatic Calculation',
      description: 'Smart algorithms calculate who owes what. No manual math needed, all transparent.',
    },
    {
      icon: Zap,
      title: 'One-Click Settlement',
      description: 'Settle debts instantly with Algorand. Fast, secure, and low-fee blockchain payments.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D0D0D] via-black to-[#0D0D0D]">
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size={40} />
          <div className="flex items-center space-x-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={onConnectWallet}
            >
              Connect Wallet
            </Button>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-96 h-96 bg-[#B11226] rounded-full blur-[150px]" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#8B0000] rounded-full blur-[150px]" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center animate-slideUp">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Split Expenses.
            <br />
            <span className="bg-gradient-to-r from-[#8B0000] via-[#B11226] to-[#8B0000] bg-clip-text text-transparent">
              Settle Instantly.
            </span>
            <br />
            Powered by Algorand.
          </h1>

          <p className="text-xl text-[#B3B3B3] mb-12 max-w-3xl mx-auto leading-relaxed">
            The decentralized way to manage shared expenses. Create groups, track bills,
            and settle debts with blockchain-powered transparency and security.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => onNavigate('dashboard')}
              className="min-w-[200px]"
            >
              Create Group
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onConnectWallet}
              className="min-w-[200px]"
            >
              Connect Wallet
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Why Choose SplitChain?
            </h2>
            <p className="text-[#B3B3B3] text-lg">
              Built on Algorand for instant, secure, and transparent settlements
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                hover
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col items-center text-center h-full">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#8B0000] to-[#B11226] flex items-center justify-center mb-4 shadow-lg shadow-[#B11226]/50">
                    <feature.icon size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-[#B3B3B3] text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-black/50">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="p-12">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-[#B3B3B3] text-lg mb-8">
              Join the future of expense sharing. No intermediaries, no delays.
            </p>
            <Button
              size="lg"
              onClick={() => onNavigate('dashboard')}
              className="min-w-[250px] animate-glow"
            >
              Launch App
            </Button>
          </Card>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <Logo size={32} />
          <p className="text-[#B3B3B3] text-sm mt-4 md:mt-0">
            © 2024 SplitChain. Built on Algorand.
          </p>
        </div>
      </footer>
    </div>
  );
}
