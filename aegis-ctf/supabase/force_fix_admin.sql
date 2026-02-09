-- FIX: Restore missing profile and force Admin role
-- Ini akan memperbaiki masalah "Success. No rows returned" dengan membuat ulang profile yang hilang

-- 1. Insert/Update Profile untuk email Anda
insert into public.profiles (id, username, full_name, avatar_url, role)
select 
  id, 
  -- Gunakan username dari metadata, atau default ke 'admin' jika kosong
  coalesce(raw_user_meta_data->>'username', 'admin_user'),
  coalesce(raw_user_meta_data->>'full_name', 'Admin'),
  raw_user_meta_data->>'avatar_url',
  'admin' -- Force role jadi admin
from auth.users
where email = 'hilmirafifmaryanto4@gmail.com' -- Email sesuai screenshot Profile
on conflict (id) do update
set role = 'admin'; -- Jika profile sudah ada, update jadi admin

-- 2. Tampilkan Hasil (Harus muncul data)
select * from public.profiles 
where id = (select id from auth.users where email = 'hilmirafifmaryanto4@gmail.com');
