create extension if not exists pgcrypto;

create table if not exists public.portfolio_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.site_content (
  id text primary key default 'main',
  hero_greeting text not null default '',
  hero_name text not null default '',
  hero_description text not null default '',
  hero_avatar_url text not null default '',
  about_paragraphs text[] not null default '{}',
  about_highlights jsonb not null default '[]'::jsonb,
  about_cta_text text not null default '',
  skills_footer text not null default '',
  contact_title text not null default '',
  contact_items jsonb not null default '[]'::jsonb,
  thank_you_text text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  description text not null default '',
  short_desc text not null default '',
  image_url text not null default '',
  thumbnail_fit text not null default 'cover' check (thumbnail_fit in ('cover', 'contain')),
  thumbnail_position text not null default 'center',
  category text not null default 'personal' check (category in ('personal', 'team', 'design')),
  stack text[] not null default '{}',
  overview text not null default '',
  goal text not null default '',
  difficulties text[] not null default '{}',
  outputs text[] not null default '{}',
  detail_images text[] not null default '{}',
  full_page_images text[] not null default '{}',
  challenge_images text[] not null default '{}',
  project_links jsonb not null default '[]'::jsonb,
  link_url text not null default '',
  github_url text not null default '',
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skill_groups (
  id text primary key,
  category text not null,
  icon_name text not null default 'Code2' check (icon_name in ('GitBranch', 'Database', 'Code2', 'Palette')),
  color text not null default 'from-blue-500 to-cyan-500',
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.skill_items (
  id bigint generated always as identity primary key,
  group_id text not null references public.skill_groups(id) on delete cascade,
  label text not null,
  sort_order integer not null default 0
);

create or replace function public.is_portfolio_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select
    coalesce(auth.jwt() ->> 'email', '') in (
      'admin@yunjis-portfolio.local',
      'yunw0117@gmail.com'
    )
    or exists (
      select 1
      from public.portfolio_admins
      where user_id = auth.uid()
    );
$$;

alter table public.portfolio_admins enable row level security;
alter table public.site_content enable row level security;
alter table public.projects enable row level security;
alter table public.skill_groups enable row level security;
alter table public.skill_items enable row level security;

drop policy if exists "Admins can read themselves" on public.portfolio_admins;
create policy "Admins can read themselves"
on public.portfolio_admins for select
using (user_id = auth.uid());

drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content"
on public.site_content for select
using (true);

drop policy if exists "Admins can manage site content" on public.site_content;
create policy "Admins can manage site content"
on public.site_content for all
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

drop policy if exists "Public can read published projects" on public.projects;
create policy "Public can read published projects"
on public.projects for select
using (is_published = true);

drop policy if exists "Admins can manage projects" on public.projects;
create policy "Admins can manage projects"
on public.projects for all
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

drop policy if exists "Public can read skill groups" on public.skill_groups;
create policy "Public can read skill groups"
on public.skill_groups for select
using (true);

drop policy if exists "Admins can manage skill groups" on public.skill_groups;
create policy "Admins can manage skill groups"
on public.skill_groups for all
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

drop policy if exists "Public can read skill items" on public.skill_items;
create policy "Public can read skill items"
on public.skill_items for select
using (true);

drop policy if exists "Admins can manage skill items" on public.skill_items;
create policy "Admins can manage skill items"
on public.skill_items for all
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-images',
  'portfolio-images',
  true,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read portfolio images" on storage.objects;
create policy "Public can read portfolio images"
on storage.objects for select
using (bucket_id = 'portfolio-images');

drop policy if exists "Admins can upload portfolio images" on storage.objects;
create policy "Admins can upload portfolio images"
on storage.objects for insert
with check (bucket_id = 'portfolio-images' and public.is_portfolio_admin());

drop policy if exists "Admins can update portfolio images" on storage.objects;
create policy "Admins can update portfolio images"
on storage.objects for update
using (bucket_id = 'portfolio-images' and public.is_portfolio_admin())
with check (bucket_id = 'portfolio-images' and public.is_portfolio_admin());

drop policy if exists "Admins can delete portfolio images" on storage.objects;
create policy "Admins can delete portfolio images"
on storage.objects for delete
using (bucket_id = 'portfolio-images' and public.is_portfolio_admin());

insert into public.site_content (
  id,
  hero_greeting,
  hero_name,
  hero_description,
  about_paragraphs,
  about_highlights,
  about_cta_text,
  skills_footer,
  contact_title,
  contact_items,
  thank_you_text
)
values (
  'main',
  'Hi, I''m',
  'Yunji',
  '아름답고 모던한 인터페이스와 견고한 애플리케이션을 만드는 것을 좋아하는 풀스택 개발자입니다.',
  array[
    '안녕하세요! 4년제 대학교를 졸업하고, 현재는 풀스택 개발자를 꿈꾸며 성장 중인 KIM YUNJI입니다.',
    '평소 사람들에게 도움을 주는 일을 좋아하고, 더 넓은 세상에서 영향력을 주는 방법을 고민하다가 개발에 관심을 갖게 되었습니다.',
    '이후 본격적으로 개발을 공부하기 위해 풀스택 개발자 양성과정에 등록했고, 현재 React, JavaScript, Node.js, MySQL 등 프론트엔드부터 백엔드까지 폭넓게 배우고 있습니다.',
    '프로젝트 기반의 실습을 통해 로그인/회원가입 기능, 커뮤니티 게시판 등 실제 서비스를 구현하는 경험을 쌓고 있습니다.'
  ],
  '[
    {"iconName":"Users","title":"User-Centric Design","description":"사용자 중심의 UI/UX를 고려한 서비스 개발"},
    {"iconName":"Zap","title":"Full-Stack Development","description":"React, Node.js, MySQL 등 풀스택 기술 보유"},
    {"iconName":"CheckCircle2","title":"Problem Solver","description":"실제 프로젝트를 통한 실무 경험 축적"}
  ]'::jsonb,
  '끈기 있게 한 걸음씩 나아가고 있는 개발자입니다 👨‍💻',
  '지속적으로 학습하고 새로운 기술을 탐구하는 개발자입니다 🚀',
  'KIM YUNJI Contact',
  '[
    {"label":"Email","value":"yunw0117@gmail.com","url":"mailto:yunw0117@gmail.com"},
    {"label":"Instagram","value":""},
    {"label":"Github","value":"yunji117","url":"https://github.com/yunji117"}
  ]'::jsonb,
  'Thank You •͜•'
)
on conflict (id) do nothing;

