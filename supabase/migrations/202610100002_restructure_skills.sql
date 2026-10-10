begin;

update public.site_content
set
  skills_footer = '많은 기술을 알고 있다는 것보다, 어떤 기술로 무엇을 만들었는지를 보여드립니다.',
  updated_at = now()
where id = 'main';

delete from public.skill_groups
where id in ('devops-tools', 'backend-database', 'frontend', 'design-content');

insert into public.skill_groups (id, category, icon_name, color, sort_order)
values
  ('core-expertise', 'CORE EXPERTISE', 'Code2', 'from-blue-500 to-violet-500', 0),
  ('project-experience', 'PROJECT EXPERIENCE', 'GitBranch', 'from-cyan-500 to-blue-500', 1),
  ('familiar-with', 'FAMILIAR WITH', 'Database', 'from-purple-500 to-pink-500', 2),
  ('additional-tools', 'Additional Tools', 'Palette', 'from-amber-500 to-rose-500', 3)
on conflict (id) do update set
  category = excluded.category,
  icon_name = excluded.icon_name,
  color = excluded.color,
  sort_order = excluded.sort_order,
  updated_at = now();

delete from public.skill_items
where group_id in ('core-expertise', 'project-experience', 'familiar-with', 'additional-tools');

insert into public.skill_items (group_id, label, sort_order)
values
  ('core-expertise', 'React', 0),
  ('core-expertise', 'TypeScript', 1),
  ('core-expertise', 'Next.js', 2),
  ('core-expertise', 'Figma', 3),
  ('core-expertise', 'Supabase', 4),
  ('core-expertise', 'Tailwind CSS', 5),
  ('project-experience', 'JavaScript', 0),
  ('project-experience', 'HTML / CSS', 1),
  ('project-experience', 'Vite', 2),
  ('project-experience', 'Node.js', 3),
  ('project-experience', 'Express', 4),
  ('project-experience', 'REST API', 5),
  ('project-experience', 'PostgreSQL / MySQL', 6),
  ('project-experience', 'Git / GitHub', 7),
  ('project-experience', 'Vercel', 8),
  ('project-experience', 'Postman', 9),
  ('project-experience', 'npm / yarn', 10),
  ('familiar-with', 'NestJS', 0),
  ('familiar-with', 'MongoDB', 1),
  ('familiar-with', 'Firebase', 2),
  ('familiar-with', 'Docker', 3),
  ('familiar-with', 'AWS', 4),
  ('familiar-with', 'Electron', 5),
  ('familiar-with', 'Jest', 6),
  ('familiar-with', 'Blender', 7),
  ('familiar-with', 'Adobe Photoshop', 8),
  ('additional-tools', 'CapCut', 0),
  ('additional-tools', 'VLLO', 1),
  ('additional-tools', 'Notion', 2),
  ('additional-tools', 'Slack', 3),
  ('additional-tools', 'VS Code', 4),
  ('additional-tools', 'Ubuntu', 5),
  ('additional-tools', 'PowerShell', 6);

commit;
