# Storige — 에이전트 행동 지침

> 기억을 저장하고, 내일을 준비하는 디지털 헤리티지 플랫폼

---

## 프로젝트 개요

일상 기록 → 유고 시 가족 전달 → 종이책 출판까지 아우르는 End-to-End 디지털 헤리티지 플랫폼.

| 서비스 | 상태 | 역할 |
|--------|------|------|
| **Storige 웹앱** | 본 프로젝트 | 메인 플랫폼 (일기/편지/시크릿/가족/출판/유고) |
| 나의이야기 | 개발중 | → "AI 자서전" 모듈 통합 예정 |
| Remember Storige | 프로토타입 | → "디지털 추모관" 모듈 통합 예정 |
| storige.co.kr | 운영중 | 브랜드 랜딩 + 앱 진입점 |

---

## 기술 스택

```yaml
Frontend:   Next.js 16.2.2 (App Router + Turbopack) + TypeScript + Tailwind CSS + shadcn/ui
State:      Zustand (전역) + React Query (서버 상태)
Editor:     Tiptap (리치 텍스트)
Backend:    Supabase (PostgreSQL + Auth + Storage + Edge Functions + Vault)
AI:         Anthropic Claude API (요약, 제안, 자서전)
Payment:    포트원 PortOne (미연동 — API 키 대기)
Push:       Firebase Cloud Messaging
Mobile:     Capacitor (iOS + Android) — 앱 ID: storige.co.kr, 웹 디렉토리: out
Encryption: Web Crypto API (AES-256-GCM) + secrets.js (SSS)
Deploy:     Vercel (GitHub Actions 경유) + Supabase Cloud
```

---

## 핵심 모듈 경로

| 모듈 | 경로 |
|------|------|
| Auth | `src/app/(auth)/` |
| Diary | `src/app/(main)/diary/` |
| Dear | `src/app/(main)/dear/` |
| Secret | `src/app/(main)/secret/` |
| Album | `src/app/(main)/album/` |
| Publish | `src/app/(main)/publish/` |
| Settings | `src/app/(main)/settings/` |
| MyStory | `src/app/(main)/mystory/` |
| Legacy | `src/app/(legacy)/` |
| Landing | `src/app/page.tsx` |

---

## 코딩 규칙

1. **TDD:** 테스트 먼저 → 구현 → 리팩토링
2. **파일 크기:** 200줄 이내 (초과 시 분리)
3. **컴포넌트:** 함수형 + 커스텀 훅 패턴
4. **주석:** 한국어
5. **타입:** TypeScript strict mode, `any` 금지
6. **보안:** 시크릿 코드는 반드시 클라이언트 사이드 E2EE
7. **접근제어:** Supabase RLS 우선, 서버 로직 최소화
8. **Over Engineering 금지:** 현재 필요한 것만 구현
9. **네이밍:** 컴포넌트=PascalCase, 훅=camelCase, DB=snake_case

---

## 디자인 시스템: Midnight Archive

> 기준 파일: `docs/DESIGN_sample/eterna_archive/DESIGN.md` (최우선)  
> 화면 템플릿: `docs/DESIGN_sample/_1~_7/`, `dear_my_son_*/`  
> `docs/storige-prototype.html`은 레이아웃 참고용만 (토큰 사용 금지)

### 핵심 컬러 토큰

```
배경:    #F9F9F9
서피스:  #FFFFFF(카드) / #F3F3F3(보조) / #EEEEEE(그룹) / #E8E8E8(구분)
텍스트:  #1A1C1C(기본) / #444748(보조) / #747878(힌트/아이콘)
경계:    #C4C7C7 (반드시 opacity 30% 이하)

Primary:  #0061A5  (코발트 블루 — Diary 강조, CTA)
Dear:     #006B5F  (틸 그린)
Secret:   #E91E63  (딥 핑크)
Error:    #BA1A1A

가족 뱃지: 배우자=#0061A5 / 아들=#FFD93D / 딸=#E91E63 / 변호사=#2ED573 / 부모=#006B5F
```

### 4대 규칙 (위반 금지)

