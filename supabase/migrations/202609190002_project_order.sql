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
