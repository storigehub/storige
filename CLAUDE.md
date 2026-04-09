# Storige (스토리지) — 이야기저장소

> 기억을 저장하고, 내일을 준비하는 디지털 헤리티지 플랫폼
> Stories + Storage = Storige

---

## 프로젝트 개요

Storige는 사용자가 일상을 기록하고, 유고 시 지정한 가족에게 기록과 보안 정보를 안전하게 전달하며, 소중한 기억을 종이책으로 출판할 수 있는 **End-to-End 디지털 헤리티지 플랫폼**이다.

### 플랫폼 에코시스템

Storige 앱은 베이스 플랫폼. 아래 서비스를 Phase 6 이후 단계적 통합:

| 서비스 | 현재 상태 | 통합 후 역할 |
|--------|----------|-------------|
| **Storige 앱** | 본 프로젝트 | 메인 플랫폼 (일기/편지/시크릿/가족/출판/유고) |
| 나의이야기 (bookmoa-mobile) | 코드탭 개발중 | → "AI 자서전" 모듈로 통합 |
| Remember Storige | 프로토타입 | → "디지털 추모관" 모듈로 통합 |
| storige.co.kr | 랜딩 운영중 | 브랜드 랜딩 + 앱 진입점 (유지) |

통합 대비: `entries.journal_type`은 TEXT 타입으로 확장 가능하게 유지.

---

## 기술 스택

```yaml
Frontend:   Next.js 14+ (App Router) + TypeScript + Tailwind CSS + shadcn/ui
State:      Zustand (전역) + React Query (서버 상태)
Editor:     Tiptap (리치 텍스트)
Map:        Kakao Maps SDK
Animation:  Framer Motion
Backend:    Supabase (PostgreSQL + Auth + Storage + Edge Functions + Vault)
AI:         Anthropic Claude API (요약, 제안, 자서전)
Payment:    포트원 (PortOne)
Push:       Firebase Cloud Messaging
Mobile:     Capacitor (iOS + Android 동시 배포)
Encryption: Web Crypto API (AES-256-GCM) + secrets.js (SSS)
Testing:    Vitest + React Testing Library + Playwright
Deploy:     Vercel (프론트) + Supabase Cloud (백엔드)
CI/CD:      GitHub Actions → Vercel 자동 배포
Monitoring: Sentry + Vercel Analytics
```

### Capacitor 설정

```
앱 ID: storige.co.kr
웹 디렉토리: out (Next.js static export)
플랫폼: iOS + Android
필수 플러그인: camera, biometrics, push-notifications, geolocation, share, splash-screen
```

---

## 핵심 모듈

| 모듈 | 경로 | 설명 |
|------|------|------|
| Auth | `src/app/(auth)/` | 로그인, 회원가입, 2FA |
| Diary | `src/app/(main)/diary/` | 일기 CRUD, 아코디언 목록, 5개 뷰 |
| Dear | `src/app/(main)/dear/` | 자녀에게 보내는 편지 |
| Secret | `src/app/(main)/secret/` | E2EE 암호화 보안 정보 |
| Album | `src/app/(main)/album/` | 가족 포토앨범 (Phase 4 구현 예정 — 현재 플레이스홀더) |
| Publish | `src/app/(main)/publish/` | 출판 미리보기/주문 (파파스 POD) |
| Settings | `src/app/(main)/settings/` | 가족관리, 보안, 구독 |
| Legacy | `src/app/(legacy)/` | 유고 후 열람 전용 |

---

## 코딩 규칙

1. **TDD:** 테스트 먼저 작성 → 구현 → 리팩토링
2. **파일 크기:** 200줄 이내 (넘으면 분리)
3. **컴포넌트:** 함수형 + 커스텀 훅 패턴
4. **주석:** 한국어 사용
5. **타입:** TypeScript strict mode, any 금지
6. **보안:** 시크릿 코드는 반드시 클라이언트 사이드 E2EE
7. **접근제어:** Supabase RLS 우선, 서버 로직 최소화
8. **Over Engineering 금지:** 현재 필요한 것만 구현
9. **네이밍:** 컴포넌트=PascalCase, 훅=camelCase, DB=snake_case

