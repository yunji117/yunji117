import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { X, ExternalLink, Github } from 'lucide-react';

// 이미지 경로 helper
const getImagePath = (imageName: string) => {
  return new URL(`../assets/img/${imageName}`, import.meta.url).href;
};

interface Project {
  id: number;
  title: string;
  description: string;
  shortDesc: string;
  image: string;
  category: 'personal' | 'team';
  stack: string[];
  overview: string;
  goal: string;
  difficulties: string[];
  outputs?: string[];
  challengeImages?: string[];
  link?: string;
  github?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: '오늘 하루',
    shortDesc: 'CRUD를 활용한 글쓰기 웹 서비스',
    description: '간단한 글쓰기를 할 수 있는 웹 서비스로 CRUD 기능을 직접 구현한 개인 프로젝트',
    image: getImagePath("FirstWrite.svg"),
    category: 'team',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'Express', 'GitHub'],
    overview: '간단한 글쓰기를 할 수 있는 웹 서비스입니다. CRUD 기능을 처음으로 직접 구현해본 프로젝트입니다.',
    goal: 'CRUD 기능(글 작성, 보기, 수정, 삭제)을 직접 구현하여 웹 개발의 기본을 습득',
    difficulties: [
      'CRUD를 처음 다뤄봐서 데이터 저장/수정/삭제 로직이 헷갈렸습니다.',
      '예제 코드와 문서 참고, 팀원들과 함께 코드 리뷰하며 해결했습니다.'
    ],
    outputs: [
      getImagePath("FirstWrite.svg"),
      getImagePath("modal.svg"),
      getImagePath("write.png"),
      getImagePath("Writing.svg"),
      getImagePath("writingcut.png"),
    ],
    challengeImages: [
      getImagePath("Create.svg"),
      getImagePath("Update.svg"),
      getImagePath("Delete.svg"),
    ],
  },
  {
    id: 2,
    title: '리그오브레전드 벤픽',
    shortDesc: '게임 벤픽 과정을 실제처럼 체험할 수 있는 모의 벤픽 웹앱',
    description: '리그오브레전드의 챔피언 선택 과정을 실제처럼 체험할 수 있는 모의 벤픽 웹앱',
    image: getImagePath("banpick.png"),
    category: 'team',
    stack: ['React', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'SQLite3', 'Figma'],
    overview:
      '리그오브레전드(LoL)의 게임 시작 전 진행되는 "벤픽" 과정을 시뮬레이션할 수 있는 웹 서비스입니다. 실전과 유사한 환경에서 전략적으로 챔피언을 밴/픽할 수 있습니다.',
    goal: '사용자가 실제 게임과 동일한 방식으로 챔피언을 밴 및 픽하며, 전략을 연습할 수 있는 인터랙티브한 플랫폼 구축',
    difficulties: [
      'Figma를 처음 사용하면서 단축키와 UI 기능에 익숙하지 않아 디자인 협업에 초반 어려움이 있었습니다.',
      '검색과 동료 피드백을 통해 Figma 기능과 워크플로우를 빠르게 습득하고 해결했습니다.',
    ],
    outputs: [getImagePath("banpick.png")],
  },
  {
    id: 3,
    title: '풉타임 (POOP TIME)',
    shortDesc: '짧은 시간에 의미있는 시간을 보내는 웹 플랫폼',
    description: '퀴즈, 커뮤니티 등 다양한 콘텐츠로 짧은 시간을 알차게 보낼 수 있는 웹 플랫폼',
    image: getImagePath("Pooptime.svg"),
    category: 'team',
    stack: ['React', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'MySQL', 'TypeScript'],
    overview:
      '풉타임은 사용자가 퀴즈, 커뮤니티 등 다양한 콘텐츠를 즐기며, 짧은 시간에도 알차게 놀 수 있는 웹 서비스입니다.',
    goal: '누구나 쉽게 접근하고 재미있게 소통할 수 있는 짧은 시간용 웹 콘텐츠 플랫폼을 구축하고, 실제 서비스처럼 CRUD, 회원가입, 로그인, 커뮤니티 등 다양한 실무 기능을 직접 구현',
    difficulties: [
      '팀원들과 Git 협업 과정에서 브랜치 충돌, PR, 코드 리뷰 등 실무 환경의 협업 방식에 처음 적응하며 어려움이 있었습니다.',
      '이를 해결하기 위해 작업별로 이슈를 생성하고, 각자 별도 브랜치에서 개발한 후 PR과 코드 리뷰를 통해 코드 품질을 높였습니다.',
      '회원가입 기능 구현 시 이메일 인증을 처음 시도하면서 인증 로직에 대한 이해가 부족했습니다.',
      'Nodemailer와 SMTP를 활용해 기능을 완성하며 실무 경험을 쌓았습니다.',
    ],
    outputs: [
      getImagePath("pooptime.png"),
      getImagePath("Pooptime.svg"),
    ],
  },
  {
    id: 4,
    title: '모투슛 (Motoshoot)',
    shortDesc: '주식 초보자도 쉽게 가상 투자 경험을 쌓을 수 있는 모의투자 웹앱',
    description: '실제 주식 시장과 유사한 환경에서 가상으로 주식 매매를 연습할 수 있는 모의투자 웹 플랫폼',
    image: getImagePath("Motoshoot.svg"),
    category: 'team',
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'NestJS', 'PostgreSQL', 'Supabase', 'Docker'],
    overview:
      '"모투슛"은 초보 투자자들이 실제 주식 시장과 유사한 환경에서 가상으로 주식 매매를 연습할 수 있는 모의투자 웹 플랫폼입니다.',
    goal: '투자 경험이 없는 사용자도 쉽고 재미있게 주식 거래의 기본을 익힐 수 있는 웹 서비스를 개발하고, 팀장으로서 프로젝트 리딩과 협업 역량 강화',
    difficulties: [
      '팀장 역할로서 프로젝트 전체 기획과 일정 관리를 맡으며 팀원들과의 원활한 커뮤니케이션에 신경 썼습니다.',
      '처음에는 한국투자증권 Open API를 사용하려 했으나, 필요한 종목/회사 정보가 부족해 공공데이터포털의 API로 빠르게 방향을 전환했습니다.',
      'API 데이터를 설계된 UI 구조에 정확히 맵핑하는 과정에서 데이터 구조, 상태관리 등에 많은 시행착오가 있었습니다.',
      '페어프로그래밍 및 코드리뷰를 통해 문제를 해결했습니다.',
    ],
    outputs: [getImagePath("Motoshoot.svg")],
  },
  {
    id: 5,
    title: 'DayTime',
    shortDesc: '날짜 계산 및 시간 관련 기능을 제공하는 올인원 웹 도구',
    description: '날짜 계산, 시간 차이, 나이 계산, D-day 등 다양한 시간/날짜 관련 기능을 제공하는 개인 웹 프로젝트',
    image: getImagePath("DayTime.svg"), 
    category: 'personal',
    stack: ['React', 'Vite', 'TypeScript', 'Tailwind CSS', 'dayjs', 'Git', 'GitHub', 'VS Code', 'Figma', 'Actions'],
    overview: 'DayTime은 날짜 계산, 시간 차이, 나이 계산, D-day 등 다양한 시간/날짜 관련 기능을 제공하는 개인 웹 프로젝트입니다. 복잡한 날짜 계산을 누구나 간편하게 사용할 수 있도록 직관적인 UI와 실용적인 기능에 집중했습니다.',
    goal: '누구나 손쉽게 날짜 및 시간 관련 계산을 할 수 있는 올인원 웹 도구를 만드는 것. 사용자 중심의 UX와 직관적 디자인을 목표로, 직접 UI/UX 설계와 프론트엔드 구현을 모두 담당했습니다.',
    difficulties: [
      '여러 날짜 계산 로직(윤년,월/일 계산 등)을 처음 설계하는 게 어려웠다.',
      'GPT와 검색, dayjs 활용으로 로직을 완성했다.',
      '나이와 띠(간지) 계산이 처음엔 맞지 않았다.',
      'Copilot 추천 코드와 배열, 기준일 적용으로 문제를 해결했다.',
    ],
    outputs: [
      getImagePath("firstDayTime.svg"),
      getImagePath("ingDayTime.svg"),
      getImagePath("DayTimeQR.svg"),
    ],
    challengeImages: [
      getImagePath("Dayjscode.svg"),
      getImagePath("Elcode.svg"),
    ],
    link: 'https://getdaytimes.com',
  },
  {
    id: 6,
    title: 'Meal Picker',
    shortDesc: '식사 메뉴 추천 웹앱',
    description: '매일 반복되는 메뉴 고민을 덜어주는 식사 메뉴 추천 웹앱입니다.',
    image: getImagePath("Mealpicker.svg"), 
    category: 'personal',
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Git', 'GitHub', 'VS Code', 'Figma', 'framer-motion', 'react-custom-roulette', 'Vercel'],
    overview: 'Meal Picker는 매일 반복되는 메뉴 고민을 덜어주는 식사 메뉴 추천 웹앱입니다. 한식, 중식, 양식 등 다양한 카테고리와 사용자 취향에 맞춘 필터링, 완전히 랜덤 추천 등 여러 방식으로 메뉴를 제안하여 일상 속 작은 결정을 쉽게 만들어 줍니다.',
    goal: '간편한 UI와 빠른 반응 속도를 바탕으로, 누구나 재미있게 식사 메뉴를 추천받을 수 있는 서비스를 구현하는 것. 사용자 중심의 UX 설계와 기능 단순화를 통해, 실제로 매일 쓸 수 있는 앱을 만드는 것을 목표로 했습니다.',
    difficulties: [
      '룰렛 UI를 처음 구현하다 보니, 기능 설계와 랜덤 동작 구현에서 많은 고민이 있었다.',
      'react-custom-roulette 라이브러리를 활용해 구현을 빠르게 진행했다.',
      '룰렛 내부에 텍스트가 많아지면 글씨가 깨지거나 레이아웃이 무너지는 문제가 있었다.',
      'VSCode에 내장된 Copilot에 여러 번 물어보며, 추천 코드를 참고하고 CSS 속성(writing-mode, transform 등)을 조합해가며 문제를 해결했다.',
    ],
    outputs: [
      getImagePath("Mealpicker.svg"),
      getImagePath("Mealpickerinsert.svg"),
      getImagePath("MealpickerQRcode.svg"),
    ],
    challengeImages: [
      getImagePath("react-custom-roulettecode.svg"),
    ],
    link: 'https://whatlunch.getdaytimes.com/lunch',
  },
  {
    id: 7,
    title: 'Runner Game',
    shortDesc: '장애물을 피하며 달리는 2D 러너 게임 웹앱',
    description: '키보드 또는 터치 조작으로 캐릭터를 움직이며 장애물을 피하고 점수를 쌓는 2D 러너 게임 웹앱입니다.',
    image: getImagePath("Runnergame.svg"), 
    category: 'personal',
    stack: ['React', 'TypeScript', 'Vite', 'Canvas API', 'Git', 'GitHub', 'VS Code', 'Figma', 'AWS'],
    overview: 'Runner Game은 사용자가 키보드(또는 터치)로 캐릭터를 조작하여 장애물을 피하며 최대한 멀리 달리는 간단한 2D 러너 게임입니다. 실시간 게임 로직과 Canvas API 기반 애니메이션을 React 환경에서 직접 구현하며, 웹 프론트엔드에서 인터랙티브한 콘텐츠 제작 경험을 쌓았습니다.',
    goal: '간단한 규칙과 조작만으로도 누구나 즐길 수 있는 러너 게임을 웹에서 구현. 게임 루프, 충돌 판정, 점수 집계, 난이도 조절 등 핵심 게임 로직을 스스로 설계하여, 실시간 UI 업데이트 및 Canvas 기반 애니메이션 처리 능력을 키우는 것을 목표로 했습니다.',
    difficulties: [ 
      '2D 게임 그래픽 및 애니메이션을 직접 구현하는 데 어려움이 있었습니다.',
      '인터넷 검색과 GPT를 통해 PIXI.js를 알게 되었고, 이를 활용해 2D 게임을 성공적으로 구현했습니다.',
      '캐릭터가 달린 시간을 초 단위로 기록하고 싶었으나, 기본적으로 ms 단위로 기록되어 원하는 대로 동작하지 않았습니다.',
      'ms 누적용 변수를 만들어, 1초(1000ms)마다 score를 1씩 증가시키는 방식으로 개선했습니다.',
      '장애물 등장 타이밍을 점프 가능한 간격으로 랜덤하게 제어하는 부분이 어려웠습니다.',
      '이미지와 위치를 랜덤으로 지정하고, 장애물 배열과 상태를 관리하여 Pixi 무대에 동적으로 추가하는 로직으로 해결했습니다.',
    ],
    
    outputs: [
      getImagePath("Runnergame.svg"),
      getImagePath("RunnerFirst.svg"),
      getImagePath("running.svg"),
    ],
    challengeImages: [
      getImagePath("UsepixiJS.svg"),
      getImagePath("Mss.svg"),
      getImagePath("Obj.svg"),
    ],
  },
  {
    id: 8,
    title: '부동산 매물 플랫폼',
    shortDesc: '논산 지역 중심의 부동산 매물 조회 및 상담 웹서비스',
    description: '논산 지역을 중심으로 원룸, 투룸, 아파트, 빌라, 상가, 토지 등 다양한 매물을 탐색하고 상담 문의까지 연결할 수 있는 부동산 웹 플랫폼입니다.',
    image: getImagePath("01-home-page.svg"),
    category: 'personal',
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Solapi', 'Git', 'GitHub', 'VS Code','Figma', 'aws', 'solapi'],
    overview: '논산 부동산 매물 플랫폼은 사용자가 다양한 부동산 매물을 조건별로 검색하고, 상세 정보를 확인한 뒤 바로 상담 문의까지 남길 수 있도록 만든 웹서비스입니다. 메인 매물 목록, 카테고리별 페이지, 상세 페이지, 최근 본 매물, 관심 매물, 관리자 등록/수정 기능까지 포함해 실제 운영을 고려한 흐름으로 구현했습니다.',
    goal: '부동산 중개 서비스에 필요한 매물 탐색, 상세 조회, 빠른 상담 연결, 관리자 중심의 매물 관리 기능을 하나의 웹서비스로 구현하는 것이 목표였습니다. 사용자는 원하는 조건의 매물을 쉽게 찾고, 관리자는 매물 정보와 커스텀 항목을 유연하게 운영할 수 있도록 구성해 실서비스에 가까운 구조를 만드는 데 집중했습니다.',
    difficulties: [
      '매물 종류와 거래 방식이 다양해지면서 목록 조회, 필터링, 상세 정보 구조를 일관되게 설계하는 과정이 쉽지 않았습니다.',
      '카테고리, 지역, 거래 유형, 가격 조건 등을 조합해 검색할 수 있도록 쿼리와 상태 구조를 분리해 관리하며 복잡도를 줄였습니다.',
      '초기 로딩 속도와 사용자 경험을 함께 챙기기 위해 서버 측 데이터 조회와 클라이언트 상호작용의 역할을 구분할 필요가 있었습니다.',
      'Next.js App Router 환경에서 서버 데이터 패칭과 클라이언트 컴포넌트를 분리하고, 일부 영역은 지연 로딩 방식으로 구성해 화면 응답성을 개선했습니다.',
      '실제 운영 환경에서는 매물 기본 정보 외에도 추가 입력 항목이 계속 바뀔 수 있어 관리자 화면의 확장성이 중요했습니다.',
      'Supabase와 커스텀 필드 구조를 활용해 관리자 페이지에서 동적으로 항목을 추가·수정할 수 있도록 설계하여 운영 편의성을 높였습니다.',
      '사용자가 바로 상담으로 이어질 수 있도록 간단한 문의 흐름과 데이터 저장 기능을 안정적으로 연결하는 과정도 필요했습니다.',
      '문자 상담 폼, 개인정보 동의, 문의 저장 로직을 구현해 매물 탐색에서 상담 접수까지 자연스럽게 이어지도록 구성했습니다.',
    ],
    
    outputs: [
      getImagePath("02-admin-login-page.svg"),
      getImagePath("03-property-create-page.svg"),
      getImagePath("04-property-detail-page.svg"),
    ],
    challengeImages: [
      getImagePath("custom-transaction-type-merge.svg"),
      getImagePath("transaction-type-merge-and-sort.svg"),
      getImagePath("transaction-price-query-mapping.svg"),
    ],
  },
  {
    id: 9,
    title: '부동산 중개보수 계산기',
    shortDesc: '매매, 전세, 월세의 예상 중개 수수료와 VAT를 빠르게 계산해주는 운영형 웹앱',
    description: '한국 부동산 거래에서 자주 헷갈리는 중개보수 상한 요율을 기준으로 예상 수수료를 계산해주는 개인 프로젝트입니다.',
    image: getImagePath("brokerage-calculator.svg"),
    category: 'personal',
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'CSS Modules', 'Next API Routes', 'next-sitemap', 'SEO', 'Resend'],
    overview: '부동산 중개보수 계산기는 한국 부동산 거래에서 사용자가 자주 헷갈리는 복비를 빠르게 확인할 수 있도록 만든 실용형 웹앱입니다. 단순 계산기에서 끝나지 않고, 부동산 유형과 거래 유형에 따라 법정 상한 요율을 적용하고, 협의 보수율과 VAT 안내, 문의 페이지, 개인정보처리방침, SEO 구조화 데이터까지 포함해 실제 공개 서비스 형태로 운영 중입니다.',
    goal: '사용자가 매매, 전세, 월세 조건만 입력하면 예상 중개 수수료와 참고 VAT를 즉시 확인할 수 있도록 만들고, 동시에 검색 유입과 운영 대응까지 고려한 실서비스 구조를 한 프로젝트 안에 구현하는 것이 목표였습니다.',
    difficulties: [
      '주택, 오피스텔, 주택 외 부동산은 유형과 거래 방식에 따라 법정 상한 요율과 계산 기준이 달라 단순 곱셈 계산기로는 처리하기 어려웠습니다.',
      '주택 매매·교환과 임대차 구간을 각각 분리하고, 일부 구간에 한도액까지 반영하는 구조로 계산 로직을 명확하게 설계했습니다.',
      '월세는 보증금과 월세를 그대로 더하는 방식이 아니라 환산보증금 규칙과 5천만원 미만 특례를 함께 반영해야 해서 사용자 혼란이 큰 영역이었습니다.',
      '월세 계산 시 보증금 + 월세 × 100을 기본으로 적용하고, 5천만원 미만 구간에서는 보증금 + 월세 × 70 특례까지 코드에 포함해 실제 현장 기준에 맞췄습니다.',
      '서비스 신뢰도를 높이려면 결과 숫자만 보여주는 것이 아니라 상한 요율인지, 실제 청구액인지, VAT가 참고치인지까지 해석 가이드를 제공해야 했습니다.',
      '결과 화면에 적용된 거래금액, 상한 요율, 한쪽 당 납부 기준, 협의 가능 여부, VAT 참고 안내를 함께 노출해 사용자가 계산 결과를 바로 이해할 수 있도록 구성했습니다.',
      '공개 서비스를 운영하려면 계산기 외에도 문의 대응, 정책 페이지, 메타 정보, 구조화 데이터 등 운영 요소가 필요했습니다.',
      '문의 폼과 메일 전송 API, 개인정보처리방침, WebApplication 및 FAQPage 구조화 데이터까지 포함해 실제 서비스 운영 흐름을 완성했습니다.',
    ],
    outputs: [
      getImagePath("brokerage-calculator.svg"),
      getImagePath("jeonse.svg"),
      getImagePath("contactus.svg"),
    ],
    challengeImages: [
      getImagePath("bclogic.svg")    
    ],
  },
];

