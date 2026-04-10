---
title: Sprint 6 상태 보고 — AI 자서전·추모관·랜딩 통합
updated: 2026-04-09
status: 일부 착수 / 결제 연동 후 재개 예정
---

# Sprint 6 진척 상태 및 재개 가이드

> 이 문서는 Sprint 6-1~6-3 작업이 **결제 시스템 연동을 우선하기 위해 중단된 시점**의 상태를 기록한다.  
> 다음 CTO가 재개할 때 이 문서를 먼저 읽고 시작한다.

---

## 0. 한 줄 요약

**Sprint 6-1(AI 자서전) 코드 50% 완성, DB 100% 적용. 앱 진입점(네비게이션) 미연결 상태로 중단.**  
Sprint 6-2(추모관), 6-3(랜딩) 미착수.

---

## 1. Sprint 6-1 — AI 자서전 (MyStory) 모듈

### 1.1 완료된 항목 ✅

| 파일 | 내용 |
|------|------|
| `src/lib/mystory/questions.ts` | 13개 카테고리 × 평균 5문 = 67개 질문 풀 (정적 이관) |
| `src/hooks/useMystory.ts` | `useMystorySessions`, `useMystoryInterview` 훅 — 세션 생성·저장·원고 생성 |
| `src/app/api/ai/interview/route.ts` | Claude Haiku 인터뷰어 API (질문 사이클링, 8개 메시지 컨텍스트) |
| `src/app/api/ai/manuscript/route.ts` | 자서전 원고 생성 API (500~800자, 1인칭 서술체) |
| `src/app/(main)/mystory/page.tsx` | 카테고리 그룹별 토픽 목록 + 챕터 진행도 히어로 |
| `src/app/(main)/mystory/[topicId]/page.tsx` | 인터뷰 채팅 화면 (진행도 바 + 원고 생성 버튼) |
| `src/app/(main)/mystory/preview/page.tsx` | 완성 원고 아코디언 뷰 + 인터뷰 이어하기 |
| `src/components/mystory/TopicCard.tsx` | 주제 카드 (상태 배지 + 진행 바) |
| `src/components/mystory/InterviewChat.tsx` | 채팅 UI (타이핑 인디케이터 + Enter 전송) |
| `supabase/migrations/20260409120000_mystory_sessions.sql` | `mystory_sessions` 테이블 + RLS |
| Supabase 프로덕션 DB | `mystory_sessions`, `memorial_pages`, `memorial_messages` 3개 테이블 + RLS 6개 정책 적용 완료 |

### 1.2 미완성 항목 ❌

| 항목 | 중요도 | 비고 |
|------|--------|------|
| **BottomNav 5번째 탭 + Header 사이드 메뉴에 `/mystory` 진입점 추가** | ✅ 완료 | BottomNav 프로필사진 탭 추가, Header 사이드메뉴는 기존에 포함 |
| 질문 풀 완성 (13→14 카테고리, 67→100개) | 🟡 중간 | 원본 mystory-khaki.vercel.app 질문 1개 카테고리 미이관 |
| `VoiceInput.tsx` — Capacitor 음성 입력 | 🟡 중간 | 계획에 있었으나 미구현 |
| `/mystory/publish/page.tsx` — 기존 출판 모듈 연결 | 🟡 중간 | 수익화 연결 필요 |
| 일기 데이터 → 자서전 소스 활용 시너지 | 🟢 낮음 | 고도화 기능 |
| 기존 MyStory(mystory-khaki.vercel.app) 사용자 데이터 가져오기 | 🟢 낮음 | JSON 가져오기 |
| mystory-khaki.vercel.app 리다이렉트 설정 | 🟢 낮음 | 외부 서비스 설정 |
| mystory 전용 E2E 테스트 | 🟢 낮음 | `e2e/mystory.spec.ts` |

### 1.3 재개 시 최소 작업 (배포 가능 기준)

```
1. Header.tsx의 SIDE_ITEMS에 mystory 항목 추가 (30분)
   { href: '/mystory', label: 'AI 자서전', icon: 'auto_stories' }

2. BottomNav 정책 결정: 5번째 탭 추가 or 사이드 메뉴 only (오너 결정 필요)
```

---

## 2. Sprint 6-2 — 디지털 추모관 (Remember) 모듈

### 2.1 완료된 항목 ✅

