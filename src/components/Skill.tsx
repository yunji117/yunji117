import EditButton from './admin/EditButton';
import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowUpRight, ChevronDown, Code2, Database, LayoutTemplate, Palette } from 'lucide-react';
import { defaultSkillGroups, defaultSiteContent } from '../lib/defaultPortfolio';
import { fetchPublishedProjects, fetchSiteContent, fetchSkillGroups } from '../lib/portfolioApi';
import type { PortfolioProject } from '../types/portfolio';
import { fallbackProjects } from './ProjectSection';

interface CoreSkillDetail {
  description: string;
  evidence: string;
  preferredProject: string;
  aliases: string[];
  icon: typeof Code2;
}

const coreSkillDetails: Record<string, CoreSkillDetail> = {
  React: {
    description: '컴포넌트 기반 UI와 사용자 인터랙션 구현',
    evidence: '10 Projects',
    preferredProject: 'Business Website',
    aliases: ['react'],
    icon: Code2,
  },
  TypeScript: {
    description: '타입을 활용한 컴포넌트와 데이터 구조 설계',
    evidence: '7+ Projects',
    preferredProject: 'DayTime',
    aliases: ['typescript'],
    icon: Code2,
  },
  'Next.js': {
    description: '라우팅, SEO, 데이터 기반 웹서비스 구현',
    evidence: 'Web Services',
    preferredProject: '부동산 매물 플랫폼',
    aliases: ['next.js', 'next.js 16'],
    icon: LayoutTemplate,
  },
  Figma: {
    description: 'UI/UX 설계와 커머스 콘텐츠 제작',
    evidence: '126 Product Pages',
    preferredProject: '커머스 상세페이지 디자인',
    aliases: ['figma'],
    icon: Palette,
  },
  Supabase: {
    description: '데이터 연동과 관리 기능 구현',
    evidence: 'Data & Admin',
    preferredProject: '부동산 매물 플랫폼',
    aliases: ['supabase'],
    icon: Database,
  },
  'Tailwind CSS': {
    description: '반응형 레이아웃과 일관된 UI 시스템 구현',
    evidence: 'Multiple Projects',
    preferredProject: 'DayTime',
    aliases: ['tailwind css', 'tailwind'],
    icon: LayoutTemplate,
  },
};

const normalizeTitle = (value: string) =>
  value.toLocaleLowerCase().replace(/[^a-z0-9가-힣]/g, '');

const mergeProjects = (databaseProjects: PortfolioProject[]) => [
  ...fallbackProjects.filter(
    (fallbackProject) => !databaseProjects.some((project) => project.id === fallbackProject.id),
  ),
  ...databaseProjects,
];

const findProjectForSkill = (projects: PortfolioProject[], skill: CoreSkillDetail) => {
  const preferredTitle = normalizeTitle(skill.preferredProject);
  const preferred = projects.find((project) => {
    const projectTitle = normalizeTitle(project.title);
    return projectTitle === preferredTitle || projectTitle.includes(preferredTitle) || preferredTitle.includes(projectTitle);
  });

  if (preferred) return preferred;

  return projects.find((project) => {
    const stack = project.stack.join(' ').toLocaleLowerCase();
    return skill.aliases.some((alias) => stack.includes(alias));
  });
};

