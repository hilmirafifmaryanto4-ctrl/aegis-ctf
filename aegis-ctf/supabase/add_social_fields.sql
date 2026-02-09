-- Add social fields to profiles
alter table public.profiles 
add column if not exists website text,
add column if not exists github text,
add column if not exists twitter text;
