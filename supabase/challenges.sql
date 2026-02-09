-- Create Challenges Table
create table if not exists public.challenges (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  category text not null, -- 'Web', 'Crypto', 'Pwn', 'Forensics', 'Reverse', 'Misc'
  description text not null,
  points int default 100,
  flag text not null,
  files text[], -- Array of file URLs
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Submissions Table (History of attempts)
create table if not exists public.submissions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  challenge_id uuid references public.challenges not null,
  flag_submitted text not null,
  is_correct boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Solves Table (Unique solves per user per challenge)
-- This is useful for Scoreboard calculation
create table if not exists public.solves (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  challenge_id uuid references public.challenges not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, challenge_id) -- Prevent duplicate points
);

-- Enable RLS
alter table public.challenges enable row level security;
alter table public.submissions enable row level security;
alter table public.solves enable row level security;

-- Policies
-- Challenges: Everyone can read active challenges
create policy "Public view active challenges" on public.challenges 
  for select using (is_active = true);

-- Submissions: Users can create, only view their own
create policy "Users submit own flags" on public.submissions 
  for insert with check (auth.uid() = user_id);
create policy "Users view own submissions" on public.submissions 
  for select using (auth.uid() = user_id);

-- Solves: Public can view (for scoreboard), System inserts
create policy "Public view solves" on public.solves 
  for select using (true);
  
-- Function to handle flag submission
create or replace function submit_flag(
  p_challenge_id uuid,
  p_flag text
) returns boolean as $$
declare
  v_correct_flag text;
  v_is_correct boolean;
  v_user_id uuid;
begin
  -- Get current user
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Check if already solved
  if exists (select 1 from public.solves where user_id = v_user_id and challenge_id = p_challenge_id) then
    return true; -- Already solved
  end if;

  -- Get correct flag
  select flag into v_correct_flag from public.challenges where id = p_challenge_id;
  
  -- Check flag
  v_is_correct := (v_correct_flag = p_flag);

  -- Record submission
  insert into public.submissions (user_id, challenge_id, flag_submitted, is_correct)
  values (v_user_id, p_challenge_id, p_flag, v_is_correct);

  -- If correct, record solve
  if v_is_correct then
    insert into public.solves (user_id, challenge_id)
    values (v_user_id, p_challenge_id);
  end if;

  return v_is_correct;
end;
$$ language plpgsql security definer;
