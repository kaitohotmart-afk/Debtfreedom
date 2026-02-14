-- Debt Freedom Reset™ - Database Schema for Checkout Flow
-- Run this in your Supabase SQL Editor

-- Add payment-related columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS payment_verified_at TIMESTAMPTZ;

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'ZAR',
  payment_gateway TEXT DEFAULT 'payjsr',
  transaction_id TEXT UNIQUE,
  payjsr_order_id TEXT,
  status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  webhook_received_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only view their own payments
CREATE POLICY "Users can view own payments" 
ON payments FOR SELECT 
USING (auth.uid() = user_id);

-- RLS Policy: Only authenticated users can insert payments (via webhook)
CREATE POLICY "System can insert payments" 
ON payments FOR INSERT 
WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_profiles_payment_status ON profiles(payment_status);

-- Create user_progress table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  current_day INTEGER DEFAULT 1,
  current_week INTEGER DEFAULT 1,
  streak_days INTEGER DEFAULT 0,
  last_active_date DATE,
  completed_weeks JSONB DEFAULT '[]',
  badges_earned JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on user_progress
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only view/update their own progress
CREATE POLICY "Users can view own progress" 
ON user_progress FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" 
ON user_progress FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert progress" 
ON user_progress FOR INSERT 
WITH CHECK (true);
