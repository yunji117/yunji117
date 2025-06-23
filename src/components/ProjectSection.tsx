// src/components/ProjectSection.tsx
import { useState } from "react";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";

const projects = [
  {
    title: "오늘 하루",
    imgSrc: "/img/FirstWrite.svg",
    description: "CRUD를 활용한 글쓰기 웹 서비스",
    stack: "HTML5/CSS3, JavaScript, Github, VS Code, npm, express",
    modal: {
      overview: "간단한 글쓰기를 할 수 있는 웹 서비스",
      goal: "CRUD 기능(글 작성, 보기, 수정, 삭제) 직접 구현",
      skill: "HTML, CSS, JavaScript, GitHub, VS Code, npm",
      difficulties: [
        "CRUD를 처음 다뤄봐서 데이터 저장/수정/삭제 로직이 헷갈렸다",
        "예제 코드와 문서 참고, 팀원들과 함께 코드 리뷰하며 해결했다"
      ],
      outputs: ["/img/FirstWrite.svg", "/img/Writing.svg", "/img/modal.svg"],
      codes: ["/img/Create.svg", "/img/Update.svg", "/img/Delete.svg"]
    }
  },
  {
  title: "리그오브레전드 벤픽",
  imgSrc: "/img/banpick.png",
  description: "게임 리그오브레전드의 챔피언 선택 과정을 실제처럼 체험할 수 있는 모의 벤픽 웹앱",
  stack: "HTML, Tailwind CSS, Git, Github, React, Vite, Figma, SQLite3, Nodemon, VS Code, Express.js, Node.js, npm, REST API",
  modal: {
    overview: "리그오브레전드(LoL)의 게임 시작 전 진행되는 '벤픽' 과정을 시뮬레이션할 수 있는 웹 서비스입니다. 실전과 유사한 환경에서 전략적으로 챔피언을 밴/픽할 수 있어, 초보자와 팀원 모두에게 실제 경험을 제공하고자 했습니다.",
    goal: "사용자가 실제 게임과 동일한 방식으로 챔피언을 밴 및 픽하며, 전략을 연습하고 팀원 간 의사소통을 연습할 수 있는 인터랙티브한 플랫폼 구축",
    skill: "HTML, Tailwind CSS, React, Vite, Node.js, Express.js, SQLite3, Figma, Git, Github, REST API, Nodemon, VS Code, npm",
    difficulties: [
      "Figma를 처음 사용하면서 단축키와 UI 기능에 익숙하지 않아 디자인 협업에 초반 어려움이 있었음.",
      "검색과 동료 피드백을 통해 Figma 기능과 워크플로우를 빠르게 습득하고 해결함.",
    ],
    // outputs: ["벤픽 메인 화면", "챔피언 상세 정보 팝업", "최종 결과 화면"],
    // codes: ["챔피언 리스트 컴포넌트 코드", "벤픽 상태관리 코드"]
  }
},
{
  title: "풉타임(POOP TIME)",
  imgSrc: "/img/Pooptime.svg",
  description: "짧은 시간에 의미있는 시간을 보내고 싶은 분들을 위한 웹 플랫폼",
  stack: "React 18, Vite, Tailwind CSS, Figma, Node.js, Express.js, MySQL, Git, GitHub, VS Code, REST API",
  modal: {
    overview: "풉타임은 사용자가 퀴즈, 커뮤니티 등 다양한 콘텐츠를 즐기며, 짧은 시간에도 알차게 놀 수 있는 웹 서비스입니다. 팀 프로젝트로, 기획부터 개발, 디자인까지 직접 참여했습니다.",
    goal: "누구나 쉽게 접근하고 재미있게 소통할 수 있는 짧은 시간용 웹 콘텐츠 플랫폼을 만드는 것. 실제 서비스처럼 CRUD, 회원가입, 로그인, 커뮤니티 등 다양한 실무 기능을 직접 구현하며 실력을 키우는 게 목표였어요.",
    skill: [
      "React 18, Vite, Tailwind CSS, JavaScript(ES6+), Figma, Node.js, Express.js, MySQL, REST API, Git, GitHub, VS Code, Nodemon"
    ],
    difficulties: [
      "팀원들과 Git 협업 과정에서 브랜치 충돌, PR(풀리퀘스트), 코드 리뷰 등 실무 환경의 협업 방식에 처음 적응하면서 어려움이 있었습니다.",
      "이를 해결하기 위해 작업별로 이슈를 생성하고, 각자 별도 브랜치에서 개발한 후 PR과 코드 리뷰를 통해 코드 품질과 팀 전체의 코드 이해도를 높였습니다.",
      "회원가입 기능 구현 시, 이메일 인증을 처음 시도하면서 인증 로직, 메일 전송 방식에 대한 이해가 부족해 시행착오를 겪었습니다.",
      "이메일 인증 구현에는 Nodemailer와 SMTP를 활용했으며, 공식 문서, 블로그, GPT 등 다양한 자료를 참고해 직접 기능을 완성하며 실무 경험을 쌓았습니다."
    ],
    // outputs: [
    //   "메인 화면 (퀴즈/커뮤니티 등 접근 가능)",
    //   "게시글/댓글 CRUD 기능 완성",
    //   "회원가입/로그인, 인증 기능 구현",
    //   "반응형 UI 적용",
    //   "Figma 디자인 시안과 실제 구현 비교"
    // ],
    // codes: [
    //   "퀴즈/커뮤니티 컴포넌트 구조 코드",
    //   "CRUD API 연동 및 상태관리 코드"
    // ]
  }
},
{
  title: "모투슛(Motoshoot)",
  imgSrc: "/img/Motoshoot.svg",
  description: "주식 초보자도 쉽게 가상 투자 경험을 쌓을 수 있는 실전형 모의투자 웹앱",
  stack: "Next.js, Tailwind CSS, React, TypeScript, NestJS, PostgreSQL, Supabase, Figma, Git, GitHub, Docker, 공공데이터포털 API",
  modal: {
    overview: "‘모투슛’은 초보 투자자들이 실제 주식 시장과 유사한 환경에서 가상으로 주식 매매를 연습할 수 있는 모의투자 웹 플랫폼입니다. 실시간 종목 정보, 차트, 주문, 거래내역 등 실전 기능을 구현했으며, 팀장으로서 전체 기획, 프론트엔드 UI/UX 설계, 데이터 연동 및 팀 협업을 주도했습니다. 실제 증권사(한국투자증권) API를 우선 검토했으나, 데이터 제공의 한계로 인해 공공데이터포털의 주식/금융 API를 적극적으로 활용했습니다.",
    goal: "투자 경험이 없는 사용자도 쉽고 재미있게 주식 거래의 기본을 익힐 수 있는 웹서비스를 개발. 실시간 종목 정보, 거래, 주문내역 등 실전 기능을 구현하여 실무 역량을 강화하고, 팀장으로서 프로젝트 리딩과 협업 역량까지 함께 성장하는 것이 목표였습니다.",
    skill: [
      "Next.js", "React", "TypeScript", "Tailwind CSS", "NestJS", "PostgreSQL", "Supabase", "공공데이터포털 Open API", "Figma", "Git", "GitHub",
    ],
    difficulties: [
      "팀장 역할로서 프로젝트 전체 기획과 일정 관리를 맡으며 팀원들과의 원활한 커뮤니케이션에 신경 썼습니다.",
      "특히 팀원 중 한 명이 소극적인 태도를 보여 진행에 약간의 어려움이 있었으나, 1:1 대화를 통해 동기부여와 역할 조율로 해결해 팀워크를 높였습니다.",
      "처음에는 한국투자증권 Open API를 사용하려 했으나, 필요한 종목/회사 정보가 부족하다는 한계가 있어, 공공데이터포털의 다양한 주식/금융 API로 빠르게 방향을 전환했습니다.",
      "회사별 종목 정보 API를 연동해 뷰(프론트 UI)만 먼저 구성해뒀는데, 실제 API 데이터를 설계된 UI 구조에 정확히 맵핑하는 과정에서 데이터 구조, 상태관리 등에 많은 시행착오가 있었습니다.",
      "API 문서와 예제 코드를 반복적으로 참고하며, 팀원들과 함께 페어프로그래밍 및 코드리뷰를 통해 문제를 해결했습니다."
    ],
    // outputs: [
    //   "실시간 종목 리스트 및 검색 UI 구현",
    //   "주문/매매 기능(가상 체결) 구현",
    //   "거래내역, 실적 차트, 기업 정보 등 다양한 데이터 시각화",
    //   "반응형 웹 UI, 사용자 친화적 대시보드 완성"
    // ],
    // codes: [
    //   "주식 종목 리스트 동적 렌더링 코드",
    //   "주문/체결 기능 및 API 연동 예시 코드"
    // ]
  }
},
{
  title: "DayTime",
  imgSrc: "/img/DayTime.svg",
  description: "일상에서 자주 사용하는 날짜와 시간 계산을 쉽고 빠르게 도와주는 웹앱",
  stack: "React, TypeScript, Vite, Tailwind CSS, dayjs, Git, GitHub, VS Code, Figma, Github Actions",
  isPersonal: true,
  modal: {
    overview: "DayTime은 날짜 계산, 시간 차이, 나이 계산, D-day 등 다양한 시간/날짜 관련 기능을 제공하는 개인 웹 프로젝트입니다. 복잡한 날짜 계산을 누구나 간편하게 사용할 수 있도록 직관적인 UI와 실용적인 기능에 집중했습니다.",
    goal: "누구나 손쉽게 날짜 및 시간 관련 계산을 할 수 있는 올인원 웹 도구를 만드는 것. 사용자 중심의 UX와 직관적 디자인을 목표로, 직접 UI/UX 설계와 프론트엔드 구현을 모두 담당했습니다.",
    skill: [
      "React", "TypeScript", "Vite", "Tailwind CSS", "dayjs", "Git", "GitHub", "VS Code", "Figma", "Actions"
    ],
    difficulties: [
      "여러 날짜 계산 로직(윤년, 월/일 계산 등)을 처음 설계하는 게 어려웠다.",
      "GPT와 검색, dayjs 활용으로 로직을 완성했다.",
      "나이와 띠(간지) 계산이 처음엔 맞지 않았다.",
      "Copilot 추천 코드와 배열, 기준일 적용으로 문제를 해결했다."
      ],
    outputs: [
      "/img/firstDayTime.svg",
      "/img/ingDayTime.svg",
      "/img/DayTimeQRcode.svg",
    ],
    codes: [
      "/img/Dayjscode.svg",
      "/img/Elcode.svg"
    ]
  }
},
{
  title: "Meal Picker",
  imgSrc: "/img/Mealpicker.svg",
  description: "오늘 메뉴 고민을 한 번에 해결하는 랜덤 식사 추천 웹앱",
  stack: "React, TypeScript, Vite, Tailwind CSS, Git, GitHub, VS Code, Figma, framer-motion, react-custom-roulette, Vercel",
  isPersonal: true,
  modal: {
    overview: "Meal Picker는 매일 반복되는 메뉴 고민을 덜어주는 식사 메뉴 추천 웹앱입니다. 한식, 중식, 양식 등 다양한 카테고리와 사용자 취향에 맞춘 필터링, 완전히 랜덤 추천 등 여러 방식으로 메뉴를 제안하여 일상 속 작은 결정을 쉽게 만들어 줍니다.",
    goal: "간편한 UI와 빠른 반응 속도를 바탕으로, 누구나 재미있게 식사 메뉴를 추천받을 수 있는 서비스를 구현하는 것. 사용자 중심의 UX 설계와 기능 단순화를 통해, 실제로 매일 쓸 수 있는 앱을 만드는 것을 목표로 했습니다.",
    skill: [
      "React", "TypeScript", "Vite", "Tailwind CSS", "Git", "GitHub", "VS Code", "Figma", "framer-motion", "react-custom-roulette", "Vercel"
    ],
    difficulties: [
      "룰렛 UI를 처음 구현하다 보니, 기능 설계와 랜덤 동작 구현에서 많은 고민이 있었다.",
      "react-custom-roulette 라이브러리를 활용해 구현을 빠르게 진행했다.",
      "룰렛 내부에 텍스트가 많아지면 글씨가 깨지거나 레이아웃이 무너지는 문제가 있었다.",
      "VSCode에 내장된 Copilot에 여러 번 물어보며, 추천 코드를 참고하고 CSS 속성(writing-mode, transform 등)을 조합해가며 문제를 해결했다."
    ],
    outputs: [
      "/img/firstmealpicker.svg",
      "/img/Mealpickerinsert.svg",
      "/img/MealpickerQRcode.svg",
    ],
    codes: [
      "/img/react-custom-roulettecode.svg",
    ]
  }
},
{
  title: "Runner Game",
  imgSrc: "/img/Runnergame.svg",
  description: "실시간으로 달리고 점프하며 장애물을 피하는 2D 러너 웹 게임",
  stack: "React, TypeScript, Vite, Canvas API, Git, GitHub, VS Code, Figma, AWS",
  isPersonal: true,
  modal: {
    overview: "Runner Game은 사용자가 키보드(또는 터치)로 캐릭터를 조작하여 장애물을 피하며 최대한 멀리 달리는 간단한 2D 러너 게임입니다. 실시간 게임 로직과 Canvas API 기반 애니메이션을 React 환경에서 직접 구현하며, 웹 프론트엔드에서 인터랙티브한 콘텐츠 제작 경험을 쌓았습니다.",
    goal: "간단한 규칙과 조작만으로도 누구나 즐길 수 있는 러너 게임을 웹에서 구현. 게임 루프, 충돌 판정, 점수 집계, 난이도 조절 등 핵심 게임 로직을 스스로 설계하여, 실시간 UI 업데이트 및 Canvas 기반 애니메이션 처리 능력을 키우는 것을 목표로 했습니다.",
    skill: [
      "React", "TypeScript", "Vite", "Canvas API", "Git", "GitHub", "VS Code", "Figma", "AWS"
    ],
    difficulties: [
      "2D 게임 그래픽 및 애니메이션을 직접 구현하는 데 어려움이 있었습니다.",
      "인터넷 검색과 GPT를 통해 PIXI.js를 알게 되었고, 이를 활용해 2D 게임을 성공적으로 구현했습니다.",
      "캐릭터가 달린 시간을 초 단위로 기록하고 싶었으나, 기본적으로 ms 단위로 기록되어 원하는 대로 동작하지 않았습니다.",
      "ms 누적용 변수를 만들어, 1초(1000ms)마다 score를 1씩 증가시키는 방식으로 개선했습니다.",
      "장애물 등장 타이밍을 점프 가능한 간격으로 랜덤하게 제어하는 부분이 어려웠습니다.",
      "이미지와 위치를 랜덤으로 지정하고, 장애물 배열과 상태를 관리하여 Pixi 무대에 동적으로 추가하는 로직으로 해결했습니다."
    ],
    outputs: [
      "/img/RunnerFirst.svg",
      "/img/running.svg",
      "/img/gameover.svg",
    ],
    codes: [
      "/img/UsepixiJS.svg",
      "/img/Mss.svg",
      "/img/Obj.svg",
    ]
  }
}
];

