import { useState } from 'react';
import { UserPlus, X, Check } from 'lucide-react';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useWallet } from '../context/WalletContext';
import { supabase } from '../lib/supabase';

export function CreateGroup() {
  const { wallet } = useWallet();
  const [groupName, setGroupName] = useState('');
  const [participantAddress, setParticipantAddress] = useState('');
  const [participants, setParticipants] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const addParticipant = () => {
    if (!participantAddress.trim()) return;

    if (participants.includes(participantAddress)) {
      setError('Address already added');
      return;
    }

    setParticipants([...participants, participantAddress]);
    setParticipantAddress('');
    setError('');
  };

  const removeParticipant = (address: string) => {
    setParticipants(participants.filter((p) => p !== address));
  };

  const createGroup = async () => {
    if (!wallet.connected) {
      setError('Please connect your wallet first');
      return;
    }

    if (!groupName.trim()) {
      setError('Group name is required');
      return;
    }

    if (participants.length === 0) {
      setError('Add at least one participant');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data: group, error: groupError } = await supabase
        .from('groups')
        .insert({
          name: groupName,
          created_by: wallet.address,
        })
        .select()
        .single();

      if (groupError) throw groupError;

      const allParticipants = [wallet.address, ...participants];
      const participantRecords = allParticipants.map((address) => ({
        group_id: group.id,
        wallet_address: address,
      }));

      const { error: participantsError } = await supabase
        .from('participants')
        .insert(participantRecords);

      if (participantsError) throw participantsError;

      setSuccess(true);
      setTimeout(() => {
        setGroupName('');
        setParticipants([]);
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError('Failed to create group. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Create Group</h1>
        <p className="text-[#B3B3B3]">Start a new expense-sharing group</p>
      </div>

      <div className="max-w-2xl">
        <Card className="p-8">
          <div className="space-y-6">
            <Input
              label="Group Name"
              placeholder="e.g., Weekend Trip, Roommates, Team Lunch"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />

            <div>
              <label className="block text-sm font-medium text-[#B3B3B3] mb-2">
                Add Participants
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Algorand wallet address"
                  value={participantAddress}
                  onChange={(e) => setParticipantAddress(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
                />
                <Button onClick={addParticipant} className="whitespace-nowrap">
                  <UserPlus size={20} />
                </Button>
              </div>
            </div>

            {participants.length > 0 && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#B3B3B3]">
                  Participants ({participants.length})
                </label>
                <div className="flex flex-wrap gap-2">
                  {participants.map((address) => (
                    <div
                      key={address}
                      className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg text-sm text-white"
                    >
                      <span className="font-mono truncate max-w-[200px]">
                        {address}
                      </span>
                      <button
                        onClick={() => removeParticipant(address)}
                        className="text-white/60 hover:text-white transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-500/10 border border-green-500/50 rounded-lg text-green-500 text-sm flex items-center gap-2">
                <Check size={16} />
                Group created successfully!
              </div>
            )}

            <Button
              onClick={createGroup}
              disabled={loading || success}
              className="w-full"
              size="lg"
            >
              {loading ? 'Creating...' : success ? 'Created!' : 'Create Group'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
