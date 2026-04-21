-- Re-seed home_cards if any of the three canonical rows were deleted.
-- Idempotent: only inserts rows that don't already exist (matched by title).

insert into public.home_cards
  (script_label, script_label_en, title, title_en, body, body_en,
   image_url, cta_label, cta_label_en, link_to, link_type, sort_order, is_published)
select *
from (values
  (
    'bizim hikâyemiz', 'our story',
    'Bahçede bir ömür yaz', 'A summer for a lifetime in the garden',
    'Kaş''ın masmavi suyunu içeride değil, dışarıda yaşıyoruz. Palmiyelerin altında, fenerlerin ışığında uzun yaz akşamları kuruyoruz.',
    'We don''t live Kaş''s turquoise water indoors — we live it outside. Under palms, in lantern light, we gather long summer evenings.',
    '/turtle.jpg',
    'Devamını oku', 'Read more',
    '/hakkimizda', 'internal', 10, true
  ),
  (
    'dalış & açık hava', 'diving & outdoor',
    'Dragoman Diving & Outdoor', 'Dragoman Diving & Outdoor',
    'Kaş''ın berrak sularında dalış rotaları, kano, trekking ve açık hava deneyimleri — Bahçe''nin kardeş markasıyla.',
    'Diving routes, kayaking, trekking and outdoor experiences in Kaş''s crystal-clear waters — with Bahçe''s sister brand.',
    '/ofis-foto.jpg',
    'Keşfet', 'Discover',
    '/dragomando', 'internal', 20, true
  ),
  (
    'kaş rehberi', 'kaş guide',
    'Kasguide.de', 'Kasguide.de',
    'Kaş''ın en kapsamlı rehberi. Restoranlar, plajlar, aktiviteler ve daha fazlası.',
    'The most comprehensive guide to Kaş. Restaurants, beaches, activities and more.',
    '/kasguidemenugorsel.jpg',
    'Keşfet', 'Discover',
    '/kasguide', 'internal', 30, true
  )
) as seed(script_label, script_label_en, title, title_en, body, body_en,
          image_url, cta_label, cta_label_en, link_to, link_type, sort_order, is_published)
where not exists (
  select 1 from public.home_cards where public.home_cards.title = seed.title
);
