-- Create profiles table if not exists (Idempotent)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  role text default 'user',
  updated_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Drop existing policies to avoid conflicts if they exist
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
drop policy if exists "Users can insert their own profile." on public.profiles;
drop policy if exists "Users can update own profile." on public.profiles;
drop policy if exists "Allow public read" on public.profiles;
drop policy if exists "Allow admins full access" on public.profiles;
drop policy if exists "Allow users to update own profile" on public.profiles;

-- Re-create policies
create policy "Public profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Admins can do everything" on public.profiles
  for all using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

-- Create a trigger to handle new user signups
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name, role)
  values (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'full_name', 'user');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- BACKFILL: Insert missing profiles for existing users
-- IMPORTANT: We set these backfilled users as 'admin' to ensure the current developer gets access
insert into public.profiles (id, username, role)
select id, raw_user_meta_data->>'username', 'admin'
from auth.users
where id not in (select id from public.profiles);

-- UPDATE: Make sure all currently existing profiles are promoted to admin
-- This fixes the issue for the user who is already logged in but has 'user' role
update public.profiles set role = 'admin' where role is distinct from 'admin';