```
1. No-Line Rule: 1px border 섹션 구분 금지 → 배경색 전환(surface 계층)으로 구분
   경계 필요 시: outline-variant, 0.125rem, opacity 30% 이하만 허용

2. Backdrop Blur Rule: sticky 헤더/플로팅 요소 → backdrop-blur-xl + bg-white/80
   완전 불투명 배경 금지

3. Tonal Layering: 그림자 대신 배경색 계층으로 깊이 표현
   카드=shadow-sm / 피처드=shadow-lg / FAB·모달=shadow-2xl

4. 아이콘: Material Symbols Outlined만 사용, 이모지 금지
```

### 타이포그래피 & 간격 요약

```
헤드라인: Plus Jakarta Sans 700-800, tracking-tight
본문:     Pretendard Variable
모노:     JetBrains Mono (암호화 데이터 전용)
레이블:   UPPERCASE + tracking-[0.2em] + 10-12px

카드 radius: 1.25rem(표준) / 1.5rem(대형) / 0.625rem(버튼)
패딩: 24px(desktop) / 16px(mobile)
터치 영역 최소: 44px × 44px
```

### 아코디언 색상 (확정)

```
Diary:  border-l #0061A5, 열림 bg #F0F7FF
Dear:   border-l #006B5F, 열림 bg #E8F5F3
Secret: border-l #E91E63, 열림 bg #FFF0F5
```

---

## 배포 인프라

> 상세: `docs/deploy_vercel_git_supabase.md`

**배포 방식:** `git push origin main` → GitHub Actions → Vercel 프로덕션 (~1분)

```bash
git push origin main                              # 표준 배포
npx vercel deploy --prod                          # 긴급 수동
gh run list --repo storigehub/storige --limit 3   # 상태 확인
```

**계정 구조:** Vercel(`papas-yohan`) ≠ GitHub(`storigehub`) — Dashboard Git 연결 구조적 불가.  
→ `.github/workflows/deploy.yml` + GitHub Secrets 3개로만 운영. 다른 방법 시도 금지.

**핵심 ID**

| 항목 | 값 |
|------|-----|
| Vercel Project ID | `prj_KOfHRMjPd7VhuBWhC5Xhz2qb4k7t` |
| Supabase Project ID | `uobbgxwuukwptqtywxxj` (ap-northeast-2) |

---

## 현재 상태

```
Phase 1~6 완료 | Auth 보완 완료 | 결제 연동 대기
최신 커밋: 7bfc5df (2026-04-11)
```

**다음 작업:** 포트원(PortOne) API 키 + 파파스 POD 계약 → 결제 연동  
**상세 이력:** `docs/STATUS.md`

---

## 커밋 컨벤션

```
feat: 새 기능    fix: 버그 수정    design: UI/디자인
docs: 문서       refactor: 리팩    test: 테스트
style: 포맷      chore: 빌드/설정
```

---

## 에이전트 행동 원칙

- 같은 접근법 2회 연속 실패 → 즉시 다른 경로로 전환
- 외부 서비스 연동 문제 → 원인 파악에 5분, 초과 시 우회로 선택
- 블로커 발생 → 오너에게 즉시 보고, 혼자 1시간 소비 금지
- Over Engineering 금지: 요청된 것만 구현

**오토파일럿:** `agents/AUTOPILOT.md를 읽고 오토파일럿 모드로 [작업]을 시작해`  
**수동 모드:** `CTO 역할로 전환해. agents/AGENT_CTO.md 참조해`

---

## 참조 문서

| 문서 | 내용 |
|------|------|
| `docs/STATUS.md` | 스프린트 완료 이력 + 대기 작업 |
| `docs/deploy_vercel_git_supabase.md` | 배포 인프라 상세 가이드 |
| `docs/DESIGN_sample/eterna_archive/DESIGN.md` | Midnight Archive 공식 디자인 문서 |
| `docs/DESIGN_sample/_1~_7/` | 화면별 HTML 템플릿 + 스크린샷 |
| `docs/sprint6-memorial-plan.md` | 추모관 기획서 (보류 중) |
| `docs/sprint6-status.md` | Phase 6 상세 현황 |
| `docs/appstore-deploy-guide.md` | iOS/Android 앱스토어 제출 가이드 |
| `STORIGE_DEV_PLAN.md` | 전체 개발 계획 v2.0 |
| `STORIGE_BM_STRATEGY.md` | BM 전략서 |
| `agents/AUTOPILOT.md` | 오토파일럿 파이프라인 |