const ProjectSection = () => {
  const [modalIdx, setModalIdx] = useState<number | null>(null);

  return (
    <section id="project" className="min-h-screen flex items-center justify-center px-10">
      <div className="text-center w-full">
        <h2 className="text-2xl font-bold mb-6">PROJECT</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {projects.map((proj, i) => (
            <ProjectCard key={proj.title}
              title={proj.title}
              imgSrc={proj.imgSrc}
              description={proj.description}
              stack={proj.stack}
              onClick={() => setModalIdx(i)}
              isPersonal={proj.isPersonal}
            />
          ))}
        </div>
        {modalIdx !== null && (
          <ProjectModal
            open={true}
            onClose={() => setModalIdx(null)}
            title={projects[modalIdx].title}
            overview={projects[modalIdx].modal.overview}
            goal={projects[modalIdx].modal.goal}
            skill={
              Array.isArray(projects[modalIdx].modal.skill)
                ? projects[modalIdx].modal.skill
                : [projects[modalIdx].modal.skill] // string이면 배열로 감싸서 전달
            }
            difficulties={projects[modalIdx].modal.difficulties}
            outputs={projects[modalIdx].modal.outputs}
            codes={projects[modalIdx].modal.codes}
          />
        )}
      </div>
    </section>
  );
};

export default ProjectSection;
