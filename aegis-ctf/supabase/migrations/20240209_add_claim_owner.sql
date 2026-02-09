-- Create a function to allow the owner to claim admin access
create or replace function public.claim_owner(secret_key text)
returns boolean as $$
declare
  user_id uuid;
begin
  -- Simple hardcoded secret for recovery (The user is the developer)
  if secret_key != 'AEGIS_OWNER_2026' then
    return false;
  end if;

  user_id := auth.uid();
  
  if user_id is null then
    return false;
  end if;

  -- Ensure profile exists
  insert into public.profiles (id, username, role)
  values (user_id, 'Owner', 'admin')
  on conflict (id) do update
  set role = 'admin';

  return true;
end;
$$ language plpgsql security definer;

-- Grant execute permission to authenticated users
grant execute on function public.claim_owner to authenticated;
