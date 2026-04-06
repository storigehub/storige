---
title: Storige 개발 진행 현황 요약
description: Claude Code 기준 정리 (CLAUDE.md·코드베이스 대조)
---

# Storige 폴더 개발 진행 현황 (Claude Code 기준 정리)

## 공식 진행 상태 (문서)

[CLAUDE.md](../CLAUDE.md)의 **현재 진행 상태** 블록에 따르면:

- **최종 업데이트:** 2026-04-06  
- **Phase:** 1  
- **스프린트:** 1-4 완료 (Phase 1 전체 완료로 표기)  
- **완료로 적힌 작업:**  
  - 1-1 프로젝트 초기화  
  - 1-2 DB 스키마 + RLS  
  - 1-3 Auth 모듈  
  - 1-4 레이아웃 + 네비  
- **다음 단계(문서상):** Phase 1 QC 검증 대기  
- **Supabase 프로젝트:** `uobbgxwuukwptqtywxxj` (ap-northeast-2) — [src/types/database.ts](../src/types/database.ts)에도 동일 project-id 주석이 있음  

[STORIGE_DEV_PLAN.md](../STORIGE_DEV_PLAN.md)의 Phase 1 완료 기준은 **로그인 후 빈 일기 목록** 수준인데, 실제 코드는 그 이상(일기 작성·뷰·에디터)까지 확장된 상태입니다.

---

## 레포에 실제로 있는 것 (코드 기준)

### 스택·설정

- **Next.js 16.2**, **React 19**, **Tailwind 4**, TypeScript ([package.json](../package.json))  
- **Supabase:** `@supabase/ssr`, 클라이언트/서버/미들웨어 헬퍼 — [src/lib/supabase/client.ts](../src/lib/supabase/client.ts), [server.ts](../src/lib/supabase/server.ts), [middleware.ts](../src/lib/supabase/middleware.ts)  
- **에디터:** Tiptap 관련 패키지 및 [src/components/editor/](../src/components/editor/) (RichTextEditor, Toolbar, MediaAttachment)  
- **기타 의존성:** TanStack Query, Zustand(패키지), Framer Motion, Capacitor(iOS/Android 등), Vitest + Testing Library  

### 라우트·화면

| 영역 | 경로/파일 | 비고 |
|------|-----------|------|
| 홈 | [src/app/page.tsx](../src/app/page.tsx) | `/diary`로 리다이렉트 |
| 인증 | `(auth)/login`, `(auth)/signup`, `auth/callback` | LoginForm, SignupForm, [useAuth](../src/hooks/useAuth.ts) |
| 메인 셸 | `(main)/layout.tsx` | Header, BottomNav, FAB 등과 조합 |
| 일기 | `(main)/diary`, `(main)/diary/new` | 목록·신규 작성 플로우 |

### 일기(Diary) 구현 범위 (Phase 2 계획과 겹침)

- 컴포넌트: 아코디언 항목, 리스트/캘린더/미디어 뷰, 검색 바, 에디터 래핑 등 — [src/components/diary/](../src/components/diary/)  
- 훅: `useDiaryList`, `useDiaryEditor`, `useMediaUpload`, `useGeoWeather`, `useDebounce` 등 — [src/hooks/](../src/hooks/)  
- **테스트:** [src/hooks/__tests__/useDiaryEditor.test.ts](../src/hooks/__tests__/useDiaryEditor.test.ts) (Vitest)  

### 데이터 모델(타입)

- [src/types/database.ts](../src/types/database.ts)에 `profiles`, `entries`, 미디어 등 **Supabase용 TypeScript 타입**이 정의되어 있음 (문서의 generate 명령 주석 포함).

---

## 레포에 없거나 문서와 어긋나는 점

- **마이그레이션 폴더:** [CLAUDE.md](../CLAUDE.md) 디렉터리 설명에는 `supabase/migrations`가 있으나, 현재 워크스페이스에는 **`supabase/` 디렉터리 자체가 없음**. 스키마/RLS는 Supabase 대시보드·다른 브랜치·또는 미커밋 상태일 수 있음.  
- **모듈 라우트:** 계획상 `(main)/dear`, `secret`, `album`, `publish`, `settings`, `(legacy)` 등은 **아직 `src/app`에 없음**.  
- **Zustand 스토어:** `src/stores/`는 비어 있거나 미사용 — 전역 상태는 아직 본격 도입 전으로 보임.  
- **미들웨어 파일명:** 세션 갱신 로직은 [src/lib/supabase/middleware.ts](../src/lib/supabase/middleware.ts)에 있고, [src/proxy.ts](../src/proxy.ts)가 `updateSession`을 호출함. Next의 표준 `middleware.ts` 배치 여부는 별도 확인이 필요할 수 있음(빌드/런타임 동작 점검은 QC 단계에서 해당).

---

## 한 줄 요약

**문서상으로는 Phase 1 완료·QC 대기이고, 코드는 Auth + 메인 레이아웃 + 일기 목록/작성·리치 텍스트·미디어/지도·날씨 훅까지 포함해 Phase 2 일기 축을 상당 부분 진행한 상태**이며, dear/secret 등 나머지 모듈과 레포 내 Supabase 마이그레이션은 아직 반영되지 않았습니다.
