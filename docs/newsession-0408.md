---
title: 세션 핸드오프 — 2026-04-08
created: 2026-04-08
phase: 3 완료 / Phase 4 대기
prev_session: design-handoff-04062055.md
---

# newsession-0408.md
> 새 세션에서 이 파일을 먼저 읽고 작업을 이어가세요.

---

## 현재 프로젝트 상태 한 줄 요약

```
Phase 1~3 전체 완료 + 디자인 리뉴얼(D-A~D-D) 완료 + Stitch MCP 연동 완료
빌드: ✅ | 테스트 40개: ✅ | Vercel 배포: ✅
다음: Phase 4 (포토앨범 + Legacy + Capacitor) 또는 Sprint 3-7 (결제)
```

---

## 1. 이번 세션(04-08)에서 완료한 작업

### 1-1. Sprint D-D — `/settings/family` 가족 관리 리뉴얼

**변경 파일:**
- `src/components/family/FamilyMemberCard.tsx` — 전면 재설계
- `src/app/(main)/settings/family/page.tsx` — 그리드 레이아웃 변경

**적용 내용 (`_3` 템플릿 기준):**
- `w-16 h-16` 원형 아바타 + `border: 2.5px solid [roleColor]` 역할 컬러 링
- `Material Symbol FILL:1` 인증 뱃지 (verified=초록, 미인증=회색)
- `grid grid-cols-2 sm:grid-cols-4 gap-4` 반응형 그리드
- 그리드 마지막에 `person_add` 점선 CTA 카드 내장
- 빈 상태 UI 개선 (아이콘 + 안내 문구)

**디자인 리뉴얼 스프린트 전체 완료 현황:**
| Sprint | 대상 | 기준 템플릿 | 상태 |
|--------|------|-----------|------|
| D-A | `/diary` | `_5` + `_7` | ✅ |
| D-B | `/dear` | `dear_my_son_2` | ✅ |
| D-C | `/secret` | `_1` | ✅ |
| D-D | `/settings/family` | `_3` | ✅ |

---

### 1-2. Stitch MCP 연동 및 디자인 시스템 전면 적용

#### Stitch MCP 서버 연결
- `~/.claude.json`에 직접 등록 완료
- **새 세션에서 자동 로드됨** (아래 "MCP 사용법" 섹션 참고)

```json
// ~/.claude.json 내 등록 위치
"mcpServers": {
  "stitch": {
    "type": "http",
    "url": "https://stitch.googleapis.com/mcp",
    "headers": {
      "X-Goog-Api-Key": "<STITCH_API_KEY>"
    }
  }
}
```

#### Stitch 프로젝트 정보 (이미 존재)
- **Project ID:** `18286796991837386984`
- **Project Name:** `projects/18286796991837386984`
- **Title:** "Storige 개발 계획서 (PRD)"
- **등록된 화면 8개:** 일기/편지/비밀코드/설정 등 주요 데스크탑 화면
- **디자인 시스템 등록:** `assets/17326657806955813002` ("Storige Midnight Archive v2")

#### Stitch → 코드베이스 디자인 토큰 전면 적용
Stitch HTML에서 추출한 Material Design 3 시맨틱 토큰을 전체 코드베이스에 적용:

**`src/app/globals.css`에 추가된 `@theme` 블록:**
```css
@theme {
  --color-primary: #0061A5;           /* bg-primary / text-primary */
  --color-on-surface: #1A1C1C;        /* text-on-surface */
  --color-outline: #747878;           /* text-outline */
  --color-outline-variant: #C4C7C7;   /* border-outline-variant */
  --color-surface-container-low: #F3F3F3;   /* bg-surface-container-low */
  --color-surface-container: #EEEEEE;        /* bg-surface-container */
  --color-surface-container-high: #E8E8E8;   /* bg-surface-container-high */
  --color-primary-container: #D2E4FF; /* bg-primary-container */
  --color-error: #BA1A1A;             /* text-error / bg-error */
  --color-dear: #006B5F;              /* text-dear / bg-dear (Dear 모듈) */
  --color-pink-accent: #E91E63;       /* text-pink-accent (Secret 모듈) */
  --color-diary-open: #F0F7FF;        /* bg-diary-open (아코디언 열림 배경) */
  /* ... 기타 토큰 전체 */
}
```

