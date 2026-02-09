-- Upgrade Schema for CTFd-like features

-- 1. Challenges Enhancements (Dynamic Scoring)
alter table public.challenges 
add column if not exists type text default 'standard', -- 'standard' or 'dynamic'
add column if not exists initial_points integer default 100,
add column if not exists minimum_points integer default 100,
add column if not exists decay integer default 0;

-- 2. Hints System
create table if not exists public.hints (
  id uuid default gen_random_uuid() primary key,
  challenge_id uuid references public.challenges(id) on delete cascade,
  content text not null,
  cost integer default 0,
  created_at timestamptz default now()
);

-- Track unlocked hints
create table if not exists public.hint_unlocks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  hint_id uuid references public.hints(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, hint_id)
);

-- 3. Announcements
create table if not exists public.announcements (
  id uuid default gen_random_uuid() primary key,
  content text not null,
  created_at timestamptz default now()
);

-- 4. Enable RLS
alter table public.hints enable row level security;
alter table public.hint_unlocks enable row level security;
alter table public.announcements enable row level security;

-- Policies for Hints
create policy "Public hints view" on public.hints for select to authenticated using (true);
create policy "Admin hints manage" on public.hints for all to authenticated using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Policies for Hint Unlocks
create policy "Users can see their unlocked hints" on public.hint_unlocks for select to authenticated using (user_id = auth.uid());
create policy "Users can unlock hints" on public.hint_unlocks for insert to authenticated with check (user_id = auth.uid());

-- Policies for Announcements
create policy "Public announcements view" on public.announcements for select to authenticated using (true);
create policy "Admin announcements manage" on public.announcements for all to authenticated using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
