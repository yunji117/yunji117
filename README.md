# Yunji Portfolio

React + TypeScript + Vite + Supabase 포트폴리오입니다.

## 로컬 실행

`.env.example`을 참고하여 `.env.local`에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`를 설정합니다. 브라우저에는 publishable/anon 키만 사용합니다.

```sh
npm ci
npm run dev
npm run build
npm run lint
node --test tests/*.test.mjs
```

## Supabase 적용 (2026-09-19)

- 기존 데이터베이스: SQL Editor에서 `supabase/migrations/202609190001_project_categories_sections.sql`을 실행합니다.
- 신규 데이터베이스: `supabase/schema.sql`을 실행합니다.
- 기존 `is_portfolio_admin()` 함수가 있어야 합니다. Google 관리자 계정은 스키마의 계정 또는 `portfolio_admins`에 등록된 사용자입니다. UI와 RLS 모두 이 함수를 사용합니다.
- `project_categories`는 공개 조회 및 관리자 추가만 허용하며 삭제/수정을 허용하지 않습니다. 프로젝트를 지워도 대주제는 남습니다.
- 프로젝트 중주제는 `projects.sections` JSONB에 `{ id, title, content }` 배열로 저장됩니다.

## Google 로그인과 배포

Supabase Authentication → URL Configuration에서 실제 포트폴리오 URL을 Site URL 및 Redirect URLs에 등록합니다. GitHub Pages 경로를 사용하는 경우 `/yunji117/`까지 포함해야 합니다. 로컬 검증용 `http://localhost:5173/yunji117/`도 Redirect URLs에 추가합니다. 로컬 포트가 다르면 해당 포트를 등록합니다.

OAuth 복귀 주소는 Vite의 `BASE_URL`을 포함합니다. Supabase가 세션을 브라우저에 보관하고 자동 갱신하며, UI는 `onAuthStateChange`에서 세션을 복원한 후 서버의 관리자 권한을 확인합니다. 로그인 직후에는 포트폴리오로 돌아오며 관리자 권한이 확인되면 프로젝트 목록 끝에 ＋ 카드가 표시됩니다. 하단 원형 버튼은 로그인된 계정과 관리자 메뉴를 열며, 권한 조회가 실패해도 로그인 창을 다시 열거나 로그아웃하지 않습니다. 관리자 화면에서 포트폴리오로 돌아와도 로그인은 유지됩니다. 관리자 데이터 로딩 오류 화면의 돌아가기 버튼 역시 로그아웃하지 않습니다.

GitHub 저장소 Settings → Secrets and variables → Actions에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`를 등록합니다. `.env.local`은 GitHub Actions에 전달되지 않으므로 이 두 값이 필요합니다. `dev` 브랜치 배포 워크플로에서 빌드 시 사용합니다.

## 프로젝트 등록

로그인 후 포트폴리오의 마지막 프로젝트 뒤에 나타나는 `+` 카드를 누릅니다. 대주제 선택 옆 `+`로 새로운 대주제를 먼저 저장하면 다음 등록에서도 선택할 수 있습니다. 대표/상세 이미지, 설명, 개요, 목표, 문제점과 해결방법을 입력하고, `중주제 추가하기`로 제목·내용 세트를 추가합니다. 스킬은 `#React #TypeScript`처럼 입력하고 공백/Enter 또는 입력란 밖을 누르면 개별 태그가 됩니다.

## 확인해야 할 운영 항목

빌드/린트는 로컬에서 검증 가능합니다. 실제 Google 로그인 → ＋ 카드 표시 → 관리자 진입 → 새로고침 → 포트폴리오 복귀 → 프로젝트 저장 → 다른 브라우저에서 공개 조회는 위 SQL과 배포 설정을 적용한 후 확인해야 합니다. 연결된 브라우저/관리자 DB 연결 없이는 OAuth와 실제 저장 성공을 검증할 수 없습니다.

## 로그인 상태 진단

- 하단 원형 버튼에서 `로그인된 계정`과 이메일이 보이면 세션은 유지되고 있습니다.
- 권한 오류 코드/메시지가 보이면 `is_portfolio_admin()` 및 관리자 등록을 확인합니다. 다시 확인 버튼은 세션을 유지한 채 권한만 조회합니다.
- 로그인 복귀 오류가 보이면 Supabase URL 허용 목록과 실제 접속 주소(호스트/포트/경로)가 일치하는지 확인합니다.
- 로그인 화면이 보이면 브라우저에 복원 가능한 세션이 없는 상태입니다. Google 로그인 전후 주소가 서로 다른 출처인지 확인합니다.
- `tests/portfolioAuth.test.mjs`는 새로고침 시 세션 복원, OAuth 로그인 이벤트, 권한 조회 실패와 재시도, 비관리자 로그인, 계정 전환/로그아웃 경쟁 상태, 복귀 오류, 구독 해제를 검증합니다. 실제 Google OAuth 로그인에 대한 종단간 테스트는 별도입니다.

## 2026-09-19 로그인 복귀 실패 원인

로컬 `.env.local`의 `VITE_SUPABASE_ANON_KEY`에 서버 전용 secret 키가 설정되어 있었습니다. 브라우저 요청에서 Supabase가 `401 Forbidden use of secret API key in browser`로 거부하여 OAuth 복귀 후 사용자 조회/세션 저장이 완료되지 않았습니다. publishable 키로 교체했습니다. Vite 시작/빌드와 클라이언트 설정에서 secret 및 service_role 키를 차단합니다.

이전에 브라우저 번들에 포함된 서버 전용 키는 Supabase Dashboard에서 폐기하고 재발급해야 합니다. OAuth 콜백의 전체 주소에도 인증 토큰이 있으므로 공유하지 않습니다.
