-- Google / Tripadvisor ratings shown in JSON-LD and admin panel
create table public.site_ratings (
  id int primary key default 1,
  google_rating numeric(2,1),
  google_review_count int,
  tripadvisor_rating numeric(2,1),
  tripadvisor_review_count int,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);
alter table public.site_ratings enable row level security;
insert into public.site_ratings
  (id, google_rating, google_review_count, tripadvisor_rating, tripadvisor_review_count)
values (1, 4.7, 288, 4.9, 103);

create policy "Public can view site ratings"
  on public.site_ratings for select using (true);
create policy "Staff manages site ratings"
  on public.site_ratings for update to authenticated
  using (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'staff'));

create trigger site_ratings_updated_at before update on public.site_ratings
  for each row execute function public.set_updated_at();
