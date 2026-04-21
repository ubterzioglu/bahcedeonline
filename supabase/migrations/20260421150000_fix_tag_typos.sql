-- Fix common Turkish tag typos that have been entered via admin over time.
-- Case-insensitive replacement inside menu_items.tags arrays.

create or replace function public._fix_tag_typo(input_tags text[])
returns text[]
language sql immutable
as $$
  select array(
    select case
      when lower(tag) in ('ferlatıcı','ferlatici','ferahlatici') then 'ferahlatıcı'
      when lower(tag) in ('populer','popular') then 'popüler'
      else tag
    end
    from unnest(coalesce(input_tags, array[]::text[])) as tag
  )
$$;

-- Apply to TR tags
update public.menu_items
  set tags = public._fix_tag_typo(tags)
  where exists (
    select 1 from unnest(coalesce(tags, array[]::text[])) as t
    where lower(t) in ('ferlatıcı','ferlatici','ferahlatici','populer','popular')
  );

-- EN equivalents (if users mistyped English tags too)
create or replace function public._fix_tag_typo_en(input_tags text[])
returns text[]
language sql immutable
as $$
  select array(
    select case
      when lower(tag) = 'refreshin' then 'refreshing'
      when lower(tag) = 'populer' then 'popular'
      else tag
    end
    from unnest(coalesce(input_tags, array[]::text[])) as tag
  )
$$;

update public.menu_items
  set tags_en = public._fix_tag_typo_en(tags_en)
  where exists (
    select 1 from unnest(coalesce(tags_en, array[]::text[])) as t
    where lower(t) in ('refreshin','populer')
  );

-- Also fix any occurrences inside description fields (case-preserving simple replace).
update public.menu_items
  set description = regexp_replace(description, 'ferlat(ı|i)c(ı|i)', 'ferahlatıcı', 'gi')
  where description ~* 'ferlat(ı|i)c(ı|i)';

update public.menu_items
  set description = regexp_replace(description, 'populer', 'popüler', 'gi')
  where description ~* 'populer';

drop function public._fix_tag_typo(text[]);
drop function public._fix_tag_typo_en(text[]);
