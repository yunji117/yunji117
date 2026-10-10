import type { SiteContent, SkillGroup } from '../types/portfolio';

export const defaultSiteContent: SiteContent = {
  heroGreeting: "Hi, I'm",
  heroName: 'Yunji',
  heroDescription:
    '아름답고 모던한 인터페이스와 견고한 애플리케이션을 만드는 것을 좋아하는 풀스택 개발자입니다.',
  aboutParagraphs: [
    '안녕하세요. 디자인 의도를 실제로 동작하는 웹 경험으로 구현하는 김윤지입니다.',
    'React와 TypeScript를 중심으로 사용자에게 필요한 정보를 명확하게 전달하고, 자연스럽게 탐색하고 행동할 수 있는 인터페이스를 만들고 있습니다. Figma를 활용한 화면 설계부터 프론트엔드 개발, 데이터 연동, 배포와 운영까지 웹서비스 제작의 전 과정을 경험했습니다.',
    '실무에서는 126개 제품의 커머스 상세페이지를 제작하며 제품의 강점과 구매 흐름을 시각적으로 설계했습니다. 개발 프로젝트에서는 Next.js, Supabase 등의 기술을 활용해 아이디어를 실제로 사용할 수 있는 서비스로 구현했습니다.',
    '보기 좋은 화면에 그치지 않고, 사용자의 경험과 서비스의 목적을 함께 생각하는 디자이너이자 개발자가 되고자 합니다.',
  ],
  aboutHighlights: [
    {
      iconName: 'Zap',
      title: 'DESIGN TO DEVELOPMENT',
      description: '디자인 의도를 반응형 웹 인터페이스로 정확하게 구현합니다.',
    },
    {
      iconName: 'CheckCircle2',
      title: 'SERVICE DEVELOPMENT',
      description: '기획부터 개발, 배포와 운영까지 서비스 제작 과정을 경험했습니다.',
    },
    {
      iconName: 'Users',
      title: '126 PRODUCT PAGES',
      description: '126개 제품의 상세페이지를 제작하며 제품별 정보 구조와 구매 흐름을 설계했습니다.',
    },
  ],
  aboutCtaText: '디자인과 개발을 연결해 아이디어를 실제 서비스로 완성합니다.',
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
