
-- Roles
create type public.app_role as enum ('admin', 'staff');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null default 'staff',
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- Auto-assign first signed-up user as admin, others as staff
create or replace function public.handle_new_user_role()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  user_count int;
begin
  select count(*) into user_count from public.user_roles;
  if user_count = 0 then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  else
    insert into public.user_roles (user_id, role) values (new.id, 'staff');
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user_role();

create policy "Anyone authenticated can view roles"
  on public.user_roles for select to authenticated using (true);
create policy "Admins manage roles"
  on public.user_roles for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Menu categories enum
create type public.menu_category as enum ('biralar', 'sicak_icecekler', 'soguk_icecekler', 'saraplar', 'atistirmaliklar', 'kokteyller');

-- Menu items
create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null default 0,
  category menu_category not null,
  image_url text,
  tags text[] default '{}',
  details jsonb default '{}'::jsonb,
  is_available boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.menu_items enable row level security;

create policy "Public can view available items"
  on public.menu_items for select using (true);
create policy "Staff can insert"
  on public.menu_items for insert to authenticated
  with check (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'staff'));
create policy "Staff can update"
  on public.menu_items for update to authenticated
  using (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'staff'));
create policy "Admin can delete"
  on public.menu_items for delete to authenticated
  using (public.has_role(auth.uid(),'admin'));

-- Now playing (single row table)
create table public.now_playing (
  id int primary key default 1,
  track_title text,
  artist text,
  cover_url text,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);
alter table public.now_playing enable row level security;
insert into public.now_playing (id, track_title, artist) values (1, null, null);

create policy "Public can view now playing"
  on public.now_playing for select using (true);
create policy "Staff manages now playing"
  on public.now_playing for update to authenticated
  using (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'staff'));

-- Song requests
create type public.request_status as enum ('pending', 'approved', 'played', 'rejected');

create table public.song_requests (
  id uuid primary key default gen_random_uuid(),
  guest_name text,
  song_title text not null,
  artist text,
  message text,
  status request_status not null default 'pending',
  created_at timestamptz not null default now()
);
alter table public.song_requests enable row level security;

create policy "Anyone can submit a request"
  on public.song_requests for insert with check (true);
create policy "Staff can view requests"
  on public.song_requests for select to authenticated
  using (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'staff'));
create policy "Staff updates requests"
  on public.song_requests for update to authenticated
  using (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'staff'));
create policy "Admin deletes requests"
  on public.song_requests for delete to authenticated
  using (public.has_role(auth.uid(),'admin'));

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger menu_items_updated_at before update on public.menu_items
  for each row execute function public.set_updated_at();
create trigger now_playing_updated_at before update on public.now_playing
  for each row execute function public.set_updated_at();

-- Storage bucket for menu images
insert into storage.buckets (id, name, public) values ('menu-images', 'menu-images', true);

create policy "Public can view menu images"
  on storage.objects for select using (bucket_id = 'menu-images');
create policy "Staff can upload menu images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'menu-images' and (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'staff')));
create policy "Staff can update menu images"
  on storage.objects for update to authenticated
  using (bucket_id = 'menu-images' and (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'staff')));
create policy "Staff can delete menu images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'menu-images' and (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'staff')));
