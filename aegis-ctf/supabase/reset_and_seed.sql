-- DANGER: This will reset your database tables related to CTF to fix the schema errors
-- Drop tables if they exist to start fresh and avoid conflicts
drop table if exists public.solves cascade;
drop table if exists public.submissions cascade;
drop table if exists public.challenges cascade;
drop table if exists public.profiles cascade;

-- 1. Create Profiles Table
create table public.profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  role text default 'user',
  updated_at timestamp with time zone,
  constraint username_length check (char_length(username) >= 3)
);

-- 2. Create Challenges Table
create table public.challenges (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  category text not null,
  description text not null,
  points int default 100,
  flag text not null,
  files text[],
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Submissions Table
create table public.submissions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  challenge_id uuid references public.challenges not null,
  flag_submitted text not null,
  is_correct boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Create Solves Table
create table public.solves (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  challenge_id uuid references public.challenges not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, challenge_id)
);

-- 5. Enable RLS
alter table public.profiles enable row level security;
alter table public.challenges enable row level security;
alter table public.submissions enable row level security;
alter table public.solves enable row level security;

-- 6. Policies

-- Profiles
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- Challenges
create policy "Public view active challenges" on public.challenges for select using (is_active = true);
create policy "Admins can manage challenges" on public.challenges for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);

-- Submissions
create policy "Users submit own flags" on public.submissions for insert with check (auth.uid() = user_id);
create policy "Users view own submissions" on public.submissions for select using (auth.uid() = user_id);

-- Solves
create policy "Public view solves" on public.solves for select using (true);

-- 7. Functions & Triggers

-- Handle New User (Auto Profile)
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id, 
    new.raw_user_meta_data->>'username', 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Submit Flag Function
create or replace function submit_flag(
  p_challenge_id uuid,
  p_flag text
) returns boolean as $$
declare
  v_correct_flag text;
  v_is_correct boolean;
  v_user_id uuid;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  if exists (select 1 from public.solves where user_id = v_user_id and challenge_id = p_challenge_id) then
    return true; 
  end if;

  select flag into v_correct_flag from public.challenges where id = p_challenge_id;
  v_is_correct := (v_correct_flag = p_flag);

  insert into public.submissions (user_id, challenge_id, flag_submitted, is_correct)
  values (v_user_id, p_challenge_id, p_flag, v_is_correct);

  if v_is_correct then
    insert into public.solves (user_id, challenge_id)
    values (v_user_id, p_challenge_id);
  end if;

  return v_is_correct;
end;
$$ language plpgsql security definer;

-- 8. Seed Data (Insert Challenges)
insert into public.challenges (title, category, description, points, flag, is_active)
values 
('Sanity Check', 'Misc', 'Welcome to Aegis CTF! The flag is right here: `AEGIS{welcome_to_the_game}`', 10, 'AEGIS{welcome_to_the_game}', true),
('Base64 Basic', 'Crypto', 'Can you decode this? `QUVHSVN7YmFzZTY0X2lzX25vdF9lbmNyeXB0aW9ufQ==`', 50, 'AEGIS{base64_is_not_encryption}', true),
('Inspect Element', 'Web', 'The flag is hidden in the HTML source code of this page (not really, but imagine it is). Flag: `AEGIS{html_hero}`', 50, 'AEGIS{html_hero}', true),
('Buffer Overflow 101', 'Pwn', 'Just a classic buffer overflow. Flag is `AEGIS{stack_smashing_detected}`', 100, 'AEGIS{stack_smashing_detected}', true),
('Reverse Me', 'Reverse', 'If you reverse this string "gnirts_desrever", what do you get? Flag: `AEGIS{reversed_string}`', 100, 'AEGIS{reversed_string}', true);

-- 9. Make Admin (Update your specific email)
update public.profiles
set role = 'admin'
where id in (
  select id from auth.users where email = 'hilmirafifmaryanto4@gmail.com'
);