insert into public.skill_groups (id, category, icon_name, color, sort_order)
values
  ('devops-tools', 'DevOps & Tools', 'GitBranch', 'from-green-500 to-emerald-500', 0),
  ('backend-database', 'Backend & Database', 'Database', 'from-purple-500 to-pink-500', 1),
  ('frontend', 'Frontend', 'Code2', 'from-blue-500 to-cyan-500', 2),
  ('design-content', 'Design & Content', 'Palette', 'from-amber-500 to-rose-500', 3)
on conflict (id) do nothing;

insert into public.skill_items (group_id, label, sort_order)
select group_id, label, sort_order
from (
  values
    ('devops-tools', 'Git / Github', 0),
    ('devops-tools', 'Notion', 1),
    ('devops-tools', 'Postman', 2),
    ('devops-tools', 'npm / yarn', 3),
    ('devops-tools', 'VS Code', 4),
    ('devops-tools', 'Slack', 5),
    ('devops-tools', 'AWS / Vercel / Github Action', 6),
    ('devops-tools', 'Ubuntu / PowerShell', 7),
    ('backend-database', 'Node.js', 0),
    ('backend-database', 'Express', 1),
    ('backend-database', 'NestJS', 2),
    ('backend-database', 'MongoDB / MySQL / PostgreSQL', 3),
    ('backend-database', 'Firebase', 4),
    ('backend-database', 'Supabase', 5),
    ('backend-database', 'REST API', 6),
    ('backend-database', 'Docker', 7),
    ('frontend', 'HTML / CSS / Tailwind CSS', 0),
    ('frontend', 'React', 1),
    ('frontend', 'Next.js', 2),
    ('frontend', 'Vite', 3),
    ('frontend', 'JavaScript / TypeScript', 4),
    ('frontend', 'Electron', 5),
    ('frontend', 'Jest (Testing)', 6),
    ('design-content', 'Figma (UI/UX Design)', 0),
    ('design-content', 'Adobe Photoshop', 1),
    ('design-content', 'CapCut', 2),
    ('design-content', 'VLLO', 3),
    ('design-content', 'Blender (3D Modeling)', 4)
) as seed(group_id, label, sort_order)
where not exists (
  select 1
  from public.skill_items
  where public.skill_items.group_id = seed.group_id
);

