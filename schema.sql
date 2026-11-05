-- ====================================================================
-- Supabase PostgreSQL Schema & Row Level Security (RLS) Policies
-- ====================================================================
-- Run this script in the Supabase Dashboard: SQL Editor -> New Query -> Run
-- ====================================================================

-- 1. Enable UUID generator
create extension if not exists "uuid-ossp";

-- 2. Create the transactions table
create table if not exists public.transactions (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    type text not null check (type in ('Income', 'Expense')),
    amount numeric(12, 2) not null check (amount > 0),
    category text not null,
    description text default '',
    date date not null default current_date,
    created_at timestamptz not null default timezone('utc'::text, now())
);

-- 3. Create performance indexes
create index if not exists idx_transactions_user_id 
    on public.transactions(user_id);

create index if not exists idx_transactions_user_date 
    on public.transactions(user_id, date desc);

-- 4. Enable Row Level Security (RLS)
alter table public.transactions enable row level security;

-- 5. Drop existing policies if re-running script
drop policy if exists "Users can view own transactions" on public.transactions;
drop policy if exists "Users can insert own transactions" on public.transactions;
drop policy if exists "Users can update own transactions" on public.transactions;
drop policy if exists "Users can delete own transactions" on public.transactions;

-- 6. RLS Policies: Ensure users can ONLY access their own records
create policy "Users can view own transactions"
    on public.transactions for select
    using (auth.uid() = user_id);

create policy "Users can insert own transactions"
    on public.transactions for insert
    with check (auth.uid() = user_id);

create policy "Users can update own transactions"
    on public.transactions for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete own transactions"
    on public.transactions for delete
    using (auth.uid() = user_id);
