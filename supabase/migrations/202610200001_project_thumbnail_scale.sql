alter table public.projects
  add column if not exists thumbnail_scale numeric not null default 1
  check (thumbnail_scale between 1 and 3);
