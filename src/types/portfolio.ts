export type ProjectCategory = string;
export interface CategoryOption { value: string; label: string }
export interface ProjectSectionContent { id: string; title: string; content: string }
export type ProjectFilter = 'all' | ProjectCategory;

export type ThumbnailFit = 'cover' | 'contain';

export interface ProjectLink {
  title: string;
  description: string;
  url: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  shortDesc: string;
  image: string;
  thumbnailFit?: ThumbnailFit;
  thumbnailPosition?: string;
  category: ProjectCategory;
  stack: string[];
  overview: string;
  goal: string;
  difficulties: string[];
  sections?: ProjectSectionContent[];
  outputs?: string[];
  detailImages?: string[];
  fullPageImages?: string[];
  challengeImages?: string[];
  projectLinks?: ProjectLink[];
  link?: string;
  github?: string;
  isPublished?: boolean;
  sortOrder?: number;
}

export type AboutIconName = 'Users' | 'Zap' | 'CheckCircle2';
export type SkillIconName = 'GitBranch' | 'Database' | 'Code2' | 'Palette';

export interface AboutHighlight {
  iconName: AboutIconName;
  title: string;
  description: string;
}

export interface ContactItem {
  label: string;
  value: string;
  url?: string;
}

export interface SiteContent {
  heroGreeting: string;
  heroName: string;
  heroDescription: string;
  heroAvatarUrl?: string;
  aboutParagraphs: string[];
  aboutHighlights: AboutHighlight[];
  aboutCtaText: string;
  skillsFooter: string;
  contactTitle: string;
  contactItems: ContactItem[];
  thankYouText: string;
}

export interface SkillGroup {
  id: string;
  category: string;
  iconName: SkillIconName;
  color: string;
  items: string[];
  sortOrder?: number;
}
