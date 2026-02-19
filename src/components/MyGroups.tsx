import { useEffect, useState } from 'react';
import { Users, Calendar } from 'lucide-react';
import { Card } from './ui/Card';
import { supabase } from '../lib/supabase';
import { useWallet } from '../context/WalletContext';
import { Group, Participant } from '../types';

export function MyGroups() {
  const { wallet } = useWallet();
  const [groups, setGroups] = useState<(Group & { participants: Participant[] })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGroups();
  }, [wallet.address]);

  const loadGroups = async () => {
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

      const { data: groupsData } = await supabase
        .from('groups')
        .select('*')
        .in('id', groupIds)
        .order('created_at', { ascending: false });

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
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#B3B3B3]">Loading groups...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">My Groups</h1>
        <p className="text-[#B3B3B3]">Manage your expense-sharing groups</p>
      </div>

      {groups.length === 0 ? (
        <Card className="p-12 text-center">
          <Users size={48} className="mx-auto text-[#B3B3B3] mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No groups yet</h3>
          <p className="text-[#B3B3B3]">Create a group to start sharing expenses</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <Card key={group.id} hover className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{group.name}</h3>
                <div className="flex items-center gap-1 text-[#B3B3B3] text-sm">
                  <Users size={16} />
                  <span>{group.participants.length}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-[#B3B3B3]">
                  <Calendar size={16} />
                  <span>Created {new Date(group.created_at).toLocaleDateString()}</span>
                </div>

                <div className="pt-3 border-t border-white/10">
                  <div className="text-xs text-[#B3B3B3] mb-2">Members</div>
                  <div className="flex flex-wrap gap-1">
                    {group.participants.slice(0, 3).map((participant, i) => (
                      <div
                        key={participant.id}
                        className="px-2 py-1 bg-white/5 rounded text-xs font-mono text-white truncate max-w-[80px]"
                      >
                        {participant.wallet_address.slice(0, 8)}...
                      </div>
                    ))}
                    {group.participants.length > 3 && (
                      <div className="px-2 py-1 bg-white/5 rounded text-xs text-[#B3B3B3]">
                        +{group.participants.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
