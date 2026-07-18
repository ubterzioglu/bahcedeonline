-- Sosyal Medya Deposu: admin-only archive of uploaded images/videos with title, subtitle and a comment.
create table public.social_media_archive (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  comment text,
  media_path text not null,
  media_type text not null default 'image' check (media_type in ('image', 'video')),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.social_media_archive enable row level security;

-- Admin-only: no public select policy at all.
create policy "Staff can view social media archive"
  on public.social_media_archive for select to authenticated
  using (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'staff'));
create policy "Staff can insert social media archive"
  on public.social_media_archive for insert to authenticated
  with check (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'staff'));
create policy "Staff can update social media archive"
  on public.social_media_archive for update to authenticated
  using (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'staff'));
create policy "Admin can delete social media archive"
  on public.social_media_archive for delete to authenticated
  using (public.has_role(auth.uid(),'admin'));

create index social_media_archive_sort_idx on public.social_media_archive (sort_order);

create trigger social_media_archive_set_updated_at
  before update on public.social_media_archive
  for each row execute function public.set_updated_at();

-- Storage: dedicated PRIVATE bucket (unlike the shared public 'dbahce' bucket
-- used for home cards/menu images). Objects are never public — the admin API
-- serves them via short-lived signed URLs generated with the service-role key.
insert into storage.buckets (id, name, public)
values ('social-archive', 'social-archive', false)
on conflict (id) do nothing;

create policy "Staff upload social-archive media"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'social-archive'
    and (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'staff'))
  );

create policy "Staff read social-archive media"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'social-archive'
    and (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'staff'))
  );

create policy "Admin delete social-archive media"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'social-archive'
    and public.has_role(auth.uid(),'admin')
  );
