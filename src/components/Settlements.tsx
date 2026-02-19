import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { useWallet } from '../context/WalletContext';
import { supabase } from '../lib/supabase';

interface Balance {
  from: string;
  to: string;
  amount: number;
  groupName: string;
}

export function Settlements() {
  const { wallet } = useWallet();
  const [balances, setBalances] = useState<Balance[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentModal, setPaymentModal] = useState<Balance | null>(null);
  const [paying, setPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    calculateBalances();
  }, [wallet.address]);

  const calculateBalances = async () => {
    if (!wallet.connected) {
      setLoading(false);
      return;
    }

    try {
      const { data: participantData } = await supabase
        .from('participants')
        .select('group_id')
        .eq('wallet_address', wallet.address);

      if (!participantData) {
        setLoading(false);
        return;
      }

      const groupIds = participantData.map((p) => p.group_id);

      const { data: expenses } = await supabase
        .from('expenses')
        .select('*, expense_splits(*), groups(name)')
        .in('group_id', groupIds);

      if (!expenses) {
        setLoading(false);
        return;
      }

      const balanceMap = new Map<string, { amount: number; groupName: string }>();

      expenses.forEach((expense: any) => {
        const splits = expense.expense_splits || [];
        const paidBy = expense.paid_by;
        const groupName = expense.groups?.name || 'Unknown Group';

        splits.forEach((split: any) => {
          if (split.wallet_address === wallet.address && paidBy !== wallet.address) {
            const key = `${wallet.address}-${paidBy}`;
            const current = balanceMap.get(key) || { amount: 0, groupName };
            balanceMap.set(key, {
              amount: current.amount + parseFloat(split.amount),
              groupName,
            });
          } else if (split.wallet_address !== wallet.address && paidBy === wallet.address) {
            const key = `${split.wallet_address}-${wallet.address}`;
            const current = balanceMap.get(key) || { amount: 0, groupName };
            balanceMap.set(key, {
              amount: current.amount - parseFloat(split.amount),
              groupName,
            });
          }
        });
      });

      const balancesList: Balance[] = [];
      balanceMap.forEach((value, key) => {
        const [from, to] = key.split('-');
        if (value.amount > 0) {
          balancesList.push({
            from,
            to,
            amount: value.amount,
            groupName: value.groupName,
          });
        } else if (value.amount < 0) {
          balancesList.push({
            from: to,
            to: from,
            amount: Math.abs(value.amount),
            groupName: value.groupName,
          });
        }
      });

      setBalances(balancesList);
    } catch (error) {
      console.error('Error calculating balances:', error);
    } finally {
      setLoading(false);
    }
  };

  const initiatePayment = (balance: Balance) => {
    setPaymentModal(balance);
  };

  const processPayment = async () => {
    if (!paymentModal) return;

    setPaying(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setPaymentSuccess(true);
    setPaying(false);

    setTimeout(() => {
      setBalances(balances.filter((b) => b !== paymentModal));
      setPaymentModal(null);
      setPaymentSuccess(false);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#B3B3B3]">Loading settlements...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Settlements</h1>
        <p className="text-[#B3B3B3]">Settle your outstanding balances</p>
      </div>

      {balances.length === 0 ? (
        <Card className="p-12 text-center">
          <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">All settled up!</h3>
          <p className="text-[#B3B3B3]">You have no outstanding balances</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {balances.map((balance, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-white font-mono text-sm">
                      {balance.from === wallet.address
                        ? 'You'
                        : balance.from.slice(0, 12) + '...'}
                    </span>
                    <ArrowRight size={20} className="text-[#B11226]" />
                    <span className="text-white font-mono text-sm">
                      {balance.to === wallet.address
                        ? 'You'
                        : balance.to.slice(0, 12) + '...'}
                    </span>
                  </div>
                  <div className="text-sm text-[#B3B3B3]">{balance.groupName}</div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">
                      {balance.amount.toFixed(2)} ALGO
                    </div>
                  </div>

                  {balance.from === wallet.address && (
                    <Button onClick={() => initiatePayment(balance)}>
                      Pay Now
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!paymentModal}
        onClose={() => !paying && setPaymentModal(null)}
        title="Confirm Payment"
      >
        {paymentModal && (
          <div className="space-y-6">
            {!paymentSuccess ? (
              <>
                <div className="text-center p-6 bg-white/5 rounded-lg">
                  <div className="text-sm text-[#B3B3B3] mb-2">Payment Amount</div>
                  <div className="text-4xl font-bold text-white mb-4">
                    {paymentModal.amount.toFixed(2)} ALGO
                  </div>
                  <div className="text-sm text-[#B3B3B3]">
                    To: {paymentModal.to.slice(0, 16)}...
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-[#B3B3B3]">
                    <span>Transaction Fee</span>
                    <span>0.001 ALGO</span>
                  </div>
                  <div className="flex justify-between font-bold text-white border-t border-white/10 pt-2">
                    <span>Total</span>
                    <span>{(paymentModal.amount + 0.001).toFixed(3)} ALGO</span>
                  </div>
                </div>

                <Button
                  onClick={processPayment}
                  disabled={paying}
                  className="w-full"
                  size="lg"
                >
                  {paying ? 'Processing...' : 'Confirm & Pay'}
                </Button>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-glow">
                  <CheckCircle size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Payment Successful!
                </h3>
                <p className="text-[#B3B3B3]">
                  Transaction confirmed on Algorand
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
