begin;

alter table public.projects enable row level security;
grant select on public.projects to anon, authenticated;

drop policy if exists "Public can read published projects" on public.projects;
create policy "Public can read published projects"
on public.projects for select
to anon, authenticated
using (is_published = true);

commit;