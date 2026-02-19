import { useState } from 'react';
import { LayoutDashboard, Users, PlusCircle, ArrowLeftRight, Wallet, Menu, X } from 'lucide-react';
import { Card } from './ui/Card';
import { Logo } from './Logo';
import { useWallet } from '../context/WalletContext';
import { CreateGroup } from './CreateGroup';
import { MyGroups } from './MyGroups';
import { AddExpense } from './AddExpense';
import { Settlements } from './Settlements';
import { WalletView } from './WalletView';

interface DashboardProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Dashboard({ currentView, onViewChange }: DashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { wallet } = useWallet();

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'groups', label: 'My Groups', icon: Users },
    { id: 'add-expense', label: 'Add Expense', icon: PlusCircle },
    { id: 'settlements', label: 'Settlements', icon: ArrowLeftRight },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-black to-[#0D0D0D]">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden glass p-3 rounded-lg text-white hover:bg-white/10 transition-all"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`
          fixed top-0 left-0 h-full w-72 glass z-40
          transform transition-transform duration-300 ease-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="p-6 border-b border-white/10">
          <Logo size={36} />
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onViewChange(item.id);
                setSidebarOpen(false);
              }}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                transition-all duration-200
                ${
                  currentView === item.id
                    ? 'bg-gradient-to-r from-[#8B0000] to-[#B11226] text-white shadow-lg'
                    : 'text-[#B3B3B3] hover:bg-white/5 hover:text-white'
                }
              `}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {wallet.connected && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
            <Card className="p-4">
              <div className="text-xs text-[#B3B3B3] mb-1">Connected</div>
              <div className="text-sm font-mono text-white truncate">
                {wallet.address}
              </div>
              <div className="text-lg font-bold text-white mt-2">
                {wallet.balance.toFixed(2)} ALGO
              </div>
            </Card>
          </div>
        )}
      </aside>

      <main className="lg:ml-72 min-h-screen">
        <div className="p-6 lg:p-8">
          {currentView === 'overview' && <OverviewView onViewChange={onViewChange} />}
          {currentView === 'groups' && <MyGroups />}
          {currentView === 'create-group' && <CreateGroup />}
          {currentView === 'add-expense' && <AddExpense />}
          {currentView === 'settlements' && <Settlements />}
          {currentView === 'wallet' && <WalletView />}
        </div>
      </main>
    </div>
  );
}

interface OverviewViewProps {
  onViewChange: (view: string) => void;
}

function OverviewView({ onViewChange }: OverviewViewProps) {
  const summaryCards = [
    { label: 'Total Owed to You', value: '45.80', color: 'from-green-600 to-green-700' },
    { label: 'Total You Owe', value: '23.50', color: 'from-[#8B0000] to-[#B11226]' },
    { label: 'Net Balance', value: '+22.30', color: 'from-blue-600 to-blue-700' },
  ];

  const recentActivity = [
    { type: 'expense', description: 'Dinner at Restaurant', amount: '15.50', from: 'John', date: '2 hours ago' },
    { type: 'settlement', description: 'Payment received', amount: '25.00', from: 'Sarah', date: '5 hours ago' },
    { type: 'expense', description: 'Movie tickets', amount: '12.00', from: 'Mike', date: '1 day ago' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Overview</h1>
          <p className="text-[#B3B3B3]">Track your expenses and settlements</p>
        </div>
        <button
          onClick={() => onViewChange('create-group')}
          className="px-6 py-3 bg-gradient-to-r from-[#8B0000] to-[#B11226] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#B11226]/50 transition-all"
        >
          Create Group
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {summaryCards.map((card, index) => (
          <Card key={index} hover className="p-6">
            <div className="text-sm text-[#B3B3B3] mb-2">{card.label}</div>
            <div className={`text-3xl font-bold bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
              {card.value} ALGO
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
            >
              <div className="flex-1">
                <div className="text-white font-medium">{activity.description}</div>
                <div className="text-sm text-[#B3B3B3]">
                  {activity.type === 'expense' ? 'Paid by' : 'From'} {activity.from} • {activity.date}
                </div>
              </div>
              <div className={`text-xl font-bold ${activity.type === 'settlement' ? 'text-green-500' : 'text-white'}`}>
                {activity.type === 'settlement' ? '+' : ''}{activity.amount} ALGO
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
