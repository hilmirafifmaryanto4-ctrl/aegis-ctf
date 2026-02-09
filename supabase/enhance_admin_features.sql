-- 1. Challenge Visibility
alter table public.challenges 
add column if not exists state text default 'visible'; -- 'visible' or 'hidden'

-- 2. Challenge Max Attempts (optional, good for brute-force prevention)
alter table public.challenges 
add column if not exists max_attempts integer default 0; -- 0 means infinite

-- 3. RLS Updates for Visibility
-- Drop existing policy if it exists (to be safe, we'll just create a new one or replace)
drop policy if exists "Public challenges view" on public.challenges;

-- Everyone can see visible challenges
create policy "Public challenges view" 
on public.challenges for select 
using (state = 'visible');

-- Admins can see all challenges (override or additional policy)
create policy "Admin challenges view all" 
on public.challenges for select 
to authenticated 
using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- 4. Solves Management
-- Ensure admins can delete solves (for cleanup/cheating)
create policy "Admin delete solves" 
on public.solves for delete 
to authenticated 
using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
