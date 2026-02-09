-- Enable Storage if not already available (usually enabled by default)
-- Create a public bucket for challenge files
insert into storage.buckets (id, name, public)
values ('challenge-files', 'challenge-files', true)
on conflict (id) do nothing;

-- Policy: Anyone can view/download files
create policy "Public View"
on storage.objects for select
using ( bucket_id = 'challenge-files' );

-- Policy: Only Admins (authenticated users for now to keep it simple, or check profile role) can upload
-- Note: For simplicity in this script, we allow authenticated users to upload. 
-- Ideally, you'd check the profiles table for role='admin' but storage policies can be tricky with joins.
create policy "Authenticated Upload"
on storage.objects for insert
with check ( bucket_id = 'challenge-files' and auth.role() = 'authenticated' );

create policy "Authenticated Delete"
on storage.objects for delete
using ( bucket_id = 'challenge-files' and auth.role() = 'authenticated' );