---

## 디렉토리 구조

```
storige/
├── CLAUDE.md                    ← 이 파일 (Claude Code 자동 참조)
├── STORIGE_DEV_PLAN.md          ← 전체 개발 계획 (v2.0)
├── STORIGE_BM_STRATEGY.md       ← BM 전략서
├── STORIGE_INTEGRATION_GUIDE.md ← 서비스 통합 가이드
├── agents/                      ← 에이전트 프롬프트
│   ├── AUTOPILOT.md             ← 자동 오케스트레이션
│   ├── AGENT_CEO.md
│   ├── AGENT_CTO.md
│   ├── AGENT_CODE_REVIEWER.md
│   ├── AGENT_DESIGN_LEAD.md
│   ├── AGENT_QC.md
│   ├── AGENT_TESTER.md
│   └── ORCHESTRATION_GUIDE.md
├── docs/
│   ├── DESIGN_sample/           ← 디자인 시스템 기준 (최우선)
│   │   ├── _1~_7/               ← 화면별 HTML 템플릿 + 스크린샷
│   │   ├── dear_my_son_*/       ← Dear 화면 템플릿
│   │   └── eterna_archive/      ← DESIGN.md (Midnight Archive 시스템 문서)
│   ├── storige-prototype.html   ← 레거시 레이아웃 참고 (토큰 사용 금지)
│   └── storige_스토리보드_초안.pdf
├── src/
│   ├── app/                     # Next.js App Router 페이지
│   │   ├── (auth)/              # 인증 (로그인/회원가입)
│   │   ├── (main)/              # 메인 레이아웃
│   │   │   ├── diary/           # 일기
│   │   │   ├── dear/            # 편지
│   │   │   ├── secret/          # 시크릿 코드
│   │   │   ├── album/           # 포토앨범
│   │   │   ├── publish/         # 출판
│   │   │   └── settings/        # 설정
│   │   └── (legacy)/            # 유고 후 열람
│   ├── components/              # 공유 컴포넌트
│   │   ├── ui/                  # shadcn/ui
│   │   ├── editor/              # Tiptap 에디터
│   │   ├── diary/               # 일기 (아코디언 포함)
│   │   ├── secret/              # 시크릿 코드
│   │   ├── publish/             # 출판 미리보기
│   │   ├── family/              # 가족 관리
│   │   └── layout/              # Header, Nav, FAB
│   ├── hooks/                   # 커스텀 훅
│   ├── stores/                  # Zustand 스토어
│   ├── lib/                     # 핵심 로직
│   │   ├── supabase/            # Supabase 클라이언트 + 타입
│   │   ├── encryption/          # AES-256 + SSS 암호화
│   │   ├── ai/                  # Claude API 래퍼
│   │   └── utils/               # 날짜, 미디어, 위치
│   └── test/                    # 테스트 설정 + 목
└── supabase/                    # Supabase 프로젝트
    ├── migrations/              # DB 마이그레이션
    └── functions/               # Edge Functions
```

---

## 커밋 컨벤션

```
feat: 새 기능        fix: 버그 수정      test: 테스트
docs: 문서           refactor: 리팩토링   style: 포맷팅
chore: 빌드/설정
```

---

## UI/UX 핵심 결정사항

> **디자인 기준 파일:** `docs/DESIGN_sample/` (최우선) → `docs/DESIGN_sample/eterna_archive/DESIGN.md` (시스템 문서)  
> `docs/storige-prototype.html`은 초기 레이아웃 참고용으로만 유지 (토큰은 DESIGN_sample 우선)

---

### 디자인 시스템: Midnight Archive

**철학:** 고급 물리 저널의 디지털 등가물. 편집적(editorial)이고 큐레이션된 미학. 브루탈리즘 건축과 개인적 성찰의 중간. 흰 공간(white space)을 프리미엄 재료로 취급.

