import { encodeProjectImage, decodeProjectImage } from './projectImages';
import { supabase } from './supabase';
import type {
  AboutHighlight,
  CategoryOption,
  ProjectSectionContent,
  ContactItem,
  PortfolioProject,
  ProjectCategory,
  ProjectLink,
  SiteContent,
  SkillGroup,
  SkillIconName,
  ThumbnailFit,
} from '../types/portfolio';

const asProjectLinks = (value: unknown): ProjectLink[] => {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const link = item as Record<string, unknown>;
      return {
        title: typeof link.title === 'string' ? link.title : '',
        description: typeof link.description === 'string' ? link.description : '',
        url: typeof link.url === 'string' ? link.url : '',
      };
    })
    .filter((item): item is ProjectLink => Boolean(item?.title && item.url));
};

const asAboutHighlights = (value: unknown): AboutHighlight[] => {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const highlight = item as Record<string, unknown>;
      const iconName = highlight.iconName;
      return {
        iconName:
          iconName === 'Users' || iconName === 'Zap' || iconName === 'CheckCircle2'
            ? iconName
            : 'Users',
        title: typeof highlight.title === 'string' ? highlight.title : '',
        description: typeof highlight.description === 'string' ? highlight.description : '',
      };
    })
    .filter((item): item is AboutHighlight => Boolean(item?.title));
};

const asContactItems = (value: unknown): ContactItem[] => {
  if (!Array.isArray(value)) return [];

  return value
    .map<ContactItem | null>((item) => {
      if (!item || typeof item !== 'object') return null;
      const contact = item as Record<string, unknown>;
      return {
        label: typeof contact.label === 'string' ? contact.label : '',
        value: typeof contact.value === 'string' ? contact.value : '',
        url: typeof contact.url === 'string' ? contact.url : undefined,
      };
    })
    .filter((item): item is ContactItem => item !== null && Boolean(item.label));
};

const toProjectCategory = (value: unknown): ProjectCategory => {
  return typeof value === 'string' && value ? value : 'personal';
};

const toThumbnailFit = (value: unknown): ThumbnailFit | undefined => {
  return value === 'contain' || value === 'cover' ? value : undefined;
};

interface ProjectRow {
  id: string;
  title: string;
  description: string | null;
  short_desc: string | null;
  image_url: string | null;
  thumbnail_fit: string | null;
  thumbnail_position: string | null;
  category: string | null;
  stack: string[] | null;
  overview: string | null;
  goal: string | null;
  difficulties: string[] | null;
  outputs: string[] | null;
  detail_images: string[] | null;
  full_page_images: string[] | null;
  challenge_images: string[] | null;
  project_links: unknown;
  sections?: ProjectSectionContent[];
  link_url: string | null;
  github_url: string | null;
  is_published: boolean | null;
  sort_order: number | null;
}

interface SiteContentRow {
  hero_greeting: string | null;
  hero_name: string | null;
  hero_description: string | null;
  hero_avatar_url: string | null;
  about_paragraphs: string[] | null;
  about_highlights: unknown;
  about_cta_text: string | null;
  skills_footer: string | null;
  contact_title: string | null;
  contact_items: unknown;
  thank_you_text: string | null;
}

interface SkillGroupRow {
  id: string;
  category: string | null;
  icon_name: string | null;
  color: string | null;
  sort_order: number | null;
}

interface SkillItemRow {
  group_id: string;
  label: string | null;
  sort_order: number | null;
}

const rowToProject = (row: ProjectRow): PortfolioProject => ({
  id: row.id,
  title: row.title,
  description: row.description ?? '',
  shortDesc: row.short_desc ?? '',
  image: decodeProjectImage(row.image_url ?? ''),
  thumbnailFit: toThumbnailFit(row.thumbnail_fit),
  thumbnailPosition: row.thumbnail_position ?? undefined,
  category: toProjectCategory(row.category),
  stack: row.stack ?? [],
  overview: row.overview ?? '',
  goal: row.goal ?? '',
  difficulties: row.difficulties ?? [],
  outputs: (row.outputs ?? []).map(decodeProjectImage),
  detailImages: (row.detail_images ?? []).map(decodeProjectImage),
  fullPageImages: (row.full_page_images ?? []).map(decodeProjectImage),
  challengeImages: (row.challenge_images ?? []).map(decodeProjectImage),
  projectLinks: asProjectLinks(row.project_links),
  sections: row.sections ?? [],
  link: row.link_url ?? undefined,
  github: row.github_url ?? undefined,
  isPublished: row.is_published ?? true,
  sortOrder: row.sort_order ?? 0,
});

