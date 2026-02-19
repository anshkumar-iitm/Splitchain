import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useWallet } from '../context/WalletContext';
import { supabase } from '../lib/supabase';
import { Group, Participant } from '../types';

export function AddExpense() {
  const { wallet } = useWallet();
  const [groups, setGroups] = useState<(Group & { participants: Participant[] })[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [splitMethod, setSplitMethod] = useState<'equal' | 'custom'>('equal');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGroups();
  }, [wallet.address]);

  useEffect(() => {
    if (selectedGroup) {
      const group = groups.find((g) => g.id === selectedGroup);
      if (group) {
        setPaidBy(wallet.address || '');
        setSelectedParticipants(group.participants.map((p) => p.wallet_address));
      }
    }
  }, [selectedGroup, groups, wallet.address]);

  const loadGroups = async () => {
    if (!wallet.connected) return;

    try {
      const { data: participantData } = await supabase
        .from('participants')
        .select('group_id')
        .eq('wallet_address', wallet.address);

      if (!participantData) return;

      const groupIds = participantData.map((p) => p.group_id);

      const { data: groupsData } = await supabase
        .from('groups')
        .select('*')
        .in('id', groupIds);

      if (groupsData) {
        const groupsWithParticipants = await Promise.all(
          groupsData.map(async (group) => {
            const { data: participants } = await supabase
              .from('participants')
              .select('*')
              .eq('group_id', group.id);

            return {
              ...group,
              participants: participants || [],
            };
          })
        );

        setGroups(groupsWithParticipants);
      }
    } catch (error) {
      console.error('Error loading groups:', error);
    }
  };

  const toggleParticipant = (address: string) => {
    if (selectedParticipants.includes(address)) {
      setSelectedParticipants(selectedParticipants.filter((p) => p !== address));
    } else {
      setSelectedParticipants([...selectedParticipants, address]);
    }
  };

  const addExpense = async () => {
    if (!selectedGroup) {
      setError('Please select a group');
      return;
    }

    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!paidBy) {
      setError('Please select who paid');
      return;
    }

    if (selectedParticipants.length === 0) {
      setError('Please select at least one participant');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data: expense, error: expenseError } = await supabase
        .from('expenses')
        .insert({
          group_id: selectedGroup,
          description,
          amount: amountNum,
          paid_by: paidBy,
          split_method: splitMethod,
        })
        .select()
        .single();

      if (expenseError) throw expenseError;

      const splitAmount = amountNum / selectedParticipants.length;
      const splits = selectedParticipants.map((address) => ({
        expense_id: expense.id,
        wallet_address: address,
        amount: splitAmount,
      }));

      const { error: splitsError } = await supabase
        .from('expense_splits')
        .insert(splits);

      if (splitsError) throw splitsError;

      setSuccess(true);
      setTimeout(() => {
        setDescription('');
        setAmount('');
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError('Failed to add expense. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentGroup = groups.find((g) => g.id === selectedGroup);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Add Expense</h1>
        <p className="text-[#B3B3B3]">Record a shared expense</p>
      </div>

      <div className="max-w-2xl">
        <Card className="p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#B3B3B3] mb-2">
                Select Group
              </label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#B11226] focus:ring-2 focus:ring-[#B11226]/20 transition-all"
              >
                <option value="">Choose a group</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id} className="bg-[#0D0D0D]">
                    {group.name}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Description"
              placeholder="e.g., Dinner, Movie tickets, Groceries"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <Input
              label="Amount (ALGO)"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-2xl font-bold"
            />

            {currentGroup && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[#B3B3B3] mb-2">
                    Who Paid?
                  </label>
                  <select
                    value={paidBy}
                    onChange={(e) => setPaidBy(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#B11226] focus:ring-2 focus:ring-[#B11226]/20 transition-all"
                  >
                    {currentGroup.participants.map((participant) => (
                      <option
                        key={participant.id}
                        value={participant.wallet_address}
                        className="bg-[#0D0D0D]"
                      >
                        {participant.wallet_address === wallet.address
                          ? 'You'
                          : participant.wallet_address.slice(0, 12) + '...'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#B3B3B3] mb-2">
                    Split Method
                  </label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setSplitMethod('equal')}
                      className={`flex-1 py-3 px-4 rounded-lg border transition-all ${
                        splitMethod === 'equal'
                          ? 'bg-gradient-to-r from-[#8B0000] to-[#B11226] border-[#B11226] text-white'
                          : 'bg-white/5 border-white/10 text-[#B3B3B3] hover:border-[#B11226]'
                      }`}
                    >
                      Equal Split
                    </button>
                    <button
                      onClick={() => setSplitMethod('custom')}
                      className={`flex-1 py-3 px-4 rounded-lg border transition-all ${
                        splitMethod === 'custom'
                          ? 'bg-gradient-to-r from-[#8B0000] to-[#B11226] border-[#B11226] text-white'
                          : 'bg-white/5 border-white/10 text-[#B3B3B3] hover:border-[#B11226]'
                      }`}
                    >
                      Custom Split
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#B3B3B3] mb-2">
                    Who Participated?
                  </label>
                  <div className="space-y-2">
                    {currentGroup.participants.map((participant) => (
                      <button
                        key={participant.id}
                        onClick={() => toggleParticipant(participant.wallet_address)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                          selectedParticipants.includes(participant.wallet_address)
                            ? 'bg-white/10 border-[#B11226] text-white'
                            : 'bg-white/5 border-white/10 text-[#B3B3B3] hover:border-white/20'
                        }`}
                      >
                        <span className="font-mono text-sm">
                          {participant.wallet_address === wallet.address
                            ? 'You'
                            : participant.wallet_address.slice(0, 16) + '...'}
                        </span>
                        {selectedParticipants.includes(participant.wallet_address) && (
                          <Check size={20} className="text-[#B11226]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-500/10 border border-green-500/50 rounded-lg text-green-500 text-sm flex items-center gap-2">
                <Check size={16} />
                Expense added successfully!
              </div>
            )}

            <Button
              onClick={addExpense}
              disabled={loading || success || !selectedGroup}
              className="w-full"
              size="lg"
            >
              {loading ? 'Adding...' : success ? 'Added!' : 'Add Expense'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
