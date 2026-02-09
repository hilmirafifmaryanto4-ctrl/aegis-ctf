-- RPC Functions for CTFd features

-- 1. Unlock Hint
create or replace function public.unlock_hint(p_hint_id uuid)
returns boolean
language plpgsql
security definer
as $$
declare
  v_cost int;
  v_user_id uuid := auth.uid();
  v_user_score int;
begin
  -- Check if already unlocked
  if exists (select 1 from public.hint_unlocks where user_id = v_user_id and hint_id = p_hint_id) then
    return true;
  end if;

  -- Get hint cost
  select cost into v_cost from public.hints where id = p_hint_id;
  if not found then
    raise exception 'Hint not found';
  end if;

  -- Insert unlock record
  insert into public.hint_unlocks (user_id, hint_id)
  values (v_user_id, p_hint_id);

  return true;
end;
$$;

-- 2. Get Solves with First Blood info (helper view or function)
-- Actually, we can just query solves ordered by created_at for a challenge.

-- 3. Calculate Score (Dynamic)
-- This is complex. For now, let's just stick to static points but allow admins to SET them. 
-- True dynamic scoring requires a trigger or scheduled job to update challenge points based on solve count.
-- Let's add a simple trigger to update points on solve if the challenge is dynamic.

create or replace function public.update_challenge_points()
returns trigger
language plpgsql
security definer
as $$
declare
  v_challenge_id uuid;
  v_solve_count int;
  v_initial int;
  v_minimum int;
  v_decay int;
  v_new_points int;
  v_type text;
begin
  v_challenge_id := new.challenge_id;
  
  select type, initial_points, minimum_points, decay 
  into v_type, v_initial, v_minimum, v_decay
  from public.challenges where id = v_challenge_id;

  if v_type = 'dynamic' and v_decay > 0 then
    select count(*) into v_solve_count from public.solves where challenge_id = v_challenge_id;
    
    -- Linear decay formula (simplified): Initial - (Decay * Solves)
    -- Or standard CTFd formula: 
    -- (((Minimum - Initial) / (Decay^2)) * (Solves^2)) + Initial  (Logarithmic/Exponential)
    -- Let's stick to a simpler Linear one for this MVP: 
    -- Points = Initial - (SolveCount * Decay). Clamped at Minimum.
    
    v_new_points := v_initial - (v_solve_count * v_decay);
    if v_new_points < v_minimum then
      v_new_points := v_minimum;
    end if;

    update public.challenges set points = v_new_points where id = v_challenge_id;
  end if;

  return new;
end;
$$;

create trigger trigger_update_points
after insert on public.solves
for each row
execute function public.update_challenge_points();