const projectToRow = (project: PortfolioProject) => ({
  id: project.id,
  title: project.title,
  description: project.description,
  short_desc: project.shortDesc,
  image_url: encodeProjectImage(project.image),
  thumbnail_fit: project.thumbnailFit ?? 'cover',
  thumbnail_position: project.thumbnailPosition ?? 'center',
  category: project.category,
  stack: project.stack,
  overview: project.overview,
  goal: project.goal,
  difficulties: project.difficulties,
  outputs: (project.outputs ?? []).map(encodeProjectImage),
  detail_images: (project.detailImages ?? []).map(encodeProjectImage),
  full_page_images: (project.fullPageImages ?? []).map(encodeProjectImage),
  challenge_images: (project.challengeImages ?? []).map(encodeProjectImage),
  project_links: project.projectLinks ?? [],
  sections: project.sections ?? [],
  link_url: project.link ?? '',
  github_url: project.github ?? '',
  is_published: project.isPublished ?? true,
  sort_order: project.sortOrder ?? 0,
});

const rowToSiteContent = (row: SiteContentRow): SiteContent => ({
  heroGreeting: row.hero_greeting ?? '',
  heroName: row.hero_name ?? '',
  heroDescription: row.hero_description ?? '',
  heroAvatarUrl: row.hero_avatar_url ?? undefined,
  aboutParagraphs: row.about_paragraphs ?? [],
  aboutHighlights: asAboutHighlights(row.about_highlights),
  aboutCtaText: row.about_cta_text ?? '',
  skillsFooter: row.skills_footer ?? '',
  contactTitle: row.contact_title ?? '',
  contactItems: asContactItems(row.contact_items),
  thankYouText: row.thank_you_text ?? '',
});

const siteContentToRow = (content: SiteContent) => ({
  id: 'main',
  hero_greeting: content.heroGreeting,
  hero_name: content.heroName,
  hero_description: content.heroDescription,
  hero_avatar_url: content.heroAvatarUrl ?? '',
  about_paragraphs: content.aboutParagraphs,
  about_highlights: content.aboutHighlights,
  about_cta_text: content.aboutCtaText,
  skills_footer: content.skillsFooter,
  contact_title: content.contactTitle,
  contact_items: content.contactItems,
  thank_you_text: content.thankYouText,
  updated_at: new Date().toISOString(),
});

const toSkillIconName = (value: unknown): SkillIconName => {
  return value === 'Database' || value === 'Code2' || value === 'Palette' || value === 'GitBranch'
    ? value
    : 'Code2';
};

export const fetchPublishedProjects = async (): Promise<PortfolioProject[]> => {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Failed to fetch projects from Supabase:', error.message);
    return [];
  }

  return ((data ?? []) as ProjectRow[]).map(rowToProject);
};

export const fetchAdminProjects = async (): Promise<PortfolioProject[]> => {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('projects')
    .select('*, sections')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return ((data ?? []) as ProjectRow[]).map(rowToProject);
};

export const saveProject = async (project: PortfolioProject) => {
  if (!supabase) throw new Error('Supabase 환경변수가 설정되지 않았습니다.');

  const { error } = await supabase.from('projects').upsert(projectToRow(project), {
    onConflict: 'id',
  });

  if (error) throw error;
};

export const deleteProject = async (projectId: string) => {
  if (!supabase) throw new Error('Supabase 환경변수가 설정되지 않았습니다.');

  const { error } = await supabase.from('projects').delete().eq('id', projectId);
  if (error) throw error;
};

export const fetchSiteContent = async (strict = false): Promise<SiteContent | null> => {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .eq('id', 'main')
    .maybeSingle();

  if (error) {
    if (strict) throw error;
    console.warn('Failed to fetch site content from Supabase:', error.message);
    return null;
  }

  return data ? rowToSiteContent(data as SiteContentRow) : null;
};

export const saveSiteContent = async (content: SiteContent) => {
  if (!supabase) throw new Error('Supabase 환경변수가 설정되지 않았습니다.');

  const { error } = await supabase.from('site_content').upsert(siteContentToRow(content), {
    onConflict: 'id',
  });

  if (error) throw error;
};

