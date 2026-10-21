import { useEffect, useMemo, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { ChevronDown, Download, ExternalLink, Github } from 'lucide-react';
import EditButton from './admin/EditButton';
import yunjiAvatar from '../assets/img/hero-character.webp';
import realYunjiAvatar from '../assets/img/real-yunji-profile.webp';
import { defaultSiteContent } from '../lib/defaultPortfolio';
import { fetchPublishedProjects, fetchSiteContent } from '../lib/portfolioApi';
import type { PortfolioProject } from '../types/portfolio';
import { fallbackProjects, getProjectCardText, getProjectThumbnail } from './ProjectSection';
import { getResumeUrl } from '../lib/contactLinks';
import ProgressiveImage from './ProgressiveImage';
import ProjectLineChart from './ProjectLineChart';
import { useLanguageStore, type Language } from '../store/languageStore';

type CareerRole = 'frontend' | 'designer' | 'fullstack';

interface HeroCopy {
  intro: string;
  lead: string;
  highlight: string;
  statement: string;
}

interface CareerProfile {
  tabLabel: string;
  label: string;
  lead: string;
  title: string;
  description: string;
  proof: string;
  numbers: Array<{ value: string; label: string }>;
  skills: string[];
  projects: Array<{ title: string; description: string }>;
  resumeLabel: string;
  projectCtaLabel: string;
  secondaryCtaLabel?: string;
  secondaryCtaType?: 'github' | 'projects';
  resumeHref?: string;
  note?: string;
}

const heroCopy: Record<Language, HeroCopy> = {
  en: {
    intro: 'hello( );',
    lead: 'Welcome to',
    highlight: 'Kim Yun Ji\u2019s Portfolio.',
    statement: 'I turn ideas into\nvisual experiences.',
  },
  ko: {
    intro: '안녕하세요',
    lead: '아이디어를 시각적인\n경험으로 만드는',
    highlight: '김윤지의\n포트폴리오입니다.',
    statement: '',
  },
};

const careerProfilesKo: Record<CareerRole, CareerProfile> = {
  frontend: {
    tabLabel: '프론트엔드 개발자',
    label: '프론트엔드 개발자',
    lead: '사용자 경험을 설계하고',
    title: 'React로 구현하는 프론트엔드 개발자',
    description:
      '디자인 의도를 정확한 인터페이스로 구현하고, 사용자가 자연스럽게 탐색하고 행동할 수 있는 웹 경험을 만듭니다. React와 TypeScript를 중심으로 반응형 UI, 데이터 기반 화면, 인터랙션을 구현해왔습니다.',
    proof:
      '10개의 React 프로젝트와 7개 이상의 TypeScript 프로젝트를 통해, 아이디어를 실제로 동작하는 사용자 경험으로 구현했습니다.',
    numbers: [
      { value: '10', label: 'React 프로젝트' },
      { value: '7+', label: 'TypeScript 프로젝트' },
      { value: '11', label: '웹 개발 프로젝트' },
    ],
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Vite', 'GSAP'],
    projects: [
      {
        title: '부동산 매물 플랫폼',
        description:
          '조건별 검색, 관심 매물, 최근 본 매물, 상세 조회와 상담 접수까지 이어지는 실제 서비스형 사용자 흐름을 구현했습니다.',
      },
      {
        title: 'Business Website',
        description:
          '재사용 가능한 섹션 컴포넌트와 반응형 레이아웃을 설계하고, GSAP와 ScrollTrigger를 활용해 자연스러운 스크롤 경험을 구현했습니다.',
      },
      {
        title: 'DayTime',
        description:
          '날짜와 시간에 관한 여러 기능을 하나의 서비스에 구성하고, 복잡한 계산 로직을 사용하기 쉬운 인터페이스로 구현했습니다.',
      },
    ],
    resumeLabel: '프론트엔드 이력서 PDF',
    projectCtaLabel: '프로젝트 더 보러가기',
    secondaryCtaLabel: 'GitHub',
    secondaryCtaType: 'github',
  },
  designer: {
    tabLabel: '웹디자이너',
    label: '웹디자이너',
    lead: '정보를 이해하기 쉬운 흐름으로 바꾸는',
    title: '웹디자이너',
    description:
      '제품과 브랜드가 전달해야 하는 핵심 정보를 정리하고, 사용자의 시선과 행동 흐름을 고려한 디자인을 만듭니다. 보기 좋은 화면을 넘어 제품 이해와 구매 행동으로 연결되는 디자인을 지향합니다.',
    proof:
      '126개의 상품 상세페이지를 제작하며, 제품 정보를 사용자의 구매 흐름으로 바꾸는 실무 경험을 쌓았습니다.',
    numbers: [
      { value: '126', label: '상품 상세페이지' },
      { value: '3', label: '대표 디자인 프로젝트' },
      { value: '100%', label: '기획부터 최종 디자인' },
    ],
    skills: [
      'Figma',
      'Adobe Photoshop',
      'UI/UX Design',
      'Information Architecture',
      'E-commerce Design',
      'Visual Design',
    ],
    projects: [
      {
        title: '커머스 상세페이지 디자인',
        description:
          '126개 제품의 정보와 판매 포인트를 분석하고, 제품 이해부터 구매 설득까지 이어지는 상세페이지 흐름을 설계했습니다.',
      },
      {
        title: '쿠쿠 넬로 자동 고양이 화장실',
        description:
          '상품 썸네일부터 상세페이지 전체 콘텐츠까지 제작했습니다. 위생, 안전, 편의성이라는 핵심 가치를 일관된 비주얼로 전달했습니다.',
      },
      {
        title: '코웨이 프로모션 광고',
        description:
          '월 1만 원이라는 핵심 혜택을 강한 타이포그래피로 강조하고, 여러 제품을 한 화면에서 쉽게 비교할 수 있도록 정보 구조를 설계했습니다.',
      },
    ],
    resumeLabel: '웹디자인 이력서 PDF',
    projectCtaLabel: '디자인 프로젝트 더 보러가기',
    note: '100%는 쿠쿠 넬로 프로젝트에서 썸네일, 콘텐츠 구성, 상세페이지 디자인 전 과정을 담당했다는 의미입니다.',
  },
  fullstack: {
    tabLabel: '풀스택 개발자',
    label: '풀스택 개발자',
    lead: '화면부터 데이터와 운영까지 연결하는',
    title: '풀스택 개발자',
    description:
      '사용자가 보는 인터페이스뿐 아니라 데이터 저장, API, 관리자 기능과 배포 환경까지 함께 고려합니다. 서비스를 직접 기획하고 구현하며 실제 운영 가능한 구조로 연결하는 과정에 강점이 있습니다.',
    proof:
      '프론트엔드, API, 데이터베이스, 배포의 4개 영역을 연결하고, 4번의 팀 프로젝트 중 1번은 팀장으로 전체 기획과 일정을 리딩했습니다.',
    numbers: [
      { value: '4', label: '개발 영역' },
      { value: '4', label: '팀 프로젝트' },
      { value: '1', label: '팀장 경험' },
    ],
    skills: ['Next.js', 'React', 'TypeScript', 'Node.js', 'NestJS', 'Supabase', 'PostgreSQL', 'Docker'],
    projects: [
      {
        title: '부동산 매물 플랫폼',
        description:
          '매물 조회와 필터링, 관심 매물, 상담 접수, 문의 저장, 관리자 매물 관리 기능을 하나의 서비스 흐름으로 구현했습니다.',
      },
      {
        title: '모투슛',
        description:
          'Next.js, NestJS, PostgreSQL과 Supabase를 활용한 모의투자 플랫폼입니다. 팀장으로서 전체 기획과 일정 관리를 담당하고 외부 API 변경에도 대응했습니다.',
      },
      {
        title: 'Portfolio CMS',
        description:
          '관리자 화면에서 프로젝트와 포트폴리오 콘텐츠를 관리할 수 있도록 데이터 기반 관리 기능을 구현했습니다. 지속적으로 운영하고 업데이트할 수 있는 구조를 만들었습니다.',
      },
    ],
    resumeLabel: '풀스택 이력서 PDF',
    projectCtaLabel: '프로젝트 더 보러가기',
    secondaryCtaLabel: 'GitHub',
    secondaryCtaType: 'github',
  },
};

const careerProfilesEn: Record<CareerRole, CareerProfile> = {
  frontend: {
    tabLabel: 'Frontend Developer',
    label: 'Frontend Developer',
    lead: 'Designing user experiences and',
    title: 'building them with React',
    description: 'I translate design intent into precise interfaces and create web experiences that help users explore and act naturally. My work focuses on responsive UI, data-driven screens, and interactions built with React and TypeScript.',
    proof: 'Across 10 React projects and 7+ TypeScript projects, I have turned ideas into working user experiences.',
    numbers: [
      { value: '10', label: 'React Projects' },
      { value: '7+', label: 'TypeScript Projects' },
      { value: '11', label: 'Web Development Projects' },
    ],
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Vite', 'GSAP'],
    projects: careerProfilesKo.frontend.projects,
    resumeLabel: 'Frontend Resume PDF',
    projectCtaLabel: 'Explore More Projects',
    secondaryCtaLabel: 'GitHub',
    secondaryCtaType: 'github',
  },
  fullstack: {
    tabLabel: 'Full-Stack Developer',
    label: 'Full-Stack Developer',
    lead: 'Connecting interfaces, data, and operations as a',
    title: 'Full-Stack Developer',
    description: 'I consider not only the interface users see, but also data storage, APIs, admin features, and deployment. I am strongest when planning and building services as complete, maintainable systems.',
    proof: 'I have connected four development areas—frontend, API, database, and deployment—and led planning and scheduling as team lead in one of four team projects.',
    numbers: [
      { value: '4', label: 'Development Areas' },
      { value: '4', label: 'Team Projects' },
      { value: '1', label: 'Team Lead Experience' },
    ],
    skills: ['Next.js', 'React', 'TypeScript', 'Node.js', 'NestJS', 'Supabase', 'PostgreSQL', 'Docker'],
    projects: careerProfilesKo.fullstack.projects,
    resumeLabel: 'Full-Stack Resume PDF',
    projectCtaLabel: 'Explore More Projects',
    secondaryCtaLabel: 'GitHub',
    secondaryCtaType: 'github',
  },
  designer: {
    tabLabel: 'Web Designer',
    label: 'Web Designer',
    lead: 'Turning information into an intuitive flow as a',
    title: 'Web Designer',
    description: 'I organize the core information a product or brand needs to communicate and design around the user’s visual and behavioral flow. My goal is not only an attractive screen, but a design that improves product understanding and supports action.',
    proof: 'By creating 126 product detail pages, I gained hands-on experience turning product information into a persuasive purchase journey.',
    numbers: [
      { value: '126', label: 'Product Detail Pages' },
      { value: '3', label: 'Featured Design Projects' },
      { value: '100%', label: 'Planning to Final Design' },
    ],
    skills: ['Figma', 'Adobe Photoshop', 'UI/UX Design', 'Information Architecture', 'E-commerce Design', 'Visual Design'],
    projects: careerProfilesKo.designer.projects,
    resumeLabel: 'Web Design Resume PDF',
    projectCtaLabel: 'Explore Design Projects',
    note: '100% means I was responsible for the thumbnail, content structure, and complete detail-page design for the Cuckoo Nello project.',
  },
};

const careerRoleOrder: CareerRole[] = ['frontend', 'fullstack', 'designer'];

const normalizeProjectTitle = (value: string) =>
  value.toLocaleLowerCase().replace(/[^a-z0-9가-힣]/g, '');

const projectMatchesRole = (project: PortfolioProject, role: CareerRole) => {
  const stack = project.stack.join(' ').toLocaleLowerCase();

  if (role === 'designer') {
    return project.category === 'design' || /figma|photoshop|design|디자인/.test(stack);
  }

  if (role === 'fullstack') {
    return /node|nest|express|supabase|postgres|mysql|mongodb|docker/.test(stack);
  }

  return project.category !== 'design' && /react|typescript|next|vite|gsap/.test(stack);
};

const selectFeaturedProjects = (
  projects: PortfolioProject[],
  role: CareerRole,
  preferredProjects: CareerProfile['projects'],
) => {
  const selected: PortfolioProject[] = [];

  preferredProjects.forEach(({ title }) => {
    const preferredTitle = normalizeProjectTitle(title);
    const match = projects.find((project) => {
      const projectTitle = normalizeProjectTitle(project.title);
      return projectTitle === preferredTitle || projectTitle.includes(preferredTitle) || preferredTitle.includes(projectTitle);
    });

    if (match && !selected.some((project) => project.id === match.id)) selected.push(match);
  });

  projects.forEach((project) => {
    if (
      selected.length < 3 &&
      !selected.some((item) => item.id === project.id) &&
      projectMatchesRole(project, role)
    ) {
      selected.push(project);
    }
  });

  return selected.slice(0, 3);
};

const getCopyLength = (copy: HeroCopy) =>
  copy.intro.length + copy.lead.length + copy.highlight.length + copy.statement.length;

const sliceCopy = (copy: HeroCopy, visibleCharacters: number): HeroCopy => {
  let remaining = visibleCharacters;
  const take = (value: string) => {
    const visible = value.slice(0, Math.max(0, remaining));
    remaining -= value.length;
    return visible;
  };

  return {
    intro: take(copy.intro),
    lead: take(copy.lead),
    highlight: take(copy.highlight),
    statement: take(copy.statement),
  };
};

const Hero = ({
  onEdit,
  revision = 0,
  useRealProfile = false,
}: {
  onEdit?: () => void;
  revision?: number;
  useRealProfile?: boolean;
}) => {
  const [content, setContent] = useState(defaultSiteContent);
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProject[]>(fallbackProjects);
  const { language, setLanguage } = useLanguageStore();
  const [careerRole, setCareerRole] = useState<CareerRole>('frontend');
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(false);
  const [visibleCharacters, setVisibleCharacters] = useState(0);

  useEffect(() => {
    let isMounted = true;

    fetchSiteContent().then((nextContent) => {
      if (isMounted && nextContent) {
        setContent({ ...defaultSiteContent, ...nextContent });
      }
    });

    return () => {
      isMounted = false;
    };
  }, [revision]);

  useEffect(() => {
    let isMounted = true;

    fetchPublishedProjects()
      .then((databaseProjects) => {
        if (!isMounted || databaseProjects.length === 0) return;
        setPortfolioProjects([
          ...fallbackProjects.filter(
            (fallbackProject) => !databaseProjects.some((project) => project.id === fallbackProject.id),
          ),
          ...databaseProjects,
        ].map((project) => {
          const bundledProject = fallbackProjects.find(
            (item) => item.id === project.id || item.title === project.title,
          );
          const projectWithBundledThumbnail = {
            ...project,
            thumbnailUrl: project.thumbnailUrl ?? bundledProject?.thumbnailUrl,
          };
          return { ...projectWithBundledThumbnail, thumbnailUrl: getProjectThumbnail(projectWithBundledThumbnail) };
        }));
      })
      .catch(() => {
        // Keep the bundled projects visible when the remote portfolio is unavailable.
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const copyLength = getCopyLength(heroCopy[language]);

    if (hasSelectedLanguage || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisibleCharacters(copyLength);
      return;
    }

    const timer = window.setInterval(() => {
      setVisibleCharacters((current) => {
        if (current >= copyLength) {
          window.clearInterval(timer);
          return copyLength;
        }
        return current + 1;
      });
    }, 42);

    return () => window.clearInterval(timer);
  }, [hasSelectedLanguage, language]);

  const selectedCopy = heroCopy[language];
  const visibleCopy = useMemo(
    () => sliceCopy(selectedCopy, visibleCharacters),
    [selectedCopy, visibleCharacters],
  );
  const isTyping = visibleCharacters < getCopyLength(selectedCopy);
  const introEnd = selectedCopy.intro.length;
  const leadEnd = introEnd + selectedCopy.lead.length;
  const highlightEnd = leadEnd + selectedCopy.highlight.length;
  const selectedCareer = (language === 'ko' ? careerProfilesKo : careerProfilesEn)[careerRole];
  const selectedResumeUrl = getResumeUrl(content.contactItems, careerRole) ?? selectedCareer.resumeHref;
  const featuredProjects = useMemo(
    () => selectFeaturedProjects(portfolioProjects, careerRole, selectedCareer.projects),
    [portfolioProjects, careerRole, selectedCareer.projects],
  );

  const selectLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    setHasSelectedLanguage(true);
    setVisibleCharacters(getCopyLength(heroCopy[nextLanguage]));
  };

  const handleScroll = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const openProject = (project: PortfolioProject) => {
    window.dispatchEvent(new CustomEvent<PortfolioProject>('portfolio:open-project', { detail: project }));
  };

  const handleCareerTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, role: CareerRole) => {
    const currentIndex = careerRoleOrder.indexOf(role);
    let nextIndex = currentIndex;

    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % careerRoleOrder.length;
    if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + careerRoleOrder.length) % careerRoleOrder.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = careerRoleOrder.length - 1;
    if (nextIndex === currentIndex) return;

    event.preventDefault();
    const nextRole = careerRoleOrder[nextIndex];
    setCareerRole(nextRole);
    document.getElementById(`career-tab-${nextRole}`)?.focus();
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.16, delayChildren: 0.15 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: 'easeOut' },
    },
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-[calc(100vh-5rem)] w-full items-center justify-center overflow-hidden"
    >
      {onEdit && <EditButton label="Hero" onClick={onEdit} />}

      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[8%] top-[18%] h-72 w-72 rounded-full bg-blue-500/20 blur-3xl dark:bg-blue-600/15" />
        <div className="absolute bottom-[8%] right-[5%] h-[30rem] w-[30rem] rounded-full bg-purple-500/25 blur-3xl dark:bg-purple-500/20" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto w-full max-w-7xl px-2 py-12 sm:px-6 lg:px-12"
      >
        <div className="grid items-center gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:gap-x-10 lg:gap-y-0">
          <div className="hero-copy-column min-w-0 text-left lg:col-start-1 lg:row-start-1">
            <motion.div variants={itemVariants} className="mb-8 flex items-center gap-2" role="group" aria-label={language === 'ko' ? '언어 선택' : 'Select language'}>
              {([
                ['ko', '한글'],
                ['en', 'English'],
              ] as const).map(([value, label]) => {
                const isActive = language === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => selectLanguage(value)}
                    aria-pressed={isActive}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                      isActive
                        ? 'border-violet-500 bg-violet-500 text-white shadow-lg shadow-violet-500/20'
                        : 'border-gray-300 bg-white/60 text-gray-600 hover:border-violet-400 hover:text-violet-600 dark:border-white/20 dark:bg-white/5 dark:text-gray-300 dark:hover:border-violet-400 dark:hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </motion.div>

            <div aria-live="polite" aria-label={`${selectedCopy.intro} ${selectedCopy.lead} ${selectedCopy.highlight} ${selectedCopy.statement}`}>
              <p className="mb-2 min-h-9 text-2xl font-bold tracking-tight text-gray-900 dark:text-white md:text-3xl">
                {visibleCopy.intro}
                {isTyping && visibleCharacters <= introEnd && <span className="hero-typing-cursor" aria-hidden="true" />}
              </p>
              <h1 className={`min-h-[9rem] text-[2.55rem] font-bold leading-[1.08] tracking-tight text-gray-900 dark:text-white sm:text-5xl md:min-h-[10.5rem] md:text-6xl lg:text-[3.65rem] ${language === 'ko' ? 'hero-korean-copy' : ''}`}>
                <span className={`block ${language === 'ko' ? 'whitespace-pre-line' : ''}`}>
                  {visibleCopy.lead}
                  {isTyping && visibleCharacters > introEnd && visibleCharacters <= leadEnd && <span className="hero-typing-cursor" aria-hidden="true" />}
                </span>
                <span className={`hero-name-gradient block pb-2 ${language === 'ko' ? 'whitespace-pre-line font-extrabold' : ''}`}>
                  {visibleCopy.highlight}
                  {isTyping && visibleCharacters > leadEnd && visibleCharacters <= highlightEnd && <span className="hero-typing-cursor" aria-hidden="true" />}
                </span>
              </h1>
              {(selectedCopy.statement || (isTyping && visibleCharacters > highlightEnd)) && (
                <p className="mt-7 min-h-[7.5rem] whitespace-pre-line text-3xl font-bold leading-[1.28] tracking-tight text-gray-800 dark:text-white sm:text-4xl md:text-5xl md:leading-[1.35]">
                  {visibleCopy.statement}
                  {isTyping && visibleCharacters > highlightEnd && <span className="hero-typing-cursor" aria-hidden="true" />}
                </p>
              )}
            </div>
          </div>

          <div className="relative mx-auto flex w-full max-w-[31rem] items-end justify-center self-end lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <div className="absolute bottom-[8%] h-[68%] w-[86%] rounded-full bg-gradient-to-br from-violet-400/15 via-fuchsia-400/20 to-purple-600/35 blur-2xl dark:from-violet-500/10 dark:to-purple-500/25" />
            <img
              src={useRealProfile ? realYunjiAvatar : content.heroAvatarUrl || yunjiAvatar}
              alt={useRealProfile ? 'Kim Yun Ji profile portrait' : 'Kim Yun Ji 3D character'}
              width={useRealProfile ? 724 : 522}
              height={useRealProfile ? 1012 : 627}
              decoding="async"
              fetchPriority="high"
              className="relative z-10 max-h-[43rem] w-full object-contain object-bottom drop-shadow-[0_24px_42px_rgba(79,42,112,0.32)]"
            />
          </div>

          <motion.div
            variants={itemVariants}
            className="lg:col-start-1 lg:row-start-2 lg:mt-10"
          >
            <p className="mb-3 text-sm font-bold tracking-[0.16em] text-violet-600 dark:text-violet-300">
              {language === 'ko' ? '지원 직무' : 'Target Roles'}
            </p>
            <div
              role="tablist"
              aria-label={language === 'ko' ? '지원 직무 선택' : 'Select a target role'}
              className="flex flex-col gap-2 sm:flex-row sm:flex-wrap"
            >
              {careerRoleOrder.map((role) => {
                const isActive = careerRole === role;

                return (
                  <button
                    key={role}
                    id={`career-tab-${role}`}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls="career-profile-panel"
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => setCareerRole(role)}
                    onKeyDown={(event) => handleCareerTabKeyDown(event, role)}
                    className={`w-full rounded-xl border px-4 py-3 text-sm font-bold transition-all duration-200 sm:w-auto ${
                      isActive
                        ? 'border-violet-500 bg-violet-500 text-white shadow-lg shadow-violet-500/20'
                        : 'border-gray-300 bg-white/70 text-gray-700 hover:border-violet-400 hover:text-violet-600 dark:border-white/15 dark:bg-white/5 dark:text-gray-200 dark:hover:border-violet-400'
                    }`}
                  >
                    {(language === 'ko' ? careerProfilesKo : careerProfilesEn)[role].tabLabel}
                  </button>
                );
              })}
            </div>
          </motion.div>

          <motion.article
            key={careerRole}
            id="career-profile-panel"
            role="tabpanel"
            aria-labelledby={`career-tab-${careerRole}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="relative mt-3 overflow-hidden rounded-3xl border border-violet-200/90 bg-white/90 p-5 shadow-[0_24px_70px_rgba(124,58,237,0.13)] ring-1 ring-white/80 backdrop-blur-2xl dark:border-violet-300/20 dark:bg-white/[0.08] dark:ring-white/10 sm:p-8 lg:col-span-2 lg:mt-6 lg:p-10"
          >
            <div aria-hidden="true" className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/80 to-transparent" />
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">
                  {selectedCareer.label}
                </p>
                <h2 className="mt-4 text-2xl font-extrabold leading-tight text-gray-900 dark:text-white sm:text-3xl lg:text-4xl">
                  <span className="block">{selectedCareer.lead}</span>
                  <span className="hero-name-gradient block pb-1">{selectedCareer.title}</span>
                </h2>
                <p className="mt-5 text-base leading-7 text-gray-700 dark:text-gray-300 sm:text-lg">
                  {selectedCareer.description}
                </p>
                <p className="mt-5 rounded-2xl bg-violet-50 px-5 py-4 font-semibold leading-7 text-violet-950 dark:bg-violet-500/10 dark:text-violet-100">
                  {selectedCareer.proof}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
                  {language === 'ko' ? '주요 수치' : 'Key Numbers'}
                </h3>
                <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-4">
                  {selectedCareer.numbers.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-violet-100 bg-white/80 p-3 text-center dark:border-white/10 dark:bg-white/5 sm:p-5">
                      <strong className="block text-2xl font-black text-violet-600 dark:text-violet-300 sm:text-3xl">
                        {item.value}
                      </strong>
                      <span className="mt-2 block text-[0.68rem] font-bold leading-4 text-gray-600 dark:text-gray-300 sm:text-xs">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
                {selectedCareer.note && (
                  <p className="mt-3 text-xs leading-5 text-gray-500 dark:text-gray-400">
                    ※ {selectedCareer.note}
                  </p>
                )}

                <h3 className="mt-7 text-sm font-extrabold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
                  {language === 'ko' ? '핵심 기술' : 'Core Skills'}
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedCareer.skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-blue-500/10 px-3 py-1.5 text-sm font-semibold text-blue-700 dark:bg-cyan-400/10 dark:text-cyan-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10">
              <div className="flex items-end justify-between gap-4">
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white sm:text-2xl">
                  {language === 'ko' ? '대표 프로젝트' : 'Featured Projects'}
                </h3>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{language === 'ko' ? '대표 프로젝트 3개' : '3 selected projects'}</span>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {featuredProjects.map((project, index) => {
                  const siteUrl = project.link ?? project.projectLinks?.[0]?.url;
                  const projectCopy = getProjectCardText(project, language);

                  return (
                    <article key={project.id} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white/70 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/5">
                      <button
                        type="button"
                        onClick={() => openProject(project)}
                        className="flex flex-1 flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-500"
                        aria-label={`${projectCopy.title} ${language === 'ko' ? '상세 내용 보기' : 'view details'}`}
                      >
                        <div className="relative aspect-[8/5] w-full shrink-0 overflow-hidden bg-gradient-to-br from-blue-500/10 to-violet-500/15">
                          {project.visualType === 'chart' && (project.chartPoints?.length ?? 0) > 0 ? (
                            <ProjectLineChart points={project.chartPoints ?? []} className="rounded-none" />
                          ) : project.image && (
                            <ProgressiveImage
                              src={getProjectThumbnail(project)}
                              alt={`${projectCopy.title} ${language === 'ko' ? '프로젝트 대표 화면' : 'project cover'}`}
                              width={800}
                              height={500}
                              loading="lazy"
                              decoding="async"
                              wrapperClassName="h-full w-full"
                              className="h-full w-full group-hover:scale-105"
                              style={{
                                objectFit: project.thumbnailFit ?? 'cover',
                                objectPosition: project.thumbnailPosition ?? 'center',
                                transform: `scale(${project.thumbnailScale ?? 1})`,
                                transformOrigin: 'center',
                              }}
                            />
                          )}
                          <span className="absolute left-3 top-3 rounded-full bg-gray-950/75 px-2.5 py-1 text-xs font-black text-white backdrop-blur-sm">
                            0{index + 1}
                          </span>
                        </div>
                        <div className="flex w-full flex-1 flex-col p-5">
                          <h4 className="text-lg font-extrabold text-gray-900 dark:text-white">{projectCopy.title}</h4>
                          <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                            {projectCopy.shortDesc || project.description}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {project.stack.slice(0, 3).map((skill) => (
                              <span key={skill} className="rounded-md bg-blue-500/10 px-2 py-1 text-[0.68rem] font-bold text-blue-700 dark:text-cyan-300">
                                {skill.replace(/^#+/, '')}
                              </span>
                            ))}
                          </div>
                          <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-extrabold text-violet-600 dark:text-violet-300">
                            {language === 'ko' ? '상세 내용 보기' : 'View details'} <ExternalLink className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </button>
                      {siteUrl && (
                        <a
                          href={siteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 border-t border-slate-200/80 px-5 py-3 text-sm font-extrabold text-gray-700 transition-colors hover:bg-violet-50 hover:text-violet-700 dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/10 dark:hover:text-violet-300"
                        >
                          <ExternalLink className="h-4 w-4" />
                          {language === 'ko' ? '사이트 바로가기' : 'Visit website'}
                        </a>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-slate-200/80 pt-6 dark:border-white/10 sm:flex-row sm:flex-wrap">
              {selectedResumeUrl && (
                <a
                  href={selectedResumeUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-bold text-white transition-colors hover:bg-violet-700"
                >
                  <Download className="h-4 w-4" />
                  {selectedCareer.resumeLabel}
                </a>
              )}
              <button
                type="button"
                onClick={scrollToProjects}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-3 font-bold text-white transition-all hover:shadow-lg hover:shadow-blue-500/30"
              >
                <ExternalLink className="h-4 w-4" />
                {selectedCareer.projectCtaLabel}
              </button>
              {selectedCareer.secondaryCtaLabel && (selectedCareer.secondaryCtaType === 'github' ? (
                <a
                  href="https://github.com/yunji117"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white/70 px-5 py-3 font-bold text-gray-800 transition-colors hover:border-violet-400 hover:text-violet-600 dark:border-white/15 dark:bg-white/5 dark:text-white"
                >
                  <Github className="h-4 w-4" />
                  {selectedCareer.secondaryCtaLabel}
                </a>
              ) : (
                <button
                  type="button"
                  onClick={scrollToProjects}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white/70 px-5 py-3 font-bold text-gray-800 transition-colors hover:border-violet-400 hover:text-violet-600 dark:border-white/15 dark:bg-white/5 dark:text-white"
                >
                  <ExternalLink className="h-4 w-4" />
                  {selectedCareer.secondaryCtaLabel}
                </button>
              ))}
            </div>
          </motion.article>
        </div>

        <motion.button
          type="button"
          onClick={handleScroll}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mx-auto mt-8 block rounded-full p-2"
          aria-label={language === 'ko' ? '소개 섹션으로 이동' : 'Go to About section'}
        >
          <ChevronDown className="h-8 w-8 text-gray-500 dark:text-gray-400" />
        </motion.button>
      </motion.div>
    </section>
  );
};

export default Hero;