| 파일 | 내용 |
|------|------|
| `src/hooks/useMemorial.ts` | `useMyMemorial`, `usePublicMemorial`, `useMemorialAdmin` 3개 훅 |
| `src/types/database.ts` | `MemorialPage`, `MemorialMessage` 타입 정의 |
| Supabase 프로덕션 DB | `memorial_pages` + `memorial_messages` 테이블 + RLS 5개 정책 적용 완료 |

### 2.2 미착수 항목 ❌

| 파일 | 내용 |
|------|------|
| `src/app/(main)/memorial/[slug]/page.tsx` | 공개 추모 페이지 (비인증 접근) — 디렉토리 생성됨, 파일 없음 |
| `src/app/(main)/settings/memorial/page.tsx` | 추모관 설정 관리 — 디렉토리 생성됨, 파일 없음 |
| `src/components/memorial/` | 추모관 컴포넌트 전체 미구현 |
| 방명록 기능 | 메시지 작성 → 오너 승인 → 공개 플로우 |
| QR 코드 생성 | 장례식장용 |

### 2.3 DB 스키마 차이

> ⚠️ 통합가이드(`STORIGE_INTEGRATION_GUIDE.md`) 계획과 실제 구현된 DB 스키마가 다름

| 항목 | 계획 (`memorial_settings` + `guestbook_entries`) | 실제 (`memorial_pages` + `memorial_messages`) |
|------|------|------|
| 추모관 테이블명 | `memorial_settings` | `memorial_pages` |
| 방명록 테이블명 | `guestbook_entries` | `memorial_messages` |
| 슬러그 방식 | `public_url_slug` | `slug` |
| 승인 플로우 | 없음 | `is_approved` 필드로 오너 승인 방식 |

재개 시 `useMemorial.ts` 훅이 실제 DB 스키마(`memorial_pages`, `memorial_messages`)를 사용하므로, 통합가이드 스키마 예시는 무시하고 **실제 DB 기준**으로 구현한다.

---

## 3. Sprint 6-3 — 랜딩 리뉴얼 + 네비게이션 통합

### 3.1 완료된 항목

없음. 전체 미착수.

### 3.2 재개 시 작업 목록

```
1. Header SIDE_ITEMS / BottomNav에 mystory + memorial 진입점 추가
2. src/app/page.tsx (랜딩) 전체 서비스 소개로 재작성
   - 히어로: "기억을 저장하고, 내일을 준비합니다"
   - 서비스: 일기 → 편지 → AI 자서전 → 추모관
   - 가격/플랜 섹션
   - 앱 다운로드 CTA
3. storige.co.kr 서브도메인 연결 정책 결정 (오너)
   - remember.storige.co.kr/[slug] → 공개 추모관
   - app.storige.co.kr → 메인 앱
```

---

## 4. 전체 완성도 요약

```
Sprint 6-1 AI 자서전     ████████░░░░░░░░  50%  (코어 완성, 진입점 미연결)
Sprint 6-2 디지털 추모관  ████░░░░░░░░░░░░  25%  (DB + 훅만, UI 전체 미구현)
Sprint 6-3 랜딩 리뉴얼   ░░░░░░░░░░░░░░░░   0%  (미착수)
```

---

## 5. 재개 우선순위 (결제 연동 완료 후)

```
[P0] 6-1 마무리: Header에 /mystory 진입점 1줄 추가 → 사용자 접근 가능
[P1] 6-2 UI 구현: memorial 공개 페이지 + 설정 페이지
[P2] 6-1 심화: 음성 입력, 출판 연결, 질문 풀 보완
[P3] 6-3 랜딩: 전체 서비스 소개 페이지
[P4] 리다이렉트: mystory-khaki.vercel.app → /mystory, remember-storige → /memorial
```

---

## 6. 관련 문서

| 문서 | 용도 |
|------|------|
| `STORIGE_INTEGRATION_GUIDE.md` | 통합 전략 전체 계획 |
| `supabase/migrations/20260409120000_mystory_sessions.sql` | mystory DB 스키마 |
| `src/hooks/useMystory.ts` | 자서전 세션 관리 훅 |
| `src/hooks/useMemorial.ts` | 추모관 훅 (훅만 구현됨) |
| `src/lib/mystory/questions.ts` | 질문 풀 (13카테고리 67문) |