**shadcn/ui `:root` 변수도 Stitch 값으로 동기화 완료** (oklch → hex)

**일괄 치환 결과:** 35개 파일, 423곳
```
#0061A5  →  primary
#1a1c1c  →  on-surface
#747878  →  outline
#c4c7c7  →  outline-variant
#f3f3f3  →  surface-container-low
#eeeeee  →  surface-container
#e8e8e8  →  surface-container-high
#d2e4ff  →  primary-container
#ba1a1a  →  error
#006B5F  →  dear
#E91E63  →  pink-accent
#F0F7FF  →  diary-open
```

---

## 2. 현재 전체 개발 완료 현황

### Phase 1~3 구현 완료 목록

| 모듈 | 핵심 파일 | 상태 |
|------|---------|------|
| Auth | `src/app/(auth)/login`, `/signup`, `/auth/callback` | ✅ |
| Layout | `Header.tsx`, `BottomNav.tsx`, `FAB.tsx` | ✅ |
| Diary | `DiaryListView`, `DiaryAccordionItem`, `DiaryEditor`, `DiaryCalendarView`, `DiaryMediaView`, `DiaryMapView` | ✅ |
| Dear | `DearListView`, `DearAccordionItem`, `DearEditor` | ✅ |
| Secret | `SecretListView`, `SecretAccordionItem`, `SecretCodeForm`, `PassphraseModal`, `SecretCredentialTable` | ✅ |
| Family | `FamilyMemberCard`, `FamilyMemberForm`, `SSSKeySetup` | ✅ |
| Publish | `PublishSelectStep`, `BookPreview`, `PublishOrderForm` | ✅ |
| Settings | `settings/page.tsx`, `settings/family/page.tsx` | ✅ |
| Encryption | `src/lib/encryption/aes.ts`, `sss.ts` | ✅ |
| Hooks | 11개 (useDiaryList, useSecretCodes, useFamilyMembers, useSSSKeyManager 등) | ✅ |

### 테스트 / 빌드 상태

```
테스트: 40개 통과
빌드:   ✅ npm run build 에러 없음
배포:   Vercel 운영 중
Supabase: uobbgxwuukwptqtywxxj (ap-northeast-2)
```

---

## 3. 미완료 / 다음 작업

### 블로커 (오너 처리 필요)
| 항목 | 내용 |
|------|------|
| Google/Kakao OAuth | Supabase Dashboard에서 프로바이더 활성화 필요. Google Cloud Console OAuth2 + Kakao Developers 앱 설정 → redirect URI: `https://uobbgxwuukwptqtywxxj.supabase.co/auth/v1/callback` |
| 포트원 API 키 | Sprint 3-7 (결제) 착수 전 필요 |
| 파파스 POD API | Sprint 3-7 (출판 주문) 착수 전 계약 필요 |

### 다음 Sprint 후보 (오너 판단)

**옵션 A — Sprint 3-7: 결제 + 출판 주문**
- 포트원(PortOne) 결제 연동
- 파파스 POD API 주문 전송
- 조건: 포트원 API 키 + 파파스 계약 완료

**옵션 B — Phase 4: 포토앨범 + Legacy + Capacitor**
- Album 모듈 (`/album`) — Capacitor Camera 연동
- Legacy Access 시스템 — 유고 후 열람 UI (`src/app/(legacy)/`)
- Capacitor 네이티브 빌드 → iOS + Android 앱스토어

---

## 4. 디자인 시스템 현황

### Midnight Archive 토큰 (Stitch 기준 확정)

