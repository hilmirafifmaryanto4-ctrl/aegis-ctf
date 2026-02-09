-- Enable Realtime for all tables
alter publication supabase_realtime add table challenges, solves, profiles, announcements;

-- Fix RLS for Solves (Allow Admins and Public to see)
alter table solves enable row level security;
create policy "Allow public read access" on solves for select using (true);
create policy "Allow admins full access" on solves for all using (
  (select role from profiles where id = auth.uid()) = 'admin'
);

-- Fix RLS for Challenges
alter table challenges enable row level security;
create policy "Allow public read visible" on challenges for select using (state = 'visible');
create policy "Allow admins full access" on challenges for all using (
  (select role from profiles where id = auth.uid()) = 'admin'
);

-- Fix RLS for Announcements
alter table announcements enable row level security;
create policy "Allow public read" on announcements for select using (true);
create policy "Allow admins full access" on announcements for all using (
  (select role from profiles where id = auth.uid()) = 'admin'
);

-- Fix RLS for Profiles
alter table profiles enable row level security;
create policy "Allow public read" on profiles for select using (true);
create policy "Allow admins full access" on profiles for all using (
  (select role from profiles where id = auth.uid()) = 'admin'
);
create policy "Allow users to update own profile" on profiles for update using (
  auth.uid() = id
);