-- Google 관리자 계정: yunw0117@gmail.com
insert into public.portfolio_admins (user_id, email)
select id, email
from auth.users
where email = 'yunw0117@gmail.com'
on conflict (user_id) do update set email = excluded.email;

-- Extensible project categories and subsections
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
-- Table grants are required in addition to RLS policies.
-- Public visitors can read only published projects; only admins can write.
alter table public.projects enable row level security;
grant usage on schema public to anon, authenticated;
grant select on public.projects to anon;
grant select, insert, update, delete on public.projects to authenticated;
drop policy if exists "Public can read published projects" on public.projects;
create policy "Public can read published projects" on public.projects for select
  to anon, authenticated using (is_published = true);
drop policy if exists "Admins can manage projects" on public.projects;
create policy "Admins can manage projects" on public.projects for all
  to authenticated using (public.is_portfolio_admin())
  with check (public.is_portfolio_admin());
commit;
begin;
-- IDs also include built-in portfolio projects which have not been edited yet.
create table if not exists public.project_order (
  project_id text primary key,
  position integer not null check (position >= 0)
);
alter table public.project_order enable row level security;
grant select on public.project_order to anon, authenticated;
grant insert, update, delete on public.project_order to authenticated;
drop policy if exists "Public can read project order" on public.project_order;
create policy "Public can read project order" on public.project_order for select to anon, authenticated using (true);
drop policy if exists "Admins can manage project order" on public.project_order;
create policy "Admins can manage project order" on public.project_order for all to authenticated
  using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());

-- A single transaction prevents half-saved ordering after an interrupted request.
create or replace function public.save_project_order(project_ids text[])
returns void language plpgsql security invoker set search_path = public as $$
begin
  if not public.is_portfolio_admin() then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;
  if project_ids is null or exists(select 1 from unnest(project_ids) id where id is null or trim(id) = '')
    or cardinality(project_ids) <> (select count(distinct id) from unnest(project_ids) id) then
    raise exception 'Invalid project IDs' using errcode = '22023';
  end if;
  perform pg_advisory_xact_lock(hashtext('portfolio-project-order'));
  delete from public.project_order;
  insert into public.project_order(project_id, position)
    select id, (ordinality - 1)::integer from unnest(project_ids) with ordinality as items(id, ordinality);
end;
$$;
revoke all on function public.save_project_order(text[]) from public, anon;
grant execute on function public.save_project_order(text[]) to authenticated;

-- Section pencil editors use the existing admin-only RLS policies.
alter table public.site_content enable row level security;
alter table public.skill_groups enable row level security;
alter table public.skill_items enable row level security;
grant select on public.site_content, public.skill_groups, public.skill_items to anon;
grant select, insert, update, delete on public.site_content, public.skill_groups, public.skill_items to authenticated;
grant usage, select on sequence public.skill_items_id_seq to authenticated;
commit;
