-- Update Monday's live music program entry
update public.weekly_schedule
set title = '80''ler Dans Partisi by Adlı',
    title_en = '80''s Dance Party by Adlı'
where day_of_week = 1;
