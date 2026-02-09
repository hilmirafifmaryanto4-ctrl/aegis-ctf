-- 1. Cek dulu email yang terdaftar di sistem untuk memastikan tidak ada typo lagi
select email, id from auth.users;

-- 2. Update role menjadi admin untuk email yang BENAR (hilmirafifmaryanto4@gmail.com)
update public.profiles
set role = 'admin'
where id in (
  select id from auth.users where email = 'hilmirafifmaryanto4@gmail.com'
);

-- 3. Verifikasi apakah update berhasil
select * from public.profiles where role = 'admin';