---

### 컬러 토큰 (Material Design 3 기반)

```css
/* ── 서피스 계층 (tonal layering) ── */
--surface-lowest:   #FFFFFF;   /* 활성 카드, 주요 콘텐츠 */
--surface-low:      #F3F3F3;   /* 보조 액션, 리스트 아이템 */
--surface:          #EEEEEE;   /* 그룹 배경 */
--surface-high:     #E8E8E8;   /* 구분 영역 */
--surface-highest:  #E2E2E2;   /* 최하위 배경 */
--background:       #F9F9F9;   /* 앱 전체 배경 */
--surface-dim:      #DADADA;   /* 비활성/오버레이 배경 */

/* ── 텍스트 ── */
--on-surface:         #1A1C1C;   /* 기본 텍스트 */
--on-surface-variant: #444748;   /* 보조 텍스트 */
--outline:            #747878;   /* 아이콘, 힌트 */
--outline-variant:    #C4C7C7;   /* 서브틀한 경계 (30% 이하 opacity 필수) */

/* ── 브랜드 액센트 ── */
--primary:            #0061A5;   /* 코발트 블루 — 주요 인터랙션, CTA, 일기 강조 */
--on-primary:         #FFFFFF;
--primary-container:  #D2E4FF;   /* 선택된 칩, 서브 배경 */

/* ── 화면별 테마 액센트 ── */
--dear-tertiary:      #006B5F;   /* Dear My Son — 틸 그린 */
--secret-pink:        #E91E63;   /* Secret Code — 딥 핑크 (이전 #FF6B9D와 다름) */
--secret-gradient:    linear-gradient(135deg, #0061A5 0%, #00201C 100%);

/* ── 시스템 ── */
--error:              #BA1A1A;
--error-container:    #FFDAD6;
```

> ⚠️ **마이그레이션 주의:** 앱 코드에 남아있는 `#4A90D9`(구 blue), `#00C9B7`(구 mint), `#FF6B9D`(구 pink)는  
> 향후 스프린트에서 위 토큰으로 통합 예정. 신규 화면은 반드시 Midnight Archive 토큰 사용.

---

### 타이포그래피

```
헤드라인/디스플레이: 'Plus Jakarta Sans'  700-800, tracking-tight
본문/UI:            'Pretendard Variable' — 동적 서브셋 권장
시크릿 코드 값:      'JetBrains Mono'     — 암호화 데이터 전용
아이콘:              Material Symbols Outlined (variable font)

폰트 스케일:
  Hero/대제목:  36px–48px  Extrabold (800)  tracking-tight
  섹션 헤더:    24px–30px  Bold (700)
  본문:         16px        Regular (400)    leading-relaxed
  UI 레이블:    10px–14px  — UPPERCASE, tracking-widest (0.2em)
  소형 캡션:    10px–12px  outline 컬러
```

---

### 간격 & 라운딩

```
표준 카드 radius:   1.25rem (20px)    ← 기존 8px에서 변경
대형 카드 radius:   1.5rem  (24px)
버튼 radius:        0.625rem (10px)
Pill/칩:            9999px
FAB:                50% (원형)

페이지 좌우 패딩:   24px (desktop) / 16px (mobile)
카드 내부 패딩:     16px–20px
섹션 간격:          배경색 전환으로 구분 (divider 라인 지양)
터치 영역 최소:     44px × 44px
```

---

### 핵심 디자인 규칙 (No-Line Rule 등)

```
1. No-Line Rule: 1px solid border로 섹션 구분 금지
   → 배경색 전환(surface 계층)으로 영역 구분
   → 경계가 꼭 필요할 때만: outline-variant 색, 0.125rem, 30% opacity 이하

2. Backdrop Blur Rule: 고정(sticky) 헤더·플로팅 요소 필수
   → backdrop-blur-xl (20px+), bg-white/80 또는 bg-surface/80
   → 완전 불투명 배경 금지

3. Tonal Layering: 그림자 대신 배경색 계층으로 깊이 표현
   → 카드: shadow-sm (Level 1)
   → 피처드/이미지: shadow-lg (Level 2)
   → FAB/모달: shadow-2xl (Level 3)

4. 비대칭 레이아웃: 날짜는 왼쪽, 콘텐츠는 오른쪽 (다른 margin)
5. 메타데이터 라벨: UPPERCASE + tracking-widest (0.2em)
6. 이미지 카드: 풀블리드 + 상단 그라디언트(black→transparent) 오버레이
```