const Skill = ({ onEdit, revision = 0 }: { onEdit?: () => void; revision?: number }) => {
  const reduceMotion = useReducedMotion();
  const [skills, setSkills] = useState(defaultSkillGroups);
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProject[]>(fallbackProjects);
  const [footerText, setFooterText] = useState(defaultSiteContent.skillsFooter);
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });

  useEffect(() => {
    let isMounted = true;

    Promise.all([fetchSkillGroups(), fetchSiteContent()]).then(([nextSkills, nextContent]) => {
      if (!isMounted) return;

      const hasCurrentStructure = nextSkills.some((group) => group.id === 'core-expertise');
      if (nextSkills.length > 0 && hasCurrentStructure) setSkills(nextSkills);

      if (nextContent?.skillsFooter) {
        const isLegacyFooter = nextContent.skillsFooter.includes('지속적으로 학습하고');
        setFooterText(isLegacyFooter ? defaultSiteContent.skillsFooter : nextContent.skillsFooter);
      }
    });

    fetchPublishedProjects()
      .then((databaseProjects) => {
        if (isMounted && databaseProjects.length > 0) {
          setPortfolioProjects(mergeProjects(databaseProjects));
        }
      })
      .catch(() => {
        // Bundled projects remain available when the remote portfolio is unavailable.
      });

    return () => {
      isMounted = false;
    };
  }, [revision]);

  const coreSkills = useMemo(
    () => skills.find((group) => group.id === 'core-expertise')?.items ?? [],
    [skills],
  );
  const projectExperience = skills.find((group) => group.id === 'project-experience')?.items ?? [];
  const familiarWith = skills.find((group) => group.id === 'familiar-with')?.items ?? [];
  const additionalTools = skills.find((group) => group.id === 'additional-tools')?.items ?? [];

  const expertiseCards = useMemo(
    () =>
      coreSkills
        .map((name) => {
          const detail = coreSkillDetails[name];
          if (!detail) return null;
          return { name, ...detail, project: findProjectForSkill(portfolioProjects, detail) };
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item)),
    [coreSkills, portfolioProjects],
  );

  const openProject = (project: PortfolioProject) => {
    window.dispatchEvent(new CustomEvent<PortfolioProject>('portfolio:open-project', { detail: project }));
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.55, ease: 'easeOut' },
    },
  };

  return (
    <section id="skills" className="relative px-6 py-20 lg:py-32">
      {onEdit && <EditButton label="Skill" onClick={onEdit} />}
      <div className="mx-auto max-w-6xl">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="space-y-14"
        >
          <motion.div variants={itemVariants} className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
              Skills <span className="text-gradient">& Expertise</span>
            </h2>
            <div className="mx-auto mt-4 h-1 w-20 bg-gradient-to-r from-blue-500 to-cyan-500" />
            <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300">
              실제 프로젝트에서 사용하며
              <span className="block font-bold text-gray-900 dark:text-white">결과로 증명한 기술을 중심으로 정리했습니다.</span>
            </p>
          </motion.div>

          <motion.section variants={containerVariants} aria-labelledby="core-expertise-title">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">Primary Skills</p>
                <h3 id="core-expertise-title" className="mt-2 text-2xl font-black text-gray-900 dark:text-white">CORE EXPERTISE</h3>
              </div>
              <p className="hidden text-sm text-gray-500 dark:text-gray-400 sm:block">카드를 선택하면 관련 프로젝트를 볼 수 있습니다.</p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {expertiseCards.map(({ name, description, evidence, project, icon: Icon }) => (
                <motion.button
                  key={name}
                  type="button"
                  variants={itemVariants}
                  onClick={() => project && openProject(project)}
                  disabled={!project}
                  className="group flex min-h-64 flex-col rounded-2xl border border-slate-200/80 bg-white/80 p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 disabled:cursor-default disabled:hover:translate-y-0 dark:border-white/10 dark:bg-white/5 dark:hover:border-violet-400/50"
                  aria-label={project ? `${name} 관련 프로젝트 ${project.title} 보기` : undefined}
                >
                  <div className="flex w-full items-start justify-between gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 text-white shadow-lg shadow-blue-500/20">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="rounded-full bg-violet-500/10 px-3 py-1.5 text-xs font-black text-violet-700 dark:text-violet-300">{evidence}</span>
                  </div>
                  <h4 className="mt-6 text-2xl font-black text-gray-900 dark:text-white">{name}</h4>
                  <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{description}</p>
                  {project && (
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-extrabold text-violet-600 dark:text-violet-300">
                      {project.title} <ArrowUpRight className="h-4 w-4" />
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.section>

          <motion.div variants={containerVariants} className="grid gap-6 lg:grid-cols-2">
            <motion.section variants={itemVariants} className="rounded-2xl border border-slate-200/80 bg-white/65 p-6 dark:border-white/10 dark:bg-white/5" aria-labelledby="project-experience-title">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-blue-600 dark:text-cyan-300">Used in Projects</p>
              <h3 id="project-experience-title" className="mt-2 text-xl font-black text-gray-900 dark:text-white">PROJECT EXPERIENCE</h3>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {projectExperience.map((skill) => (
                  <span key={skill} className="rounded-lg bg-blue-500/10 px-3.5 py-2 text-sm font-bold text-blue-800 dark:text-cyan-200">{skill}</span>
                ))}
              </div>
            </motion.section>

            <motion.section variants={itemVariants} className="rounded-2xl border border-slate-200/80 bg-white/65 p-6 dark:border-white/10 dark:bg-white/5" aria-labelledby="familiar-with-title">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">Learning & Applied</p>
              <h3 id="familiar-with-title" className="mt-2 text-xl font-black text-gray-900 dark:text-white">FAMILIAR WITH</h3>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {familiarWith.map((skill) => (
                  <span key={skill} className="rounded-lg border border-slate-200 bg-white/70 px-3.5 py-2 text-sm font-semibold text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-300">{skill}</span>
                ))}
              </div>
            </motion.section>
          </motion.div>

          {additionalTools.length > 0 && (
            <motion.details variants={itemVariants} className="group rounded-2xl border border-dashed border-slate-300 bg-white/40 p-5 dark:border-white/15 dark:bg-white/[0.03]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-gray-700 dark:text-gray-200">
                <span>Additional Tools</span>
                <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-5 flex flex-wrap gap-2">
                {additionalTools.map((tool) => (
                  <span key={tool} className="rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-600 dark:bg-white/10 dark:text-gray-300">{tool}</span>
                ))}
              </div>
            </motion.details>
          )}

          <motion.p variants={itemVariants} className="text-center text-lg font-semibold leading-8 text-gray-600 dark:text-gray-300">
            {footerText}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default Skill;
