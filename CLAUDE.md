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
| Album | `src/app/(main)/album/` | 가족 포토앨범 |
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
│   ├── storige-prototype.html   ← UI 프로토타입 (디자인 기준)
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

### 디자인 토큰
```
배경: #FAFAFA (bg) / #FFFFFF (surface)
텍스트: #1A1A1A (text) / #888 (sub) / #B0B0B0 (hint)
액센트: #4A90D9 (blue) / #00C9B7 (mint) / #FF6B9D (pink)
       #FFD93D (yellow) / #2ED573 (green) / #FF4757 (danger)
폰트: Pretendard Variable
시크릿 마스킹: JetBrains Mono
```

### 아코디언 UI 패턴 (확정)
- 일기/편지/시크릿 코드 목록에서 항목 터치 시 아코디언 펼침
- 왼쪽 컬러 보더: 일기=blue, Dear=mint, 시크릿=pink
- 한 번에 하나만 열림 (다른 항목 터치 시 기존 닫힘)
- 디자인 기준: `docs/storige-prototype.html` 참조

### 가족 뱃지 색상
아내=blue, 아들=yellow, 딸=pink, 변호사=green

---

## 개발 순서

```
Phase 1 (2주):  프로젝트 설정 + Auth + 기본 레이아웃
Phase 2 (3주):  Diary 핵심 (에디터, 아코디언, 5개 뷰, 미디어)
Phase 3 (4주):  Dear My Son + Secret Code + Family + 출판
Phase 4 (3주):  Legacy Access + Capacitor 네이티브 + 앱스토어
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
최종 업데이트: 2026-04-06
현재 Phase: 1
현재 Sprint: 1-4 완료 (Phase 1 전체 완료)
완료 이슈: Sprint 1-1 (프로젝트 초기화), 1-2 (DB 스키마+RLS), 1-3 (Auth 모듈), 1-4 (레이아웃+네비)
진행 중: Phase 1 QC 검증 대기
블로커: 없음
Supabase 프로젝트 ID: uobbgxwuukwptqtywxxj (ap-northeast-2)
```

---

## 참조 문서

| 문서 | 내용 |
|------|------|
| `STORIGE_DEV_PLAN.md` | 전체 개발 계획 (BM, 모듈, DB, API, 보안, 로드맵) |
| `STORIGE_BM_STRATEGY.md` | BM 전략 (시장 분석, 경쟁사, 재무 추정) |
| `STORIGE_INTEGRATION_GUIDE.md` | 나의이야기+Remember+랜딩 통합 계획 |
| `agents/AUTOPILOT.md` | 자동 오케스트레이션 파이프라인 |
| `agents/ORCHESTRATION_GUIDE.md` | 에이전트 수동 운용 가이드 |
| `docs/storige-prototype.html` | UI 프로토타입 (디자인 참고) |
| `docs/DESIGN_sample/` | UI 디지인시스템 (디자인 기준) |
| 참조 서비스 | https://dayoneapp.com/features/ |
