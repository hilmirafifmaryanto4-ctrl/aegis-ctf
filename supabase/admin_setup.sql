-- 1. Add 'role' column to profiles if it doesn't exist
alter table public.profiles 
add column if not exists role text default 'user';

-- 2. Create a policy to allow Admins to manage challenges
-- First, drop existing policies if any to avoid conflicts (optional but safer)
drop policy if exists "Admins can manage challenges" on public.challenges;

-- Policy: Admins can Insert, Update, Delete
create policy "Admins can manage challenges" on public.challenges
  for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- 3. Update a specific user to be Admin (REPLACE WITH YOUR EMAIL)
-- Note: This requires the user to have signed in at least once so they are in the profiles table.
update public.profiles
set role = 'admin'
where id in (
  select id from auth.users where email = 'hilmirafifmaryanto4@gmail.com'
);
