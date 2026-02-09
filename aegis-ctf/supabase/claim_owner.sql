drop function if exists public.claim_owner(text);

create or replace function public.claim_owner(secret_key text)
returns void
language plpgsql
security definer
as $$
begin
  if secret_key = 'AEGIS_OWNER_2026' then
    update public.profiles
    set role = 'admin'
    where id = auth.uid();
  else
    raise exception 'Invalid secret key';
  end if;
end;
$$;