---

### 아코디언 UI 패턴 (확정)

- 일기/편지/시크릿 코드 목록에서 항목 터치 시 아코디언 펼침
- 왼쪽 컬러 보더: 일기=`--primary(#0061A5)`, Dear=`--dear-tertiary(#006B5F)`, 시크릿=`--secret-pink(#E91E63)`
- 열림 시 배경: 일기=`#F0F7FF`, Dear=`#E8F5F3`, 시크릿=`#FFF0F5`
- 한 번에 하나만 열림 (다른 항목 터치 시 기존 닫힘)

---

### 네비게이션 레이블 (샘플 기준)

```
데스크탑 상단: 일기장 | 서신 | 비밀 코드 | 설정
모바일 하단:   Diary  | Letters | Secret | Manage
              (탭 활성: 2px cobalt 언더라인 + Bold, 배경 박싱 없음)
```

---

### 가족 뱃지 색상

```
배우자(spouse): #0061A5 (cobalt)
아들(son):      #FFD93D (yellow)
딸(daughter):   #E91E63 (pink)    ← 기존 #FF6B9D에서 변경
변호사(lawyer): #2ED573 (green)
부모(parent):   #006B5F (teal)
기타(other):    #747878 (outline)
```

---

## 개발 순서

```
Phase 1 (2주):  프로젝트 설정 + Auth + 기본 레이아웃
Phase 2 (3주):  Diary 핵심 (에디터, 아코디언, 5개 뷰, 미디어)
Phase 3 (4주):  Dear My Son + Secret Code + Family + 출판
Phase 4 (3주):  포토앨범(Capacitor camera 연동) + Legacy Access + Capacitor 네이티브 + 앱스토어
Phase 5 (2주):  AI 기능 + PWA + 테스트 + 최적화 + 런칭
Phase 6 (이후): 나의이야기 통합 + Remember 통합 + 랜딩 리뉴얼
```

---

## 오토파일럿 모드

자동 파이프라인으로 개발하려면:
```
agents/AUTOPILOT.md를 읽고 오토파일럿 모드로 Phase X를 시작해.
```

에이전트들이 자동으로 일을 넘기며 처리하고, 오너 판단이 필요한 [STOP] 시점에만 멈춥니다.

수동 모드로 전환하려면:
```
CTO 역할로 전환해. agents/AGENT_CTO.md 참조해.
```

---

## 현재 진행 상태 (자동 업데이트)

```
최종 업데이트: 2026-04-07
현재 Phase: 3 (디자인 마이그레이션 전용 스프린트 완료)
현재 Sprint: 3-7 대기 중 (오너 Go 확인 후 시작)
완료 이슈:
  Phase 1~2: 전체 완료
  Phase 3: Sprint 3-1~3-6 + QC P0~P2 완료
  디자인 마이그레이션 스프린트 완료:
    P0: Header(데스크탑 인라인 nav) / BottomNav(라벨 일기·편지·비밀·관리, md:hidden) / FAB(bottom-28 md:bottom-12)
    P2: /settings/page.tsx 신설(_6 기반 허브), /album/page.tsx 플레이스홀더(Phase 4 예정)
    P3-Diary: 히어로 "오늘의 성찰", 탭 border-b-2 cobalt, DiaryAccordionItem p-6~8 open card
    P3-Dear: 히어로 "마음을 담은 영원한 기록", 월별 teal 섹션 헤더, 편지지 스타일 열린 카드
    P3-Secret: "Archive Section 08" 히어로, fingerprint 보안 배너, "Encrypted Records" 라벨
    레거시 #4A90D9/#00C9B7/#FF6B9D 전역 치환, Plus Jakarta Sans + Material Symbols Outlined 추가
  총 테스트: 40개 통과 | 빌드: ✅ | Vercel 배포: ✅
다음: Sprint 3-7 (포트원 결제 + 파파스 POD API)
블로커: 포트원 API 키 + 파파스 POD API 계약 필요 (오너 확인)
Supabase 프로젝트 ID: uobbgxwuukwptqtywxxj (ap-northeast-2)
```

