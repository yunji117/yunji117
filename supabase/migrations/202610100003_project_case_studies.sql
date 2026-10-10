alter table public.projects
  add column if not exists case_study jsonb not null default '{}'::jsonb;

comment on column public.projects.case_study is
  'Case study metadata: period, projectType, role, contribution, deploymentStatus, keyOutcome, responsibilities, features, decisions, results, retrospective';
