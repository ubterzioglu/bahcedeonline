-- Add optional image to each weekly schedule entry
alter table public.weekly_schedule
  add column image_url text;
