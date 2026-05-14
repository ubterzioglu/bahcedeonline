alter table public.menu_items
  alter column category type text using category::text;

update public.menu_items
set category = case category
  when 'biralar' then 'beers'
  when 'soguk_icecekler' then 'non_alcoholics'
  when 'sicak_icecekler' then 'coffee'
  when 'saraplar' then 'wines'
  when 'kokteyller' then 'cocktails'
  when 'atistirmaliklar' then 'bar_bites'
  else category
end;

drop type if exists public.menu_category;
