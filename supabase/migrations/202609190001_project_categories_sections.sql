begin;
create table if not exists public.project_categories (
  id text primary key default gen_random_uuid()::text,
  name text not null check (length(trim(name)) > 0),
  created_at timestamptz not null default now()
);
create unique index if not exists project_categories_name_unique
  on public.project_categories (lower(trim(name)));
insert into public.project_categories (id, name) values
  ('personal', '개인 프로젝트'), ('team', '팀 프로젝트'), ('design', '디자인 작업')
on conflict do nothing;
alter table public.project_categories enable row level security;
drop policy if exists "Public can read categories" on public.project_categories;
create policy "Public can read categories" on public.project_categories for select using (true);
drop policy if exists "Admins can add categories" on public.project_categories;
create policy "Admins can add categories" on public.project_categories for insert
  with check (public.is_portfolio_admin());
-- No UPDATE or DELETE policies: saved categories stay available.
grant select on public.project_categories to anon, authenticated;
grant insert on public.project_categories to authenticated;
alter table public.projects drop constraint if exists projects_category_check;
alter table public.projects add column if not exists sections jsonb not null default '[]'::jsonb;
alter table public.projects drop constraint if exists projects_category_fkey;
alter table public.projects add constraint projects_category_fkey
  foreign key (category) references public.project_categories(id) on delete restrict;
commit;
