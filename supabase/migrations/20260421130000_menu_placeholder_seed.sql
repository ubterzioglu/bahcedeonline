-- Placeholder menu items across every category (no-op if same name already exists via ON CONFLICT)
-- Requires menu_items.name to be unique; since it is NOT unique in schema, we guard via WHERE NOT EXISTS.

do $$
declare
  seed record;
begin
  for seed in
    select * from (values
      -- KOKTEYLLER
      ('Dragoman Spritz',          'Gold Aperol, Prosecco, portakal ve taze nane ile imza kokteyl.',              350.00, 'kokteyller'::menu_category,   10, array['imza','ferahlatıcı']),
      ('Kaş Mule',                 'Votka, taze zencefil birası, lime; bakır kupada servis.',                     320.00, 'kokteyller'::menu_category,   20, array['ferahlatıcı']),
      ('Bahçe Mojito',             'Taze nane, lime, esmer şeker ve beyaz rom — klasik tarif.',                   300.00, 'kokteyller'::menu_category,   30, array['klasik']),
      ('Negroni',                  'Gin, Campari, kırmızı vermut; buzda servis, portakal kabuğu.',                330.00, 'kokteyller'::menu_category,   40, array['acı','klasik']),
      ('Espresso Martini',         'Votka, taze espresso, kahve likörü; köpüklü.',                                340.00, 'kokteyller'::menu_category,   50, array['gece','kafeinli']),
      ('Aperol Sunset',            'Aperol, grapefruit, prosecco ve tuzlu kenar.',                                310.00, 'kokteyller'::menu_category,   60, array['tatlı']),
      ('Limon Cello Fizz',         'Ev yapımı limoncello, prosecco ve soda.',                                     290.00, 'kokteyller'::menu_category,   70, array['ferahlatıcı']),
      ('Gin Basil Smash',          'Gin, taze fesleğen, limon ve esmer şeker.',                                   320.00, 'kokteyller'::menu_category,   80, array['botanik']),

      -- BİRALAR
      ('Efes Pilsen',               '50cl klasik pilsen, buzlu bardakta.',                                         140.00, 'biralar'::menu_category,      10, array['soğuk']),
      ('Bomonti Filtresiz',         'Filtrelenmemiş, yumuşak içim.',                                               160.00, 'biralar'::menu_category,      20, array['yerel']),
      ('Corona Extra',              '33cl, limon dilimiyle servis.',                                               200.00, 'biralar'::menu_category,      30, array['import']),
      ('Gusta Wheat',               'Türk zanaatkarından buğday birası.',                                          220.00, 'biralar'::menu_category,      40, array['craft']),
      ('Guinness Draught',          'İrlanda siyah birası, kremamsı köpük.',                                       260.00, 'biralar'::menu_category,      50, array['import','yoğun']),
      ('Erdinger Alkolsüz',         'Alkolsüz buğday birası.',                                                     180.00, 'biralar'::menu_category,      60, array['alkolsüz']),

      -- ŞARAPLAR
      ('Kavaklıdere Yakut',         'Kalecik Karası — kırmızı, kadehte.',                                          280.00, 'saraplar'::menu_category,     10, array['yerli','kırmızı']),
      ('Doluca Sarafin Chardonnay', 'Fıçı olgunlaşmalı beyaz — kadeh.',                                            300.00, 'saraplar'::menu_category,     20, array['yerli','beyaz']),
      ('Pasaeli Roze',              'Kaş sıcağına eşlik eden hafif roze.',                                         290.00, 'saraplar'::menu_category,     30, array['roze']),
      ('Kayra Prestige Kırmızı',    'Öküzgözü-Boğazkere kupajı — şişe 750ml.',                                     1250.00, 'saraplar'::menu_category,    40, array['şişe']),
      ('Santa Margherita Prosecco', 'Italyan köpüklü — şişe.',                                                     1500.00, 'saraplar'::menu_category,    50, array['köpüklü','import']),

      -- SOĞUK İÇECEKLER
      ('Ev Yapımı Limonata',        'Taze limon, nane, az şeker.',                                                 120.00, 'soguk_icecekler'::menu_category, 10, array['ev yapımı','ferahlatıcı']),
      ('Karpuz Nane Soda',          'Yaz karpuzu, taze nane, maden suyu.',                                          130.00, 'soguk_icecekler'::menu_category, 20, array['mevsimsel']),
      ('Türk Kahvesi (Soğuk)',      'Buzlu, köpüklü, orta şekerli.',                                               110.00, 'soguk_icecekler'::menu_category, 30, array['kafeinli']),
      ('Ice Latte',                 'Espresso, süt, buz.',                                                         100.00, 'soguk_icecekler'::menu_category, 40, array['kafeinli']),
      ('Coca-Cola',                 '33cl teneke kutu.',                                                            80.00, 'soguk_icecekler'::menu_category, 50, array['klasik']),
      ('Fanta Portakal',            '33cl teneke kutu.',                                                            80.00, 'soguk_icecekler'::menu_category, 60, array['klasik']),
      ('Soda',                      'Sade ya da limonlu, 25cl.',                                                    60.00, 'soguk_icecekler'::menu_category, 70, array['sade']),

      -- SICAK İÇECEKLER
      ('Türk Kahvesi',              'Geleneksel taş cezve, lokum ile.',                                            110.00, 'sicak_icecekler'::menu_category, 10, array['klasik','kafeinli']),
      ('Espresso',                  'Tek veya çift shot.',                                                          90.00, 'sicak_icecekler'::menu_category, 20, array['kafeinli']),
      ('Cappuccino',                'Espresso, buharlı süt, süt köpüğü.',                                          120.00, 'sicak_icecekler'::menu_category, 30, array['kafeinli']),
      ('Latte',                     'Yumuşak içim, sütlü espresso.',                                               120.00, 'sicak_icecekler'::menu_category, 40, array['kafeinli']),
      ('Bitki Çayı',                'Adaçayı, ıhlamur veya papatya.',                                               90.00, 'sicak_icecekler'::menu_category, 50, array['bitkisel']),
      ('Çay Demlik',                'Geleneksel Türk çayı, ince belli.',                                            60.00, 'sicak_icecekler'::menu_category, 60, array['klasik']),

      -- ATIŞTIRMALIKLAR
      ('Humus & Ekmek',             'Tahinli humus, zeytinyağı, kimyonlu pul biber; sıcak pide.',                  180.00, 'atistirmaliklar'::menu_category, 10, array['vejetaryen']),
      ('Peynir Tabağı',             'Yerel peynirler, ceviz, bal, taze meyve.',                                    320.00, 'atistirmaliklar'::menu_category, 20, array['paylaşımlık']),
      ('Zeytinyağlı Enginar',       'Soğuk enginar, limon, taze dereotu.',                                         220.00, 'atistirmaliklar'::menu_category, 30, array['vejetaryen','mevsimsel']),
      ('Karides Güveç',             'Domates, kekik ve kaşar ile sıcak servis.',                                   380.00, 'atistirmaliklar'::menu_category, 40, array['deniz']),
      ('Zeytin & Turşu Sepeti',     'Ev turşuları, yerel zeytinler.',                                              150.00, 'atistirmaliklar'::menu_category, 50, array['yerel']),
      ('Patates Kızartması',        'Çıtır patates, kekikli tuz.',                                                 120.00, 'atistirmaliklar'::menu_category, 60, array['klasik']),
      ('Kalamar Tava',              'Kızarmış kalamar halkaları, tartar sos.',                                     340.00, 'atistirmaliklar'::menu_category, 70, array['deniz']),
      ('Acılı Ezme',                'Domates, biber, sarımsak, nar ekşisi.',                                       130.00, 'atistirmaliklar'::menu_category, 80, array['acı','vejetaryen'])
    ) as s(name, description, price, category, sort_order, tags)
  loop
    if not exists (select 1 from public.menu_items where menu_items.name = seed.name) then
      insert into public.menu_items
        (name, description, price, category, sort_order, tags, is_available)
      values
        (seed.name, seed.description, seed.price, seed.category, seed.sort_order, seed.tags, true);
    end if;
  end loop;
end $$;