export const fetchSkillGroups = async (strict = false): Promise<SkillGroup[]> => {
  if (!supabase) return [];

  const [{ data: groups, error: groupError }, { data: items, error: itemError }] =
    await Promise.all([
      supabase.from('skill_groups').select('*').order('sort_order', { ascending: true }),
      supabase.from('skill_items').select('*').order('sort_order', { ascending: true }),
    ]);

  if (groupError || itemError) {
    if (strict) throw groupError ?? itemError;
    console.warn('Failed to fetch skills from Supabase:', groupError?.message ?? itemError?.message);
    return [];
  }

  const skillItems = (items ?? []) as SkillItemRow[];

  return ((groups ?? []) as SkillGroupRow[]).map((group) => ({
    id: group.id,
    category: group.category ?? '',
    iconName: toSkillIconName(group.icon_name),
    color: group.color ?? 'from-blue-500 to-cyan-500',
    sortOrder: group.sort_order ?? 0,
    items: skillItems
      .filter((item) => item.group_id === group.id)
      .map((item) => item.label)
      .filter((item): item is string => Boolean(item)),
  }));
};

export const saveSkillGroups = async (groups: SkillGroup[]) => {
  if (!supabase) throw new Error('Supabase 환경변수가 설정되지 않았습니다.');

  const groupRows = groups.map((group, index) => ({
    id: group.id,
    category: group.category,
    icon_name: group.iconName,
    color: group.color,
    sort_order: index,
    updated_at: new Date().toISOString(),
  }));

  const { error: groupError } = await supabase.from('skill_groups').upsert(groupRows, {
    onConflict: 'id',
  });

  if (groupError) throw groupError;

  const groupIds = groups.map((group) => group.id);
  if (groupIds.length > 0) {
    const { error: deleteError } = await supabase
      .from('skill_items')
      .delete()
      .in('group_id', groupIds);

    if (deleteError) throw deleteError;
  }

  const itemRows = groups.flatMap((group) =>
    group.items.map((item, index) => ({
      group_id: group.id,
      label: item,
      sort_order: index,
    })),
  );

  if (itemRows.length > 0) {
    const { error: itemError } = await supabase.from('skill_items').insert(itemRows);
    if (itemError) throw itemError;
  }
};

export const fetchAdminEmail = async (): Promise<string | null> => {
  if (!supabase) return null;

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;

  if (!user) return null;
  const { data, error } = await supabase.rpc('is_portfolio_admin');
  if (error) throw error;
  return data === true ? user.email ?? null : null;
};

export const uploadPortfolioImage = async (file: File, folder: string): Promise<string> => {
  if (!supabase) throw new Error('Supabase 환경변수가 설정되지 않았습니다.');

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const path = `${folder}/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from('portfolio-images').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from('portfolio-images').getPublicUrl(path);
  return data.publicUrl;
};

export const defaultCategories: CategoryOption[] = [
  { value: 'personal', label: '개인 프로젝트' },
  { value: 'team', label: '팀 프로젝트' },
  { value: 'design', label: '디자인 작업' },
];

export const fetchProjectCategories = async (): Promise<CategoryOption[]> => {
  if (!supabase) return defaultCategories;
  const { data, error } = await supabase.from('project_categories').select('id, name').order('created_at');
  if (error) throw error;
  return (data ?? []).map((row) => ({ value: row.id, label: row.name }));
};

export const addProjectCategory = async (name: string): Promise<CategoryOption> => {
  if (!supabase) throw new Error('Supabase 환경변수가 설정되지 않았습니다.');
  const label = name.trim();
  if (!label) throw new Error('대주제 이름을 입력해 주세요.');
  const { data, error } = await supabase.from('project_categories')
    .insert({ id: crypto.randomUUID(), name: label }).select('id, name').single();
  if (error) throw error;
  return { value: data.id, label: data.name };
};

export const fetchProjectOrder = async (): Promise<string[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('project_order').select('project_id').order('position');
  if (error) throw error;
  return (data ?? []).map((row) => row.project_id);
};
export const saveProjectOrder = async (ids: string[]) => {
  if (!supabase) throw new Error('Supabase 연결이 필요합니다.');
  const { error } = await supabase.rpc('save_project_order', { project_ids: ids });
  if (error) throw error;
};
