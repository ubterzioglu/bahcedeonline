-- i18n: parallel English columns for menu_items and home_cards.
alter table public.menu_items
  add column if not exists name_en text,
  add column if not exists description_en text,
  add column if not exists tags_en text[] default '{}';

alter table public.home_cards
  add column if not exists title_en text,
  add column if not exists body_en text,
  add column if not exists script_label_en text,
  add column if not exists cta_label_en text;

-- Seed EN content for the 3 home_cards rows (match by title).
update public.home_cards
  set title_en = 'A summer for a lifetime in the garden',
      body_en  = 'We don''t live Kaş''s turquoise water indoors — we live it outside. Under palms, in lantern light, we gather long summer evenings.',
      script_label_en = 'our story',
      cta_label_en = 'Read more'
  where title = 'Bahçede bir ömür yaz';

update public.home_cards
  set title_en = 'Dragoman Diving & Outdoor',
      body_en  = 'Diving routes, kayaking, trekking and outdoor experiences in Kaş''s crystal-clear waters — with Bahçe''s sister brand.',
      script_label_en = 'diving & outdoor',
      cta_label_en = 'Discover'
  where title = 'Dragoman Diving & Outdoor';

update public.home_cards
  set title_en = 'Kasguide.de',
      body_en  = 'The most comprehensive guide to Kaş. Restaurants, beaches, activities and more.',
      script_label_en = 'kaş guide',
      cta_label_en = 'Discover'
  where title = 'Kasguide.de';

-- Seed EN content for menu placeholder items (match by TR name).
do $$
declare
  rec record;
begin
  for rec in
    select * from (values
      ('Dragoman Spritz',          'Dragoman Spritz',          'Our signature — gold Aperol, Prosecco, orange and fresh mint.',               array['signature','refreshing']),
      ('Kaş Mule',                 'Kaş Mule',                 'Vodka, fresh ginger beer, lime — served in a copper mug.',                     array['refreshing']),
      ('Bahçe Mojito',             'Bahçe Mojito',             'Fresh mint, lime, brown sugar and white rum — the classic recipe.',            array['classic']),
      ('Negroni',                  'Negroni',                  'Gin, Campari, red vermouth on ice with orange peel.',                          array['bitter','classic']),
      ('Espresso Martini',         'Espresso Martini',         'Vodka, fresh espresso, coffee liqueur — frothy.',                              array['night','caffeinated']),
      ('Aperol Sunset',            'Aperol Sunset',            'Aperol, grapefruit, prosecco with a salted rim.',                              array['sweet']),
      ('Limon Cello Fizz',         'Limoncello Fizz',          'House-made limoncello, prosecco and soda.',                                    array['refreshing']),
      ('Gin Basil Smash',          'Gin Basil Smash',          'Gin, fresh basil, lemon and brown sugar.',                                     array['botanical']),

      ('Efes Pilsen',              'Efes Pilsen',              'Classic 50cl pilsner, served in a chilled glass.',                             array['cold']),
      ('Bomonti Filtresiz',        'Bomonti Unfiltered',       'Unfiltered, smooth-drinking Turkish lager.',                                   array['local']),
      ('Corona Extra',             'Corona Extra',             '33cl, served with a lime wedge.',                                              array['import']),
      ('Gusta Wheat',              'Gusta Wheat',              'Wheat beer from a Turkish craft brewery.',                                      array['craft']),
      ('Guinness Draught',         'Guinness Draught',         'Irish stout with a creamy head.',                                              array['import','full-bodied']),
      ('Erdinger Alkolsüz',        'Erdinger Non-Alcoholic',   'Alcohol-free wheat beer.',                                                     array['non-alcoholic']),

      ('Kavaklıdere Yakut',        'Kavaklıdere Yakut',        'Kalecik Karası — red, by the glass.',                                          array['local','red']),
      ('Doluca Sarafin Chardonnay','Doluca Sarafin Chardonnay','Barrel-aged white — by the glass.',                                            array['local','white']),
      ('Pasaeli Roze',             'Pasaeli Rosé',             'A light rosé that pairs with Kaş heat.',                                       array['rosé']),
      ('Kayra Prestige Kırmızı',   'Kayra Prestige Red',       'Öküzgözü-Boğazkere blend — 750ml bottle.',                                     array['bottle']),
      ('Santa Margherita Prosecco','Santa Margherita Prosecco','Italian sparkling — bottle.',                                                  array['sparkling','import']),

      ('Ev Yapımı Limonata',       'Homemade Lemonade',        'Fresh lemon, mint, lightly sweetened.',                                        array['homemade','refreshing']),
      ('Karpuz Nane Soda',         'Watermelon Mint Soda',     'Summer watermelon, fresh mint, sparkling water.',                              array['seasonal']),
      ('Türk Kahvesi (Soğuk)',     'Turkish Coffee (Iced)',    'Iced, foamy, medium-sweet.',                                                   array['caffeinated']),
      ('Ice Latte',                'Iced Latte',               'Espresso, milk, ice.',                                                         array['caffeinated']),
      ('Coca-Cola',                'Coca-Cola',                '33cl can.',                                                                    array['classic']),
      ('Fanta Portakal',           'Fanta Orange',             '33cl can.',                                                                    array['classic']),
      ('Soda',                     'Sparkling Water',          'Plain or lemon, 25cl.',                                                        array['plain']),

      ('Türk Kahvesi',             'Turkish Coffee',           'Traditional stone cezve, served with lokum.',                                  array['classic','caffeinated']),
      ('Espresso',                 'Espresso',                 'Single or double shot.',                                                       array['caffeinated']),
      ('Cappuccino',               'Cappuccino',               'Espresso, steamed milk, foam.',                                                array['caffeinated']),
      ('Latte',                    'Latte',                    'Smooth, milky espresso.',                                                      array['caffeinated']),
      ('Bitki Çayı',               'Herbal Tea',               'Sage, linden or chamomile.',                                                   array['herbal']),
      ('Çay Demlik',               'Tea Pot',                  'Traditional Turkish tea in a tulip glass.',                                    array['classic']),

      ('Humus & Ekmek',            'Hummus & Bread',           'Tahini hummus, olive oil, cumin & chili flakes; warm pide.',                   array['vegetarian']),
      ('Peynir Tabağı',            'Cheese Platter',           'Local cheeses, walnuts, honey, fresh fruit.',                                   array['sharing']),
      ('Zeytinyağlı Enginar',      'Artichoke in Olive Oil',   'Cold artichoke, lemon, fresh dill.',                                            array['vegetarian','seasonal']),
      ('Karides Güveç',            'Shrimp Casserole',         'Tomato, thyme and kashar — served hot.',                                        array['seafood']),
      ('Zeytin & Turşu Sepeti',    'Olives & Pickles',         'House pickles, local olives.',                                                  array['local']),
      ('Patates Kızartması',       'French Fries',             'Crispy fries with thyme salt.',                                                 array['classic']),
      ('Kalamar Tava',             'Fried Calamari',           'Fried calamari rings with tartar sauce.',                                       array['seafood']),
      ('Acılı Ezme',               'Spicy Ezme',               'Tomato, pepper, garlic, pomegranate molasses.',                                 array['spicy','vegetarian'])
    ) as s(tr_name, en_name, en_description, en_tags)
  loop
    update public.menu_items
      set name_en = rec.en_name,
          description_en = rec.en_description,
          tags_en = rec.en_tags
      where name = rec.tr_name;
  end loop;
end $$;