| 토큰 | 값 | Tailwind 클래스 | 용도 |
|------|-----|----------------|------|
| `primary` | `#0061A5` | `bg-primary` / `text-primary` | Diary, Layout, Settings |
| `on-surface` | `#1A1C1C` | `text-on-surface` | 기본 텍스트 |
| `outline` | `#747878` | `text-outline` | 보조 텍스트, 아이콘 |
| `outline-variant` | `#C4C7C7` | `border-outline-variant` | 서브틀 경계 |
| `surface-container-low` | `#F3F3F3` | `bg-surface-container-low` | 보조 배경 |
| `surface-container` | `#EEEEEE` | `bg-surface-container` | 그룹 배경 |
| `primary-container` | `#D2E4FF` | `bg-primary-container` | 선택된 칩/배지 |
| `error` | `#BA1A1A` | `text-error` / `bg-error` | 삭제, 오류 |
| `dear` | `#006B5F` | `text-dear` / `bg-dear` | Dear 모듈 전용 |
| `pink-accent` | `#E91E63` | `text-pink-accent` / `bg-pink-accent` | Secret 모듈 전용 |

### 디자인 준수 체크 (현재 수준: 85~90%)
- ✅ Primary 색상 통일
- ✅ 아코디언 패턴 (Diary/Dear/Secret 모두 Framer Motion)
- ✅ font-headline + tracking UPPERCASE 라벨
- ✅ No-Line Rule (tonal layering 우선)
- ✅ 반응형 breakpoint (md 기준 일관)
- ⚠️ Settings `border-l-4` 일부 잔존 (P3 개선 권고)

---

## 5. MCP 서버 현황 (새 세션에서 자동 로드)

| MCP | 상태 | 주요 용도 |
|-----|------|---------|
| **Stitch** | ✅ `~/.claude.json` 등록 완료 | UI 화면 생성, 디자인 시스템 관리 |
| Supabase | ✅ claude.ai 연동 | DB 마이그레이션, SQL, 로그 |
| Vercel | ✅ claude.ai 연동 | 배포 상태, 로그 |
| Google Calendar | ✅ claude.ai 연동 | — |

### Stitch MCP 사용 방법 (새 세션)
```
새 세션에서 자동으로 mcp__stitch__ 도구들이 로드됩니다.

주요 도구:
- mcp__stitch__list_projects       → 프로젝트 목록 조회
- mcp__stitch__list_screens        → 화면 목록 (projectId: "18286796991837386984")
- mcp__stitch__generate_screen_from_text → 텍스트로 새 화면 생성
- mcp__stitch__edit_screens        → 기존 화면 수정
- mcp__stitch__create_design_system → 디자인 시스템 생성
- mcp__stitch__apply_design_system  → 화면에 디자인 시스템 적용

등록된 디자인 시스템: assets/17326657806955813002 (Storige Midnight Archive v2)
```

> ⚠️ **주의:** Stitch MCP는 현재 세션(대화 시작 후 등록)에서는 tool로 로드되지 않습니다.  
> **반드시 새 Claude Code 세션을 시작**해야 MCP tool이 활성화됩니다.

---

## 6. 주요 파일 경로 참조

```
src/app/globals.css                      ← Stitch 디자인 토큰 정의 (@theme 블록)
src/app/(main)/diary/page.tsx            ← 일기 메인 (5탭, 히어로)
src/app/(main)/dear/page.tsx             ← 편지 메인
src/app/(main)/secret/page.tsx           ← 시크릿 코드 메인
src/app/(main)/settings/page.tsx         ← 설정 허브
src/app/(main)/settings/family/page.tsx  ← 가족 관리
src/components/diary/DiaryAccordionItem.tsx
src/components/dear/DearAccordionItem.tsx
src/components/secret/SecretAccordionItem.tsx
src/components/family/FamilyMemberCard.tsx
src/lib/encryption/aes.ts                ← AES-256-GCM E2EE
src/lib/encryption/sss.ts                ← Shamir's Secret Sharing
supabase project: uobbgxwuukwptqtywxxj (ap-northeast-2)
```

---

## 7. 새 세션 시작 체크리스트

```
□ 이 파일 읽기 완료
□ CLAUDE.md 읽기 (자동 로드됨)
□ Stitch MCP tool 목록 확인: mcp__stitch__list_projects 호출
□ 오너에게 다음 Sprint 확인: Phase 4 vs Sprint 3-7
□ OAuth 블로커 해결 여부 확인 (Google/Kakao 프로바이더 활성화)
```

---

*작성: 2026-04-08 | 이전 핸드오프: [`design-handoff-04062055.md`](design-handoff-04062055.md)*