---

## 배포 인프라 (필독)

> 상세 내용: `docs/deploy_vercel_git_supabase.md`

### 배포 방식: GitHub Actions (확정, 변경 금지)

```
git push origin main → GitHub Actions → Vercel 프로덕션 배포 (~1분)
```

**Vercel 계정(`papas-yohan`)과 GitHub 레포 소유자(`storigehub`)가 다른 계정이다.**  
Vercel Dashboard/CLI를 통한 Git 자동연결은 구조적으로 불가능하다.  
→ `.github/workflows/deploy.yml` + GitHub Secrets 3개로 운영 중.

### ⛔ 절대 재시도 금지 — 1시간 낭비한 방법들

아래 방법들은 모두 구조적으로 실패한다. 다시 시도하지 않는다:
- `npx vercel git connect` — `storigehub` 접근 불가
- Vercel Dashboard → Settings → Git → Namespace 연결 시도
- Vercel GitHub App을 `storigehub`에 재설치
- Vercel Dashboard → "Add GitHub Account"
- Vercel Deploy Hook 생성 (Git 연결 없으면 생성 불가)

### 배포 명령

```bash
# 표준 (자동)
git push origin main

# 긴급 수동
npx vercel deploy --prod

# 배포 상태 확인
gh run list --repo storigehub/storige --limit 3
```

### 핵심 ID

| 항목 | 값 |
|------|-----|
| Vercel Team ID | `team_dOpgsAqfLyl4qNlVgSiFVm6B` |
| Vercel Project ID | `prj_KOfHRMjPd7VhuBWhC5Xhz2qb4k7t` |
| Supabase Project ID | `uobbgxwuukwptqtywxxj` (ap-northeast-2) |

---

## 에이전트 행동 원칙 (사고 교훈)

> **같은 접근법이 2회 연속 실패하면 즉시 다른 경로로 전환한다.**  
> **외부 서비스 연동 문제 → "왜 안 되는가" 파악에 5분, 넘으면 우회로를 선택한다.**  
> **블로커 발생 시 오너에게 즉시 보고하고 결정을 받는다. 혼자 1시간 소비하지 않는다.**

---

## 참조 문서

| 문서 | 내용 |
|------|------|
| `STORIGE_DEV_PLAN.md` | 전체 개발 계획 (BM, 모듈, DB, API, 보안, 로드맵) |
| `STORIGE_BM_STRATEGY.md` | BM 전략 (시장 분석, 경쟁사, 재무 추정) |
| `STORIGE_INTEGRATION_GUIDE.md` | 나의이야기+Remember+랜딩 통합 계획 |
| `agents/AUTOPILOT.md` | 자동 오케스트레이션 파이프라인 |
| `agents/ORCHESTRATION_GUIDE.md` | 에이전트 수동 운용 가이드 |
| `docs/deploy_vercel_git_supabase.md` | **배포 인프라 가이드** (Vercel+GitHub Actions+Supabase) |
| `docs/DESIGN_sample/` | **디자인 기준 (최우선)** — Midnight Archive 시스템 + 화면별 HTML 템플릿 |
| `docs/DESIGN_sample/eterna_archive/DESIGN.md` | Midnight Archive 디자인 시스템 공식 문서 |
| `docs/storige-prototype.html` | 레거시 레이아웃 참고 (토큰 사용 금지) |
| 참조 서비스 | https://dayoneapp.com/features/ |
