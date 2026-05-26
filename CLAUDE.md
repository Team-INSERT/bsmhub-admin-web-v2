# CLAUDE.md

## 프로젝트 개요

- Vite + React 19 + TypeScript SPA (Next.js 아님)
- TanStack Router (파일 기반 라우팅), TanStack Query, Supabase 백엔드
- shadcn/ui (Radix UI + Tailwind CSS) 컴포넌트 라이브러리
- pnpm 패키지 매니저 (버전은 `package.json`의 `packageManager` 필드로 고정), Node.js 22

## CI/CD 파이프라인

main 브랜치에 push/PR 시 GitHub Actions가 아래 5단계를 순서대로 실행한다.
하나라도 실패하면 CI 실패 → 배포 차단.

| 순서 | 명령어 | 검사 내용 |
|------|--------|-----------|
| 0 | `pnpm install --frozen-lockfile` | 의존성 설치 (lockfile 불일치, 빌드 스크립트 오류 등) |
| 1 | `pnpm lint` | ESLint 규칙 위반 |
| 2 | `pnpm knip` | 미사용 파일, export, 의존성 |
| 3 | `pnpm format:check` | Prettier 포맷 불일치 |
| 4 | `pnpm build` | TypeScript 타입 에러 + Vite 빌드 실패 |

## Push 전 필수 검증 (절대 규칙)

**CI가 통과하지 않는 코드는 절대로 push하지 않는다.**

코드를 push하기 전에 반드시 아래 명령어를 **모두** 실행하여 CI와 동일한 검증을 로컬에서 통과시킨다:

```sh
pnpm install --frozen-lockfile && pnpm lint && pnpm knip && pnpm format:check && pnpm build
```

- 하나라도 실패하면 push하지 않는다
- 실패한 체크를 먼저 수정한 뒤 전체를 다시 실행한다
- `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml` 등 설정 파일을 수정한 경우 `pnpm install --frozen-lockfile` 검증이 특히 중요하다

## 코드 작성 규칙

### ESLint (`pnpm lint`)

- `console.log`, `console.warn` 등 사용 금지 (`no-console: warn`)
- 미사용 변수는 `_` 접두사를 붙여야 에러 회피 가능 (`@typescript-eslint/no-unused-vars: error`)
- React Hooks 규칙 준수 (의존성 배열 누락 금지)
- 컴포넌트 파일에서 컴포넌트가 아닌 것을 export할 때는 `allowConstantExport: true`이므로 상수 export는 허용
- `src/components/ui/`는 ESLint 검사 제외 (shadcn/ui 생성 파일)

### Knip (`pnpm knip`)

- 새 파일이나 export를 생성하면 반드시 어딘가에서 import/사용해야 한다
- 새 패키지를 설치하면 반드시 코드에서 import해야 한다
- 기존 export를 제거할 때 해당 export를 사용하는 곳이 없는지 확인
- 검사 제외 대상: `src/components/ui/**`, `src/routeTree.gen.ts`, `src/utils/supabase/database.types.ts`

### Prettier (`pnpm format:check`)

- 세미콜론 없음
- 싱글 쿼트 (JSX 포함)
- 들여쓰기 2칸
- print width 80
- trailing comma: es5
- import 순서는 `@trivago/prettier-plugin-sort-imports`가 자동 정렬하므로 수동 정렬 불필요
- Tailwind 클래스 순서는 `prettier-plugin-tailwindcss`가 자동 정렬
- 코드 수정 후 `pnpm format`을 실행하면 자동 수정됨
- `.prettierignore`에 의해 `src/` 내부 파일과 설정 파일만 검사 대상

### TypeScript (`pnpm build` = `tsc -b && vite build`)

- strict 모드 활성화
- `noUnusedLocals: true` — 사용하지 않는 로컬 변수 금지
- `noUnusedParameters: true` — 사용하지 않는 파라미터 금지 (`_` 접두사로 회피)
- 경로 별칭: `@/*` → `./src/*` (예: `import { cn } from '@/lib/utils'`)
- `any` 타입 지양, 구체적 타입 사용

## 자동 생성 파일 (수동 편집 금지)

- `src/routeTree.gen.ts` — TanStack Router가 라우트 파일 기반으로 자동 생성
- `src/utils/supabase/database.types.ts` — Supabase 스키마에서 자동 생성

## 프로젝트 구조

```
src/
  routes/          # TanStack Router 파일 기반 라우트
    _authenticated/ # 인증 필요 라우트
    (auth)/         # 로그인/회원가입
    (errors)/       # 에러 페이지 (404, 500, 403)
  features/        # 도메인별 기능 모듈 (users, companies, tasks 등)
  components/
    ui/            # shadcn/ui 컴포넌트 (자동 생성, lint/knip 제외)
    layout/        # 레이아웃 컴포넌트 (sidebar, header)
  hooks/           # 커스텀 React hooks
  context/         # React Context providers
  stores/          # Zustand 상태 관리
  utils/           # 유틸리티 함수
  lib/             # 라이브러리 유틸 (cn 등)
  api/             # API 관련
  assets/          # 정적 자산
  config/          # 설정 파일
  constants/       # 상수
```

## 주요 기술 스택 참고

- 라우팅: `createFileRoute()` API 사용, `routes/` 디렉터리 구조가 곧 URL 구조
- 데이터 페칭: `useQuery`, `useMutation` (TanStack Query)
- 폼: `react-hook-form` + `zod` 스키마 검증
- 스타일: Tailwind CSS 유틸리티 클래스 + `cn()` 헬퍼 (`clsx` + `tailwind-merge`)
- 상태 관리: Zustand (전역), React Context (도메인별)
- 아이콘: `@tabler/icons-react`
