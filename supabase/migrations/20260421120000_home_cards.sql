-- Home page cards (story strip + feature cards on homepage)
create table public.home_cards (
  id uuid primary key default gen_random_uuid(),
  script_label text not null default '',
  title text not null,
  body text not null default '',
  image_url text,
  cta_label text not null default 'Keşfet',
  link_to text not null default '/',
  link_type text not null default 'internal' check (link_type in ('internal','external')),
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.home_cards enable row level security;

create policy "Public can view published home cards"
  on public.home_cards for select using (is_published = true);
create policy "Staff can insert home cards"
  on public.home_cards for insert to authenticated
  with check (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'staff'));
create policy "Staff can update home cards"
  on public.home_cards for update to authenticated
  using (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'staff'));
create policy "Admin can delete home cards"
  on public.home_cards for delete to authenticated
  using (public.has_role(auth.uid(),'admin'));

create index home_cards_published_sort_idx on public.home_cards (is_published, sort_order);

create trigger home_cards_set_updated_at
  before update on public.home_cards
  for each row execute function public.set_updated_at();

-- Seed: preserve existing hardcoded home cards + add Dragoman Diving & Outdoor at order 20
insert into public.home_cards
  (script_label, title, body, image_url, cta_label, link_to, link_type, sort_order, is_published)
values
  (
    'bizim hikâyemiz',
    'Bahçede bir ömür yaz',
    'Kaş''ın masmavi suyunu içeride değil, dışarıda yaşıyoruz. Palmiyelerin altında, fenerlerin ışığında uzun yaz akşamları kuruyoruz.',
    '/turtle.jpg',
    'Devamını oku',
    '/hakkimizda',
    'internal',
    10,
    true
  ),
  (
    'dalış & açık hava',
    'Dragoman Diving & Outdoor',
    'Kaş''ın berrak sularında dalış rotaları, kano, trekking ve açık hava deneyimleri — Bahçe''nin kardeş markasıyla.',
    '/ofis-foto.jpg',
    'Keşfet',
    '/dragomando',
    'internal',
    20,
    true
  ),
  (
    'kaş rehberi',
    'Kasguide.de',
    'Kaş''ın en kapsamlı rehberi. Restoranlar, plajlar, aktiviteler ve daha fazlası.',
    '/kasguidemenugorsel.jpg',
    'Keşfet',
    '/kasguide',
    'internal',
    30,
    true
  );

-- Storage bucket: shared 'dbahce' bucket (menu + home-cards + other images under path prefixes)
insert into storage.buckets (id, name, public)
values ('dbahce', 'dbahce', true)
on conflict (id) do nothing;

create policy "Public read dbahce images"
  on storage.objects for select
  using (bucket_id = 'dbahce');

create policy "Staff upload dbahce images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'dbahce' and (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'staff')));

create policy "Staff update dbahce images"
  on storage.objects for update to authenticated
  using (bucket_id = 'dbahce' and (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'staff')));

create policy "Admin delete dbahce images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'dbahce' and public.has_role(auth.uid(),'admin'));
