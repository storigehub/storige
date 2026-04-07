---
title: 디자인 핸드오프 — Midnight Archive 마이그레이션 중단 (2차)
created: 2026-04-06
id: 04062055
related: design-handoff-04061845.md
---

# design-handoff-04062055.md

Claude Code 터미널 세션에서 **요청 한도**로 중단된 뒤, 리밋이 풀리면 이어서 작업하기 위한 정리입니다.  
이전 핸드오프 [`design-handoff-04061845.md`](design-handoff-04061845.md)는 **문서 편집이 시작되기 전**에 끊긴 상태였고, **본 세션에서는 문서·코드가 상당 부분 반영된 뒤** 인증 폼 작업 중 한도가 발생했습니다.

---

## 1. 터미널에서 확인된 중단 시점

| 항목 | 내용 |
|------|------|
| 한도 메시지 | `You've hit your limit · resets 3am (Asia/Seoul)` |
| 직전 작업 | `LoginForm`을 **Midnight Archive** 스타일로 **Write** 완료한 뒤, unified diff 출력 |
| 직전 의도 | `Now update LoginForm and SignupForm:` — **LoginForm**까지 적용 후 **SignupForm**으로 이어갈 예정이었음 |
| 세션 소요 | 로그에 `Brewed for 9m 47s` 등 장시간 작업 흔적 |

**중단 직후:** `SignupForm` 및 `signup 페이지` 래퍼의 동일 스타일 적용은 **미완료**로 보는 것이 안전합니다.

---

## 2. 문서 측 — 이번 세션에서 반영된 것 (레포 기준)

| 파일 | 상태 |
|------|------|
| [`CLAUDE.md`](../CLAUDE.md) | **갱신됨.** `DESIGN_sample` 최우선, Midnight Archive 토큰(`#0061A5` 등), 서피스 계층, No-Line, 타이포·라운딩·아코디언·네비·가족 뱃지 등 **대규모 확장** |
| [`agents/AGENT_DESIGN_LEAD.md`](../agents/AGENT_DESIGN_LEAD.md) | **갱신됨.** 동일 시스템명·기준 파일 우선순위·레거시 hex 치환 가이드 등 |

이전 핸드오프(04061845)에서 **미완료였던 문서 작업**은 **본 세션에서 완료된 것으로 판단**됩니다.

---

## 3. 스타일 인프라 (`globals.css`)

- **Plus Jakarta Sans** import (헤드라인)
- **Material Symbols Outlined** import
- **`.font-headline`** → `Plus Jakarta Sans`
- **`.material-symbols-outlined`** 유틸 (아이콘용)

---

## 4. 터미널 로그에 나온 코드 수정 범위 (파일 단위)

아래는 세션 중 `Update` / `Write`로 기록된 작업입니다. (일부는 동일 파일에 여러 번 패치)

| 구역 | 파일 |
|------|------|
| 일기 | `src/app/(main)/diary/page.tsx`, `src/components/diary/DiaryListView.tsx`, `src/components/diary/DiaryAccordionItem.tsx` |
| 편지 | `src/components/dear/DearAccordionItem.tsx`, `DearListView.tsx`, `src/app/(main)/dear/page.tsx` |
| 시크릿 | `SecretAccordionItem.tsx`, `SecretListView.tsx`, `src/app/(main)/secret/page.tsx` |
| 가족 | `src/app/(main)/settings/family/page.tsx` (여러 패치) |
| 인증 | `src/app/(auth)/login/page.tsx` (배경 `#f9f9f9`), **`src/components/auth/LoginForm.tsx` (전면 스타일)** |

**주요 패턴:** `#0061A5` / `#006B5F` / `#E91E63`, `#1a1c1c`, `#747878`, `backdrop-blur`, `font-headline`, Material Symbols, 표면색 `#f3f3f3` 등.

---

## 5. 디스크에 저장된 상태로 본 “완료 / 미완료”

### 완료로 보이는 것

- `LoginForm.tsx`: 코발트 CTA, 라벨 uppercase, 입력 필드 surface-low, 에러 `#ba1a1a` 등 **새 디자인 적용됨** (파일 헤더 주석: `Midnight Archive`).
- 레이아웃·일기·편지·시크릿·가족 목록·헤더 일부: 터미널 diff와 `src/` 내용이 대체로 일치.

### 미완료 / 미정리

| 항목 | 근거 |
|------|------|
| **`SignupForm.tsx`** | 여전히 `bg-[#4A90D9]`, 링크 `#4A90D9` — **LoginForm과 동일한 Midnight 스타일 미적용** |
| **`signup` 페이지** | `login/page.tsx`만 배경 토큰 변경이 로그에 있음 — `signup` 래퍼 동일 처리 여부 **별도 확인** |
| **레거시 `#4A90D9` 잔존** | `src` 전체 grep 시 **다수 파일**에 잔존 (예: `SignupForm`, `DiaryEditor`, `EditorToolbar`, `DiaryMapView`, `DiaryCalendarView`, `publish/*`, `FamilyMemberForm`, `MediaAttachment` 등). **계획상 마이그레이션 후속**으로 남음. |

---

## 6. 이어서 할 때 권장 순서

1. **`SignupForm.tsx`** + **`src/app/(auth)/signup/page.tsx`**  
   - `LoginForm`과 동일 토큰·패턴으로 통일 (라벨, Input, Button, 소셜 버튼, 링크 색 `#0061A5`).
2. **`src/app/layout.tsx`**  
   - 현재 `themeColor`는 이미 `#0061A5`로 맞춰져 있음. 추가 메타·OG 색이 있으면 동일 토큰과 일치하는지만 확인.
3. **남은 `#4A90D9` 일괄 치환**  
   - [`AGENT_DESIGN_LEAD.md`](../agents/AGENT_DESIGN_LEAD.md)의 매핑표에 따라 모듈별로 진행 (한 번에 전부 바꾸기보다 화면별 검수 권장).
4. **`npm run build` / `npx vitest run`**  
   - 스타일 변경 후 회귀 확인.
5. **선택:** `agents/AUTOPILOT.md`, `ORCHESTRATION_GUIDE.md` 안의 “디자인 기준 파일” 문구가 `CLAUDE.md`와 **동일한지** 한 줄 점검.

---

## 7. 이전 핸드오프(04061845)와의 관계

| 04061845 | 04062055 (본 문서) |
|----------|---------------------|
| 문서 수정 **직전**에 한도로 중단 | 문서·광범위 UI·`LoginForm`까지 **진행 후**, 인증 나머지·잔여 hex에서 중단 |
| 분석 요약만 터미널에 존재 | `CLAUDE.md` / `AGENT_DESIGN_LEAD.md`에 **Midnight Archive 반영** |

---

## 8. 한 줄 요약

**문서와 디자인 시스템 가이드는 정리되었고**, 메인 모듈·로그인 폼까지 **Midnight Archive 방향으로 마이그레이션 진행**되었으나, **한도로 `SignupForm`(등 인증 나머지)과 레거시 `#4A90D9` 전역 정리는 미완료**입니다. 리밋 해제 후 **회원가입 폼부터** 이어가면 됩니다.
