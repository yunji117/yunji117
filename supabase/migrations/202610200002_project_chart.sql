alter table public.projects
  add column if not exists visual_type text not null default 'image'
  check (visual_type in ('image', 'chart'));

alter table public.projects
  add column if not exists chart_points jsonb not null default '[]'::jsonb;
