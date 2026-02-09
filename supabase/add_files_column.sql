-- Add files column to challenges
alter table public.challenges 
add column if not exists files text[] default array[]::text[];
