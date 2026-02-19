export interface Group {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
}

export interface Participant {
  id: string;
  group_id: string;
  wallet_address: string;
  name: string;
  joined_at: string;
}

export interface Expense {
  id: string;
  group_id: string;
  description: string;
  amount: number;
  paid_by: string;
  split_method: 'equal' | 'custom';
  created_at: string;
}

export interface ExpenseSplit {
  id: string;
  expense_id: string;
  wallet_address: string;
  amount: number;
}

export interface Settlement {
  id: string;
  group_id: string;
  from_wallet: string;
  to_wallet: string;
  amount: number;
  transaction_id: string | null;
  status: 'pending' | 'completed';
  settled_at: string | null;
  created_at: string;
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  balance: number;
}
