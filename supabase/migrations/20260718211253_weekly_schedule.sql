-- Weekly live music program (Canlı Müzik Programı)
create table public.weekly_schedule (
  id uuid primary key default gen_random_uuid(),
  day_of_week int not null check (day_of_week between 0 and 6), -- 0 = Sunday .. 6 = Saturday
  title text not null,
  title_en text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.weekly_schedule enable row level security;

create policy "Public can view active weekly schedule"
  on public.weekly_schedule for select using (is_active = true);
create policy "Staff can insert weekly schedule"
  on public.weekly_schedule for insert to authenticated
  with check (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'staff'));
create policy "Staff can update weekly schedule"
  on public.weekly_schedule for update to authenticated
  using (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'staff'));
create policy "Admin can delete weekly schedule"
  on public.weekly_schedule for delete to authenticated
  using (public.has_role(auth.uid(),'admin'));

create index weekly_schedule_day_idx on public.weekly_schedule (day_of_week);

create trigger weekly_schedule_set_updated_at
  before update on public.weekly_schedule
  for each row execute function public.set_updated_at();

-- Seed: current live music program
insert into public.weekly_schedule (day_of_week, title, title_en, is_active) values
  (1, 'M&B Live Vocal & DJ Set', 'M&B Live Vocal & DJ Set', true),
  (2, 'Dilara Tanbay Trio', 'Dilara Tanbay Trio', true),
  (3, 'Blues on Wheels', 'Blues on Wheels', true),
  (4, 'Dilara & Yiğit', 'Dilara & Yiğit', true),
  (5, 'Goodfellas', 'Goodfellas', true),
  (6, 'Blues on Wheels', 'Blues on Wheels', true);