const ProjectSection = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'personal' | 'team'>('all');
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    const shouldLockScroll = selectedProject !== null || selectedImage !== null;
    const { body } = document;
    const previousOverflow = body.style.overflow;

    if (shouldLockScroll) {
      body.style.overflow = 'hidden';
    }

    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [selectedProject, selectedImage]);

  const filteredProjects =
    activeCategory === 'all'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  const projectCardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
    hover: {
      y: -8,
      transition: { duration: 0.3 },
    },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };

  const handleModalTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.changedTouches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleModalTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const startedNearLeftEdge = touchStartRef.current.x <= 80;
    const isRightSwipe = deltaX > 90;
    const isMostlyHorizontal = Math.abs(deltaX) > Math.abs(deltaY) * 1.5;

    touchStartRef.current = null;

    if (startedNearLeftEdge && isRightSwipe && isMostlyHorizontal) {
      setSelectedProject(null);
    }
  };

  return (
    <section id="projects" className="relative py-20 lg:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="space-y-12"
        >
          {/* 섹션 제목 */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Featured <span className="text-gradient">Projects</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto mb-8" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              개인 프로젝트와 팀 프로젝트를 통해 실무 경험을 쌓아왔습니다
            </p>
          </motion.div>

          {/* 필터 탭 */}
          <motion.div variants={itemVariants} className="flex justify-center gap-4 flex-wrap">
            {['all', 'personal', 'team'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveCategory(tab as typeof activeCategory)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                  activeCategory === tab
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50'
                    : 'glass bg-white/85 text-gray-800 border border-slate-200/80 shadow-sm shadow-slate-200/60 hover:bg-white dark:bg-transparent dark:text-gray-300 dark:border-white/10 dark:shadow-none dark:hover:bg-white/10'
                }`}
              >
                {tab === 'all' ? 'All Projects' : tab === 'personal' ? 'Personal' : 'Team'}
              </button>
            ))}
          </motion.div>

          {/* 프로젝트 그리드 */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
          >
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={projectCardVariants}
                  whileHover="hover"
                  onClick={() => setSelectedProject(project)}
                  className="cursor-pointer glass rounded-2xl overflow-hidden bg-white/85 border border-slate-200/80 shadow-lg shadow-slate-200/60 hover:shadow-2xl dark:bg-transparent dark:border-white/10 dark:shadow-none dark:hover:shadow-cyan-500/30 transition-all duration-300"
                >
                  {/* 프로젝트 이미지 */}
                  <div className="relative h-56 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 overflow-hidden group">
                    {project.image && (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">View Details</span>
                    </div>
                  </div>

                  {/* 카테고리 배지 */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`inline-flex shrink-0 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${
                          project.category === 'personal'
                            ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                            : 'bg-purple-500/20 text-purple-600 dark:text-purple-400'
                        }`}
                      >
                        {project.category === 'personal' ? '개인 프로젝트' : '팀 프로젝트'}
                      </span>
                    </div>

                    {/* 프로젝트 제목 */}
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {project.title}
                    </h3>

                    {/* 프로젝트 설명 */}
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {project.shortDesc}
                    </p>

                    {/* 스택 태그 */}
                    <div className="flex flex-wrap gap-2">
                      {project.stack.slice(0, 3).map((tech, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-blue-500/20 text-blue-600 dark:text-cyan-400 px-2 py-1 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.stack.length > 3 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                          +{project.stack.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>

      {/* 프로젝트 상세 모달 */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleModalTouchStart}
              onTouchEnd={handleModalTouchEnd}
              className="max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-2xl p-8 backdrop-blur-xl bg-[rgba(255,253,248,0.75)] border border-[rgba(222,206,182,0.85)] shadow-[0_28px_80px_rgba(94,72,47,0.20)] dark:bg-slate-900/30 dark:border-white/10 dark:shadow-none"
            >
              {/* 닫기 버튼 */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 p-2 hover:bg-white/20 dark:hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-900 dark:text-white" />
              </button>

              {/* 모달 헤더 */}
              <div className="mb-8">
                {selectedProject.image && (
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-64 object-cover rounded-xl mb-6"
                  />
                )}
                <div className="flex flex-col items-start gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                    {selectedProject.title}
                  </h2>
                  <span
                    className={`inline-flex shrink-0 text-sm font-bold px-4 py-2 rounded-full whitespace-nowrap ${
                      selectedProject.category === 'personal'
                        ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                        : 'bg-purple-500/20 text-purple-600 dark:text-purple-400'
                    }`}
                  >
                    {selectedProject.category === 'personal' ? '개인 프로젝트' : '팀 프로젝트'}
                  </span>
                </div>
              </div>

              {/* 모달 콘텐츠 */}
              <div className="space-y-8">
                {/* Overview */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Project Overview
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {selectedProject.overview}
                  </p>
                </div>

                {/* Goal */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Goal</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {selectedProject.goal}
                  </p>
                </div>

                {/* Gallery */}
                {selectedProject.outputs && selectedProject.outputs.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Project Gallery
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedProject.outputs.map((img, idx) => (
                        <div
                          key={idx}
                          className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl dark:hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-105 cursor-zoom-in"
                          onClick={() => setSelectedImage(img)}
                        >
                          <img
                            src={img}
                            alt={`Gallery ${idx + 1}`}
                            className="w-full h-48 object-contain bg-gray-100 dark:bg-gray-800 p-2"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stack */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedProject.stack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-blue-500/20 text-blue-600 dark:text-cyan-400 rounded-lg font-semibold text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Difficulties */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Challenges & Solutions
                  </h3>
                  <ul className="space-y-3">
                    {selectedProject.difficulties.map((difficulty, idx) => (
                      <li
                        key={idx}
                        className="flex gap-3 text-gray-700 dark:text-gray-300 leading-relaxed"
                      >
                        <span className="text-cyan-400 font-bold flex-shrink-0 mt-1">→</span>
                        <span>{difficulty}</span>
                      </li>
                    ))}
                  </ul>
                    {selectedProject.challengeImages && selectedProject.challengeImages.length > 0 && (
                      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedProject.challengeImages.map((img, idx) => (
                          <div
                            key={idx}
                            className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl dark:hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-105 cursor-zoom-in"
                            onClick={() => setSelectedImage(img)}
                          >
                            <img
                              src={img}
                              alt={`Challenge ${idx + 1}`}
                              className="w-full h-48 object-contain bg-gray-100 dark:bg-gray-800 p-2"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                </div>

                {/* 하단 버튼 */}
                <div className="flex gap-4 pt-6 border-t border-white/10">
                  {selectedProject.github && (
                    <a
                      href={selectedProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors font-semibold"
                    >
                      <Github className="w-5 h-5" />
                      GitHub
                    </a>
                  )}
                  {selectedProject.link && (
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all font-semibold"
                    >
                      <ExternalLink className="w-5 h-5" />
                      Visit Project
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            key="image-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full"
            >
              <button
                className="absolute -top-10 right-0 text-white hover:text-gray-200"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-8 h-8" />
              </button>
              <img
                src={selectedImage}
                alt="Selected"
                className="w-full max-h-[80vh] object-contain rounded-xl bg-gray-900"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProjectSection;
