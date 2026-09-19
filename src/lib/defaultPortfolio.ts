import type { SiteContent, SkillGroup } from '../types/portfolio';

export const defaultSiteContent: SiteContent = {
  heroGreeting: "Hi, I'm",
  heroName: 'Yunji',
  heroDescription:
    '아름답고 모던한 인터페이스와 견고한 애플리케이션을 만드는 것을 좋아하는 풀스택 개발자입니다.',
  aboutParagraphs: [
    '안녕하세요! 4년제 대학교를 졸업하고, 현재는 풀스택 개발자를 꿈꾸며 성장 중인 KIM YUNJI입니다.',
    '평소 사람들에게 도움을 주는 일을 좋아하고, 더 넓은 세상에서 영향력을 주는 방법을 고민하다가 개발에 관심을 갖게 되었습니다.',
    '이후 본격적으로 개발을 공부하기 위해 풀스택 개발자 양성과정에 등록했고, 현재 React, JavaScript, Node.js, MySQL 등 프론트엔드부터 백엔드까지 폭넓게 배우고 있습니다.',
    '프로젝트 기반의 실습을 통해 로그인/회원가입 기능, 커뮤니티 게시판 등 실제 서비스를 구현하는 경험을 쌓고 있습니다.',
  ],
  aboutHighlights: [
    {
      iconName: 'Users',
      title: 'User-Centric Design',
      description: '사용자 중심의 UI/UX를 고려한 서비스 개발',
    },
    {
      iconName: 'Zap',
      title: 'Full-Stack Development',
      description: 'React, Node.js, MySQL 등 풀스택 기술 보유',
    },
    {
      iconName: 'CheckCircle2',
      title: 'Problem Solver',
      description: '실제 프로젝트를 통한 실무 경험 축적',
    },
  ],
  aboutCtaText: '끈기 있게 한 걸음씩 나아가고 있는 개발자입니다 👨‍💻',
  skillsFooter: '지속적으로 학습하고 새로운 기술을 탐구하는 개발자입니다 🚀',
  contactTitle: 'KIM YUNJI Contact',
  contactItems: [
    { label: 'Email', value: 'yunw0117@gmail.com', url: 'mailto:yunw0117@gmail.com' },
    { label: 'Instagram', value: '' },
    { label: 'Github', value: 'yunji117', url: 'https://github.com/yunji117' },
  ],
  thankYouText: 'Thank You •͜•',
};

export const defaultSkillGroups: SkillGroup[] = [
  {
    id: 'devops-tools',
    category: 'DevOps & Tools',
    iconName: 'GitBranch',
    color: 'from-green-500 to-emerald-500',
    items: [
      'Git / Github',
      'Notion',
      'Postman',
      'npm / yarn',
      'VS Code',
      'Slack',
      'AWS / Vercel / Github Action',
      'Ubuntu / PowerShell',
    ],
  },
  {
    id: 'backend-database',
    category: 'Backend & Database',
    iconName: 'Database',
    color: 'from-purple-500 to-pink-500',
    items: [
      'Node.js',
      'Express',
      'NestJS',
      'MongoDB / MySQL / PostgreSQL',
      'Firebase',
      'Supabase',
      'REST API',
      'Docker',
    ],
  },
  {
    id: 'frontend',
    category: 'Frontend',
    iconName: 'Code2',
    color: 'from-blue-500 to-cyan-500',
    items: [
      'HTML / CSS / Tailwind CSS',
      'React',
      'Next.js',
      'Vite',
      'JavaScript / TypeScript',
      'Electron',
      'Jest (Testing)',
    ],
  },
  {
    id: 'design-content',
    category: 'Design & Content',
    iconName: 'Palette',
    color: 'from-amber-500 to-rose-500',
    items: [
      'Figma (UI/UX Design)',
      'Adobe Photoshop',
      'CapCut',
      'VLLO',
      'Blender (3D Modeling)',
    ],
  },
];
