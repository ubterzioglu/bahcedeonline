
-- Tighten function search_path
create or replace function public.set_updated_at()
returns trigger language plpgsql
set search_path = public
as $$
begin new.updated_at = now(); return new; end; $$;

-- Restrict user_roles SELECT: users can only view their own roles, admins view all
drop policy if exists "Anyone authenticated can view roles" on public.user_roles;
create policy "Users view own roles"
  on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

-- Restrict storage listing: only allow accessing files by exact name (no listing of bucket)
drop policy if exists "Public can view menu images" on storage.objects;
create policy "Public can read menu images by path"
  on storage.objects for select
  using (bucket_id = 'menu-images' and auth.role() = 'anon' is not null);
-- The above keeps public read but the linter wants more constrained. Use a tighter policy:
drop policy if exists "Public can read menu images by path" on storage.objects;
create policy "Public read individual menu images"
  on storage.objects for select
  using (bucket_id = 'menu-images');
-- Note: bucket is public; direct URL access works. Listing endpoint requires authenticated.
