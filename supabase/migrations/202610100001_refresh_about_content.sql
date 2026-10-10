update public.site_content
set
  about_paragraphs = array[
    '안녕하세요. 디자인 의도를 실제로 동작하는 웹 경험으로 구현하는 김윤지입니다.',
    'React와 TypeScript를 중심으로 사용자에게 필요한 정보를 명확하게 전달하고, 자연스럽게 탐색하고 행동할 수 있는 인터페이스를 만들고 있습니다. Figma를 활용한 화면 설계부터 프론트엔드 개발, 데이터 연동, 배포와 운영까지 웹서비스 제작의 전 과정을 경험했습니다.',
    '실무에서는 126개 제품의 커머스 상세페이지를 제작하며 제품의 강점과 구매 흐름을 시각적으로 설계했습니다. 개발 프로젝트에서는 Next.js, Supabase 등의 기술을 활용해 아이디어를 실제로 사용할 수 있는 서비스로 구현했습니다.',
    '보기 좋은 화면에 그치지 않고, 사용자의 경험과 서비스의 목적을 함께 생각하는 디자이너이자 개발자가 되고자 합니다.'
  ],
  about_highlights = '[
    {"iconName":"Zap","title":"DESIGN TO DEVELOPMENT","description":"디자인 의도를 반응형 웹 인터페이스로 정확하게 구현합니다."},
    {"iconName":"CheckCircle2","title":"SERVICE DEVELOPMENT","description":"기획부터 개발, 배포와 운영까지 서비스 제작 과정을 경험했습니다."},
    {"iconName":"Users","title":"126 PRODUCT PAGES","description":"126개 제품의 상세페이지를 제작하며 제품별 정보 구조와 구매 흐름을 설계했습니다."}
  ]'::jsonb,
  about_cta_text = '디자인과 개발을 연결해 아이디어를 실제 서비스로 완성합니다.',
  updated_at = now()
where id = 'main';
