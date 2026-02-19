/*
  # SplitChain Database Schema

  1. New Tables
    - `groups`
      - `id` (uuid, primary key)
      - `name` (text)
      - `created_by` (text, wallet address)
      - `created_at` (timestamptz)
    
    - `participants`
      - `id` (uuid, primary key)
      - `group_id` (uuid, foreign key)
      - `wallet_address` (text)
      - `name` (text, optional display name)
      - `joined_at` (timestamptz)
    
    - `expenses`
      - `id` (uuid, primary key)
      - `group_id` (uuid, foreign key)
      - `description` (text)
      - `amount` (numeric, in ALGO)
      - `paid_by` (text, wallet address)
      - `split_method` (text, 'equal' or 'custom')
      - `created_at` (timestamptz)
    
    - `expense_splits`
      - `id` (uuid, primary key)
      - `expense_id` (uuid, foreign key)
      - `wallet_address` (text)
      - `amount` (numeric)
    
    - `settlements`
      - `id` (uuid, primary key)
      - `group_id` (uuid, foreign key)
      - `from_wallet` (text)
      - `to_wallet` (text)
      - `amount` (numeric)
      - `transaction_id` (text, nullable)
      - `status` (text, 'pending' or 'completed')
      - `settled_at` (timestamptz, nullable)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (since this is a demo with wallet-based auth)
*/

-- Groups table
CREATE TABLE IF NOT EXISTS groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view groups"
  ON groups FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can create groups"
  ON groups FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Participants table
CREATE TABLE IF NOT EXISTS participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
  wallet_address text NOT NULL,
  name text DEFAULT '',
  joined_at timestamptz DEFAULT now(),
  UNIQUE(group_id, wallet_address)
);

ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view participants"
  ON participants FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can add participants"
  ON participants FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
  description text NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  paid_by text NOT NULL,
  split_method text DEFAULT 'equal' CHECK (split_method IN ('equal', 'custom')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view expenses"
  ON expenses FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can create expenses"
  ON expenses FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Expense splits table
CREATE TABLE IF NOT EXISTS expense_splits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id uuid REFERENCES expenses(id) ON DELETE CASCADE NOT NULL,
  wallet_address text NOT NULL,
  amount numeric NOT NULL CHECK (amount >= 0)
);

ALTER TABLE expense_splits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view expense splits"
  ON expense_splits FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can create expense splits"
  ON expense_splits FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Settlements table
CREATE TABLE IF NOT EXISTS settlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
  from_wallet text NOT NULL,
  to_wallet text NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  transaction_id text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  settled_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view settlements"
  ON settlements FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can create settlements"
  ON settlements FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update settlements"
  ON settlements FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_participants_group_id ON participants(group_id);
CREATE INDEX IF NOT EXISTS idx_expenses_group_id ON expenses(group_id);
CREATE INDEX IF NOT EXISTS idx_expense_splits_expense_id ON expense_splits(expense_id);
CREATE INDEX IF NOT EXISTS idx_settlements_group_id ON settlements(group_id);
CREATE INDEX IF NOT EXISTS idx_settlements_status ON settlements(status);
