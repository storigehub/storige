# 🗄️ Storige (스토리지) — 완벽 개발 계획서

> **"이야기저장소 - 스토리지"**  
> Stories + Storage = Storige  
> 기억을 저장하고, 내일을 준비하는 디지털 헤리티지 플랫폼

---

## 목차

1. [BM 개요 및 비전](#1-bm-개요-및-비전)
2. [비즈니스 로직 분석 — 이슈별 그룹화](#2-비즈니스-로직-분석--이슈별-그룹화)
3. [기술 스택 결정](#3-기술-스택-결정)
4. [시스템 아키텍처](#4-시스템-아키텍처)
5. [모듈 설계 — 기능 단위 모듈화](#5-모듈-설계--기능-단위-모듈화)
6. [UX/UI 설계 — Day One 참조 + 스토리보드 반영](#6-uxui-설계--day-one-참조--스토리보드-반영)
7. [세부 유스케이스](#7-세부-유스케이스)
8. [QA 시나리오](#8-qa-시나리오)
9. [데이터베이스 설계](#9-데이터베이스-설계)
10. [API 설계](#10-api-설계)
11. [보안 설계](#11-보안-설계)
12. [TDD 기반 개발 방법론 및 에이전트팀 구성](#12-tdd-기반-개발-방법론-및-에이전트팀-구성)
13. [단계별 개발 로드맵](#13-단계별-개발-로드맵)
14. [Claude Code 실행 가이드](#14-claude-code-실행-가이드)
15. [필요 스킬 및 검증 체크리스트](#15-필요-스킬-및-검증-체크리스트)

---

## 1. BM 개요 및 비전

### 1.1 서비스 정의

Storige는 **디지털 헤리티지 메인 플랫폼**이다. 사용자가 살아있는 동안 일상을 기록하고, 유고 시 지정한 가족에게 기록과 보안 정보를 안전하게 전달하며, 소중한 기억을 종이책으로 출판할 수 있는 서비스다.

### 1.1.1 플랫폼 에코시스템 포지션

Storige 앱은 아래 4개 서비스의 **베이스 플랫폼**으로, 향후 나머지 서비스를 모듈로 통합한다.

| 서비스 | URL | 현재 상태 | 통합 후 역할 |
|--------|-----|----------|-------------|
| **Storige 앱** | app.storige.co.kr (예정) | 본 문서에서 설계 중 | 메인 플랫폼 (일기/편지/시크릿/가족/출판/유고) |
| **나의이야기 (MyStory)** | bookmoa-mobile.vercel.app | 코드탭 개발중 | → Storige 내 "AI 자서전" 모듈로 통합 |
| **Remember Storige** | remember-storige.replit.app | 프로토타입 | → Storige 내 "디지털 추모관" 모듈로 통합 |
| **storige.co.kr** | storige.co.kr | 랜딩 운영중 | 브랜드 랜딩 + 앱 진입점 (유지) |

> **통합 원칙:** Storige 앱 MVP를 먼저 완성하고, Phase 6 이후에 나의이야기·Remember를 단계적으로 흡수한다. 통합 세부 계획은 `STORIGE_INTEGRATION_GUIDE.md` 참조.

> **통합 설계 고려사항:** MVP 단계부터 DB 스키마와 Auth 시스템을 통합 확장 가능하게 설계한다. 특히 `entries` 테이블의 `journal_type`, `media` 테이블, `family_members` 테이블은 추후 AI 자서전·추모관 기능이 그대로 활용할 수 있도록 범용적으로 구성한다.

### 1.2 핵심 가치 제안

| 가치 | 설명 |
|------|------|
| **기록** | 일기, 편지, 사진, 음성, 영상 등 다양한 형식으로 일상을 기록 |
| **보관** | 암호화된 안전한 저장소에 기억과 보안 정보를 보관 |
| **전달** | 유고 시 사전 지정한 가족에게 인증을 거쳐 기록을 전달 |
| **출판** | 기록을 모아 종이책(자서전, 포토앨범)으로 출판 |
| **연결** | 가족 커뮤니티를 통해 살아있는 동안 소통 |

### 1.3 수익 모델

| 구분 | 내용 | 예상 가격대 |
|------|------|------------|
| 프리미엄 구독 | 저장 용량 확장, 고급 보안, 가족 구성원 추가 | 월 9,900원 / 연 99,000원 |
| 종이책 출판 | 전체/부분 일기 출판, 자서전 출판 | 건당 39,000원~ |
| 포토앨범/액자 | POD 기반 인쇄물 | 건당 19,000원~ |
| 영상 인터뷰 패키지 | 부모님 이야기 인터뷰 촬영/편집 | 패키지 290,000원~ |
| 자서전 작성 대행 | AI 보조 + 전문 작가 | 건당 500,000원~ |
| 장례 서비스 연계 | 추모관 디지털 운영 | 파트너 수수료 |

---

## 2. 비즈니스 로직 분석 — 이슈별 그룹화

### 그룹 A: 사용자 인증 및 계정 관리

| 이슈 ID | 이슈명 | 우선순위 | 설명 |
|---------|--------|---------|------|
| A-1 | 회원가입/로그인 | P0 | 이메일, 소셜 로그인, 휴대전화 인증 |
| A-2 | 프로필 관리 | P0 | 기본 정보, 프로필 사진 |
| A-3 | 2단계 인증 설정 | P0 | 휴대전화/보안코드/생체인식 중 선택 |
| A-4 | 구독 관리 | P1 | 무료/프리미엄 플랜 전환, 결제 |
| A-5 | 계정 비활성화/삭제 | P2 | 유고 전/후 계정 상태 관리 |

### 그룹 B: 일기/기록 (Diary Core)

| 이슈 ID | 이슈명 | 우선순위 | 설명 |
|---------|--------|---------|------|
| B-1 | 일기 작성 (텍스트) | P0 | 리치 텍스트 에디터, 마크다운 지원 |
| B-2 | 사진 첨부 | P0 | 카메라 촬영, 갤러리 선택, 다중 첨부 |
| B-3 | 음성 녹음/첨부 | P1 | 인앱 녹음, 음성→텍스트 변환 |
| B-4 | 영상 첨부 | P1 | 영상 녹화/업로드 |
| B-5 | 위치 정보 자동 기록 | P1 | GPS 기반 위치, 날씨, 온도 자동 태깅 |
| B-6 | 날짜/시간 자동 기록 | P0 | 작성 시점 자동 기록 |
| B-7 | 템플릿 시스템 | P2 | 일기 작성 템플릿 제공 (일상, 감사, 여행 등) |
| B-8 | AI 제안 기능 | P2 | 글감 추천, 문장 보완 제안 |

### 그룹 C: 기록 열람/탐색

| 이슈 ID | 이슈명 | 우선순위 | 설명 |
|---------|--------|---------|------|
| C-1 | 목록 뷰 | P0 | 날짜별 역순 목록, 제목+미리보기 |
| C-2 | 캘린더 뷰 | P0 | 월별 캘린더에 기록 유무 표시 |
| C-3 | 미디어 뷰 | P0 | 사진/비디오/오디오/PDF 그리드 |
| C-4 | 지도 뷰 | P1 | 위치 기반 기록 지도 표시 |
| C-5 | 요약 뷰 | P1 | AI 기반 기간별 요약 |
| C-6 | 검색/필터 | P0 | 키워드, 태그, 날짜 범위, 미디어 타입 |
| C-7 | 즐겨찾기 | P1 | 중요 기록 별표 표시 |

### 그룹 D: Dear My Son (자녀에게 보내는 편지)

| 이슈 ID | 이슈명 | 우선순위 | 설명 |
|---------|--------|---------|------|
| D-1 | 편지 작성 | P0 | 수신자 지정(아들/딸/가족) 편지 작성 |
| D-2 | 편지 목록/관리 | P0 | 수신자별 편지 목록, 날짜순 정렬 |
| D-3 | 편지 출판 미리보기 | P1 | 종이책 형태 프리뷰 |
| D-4 | 편지 출판 요청 | P1 | 시안확인 → 출판요청 플로우 |

### 그룹 E: 시크릿 코드 (Secret Code — 보안 정보 보관)

| 이슈 ID | 이슈명 | 우선순위 | 설명 |
|---------|--------|---------|------|
| E-1 | 보안 정보 등록 | P0 | 은행 계좌, 부동산, 주식, 가상자산, 법률 정보 등 |
| E-2 | 보안 등급 분류 | P0 | 중요/참고 레벨 태깅 |
| E-3 | 암호화 저장 | P0 | AES-256 + E2EE 적용 |
| E-4 | 시크릿 코드 열람 제한 | P0 | 본인만 열람, 유고 시 지정자 열람 |
| E-5 | ID/비밀번호 테이블 관리 | P1 | 은행/서비스별 아이디/비밀번호 암호화 저장 |

### 그룹 F: 가족 구성원 및 열람 권한 관리

| 이슈 ID | 이슈명 | 우선순위 | 설명 |
|---------|--------|---------|------|
| F-1 | 가족 구성원 등록 | P0 | 역할(아내/아들/딸/변호사 등) + 연락처 |
| F-2 | 가족 인증 상태 관리 | P0 | 인증/미인증 상태 표시 및 인증 요청 |
| F-3 | 열람 공개 예약 | P0 | 특정 날짜(예: 2032년 3월 12일) 예약 설정 |
| F-4 | 유고 시 열람 프로세스 | P0 | 열람 요청 → 본인확인 → 2단계 인증 → 열람 승인 |
| F-5 | 권한별 콘텐츠 접근 제어 | P1 | 가족별 열람 가능한 콘텐츠 범위 설정 |

### 그룹 G: 포토앨범 및 POD 출판 (MVP 포함)

| 이슈 ID | 이슈명 | 우선순위 | 설명 |
|---------|--------|---------|------|
| G-1 | 가족 포토앨범 | P0 | 가족 사진 업로드/관리 |
| G-2 | 출판 미리보기 | P0 | 일기/편지/앨범 종이책 미리보기 |
| G-3 | 시안 확인 플로우 | P0 | 페이지 넘기기, 레이아웃 확인 |
| G-4 | 출판 요청/결제 | P0 | 주문→결제→제작→배송 (파파스컴퍼니 POD 연동) |
| G-5 | 액자/POD 인쇄물 | P1 | 파파스컴퍼니 추가 인쇄물 연동 |

> **변경사항:** 출판 기능을 MVP에 포함. 파파스컴퍼니 POD 인프라를 활용하여 MVP부터 종이책 출판 수익 모델을 검증한다.

### 그룹 H: 가족 커뮤니티

| 이슈 ID | 이슈명 | 우선순위 | 설명 |
|---------|--------|---------|------|
| H-1 | 가족 공간 생성 | P2 | 초대 기반 비공개 가족 커뮤니티 |
| H-2 | 글/사진/일기 공유 | P2 | 가족 공간에 콘텐츠 게시 |
| H-3 | 알림 시스템 | P2 | 새 게시물, 댓글 알림 |

### 그룹 I: 영상 인터뷰 / 장례 서비스

| 이슈 ID | 이슈명 | 우선순위 | 설명 |
|---------|--------|---------|------|
| I-1 | 영상 인터뷰 패키지 소개 | P2 | 서비스 안내 페이지 |
| I-2 | 셀프 인터뷰 가이드 | P2 | 질문 가이드 + 녹화 기능 |
| I-3 | 장례 서비스 연계 | P3 | 추모관 디지털 서비스 연동 |

---

## 3. 기술 스택 결정

### 3.1 프론트엔드

```
Framework:  Next.js 14+ (App Router)
Language:   TypeScript
Styling:    Tailwind CSS + shadcn/ui
State:      Zustand (전역) + React Query (서버 상태)
Editor:     Tiptap (리치 텍스트 에디터)
Map:        Mapbox GL JS 또는 Kakao Maps SDK
Animation:  Framer Motion
PWA:        next-pwa (모바일 웹앱 대응)
```

**선택 근거:**
- Next.js App Router: SSR/SSG 혼합으로 SEO + 성능 최적화
- Tiptap: Day One 수준의 리치 에디터 구현에 최적, 마크다운 호환
- Zustand: Redux 대비 보일러플레이트 최소화, 초보자 친화적
- shadcn/ui: 커스터마이징 자유도 높은 UI 컴포넌트

### 3.2 백엔드

```
BaaS:       Supabase (PostgreSQL + Auth + Storage + Realtime)
API:        Supabase Edge Functions (Deno/TypeScript)
AI:         Anthropic Claude API (요약, 제안, 자서전 보조)
Push:       Firebase Cloud Messaging (FCM)
Payment:    포트원(PortOne) / 토스페이먼츠
```

**선택 근거:**
- Supabase: 이미 사용 경험 있음, RLS로 행 단위 보안 제어 가능
- Edge Functions: 서버리스로 운영비 최소화
- 포트원: 한국 PG사 통합 결제에 최적

### 3.3 인프라

```
Hosting:    Vercel (프론트) + Supabase Cloud (백엔드)
CDN:        Vercel Edge Network
Storage:    Supabase Storage (사진/영상) + S3 호환
Encryption: Supabase Vault (시크릿 코드 암호화)
Monitoring: Sentry (에러 추적) + Vercel Analytics
CI/CD:      GitHub Actions → Vercel 자동 배포
```

### 3.4 모바일 대응 전략 — Capacitor 동시 배포

```
전략: PWA + Capacitor 래핑을 동시에 진행
  ├── 웹앱:  Vercel 배포 → 브라우저 즉시 접근 가능
  ├── iOS:   Capacitor → App Store 배포
  ├── Android: Capacitor → Play Store 배포
  └── PWA:   Service Worker → 오프라인 지원 + 홈화면 추가

Phase 1~2: Next.js 웹앱 개발 (PWA 기본 설정 포함)
Phase 3:   Capacitor 래핑 시작 (네이티브 플러그인: 카메라, 생체인식, 푸시)
Phase 4:   앱 스토어 배포 준비 (심사, 인증서, 스크린샷)
Phase 5:   웹 + iOS + Android 동시 런칭
```

**Capacitor 선택 근거:**
- Next.js 코드를 그대로 재사용 (별도 앱 개발 불필요)
- 카메라, 생체인식, 푸시 알림 등 네이티브 기능 접근
- 웹뷰 기반이므로 UI 일관성 보장
- 고령자 타겟 → 앱 스토어에서 설치 가능해야 신뢰감 확보

**Capacitor 네이티브 플러그인 (필수):**
```
@capacitor/camera         — 사진 촬영/갤러리 접근
@capacitor/filesystem     — 로컬 파일 저장 (오프라인 지원)
@capacitor/push-notifications — FCM 푸시 알림
@capacitor/biometrics     — 지문/Face ID (시크릿 코드 2FA)
@capacitor/geolocation    — 위치 정보 자동 태깅
@capacitor/share          — OS 공유 시트
@capacitor/splash-screen  — 앱 시작 화면
```

---

## 4. 시스템 아키텍처

### 4.1 전체 구조

```
┌─────────────────────────────────────────────────┐
│                   Client Layer                   │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │ Next.js  │  │   PWA    │  │  Capacitor    │  │
│  │ Web App  │  │  Mobile  │  │  Native App   │  │
│  └────┬─────┘  └────┬─────┘  └──────┬────────┘  │
│       └──────────────┼───────────────┘           │
└──────────────────────┼───────────────────────────┘
                       │ HTTPS
┌──────────────────────┼───────────────────────────┐
│              Supabase Platform                    │
│  ┌───────────────────┼────────────────────────┐  │
│  │            Supabase Auth                    │  │
│  │    (Email, OAuth, Phone, 2FA)              │  │
│  └────────────────────────────────────────────┘  │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │PostgreSQL│  │ Storage  │  │Edge Functions │  │
│  │  + RLS   │  │(S3 호환) │  │  (Deno/TS)   │  │
│  └──────────┘  └──────────┘  └───────────────┘  │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │  Vault   │  │ Realtime │  │   pg_cron     │  │
│  │(암호화)  │  │(WebSocket)│ │  (스케줄링)   │  │
│  └──────────┘  └──────────┘  └───────────────┘  │
└──────────────────────────────────────────────────┘
                       │
┌──────────────────────┼───────────────────────────┐
│           External Services                       │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │ Claude   │  │ PortOne  │  │ FCM (Push)    │  │
│  │  API     │  │ 결제     │  │               │  │
│  └──────────┘  └──────────┘  └───────────────┘  │
│  ┌──────────┐  ┌──────────┐                      │
│  │ Kakao    │  │ 파파스   │                      │
│  │ Maps     │  │ POD API  │                      │
│  └──────────┘  └──────────┘                      │
└──────────────────────────────────────────────────┘
```

### 4.2 보안 아키텍처 (시크릿 코드 전용)

```
사용자 입력 → Client-side AES-256 암호화
    → Supabase Vault 저장 (서버 측 추가 암호화)
    → 복호화 시: 본인 인증 + 2FA → 클라이언트에서 복호화

유고 시 열람:
    가족 열람 요청 → 사망 확인 문서 업로드
    → 관리자 수동 승인 → 2단계 인증
    → 열람 공개 예약일 확인 → 복호화 키 전달
    → 클라이언트에서 복호화 → 열람
```

---

## 5. 모듈 설계 — 기능 단위 모듈화

### 5.1 모듈 맵

```
src/
├── app/                          # Next.js App Router 페이지
│   ├── (auth)/                   # 인증 관련 페이지
│   │   ├── login/
│   │   ├── signup/
│   │   └── verify/
│   ├── (main)/                   # 메인 레이아웃
│   │   ├── diary/                # 일기 모듈
│   │   │   ├── page.tsx          # 일기 메인 (5탭 뷰)
│   │   │   ├── [id]/page.tsx     # 일기 상세
│   │   │   └── new/page.tsx      # 일기 작성
│   │   ├── dear/                 # Dear My Son 모듈
│   │   │   ├── page.tsx          # 편지 목록
│   │   │   ├── [id]/page.tsx     # 편지 상세
│   │   │   └── new/page.tsx      # 편지 작성
│   │   ├── secret/               # 시크릿 코드 모듈
│   │   │   ├── page.tsx          # 시크릿 코드 목록
│   │   │   └── new/page.tsx      # 시크릿 코드 등록
│   │   ├── album/                # 포토앨범 모듈
│   │   ├── community/            # 가족 커뮤니티 모듈
│   │   ├── publish/              # 출판 모듈
│   │   └── settings/             # 설정 모듈
│   │       ├── family/           # 가족 구성원 관리
│   │       ├── security/         # 보안 설정
│   │       └── subscription/     # 구독 관리
│   └── (legacy)/                 # 유고 후 열람 전용 페이지
│       ├── request/              # 열람 요청
│       └── view/                 # 열람 페이지
│
├── components/                   # 공유 컴포넌트
│   ├── ui/                       # shadcn/ui 기본 컴포넌트
│   ├── editor/                   # Tiptap 에디터 관련
│   │   ├── RichTextEditor.tsx
│   │   ├── PhotoAttachment.tsx
│   │   ├── AudioRecorder.tsx
│   │   └── LocationTag.tsx
│   ├── diary/                    # 일기 전용 컴포넌트
│   │   ├── DiaryListView.tsx
│   │   ├── DiaryCalendarView.tsx
│   │   ├── DiaryMediaView.tsx
│   │   ├── DiaryMapView.tsx
│   │   └── DiarySummaryView.tsx
│   ├── secret/                   # 시크릿 코드 컴포넌트
│   │   ├── SecretCard.tsx
│   │   ├── CredentialTable.tsx
│   │   └── EncryptionBadge.tsx
│   ├── publish/                  # 출판 컴포넌트
│   │   ├── BookPreview.tsx
│   │   ├── PageNavigator.tsx
│   │   └── PublishFlow.tsx
│   ├── family/                   # 가족 관리 컴포넌트
│   │   ├── FamilyMemberBadge.tsx
│   │   ├── AccessScheduler.tsx
│   │   └── AuthStatusIndicator.tsx
│   └── layout/                   # 레이아웃 컴포넌트
│       ├── MobileNav.tsx
│       ├── Header.tsx
│       └── FloatingActionButton.tsx
│
├── lib/                          # 유틸리티 및 핵심 로직
│   ├── supabase/
│   │   ├── client.ts             # Supabase 클라이언트 설정
│   │   ├── middleware.ts         # Auth 미들웨어
│   │   └── types.ts              # DB 타입 (자동생성)
│   ├── encryption/
│   │   ├── aes.ts                # AES-256 암/복호화
│   │   ├── keyManager.ts         # 암호화 키 관리
│   │   └── e2ee.ts               # E2EE 프로토콜
│   ├── ai/
│   │   ├── claude.ts             # Claude API 래퍼
│   │   ├── summarizer.ts         # 일기 요약
│   │   └── suggestions.ts       # 글감 추천
│   └── utils/
│       ├── date.ts               # 날짜 포맷 (한국어)
│       ├── media.ts              # 미디어 처리
│       └── location.ts           # 위치/날씨 API
│
├── hooks/                        # 커스텀 훅
│   ├── useDiary.ts
│   ├── useSecret.ts
│   ├── useFamily.ts
│   ├── usePublish.ts
│   ├── useAuth.ts
│   └── useEncryption.ts
│
├── stores/                       # Zustand 스토어
│   ├── authStore.ts
│   ├── diaryStore.ts
│   ├── editorStore.ts
│   └── uiStore.ts
│
└── supabase/                     # Supabase 프로젝트 설정
    ├── migrations/               # DB 마이그레이션
    ├── functions/                # Edge Functions
    │   ├── publish-request/      # 출판 요청 처리
    │   ├── legacy-access/        # 유고 시 열람 처리
    │   ├── notify/               # 알림 발송
    │   └── ai-summary/           # AI 요약 생성
    └── seed.sql                  # 초기 데이터
```

### 5.2 모듈별 역할 정의

#### MOD-01: Auth Module (인증 모듈)

**역할:** 사용자 인증, 세션 관리, 2FA 설정

**핵심 기능:**
- Supabase Auth 기반 이메일/소셜 로그인
- 휴대전화 OTP 인증
- TOTP 기반 보안코드 2FA
- 생체인식 연동 (WebAuthn / Passkeys)
- 세션 만료 관리 및 자동 로그아웃

**구현 가이드:**
- `@supabase/ssr` 패키지로 Next.js App Router 미들웨어 설정
- `supabase.auth.signInWithOtp()` 로 휴대전화 인증
- `supabase.auth.mfa.enroll()` 로 TOTP 등록
- WebAuthn은 `@simplewebauthn/browser` + `@simplewebauthn/server` 사용
- 보안 레벨에 따른 미들웨어 체이닝: 일반 페이지(세션만) → 시크릿 코드(2FA 필수)

#### MOD-02: Diary Module (일기 모듈)

**역할:** 일기 CRUD, 5가지 뷰 모드, 미디어 관리

**핵심 기능:**
- Tiptap 기반 리치 텍스트 에디터
- 사진/음성/영상 첨부 (Supabase Storage)
- 자동 메타데이터: 날짜, 위치, 날씨
- 5개 뷰: 요약, 목록, 캘린더, 미디어, 지도
- 자동 저장 (debounce 3초)

**구현 가이드:**
- Tiptap extensions: `@tiptap/starter-kit`, `@tiptap/extension-image`, `@tiptap/extension-placeholder`
- 사진 업로드: `supabase.storage.from('diary-media').upload()` → 이미지 리사이즈는 Sharp (Edge Function)
- 위치: `navigator.geolocation.getCurrentPosition()` → Kakao Maps Reverse Geocoding
- 날씨: OpenWeatherMap API (무료 티어) 또는 기상청 API
- 캘린더 뷰: `react-day-picker` 또는 직접 구현 (스토리보드 참조)
- 지도 뷰: Kakao Maps SDK (`react-kakao-maps-sdk`)
- 미디어 뷰: 그리드 레이아웃, 타입별 필터 (모두/사진/비디오/오디오/PDF)

#### MOD-03: Dear My Son Module (편지 모듈)

**역할:** 자녀/가족에게 보내는 편지 작성 및 출판

**핵심 기능:**
- 수신자 태그 (아들, 딸, 배우자 등)
- 시크릿 코드 연동 (편지 내 보안정보 참조 가능)
- 편지별 출판 미리보기 (책 형태)
- 독립적인 편지 목록/관리

**구현 가이드:**
- Diary 모듈과 에디터 컴포넌트 공유하되, `journal_type: 'dear'` 으로 구분
- 수신자 메타데이터: `recipient_id` (가족 구성원 FK 참조)
- 편지 목록: 수신자별 그룹핑 + 날짜순 정렬
- 출판 미리보기는 Publish 모듈 재사용

#### MOD-04: Secret Code Module (시크릿 코드 모듈)

**역할:** 암호화된 보안 정보 관리, 유고 시 전달

**핵심 기능:**
- 카테고리별 보안 정보 등록 (은행, 부동산, 주식, 가상자산, 법률, 경영)
- 중요도 태깅 (중요/참고)
- ID/비밀번호 테이블 (암호화 마스킹)
- 클라이언트 사이드 암호화 (E2EE)
- 유고 시 복호화 키 전달 메커니즘

**구현 가이드:**
- 암호화: Web Crypto API (`window.crypto.subtle`)로 AES-256-GCM
- 키 관리: 마스터 패스워드 → PBKDF2 키 유도 → 로컬 키 생성
- DB 저장: 암호화된 ciphertext만 저장, 키는 클라이언트에만 존재
- 유고 시: 마스터 패스워드의 Shamir's Secret Sharing (SSS) 조각을 가족에게 분배
  - 예: 3명의 가족 중 2명이 조각을 모으면 복호화 가능
- ID/비밀번호 테이블: 마스킹 표시(`******`), 열람 시 2FA 후 복호화
- Supabase Vault 활용: `vault.create_secret()` 로 서버측 추가 암호화

#### MOD-05: Family Module (가족 관리 모듈)

**역할:** 가족 구성원 등록, 인증, 열람 권한, 공개 예약

**핵심 기능:**
- 가족 구성원 CRUD (역할 + 연락처 + 인증상태)
- 초대 → 본인인증 → 인증 완료 플로우
- 열람 공개 예약 일자 설정
- 가족별 콘텐츠 접근 권한 매트릭스

**구현 가이드:**
- 가족 구성원 뱃지: 색상별 역할 구분 (스토리보드 참조: 아내=파랑, 아들=노랑, 딸=핑크, 변호사=초록)
- 인증 플로우: SMS 초대 → 링크 클릭 → 본인인증(PASS 등) → 인증 완료
- 열람 공개 예약: date picker로 날짜 설정 → `pg_cron` 으로 예약일 도달 시 상태 변경
- RLS 정책: `family_members` 테이블 기반으로 콘텐츠 접근 제어

#### MOD-06: Publish Module (출판 모듈)

**역할:** 일기/편지를 종이책으로 출판

**핵심 기능:**
- 전체/부분 일기 출판 미리보기
- 페이지 레이아웃 프리뷰 (사진+글 배치)
- 시안확인 → 출판요청 워크플로우
- 결제 연동

**구현 가이드:**
- 북 프리뷰: HTML→PDF 변환 (`@react-pdf/renderer` 또는 Puppeteer)
- 페이지 네비게이터: 좌우 넘기기 UI (Swiper.js)
- 출판 워크플로우 상태 머신: `draft` → `review` → `confirmed` → `ordered` → `printing` → `shipped`
- 파파스컴퍼니 POD 연동: Edge Function에서 내부 API 호출
- 결제: 포트원 SDK → 결제 완료 webhook → 주문 상태 변경

#### MOD-07: Legacy Access Module (유고 후 열람 모듈)

**역할:** 소유자 유고 시 가족의 기록 열람 프로세스

**핵심 기능:**
- 열람 요청 제출 (사망확인서 업로드)
- 관리자 수동 승인
- 2단계 인증 후 열람
- 열람 공개 예약일 자동 확인
- 시크릿 코드 복호화 키 전달

**구현 가이드:**
- 별도 라우트 그룹: `(legacy)` — 기존 사용자 UI와 완전 분리
- 열람 요청 폼: 문서 업로드 + 관계 증명
- 관리자 대시보드: Supabase Studio 또는 별도 Admin 페이지
- 승인 후: 가족 구성원 계정에 읽기 전용 접근 권한 부여 (RLS 정책 업데이트)
- 시크릿 코드: SSS 조각 결합 UI → 마스터 키 복원 → 클라이언트 복호화

---

## 6. UX/UI 설계 — Day One 참조 + 스토리보드 반영

### 6.1 디자인 시스템

#### 컬러 팔레트

```
Primary:     #1A1A1A (거의 검정 — 텍스트, 헤더)
Secondary:   #4A90D9 (차분한 파랑 — 액센트, 캘린더 하이라이트)
Accent:      #00C9B7 (민트 — CTA 버튼, 완료)
Background:  #FAFAFA (따뜻한 화이트)
Surface:     #FFFFFF (카드 배경)
Danger:      #FF4757 (삭제, 경고)
Secret:      #FF6B9D (핑크 — 시크릿 코드 강조, 출판요청 버튼)

가족 뱃지 색상:
  아내:    #4A90D9 (파랑)
  아들:    #FFD93D (노랑)
  딸:      #FF6B9D (핑크)
  변호사:  #2ED573 (초록)
  기타:    #A4B0BE (회색)
```

#### 타이포그래피

```
Display:     Pretendard Bold (한국어 + 영문 통합)
             로고: "Storige" — Stories + Storage 합성 워드마크
Heading:     Pretendard SemiBold
Body:        Pretendard Regular
Mono:        JetBrains Mono (시크릿 코드 마스킹)
Size Scale:  14px(본문) / 16px(소제목) / 20px(제목) / 28px(대제목)
```

#### 레이아웃 원칙

- **Mobile-First**: 375px 기준 설계 → 태블릿/데스크톱 확장
- **Day One 스타일**: 깨끗한 흰 배경, 충분한 여백, 콘텐츠 중심
- **하단 FAB (+)**: 새 기록 작성 (스토리보드 일관)
- **상단 로고 + 햄버거 메뉴**: 스토리보드 헤더 패턴 유지
- **탭 네비게이션**: 요약 | 목록 | 캘린더 | 미디어 | 지도 (가로 스크롤 탭)

### 6.2 화면별 와이어프레임 명세

#### Screen 01: 스플래시/온보딩

```
┌─────────────────┐
│                  │
│   [Storige 로고] │
│                  │
│ "이야기를 저장하고 │
│  기억을 저장합니다" │
│                  │
│  [시작하기]       │
│  [로그인]        │
└─────────────────┘
```
- 온보딩 3장 슬라이드: 기록 → 보관 → 전달 컨셉 설명
- Day One 참조: 심플한 일러스트 + 한 줄 설명

#### Screen 02: 메인 — 일기 목록 뷰 (스토리보드 p.3 좌)

```
┌─────────────────┐
│ Storige    ≡    │
│ 모든 일기        │
│ 2015년 ~ 2025년  │
├─────────────────┤
│ 요약│목록│캘린더│미디어│지도 │
├─────────────────┤
│ 2025년 3월       │
│                  │
│ 31 사랑하는 아들아   │
│ 화 사랑하는 나의...  │
│                  │
│ 29 사랑하는 딸에게   │
│ 월 사랑하는 나의...  │
│                  │
│ 28 아들아 결혼하기.. │
│ 일 넌 멋진 남자가...│
│                  │
│         [+]      │
└─────────────────┘
```

- 날짜 왼쪽 정렬 (일 + 요일 표기)
- 제목 굵게, 미리보기 텍스트 회색
- 보안 글은 🔒 아이콘 표시
- FAB (+) 고정 하단 우측

#### Screen 03: 캘린더 뷰 (스토리보드 p.3 중)

- 월별 그리드 캘린더
- 기록 있는 날: 파란 원형 마커
- 오늘: 하이라이트 배경
- 캘린더 아래: 해당 월 기록 스크롤

#### Screen 04: 미디어 뷰 (스토리보드 p.3 우)

- 상단 필터 탭: 모두 | 사진 | 비디오 | 오디오 | PDF
- 3열 그리드 사진 썸네일
- 좌하단 날짜 오버레이 (4월 2020 스타일)
- 탭하면 전체화면 갤러리

#### Screen 05: 지도 뷰 (스토리보드 p.4 좌)

- 전체 화면 Kakao Maps
- 기록 위치에 클러스터 마커
- 마커 탭 → 해당 일기 미리보기 팝업

#### Screen 06: 일기 작성 (스토리보드 p.4 우)

```
┌─────────────────┐
│ Storige    ≡    │
│▓ 2025년 3월 31일 ☺ 완료│
│ 일지 · 성수동1가 16-3 ☁ 12°C │
├─────────────────┤
│                  │
│ |                │
│ (커서 깜빡임)    │
│                  │
│ [사진첨부 영역]   │
│                  │
├─────────────────┤
│ 📷사진 📝템플릿 💡제안 🎤오디오 │
│      ∨ 더 보기    │
├─────────────────┤
│    [한글 키보드]   │
└─────────────────┘
```

- 상단 파란색 바: 날짜 + 이모지 기분 + 완료 버튼
- 위치/날씨 자동 태깅 (작은 텍스트)
- 하단 도구모음: 사진, 템플릿, AI 제안, 오디오
- "더 보기" 확장: 영상, 태그, 즐겨찾기

#### Screen 07: 내 스토리지 관리 (스토리보드 p.6 좌)

```
┌─────────────────┐
│ Storige    ≡    │
│ 내 스토리지 관리   │
│ 소중한 나의 기록인...│
├─────────────────┤
│ 가족구성원 설정     │
│ (아내)(아들)(딸)(변호사)[+] │
│ 인증  인증  미인증 인증  추가│
├─────────────────┤
│ 열람 공개 예약     │
│ [2032년] [3월] [12일] │
│ [변경하기 / 재등록]  │
├─────────────────┤
│ 2단계 인증 설정    │
│ 휴대전화│보안코드│생체인식│
│ 사용중   변경    변경  │
├─────────────────┤
│ 내 스토리지 출판요청 │
│ [접수/시안확인][출판요청]│
└─────────────────┘
```

#### Screen 08: 시크릿 코드 목록 (스토리보드 p.7 중)

```
┌─────────────────┐
│         시크릿 코드    ≡ │
│ 시크릿코드 기록은 암호화... │
├─────────────────┤
│ 2025년 3월        │
│                   │
│ 01 부동산 등기 현황 및... │
│ 중요               │
│                   │
│ 02 증여 관련해 (주)광장.. │
│ 참고               │
│                   │
│ 03 주식투자 및 채권...   │
│ 중요               │
│                   │
│ 04 가상자산 투자현황...  │
│ 중요               │
│                   │
│ 05 회사관련 경영권 승계.. │
│ 중요               │
│          [+]      │
└─────────────────┘
```

#### Screen 09: Dear My Son 상세 + 출판 미리보기 (스토리보드 p.8)

- 편지 상세: 감성적 레이아웃 (편지지 스타일 배경)
- 출판 미리보기: 책 페이지 넘기기 UI
- 하단: 시안확인 완료 (파란 버튼) + 출판요청 (핑크 버튼)

### 6.3 네비게이션 구조

```
햄버거 메뉴 (≡)
├── 🏠 홈 (일기 목록)
├── ✉️ Dear My Son
├── 🔐 시크릿 코드
├── 📸 포토앨범
├── 📖 출판하기
├── 👨‍👩‍👧‍👦 가족 커뮤니티
├── ⚙️ 내 스토리지 관리
│   ├── 가족구성원 설정
│   ├── 보안 설정
│   ├── 열람 공개 예약
│   └── 구독 관리
├── 🎥 영상 인터뷰
└── ❓ 도움말
```

### 6.4 핵심 UX 원칙

1. **Day One 참조 포인트:**
   - 깨끗하고 여백 넉넉한 디자인
   - 항목 간 구분선은 최소화 (공간으로 구분)
   - 에디터는 콘텐츠에 집중 (도구 최소 노출)
   - 자동 메타데이터 (날짜/위치/날씨)

2. **아코디언 UI 패턴 (확정):**
   - 일기/편지/시크릿 코드 목록에서 항목 터치 시 아코디언으로 펼침
   - 펼치면: 왼쪽 컬러 보더 + 전문 + 메타데이터 + 액션 버튼
   - 일기: 파란색 보더 | Dear My Son: 민트 보더 | 시크릿 코드: 핑크 보더
   - 쉐브론(∨) 아이콘 회전으로 열림/닫힘 상태 표시
   - 화면 전환 없이 콘텐츠 확인 → 편집 버튼으로 에디터 진입
   - 한 번에 하나만 열림 (다른 항목 터치 시 기존 닫힘)

2. **한국 시장 최적화:**
   - 한글 폰트 최적화 (Pretendard)
   - 한국식 날짜 표기 (2025년 3월 31일 화요일)
   - 한국 지도 (Kakao Maps)
   - 한국 결제 (포트원)

3. **감성적 접근:**
   - 시크릿 코드 영역: 약간의 긴장감 (어두운 배경, 모노스페이스)
   - Dear My Son 영역: 따뜻한 톤 (편지지 텍스처, 부드러운 폰트)
   - 출판 미리보기: 실제 책 느낌 (페이지 넘김 효과, 그림자)

---

## 7. 세부 유스케이스

### UC-01: 일기 작성

```
Actor: 사용자
전제조건: 로그인 상태

1. FAB(+) 버튼 탭
2. 에디터 화면 진입 → 자동으로 현재 날짜/시간/위치/날씨 기록
3. 텍스트 입력 (한글 IME 지원)
4. [선택] 사진 첨부 버튼 → 카메라 or 갤러리 선택
5. [선택] 오디오 녹음 버튼 → 인앱 녹음 → 자동 STT 변환
6. [선택] 템플릿 버튼 → 템플릿 선택 → 구조화된 폼 제공
7. [선택] AI 제안 버튼 → 글감 추천 or 문장 보완
8. "완료" 탭 → 자동 저장 + 목록으로 복귀
```

### UC-02: 시크릿 코드 등록

```
Actor: 사용자
전제조건: 로그인 + 2FA 인증 완료

1. 시크릿 코드 메뉴 진입
2. 2FA 인증 요구 → 인증 완료
3. (+) 버튼 → 새 시크릿 코드 등록
4. 카테고리 선택 (금융/부동산/법률/가상자산/기업/기타)
5. 제목 입력
6. 중요도 설정 (중요/참고)
7. 본문 입력 (텍스트)
8. [선택] ID/비밀번호 테이블 추가
   - 서비스명, 아이디, 비밀번호 행 추가
9. 저장 → 클라이언트 사이드 AES-256 암호화 → DB 저장
10. 암호화 완료 알림 표시
```

### UC-03: 유고 후 가족 열람

```
Actor: 지정된 가족 구성원
전제조건: 소유자가 사전에 가족 등록 + 열람 예약 설정 완료

1. 가족이 Storige 열람 요청 페이지 접속
2. 본인 확인 (SMS 인증 또는 PASS 인증)
3. 소유자와의 관계 선택 + 사망확인서 업로드
4. 열람 요청 접수 → 관리자에게 알림
5. 관리자가 문서 검토 후 승인
6. [열람 공개 예약일 미도래 시] "아직 열람할 수 없습니다" + 예약일 안내
7. [열람 공개 예약일 도래 또는 통과 시] 열람 권한 활성화
8. 가족 로그인 → 읽기 전용으로 일기/편지/앨범 열람
9. 시크릿 코드 열람 시: SSS 키 조각 결합 요구
   - 지정된 N명 중 M명의 키 조각 입력
   - 마스터 키 복원 → 복호화 → 열람
```

### UC-04: 종이책 출판 요청

```
Actor: 사용자
전제조건: 일기 또는 Dear My Son에 1건 이상 기록 존재

1. "출판하기" 메뉴 or 설정 내 "출판요청" 진입
2. 출판 범위 선택: 전체 일기 / Dear My Son / 기간 선택
3. 미리보기 생성 → 책 형태 레이아웃 확인
4. 페이지 넘기며 내용/사진 배치 확인
5. "시안확인 완료" 버튼
6. "출판요청" 버튼 → 결제 페이지 이동
7. 결제 완료 → 주문 접수
8. 제작 상태 알림: 접수 → 인쇄 → 발송 → 배송완료
```

### UC-05: 가족 구성원 관리

```
Actor: 사용자
전제조건: 로그인 상태

1. "내 스토리지 관리" → "가족구성원 설정"
2. (+) 버튼 → 가족 추가
3. 역할 선택 (배우자/아들/딸/부모/변호사/기타)
4. 이름, 연락처(휴대전화) 입력
5. 저장 → SMS 인증 초대 발송
6. 가족이 인증 완료 시 → 상태: "인증" 으로 변경
7. [선택] 해당 가족의 콘텐츠 접근 범위 설정
   - 일기: 전체/일부/미공개
   - Dear My Son: 본인 수신 편지만/전체
   - 시크릿 코드: SSS 키 조각 보유 여부
   - 포토앨범: 전체/일부
```

---

## 8. QA 시나리오

### 8.1 Auth QA

| ID | 시나리오 | 기대 결과 |
|----|---------|----------|
| QA-A01 | 이메일 회원가입 후 이메일 확인 링크 클릭 | 계정 활성화, 로그인 가능 |
| QA-A02 | 잘못된 비밀번호 5회 입력 | 계정 임시 잠금 (15분) |
| QA-A03 | 2FA 활성화 후 로그인 | OTP 입력 화면 표시 |
| QA-A04 | 생체인식 등록 후 재로그인 | 지문/Face ID로 인증 가능 |
| QA-A05 | 세션 만료 후 시크릿 코드 접근 | 재인증 요구 |

### 8.2 Diary QA

| ID | 시나리오 | 기대 결과 |
|----|---------|----------|
| QA-B01 | 한글 입력 중 IME 조합 상태에서 저장 | 조합 완료 후 정상 저장 |
| QA-B02 | 10MB 사진 3장 동시 첨부 | 리사이즈 후 업로드 완료, 프로그레스바 표시 |
| QA-B03 | 오프라인 상태에서 일기 작성 | 로컬 저장 후 온라인 복귀 시 동기화 |
| QA-B04 | 캘린더 뷰에서 기록 있는 날짜 탭 | 해당 날짜 일기 목록 표시 |
| QA-B05 | 지도 뷰에서 마커 클러스터 탭 | 줌인 또는 목록 팝업 |
| QA-B06 | 미디어 뷰 "비디오" 필터 | 비디오만 표시 |
| QA-B07 | 3초 디바운스 자동 저장 | 타이핑 멈추고 3초 후 저장 인디케이터 |

### 8.3 Secret Code QA

| ID | 시나리오 | 기대 결과 |
|----|---------|----------|
| QA-E01 | 시크릿 코드 저장 후 DB 직접 조회 | ciphertext만 저장 (평문 없음) |
| QA-E02 | 2FA 없이 시크릿 코드 접근 시도 | 2FA 인증 화면으로 리다이렉트 |
| QA-E03 | ID/비밀번호 테이블 마스킹 | ****** 표시, 탭 시 2FA 후 노출 |
| QA-E04 | 서로 다른 가족 2명이 SSS 키 조각 제출 | 마스터 키 복원 성공, 복호화 가능 |
| QA-E05 | SSS 키 조각 1명만 제출 (기준치 미달) | "추가 인증 필요" 메시지 |

### 8.4 Legacy Access QA

| ID | 시나리오 | 기대 결과 |
|----|---------|----------|
| QA-F01 | 미인증 가족이 열람 요청 | "인증이 완료되지 않은 구성원" 안내 |
| QA-F02 | 열람 예약일 이전에 승인된 가족 접근 | "아직 공개일이 아닙니다" 안내 |
| QA-F03 | 열람 예약일 도달 후 접근 | 읽기 전용 콘텐츠 열람 가능 |
| QA-F04 | 가족이 열람 중 콘텐츠 수정 시도 | 수정 불가 (모든 CUD 버튼 비활성화) |

### 8.5 Publish QA

| ID | 시나리오 | 기대 결과 |
|----|---------|----------|
| QA-G01 | 84페이지 일기 출판 미리보기 | 전체 페이지 로드, 페이지 넘기기 가능 |
| QA-G02 | 시안확인 미완료 상태에서 출판요청 | 출판요청 버튼 비활성화 |
| QA-G03 | 결제 성공 후 주문 상태 | "접수완료" 상태, 이메일/푸시 알림 |

---

## 9. 데이터베이스 설계

### 9.1 ERD 개요

```sql
-- 사용자 프로필 (Supabase Auth 확장)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  subscription_tier TEXT DEFAULT 'free', -- free, premium
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 일기 항목 (Diary + Dear My Son 통합)
CREATE TABLE entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  journal_type TEXT NOT NULL DEFAULT 'diary', -- diary, dear, secret_note
  title TEXT,
  content JSONB, -- Tiptap JSON 형식
  content_text TEXT, -- 검색용 평문 (시크릿 제외)
  mood TEXT, -- emoji or mood code
  is_favorite BOOLEAN DEFAULT false,
  is_encrypted BOOLEAN DEFAULT false,
  recipient_id UUID REFERENCES family_members(id), -- Dear My Son용
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  location_name TEXT,
  weather TEXT,
  temperature REAL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ -- 출판에 포함된 날짜
);

-- 미디어 첨부
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  media_type TEXT NOT NULL, -- photo, video, audio, pdf
  storage_path TEXT NOT NULL,
  thumbnail_path TEXT,
  file_size BIGINT,
  duration_seconds INTEGER, -- audio/video 길이
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 시크릿 코드
CREATE TABLE secret_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  category TEXT NOT NULL, -- finance, real_estate, legal, crypto, business, other
  title TEXT NOT NULL,
  importance TEXT NOT NULL DEFAULT 'important', -- important, reference
  encrypted_content TEXT NOT NULL, -- AES-256 암호화된 본문
  encrypted_credentials JSONB, -- 암호화된 ID/PW 테이블
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 가족 구성원
CREATE TABLE family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id),
  linked_user_id UUID REFERENCES profiles(id), -- 인증 완료 시 연결
  role TEXT NOT NULL, -- spouse, son, daughter, lawyer, parent, other
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  is_verified BOOLEAN DEFAULT false,
  verification_token TEXT,
  badge_color TEXT, -- hex 색상
  sss_share TEXT, -- Shamir's Secret Sharing 조각 (암호화)
  access_permissions JSONB DEFAULT '{"diary": "all", "dear": "own", "secret": "sss", "album": "all"}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 열람 공개 설정
CREATE TABLE legacy_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) UNIQUE,
  scheduled_date DATE, -- 열람 공개 예약일
  is_active BOOLEAN DEFAULT false, -- 유고 확인 후 활성화
  activated_at TIMESTAMPTZ,
  activation_document_url TEXT, -- 사망확인서 등
  sss_threshold INTEGER DEFAULT 2, -- SSS 복원에 필요한 최소 조각 수
  sss_total INTEGER DEFAULT 3, -- SSS 전체 조각 수
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 열람 요청
CREATE TABLE legacy_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id),
  requester_family_id UUID NOT NULL REFERENCES family_members(id),
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  document_url TEXT, -- 증빙 서류
  admin_note TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 출판 주문
CREATE TABLE publish_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  publish_type TEXT NOT NULL, -- full_diary, dear_son, album, partial
  status TEXT DEFAULT 'draft', -- draft, review, confirmed, ordered, printing, shipped, delivered
  page_count INTEGER,
  preview_data JSONB, -- 미리보기 레이아웃 데이터
  payment_id TEXT, -- 포트원 결제 ID
  amount INTEGER, -- 결제 금액 (원)
  shipping_address JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 가족 커뮤니티 게시물
CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_group_id UUID NOT NULL, -- 가족 그룹 ID
  author_id UUID NOT NULL REFERENCES profiles(id),
  content TEXT,
  media_urls TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 태그
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  name TEXT NOT NULL,
  UNIQUE(user_id, name)
);

CREATE TABLE entry_tags (
  entry_id UUID REFERENCES entries(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (entry_id, tag_id)
);
```

### 9.2 RLS 정책 (핵심)

```sql
-- entries: 본인만 읽기/쓰기
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "entries_owner" ON entries
  FOR ALL USING (auth.uid() = user_id);

-- 유고 후 가족 읽기 전용 접근
CREATE POLICY "entries_legacy_read" ON entries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM legacy_settings ls
      JOIN family_members fm ON fm.owner_id = ls.user_id
      WHERE ls.user_id = entries.user_id
        AND ls.is_active = true
        AND fm.linked_user_id = auth.uid()
        AND fm.is_verified = true
        AND (ls.scheduled_date IS NULL OR ls.scheduled_date <= CURRENT_DATE)
    )
  );

-- secret_codes: 본인만 (2FA는 앱 레벨에서 강제)
ALTER TABLE secret_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "secrets_owner" ON secret_codes
  FOR ALL USING (auth.uid() = user_id);

-- family_members: 본인이 등록한 가족만
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "family_owner" ON family_members
  FOR ALL USING (auth.uid() = owner_id);
```

---

## 10. API 설계

### 10.1 Supabase 직접 호출 (클라이언트)

대부분의 CRUD는 Supabase JS Client로 직접 처리한다 (RLS가 보안 보장).

```typescript
// 예시: 일기 목록 조회
const { data } = await supabase
  .from('entries')
  .select('*, media(*)')
  .eq('journal_type', 'diary')
  .order('created_at', { ascending: false })
  .range(0, 19);
```

### 10.2 Edge Functions (서버 로직 필요한 경우)

| Function | Trigger | 역할 |
|----------|---------|------|
| `ai-summary` | POST /functions/v1/ai-summary | Claude API 호출 → 기간별 일기 요약 생성 |
| `publish-preview` | POST /functions/v1/publish-preview | 출판 미리보기 PDF 생성 |
| `publish-order` | POST /functions/v1/publish-order | 결제 확인 → 파파스 POD API 주문 전달 |
| `legacy-activate` | POST /functions/v1/legacy-activate | 관리자 승인 → 열람 권한 활성화 |
| `notify` | POST /functions/v1/notify | FCM 푸시 알림 발송 |
| `media-process` | POST /functions/v1/media-process | 이미지 리사이즈, 썸네일 생성 |
| `sss-generate` | POST /functions/v1/sss-generate | SSS 키 조각 생성 및 분배 |
| `weather` | GET /functions/v1/weather | 위치 기반 날씨 조회 (API 키 은닉) |

### 10.3 Webhook

| Webhook | 소스 | 처리 |
|---------|------|------|
| 결제 완료 | 포트원 | 주문 상태 업데이트 → 알림 발송 |
| 가족 인증 완료 | 자체 | family_members.is_verified = true |

---

## 11. 보안 설계

### 11.1 보안 레이어

```
Layer 1: HTTPS (TLS 1.3) — 전송 구간 암호화
Layer 2: Supabase Auth + JWT — 인증/인가
Layer 3: RLS — 행 수준 접근 제어
Layer 4: 2FA (TOTP/SMS/WebAuthn) — 민감 영역 추가 인증
Layer 5: Client-side E2EE (AES-256-GCM) — 시크릿 코드 전용
Layer 6: Supabase Vault — 서버측 키 관리
Layer 7: SSS (Shamir's Secret Sharing) — 유고 시 키 복원
```

### 11.2 암호화 구현 가이드

```typescript
// Web Crypto API 기반 AES-256-GCM 구현 골격

// 1. 마스터 패스워드 → 암호화 키 유도
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 600000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// 2. 암호화
async function encrypt(plaintext: string, key: CryptoKey): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(plaintext)
  );
  // iv + ciphertext → base64
  return btoa(String.fromCharCode(...iv, ...new Uint8Array(ciphertext)));
}

// 3. SSS 키 분할 (secrets.js 라이브러리 활용)
// npm install secrets.js-34r7h
import secrets from 'secrets.js-34r7h';
const shares = secrets.share(masterKeyHex, totalShares, threshold);
```

### 11.3 데이터 분류

| 분류 | 대상 | 암호화 레벨 | 접근 제어 |
|------|------|-----------|----------|
| Public | 프로필, 설정 | 없음 (HTTPS만) | RLS (본인) |
| Sensitive | 일기, 편지, 사진 | 서버 암호화 (Supabase) | RLS + Auth |
| Critical | 시크릿 코드, ID/PW | E2EE (클라이언트) + Vault | RLS + 2FA + E2EE |
| Recovery | SSS 키 조각 | 개별 암호화 | RLS + 본인 인증 |

---

## 12. TDD 기반 개발 방법론 및 에이전트팀 구성

### 12.1 TDD 개발 사이클

```
Red    → 실패하는 테스트 먼저 작성
Green  → 테스트 통과하는 최소 코드 작성
Refactor → 코드 정리 (테스트 유지)
```

### 12.2 테스트 스택

```
Unit Test:        Vitest (빠른 실행, TypeScript 네이티브)
Component Test:   React Testing Library + Vitest
E2E Test:         Playwright (크로스 브라우저)
API Test:         Supabase CLI 로컬 환경 + Vitest
Security Test:    수동 + OWASP ZAP (자동화)
```

### 12.3 에이전트팀 구성 가이드

Claude Code로 개발할 때, 아래 역할별로 프롬프트를 분리하여 작업하면 효율적이다. 각 에이전트는 독립적인 Claude Code 세션 또는 명확히 구분된 프롬프트로 운영한다.

#### 🤖 Agent 1: 아키텍트 (Architect Agent)

**역할:** 프로젝트 초기 설정, 디렉토리 구조, 설정 파일, 타입 정의

**담당 업무:**
- Next.js 프로젝트 초기화 + TypeScript 설정
- Supabase 프로젝트 연결 + 타입 자동 생성
- Tailwind + shadcn/ui 설정
- ESLint + Prettier 설정
- 디렉토리 구조 생성
- 공통 타입 정의 (`types/`)
- 환경 변수 템플릿 (`.env.example`)

**Claude Code 프롬프트 예시:**
```
Next.js 14 App Router + TypeScript + Tailwind + shadcn/ui 프로젝트를
초기화하고, Supabase 연동 설정을 완료해줘.
디렉토리 구조는 [STORIGE_DEV_PLAN.md의 5.1 모듈 맵]을 따라줘.
```

#### 🤖 Agent 2: DB 엔지니어 (Database Agent)

**역할:** 데이터베이스 스키마, 마이그레이션, RLS 정책, Seed 데이터

**담당 업무:**
- Supabase 마이그레이션 파일 작성
- RLS 정책 구현
- 인덱스 설정
- Seed 데이터 (개발용 더미 데이터)
- Supabase 타입 생성 (`supabase gen types`)

**Claude Code 프롬프트 예시:**
```
[STORIGE_DEV_PLAN.md의 섹션 9]를 기반으로 Supabase 마이그레이션 파일을
작성해줘. RLS 정책도 포함해야 해.
```

#### 🤖 Agent 3: UI 빌더 (Frontend Agent)

**역할:** 페이지 컴포넌트, UI 컴포넌트, 스타일링

**담당 업무:**
- 페이지별 컴포넌트 구현
- shadcn/ui 컴포넌트 커스터마이징
- Tiptap 에디터 설정
- 반응형 레이아웃
- 애니메이션/트랜지션

**Claude Code 프롬프트 예시:**
```
[STORIGE_DEV_PLAN.md의 섹션 6.2]의 화면 명세를 참고해서
일기 목록 뷰(DiaryListView) 컴포넌트를 구현해줘.
Day One 앱 스타일의 깨끗한 디자인으로.
```

#### 🤖 Agent 4: 로직 엔지니어 (Business Logic Agent)

**역할:** 커스텀 훅, 스토어, API 연동, 비즈니스 로직

**담당 업무:**
- Zustand 스토어 구현
- React Query 훅 작성
- Supabase 클라이언트 래퍼
- 암호화 모듈 (`lib/encryption/`)
- AI 연동 모듈 (`lib/ai/`)
- 미디어 처리 유틸리티

**Claude Code 프롬프트 예시:**
```
[STORIGE_DEV_PLAN.md의 섹션 11.2]를 참고해서 시크릿 코드용
E2EE 암호화 모듈을 구현해줘. Web Crypto API + SSS를 사용해.
```

#### 🤖 Agent 5: 서버리스 엔지니어 (Edge Functions Agent)

**역할:** Supabase Edge Functions, Webhook, 외부 API 연동

**담당 업무:**
- Edge Functions 구현 (Deno/TypeScript)
- 결제 Webhook 처리
- FCM 푸시 알림
- Claude API 연동 (요약/제안)
- 미디어 처리 파이프라인

**Claude Code 프롬프트 예시:**
```
Supabase Edge Function으로 일기 요약 API를 만들어줘.
Claude API를 호출해서 지정 기간의 일기를 요약하는 기능이야.
```

#### 🤖 Agent 6: QA 엔지니어 (Test Agent)

**역할:** 테스트 코드 작성, E2E 시나리오, 보안 검증

**담당 업무:**
- Vitest 유닛 테스트
- React Testing Library 컴포넌트 테스트
- Playwright E2E 테스트
- 암호화 모듈 검증 테스트
- RLS 정책 검증 테스트

**Claude Code 프롬프트 예시:**
```
[STORIGE_DEV_PLAN.md의 섹션 8]의 QA 시나리오를 기반으로
시크릿 코드 모듈의 테스트 코드를 작성해줘.
Vitest + React Testing Library를 사용해.
```

### 12.4 에이전트 간 의존성 순서

```
Phase 1: Agent 1 (아키텍트) → 프로젝트 골격
Phase 2: Agent 2 (DB) → 스키마 + RLS    |  병렬: Agent 3 (UI) → 정적 UI
Phase 3: Agent 4 (로직) → 훅 + 스토어 + 암호화
Phase 4: Agent 3 + Agent 4 통합 → 페이지 조립
Phase 5: Agent 5 (서버리스) → Edge Functions
Phase 6: Agent 6 (QA) → 전체 테스트 (각 Phase마다 TDD로 병행)
```

---

## 13. 단계별 개발 로드맵

### Phase 1: Foundation (2주)

| 스프린트 | 작업 | 에이전트 | 산출물 |
|---------|------|---------|--------|
| 1-1 | 프로젝트 초기화 + Capacitor 설정 | Architect | Next.js + Supabase + Capacitor 프로젝트 |
| 1-2 | DB 스키마 + 마이그레이션 | Database | 전체 테이블 + RLS (통합 확장 고려) |
| 1-3 | Auth 모듈 | Logic + UI | 로그인/회원가입/2FA |
| 1-4 | 기본 레이아웃 + 네비게이션 | UI Builder | 헤더, 햄버거 메뉴, FAB, 하단 네비 |

**Phase 1 완료 기준:** 로그인 후 빈 일기 목록 화면 노출 (웹 + Capacitor 빌드 확인)

### Phase 2: Diary Core (3주)

| 스프린트 | 작업 | 에이전트 | 산출물 |
|---------|------|---------|--------|
| 2-1 | 일기 작성 에디터 | UI + Logic | Tiptap 에디터 + 자동저장 |
| 2-2 | 사진/미디어 첨부 | Logic + Serverless | 업로드 + 썸네일 + Capacitor Camera |
| 2-3 | 아코디언 목록 뷰 + 캘린더 뷰 | UI Builder | 목록(아코디언 펼침) + 캘린더 뷰 |
| 2-4 | 미디어 뷰 + 지도 뷰 | UI Builder | 4개 뷰 완성 |
| 2-5 | 위치/날씨 자동 태깅 | Logic + Serverless | 메타데이터 자동 기록 + Capacitor Geolocation |
| 2-6 | 검색/필터 | Logic + UI | 키워드, 태그, 날짜 필터 |

**Phase 2 완료 기준:** 일기 작성/열람(아코디언)/검색 전체 플로우 동작

### Phase 3: Dear My Son + Secret Code + 출판 (4주)

| 스프린트 | 작업 | 에이전트 | 산출물 |
|---------|------|---------|--------|
| 3-1 | Dear My Son 편지 작성/목록(아코디언) | UI + Logic | 편지 CRUD |
| 3-2 | 시크릿 코드 E2EE 암호화 | Logic | 암호화 모듈 |
| 3-3 | 시크릿 코드 UI(아코디언) | UI Builder | 목록, 등록, ID/PW 테이블 |
| 3-4 | 가족 구성원 관리 | UI + Logic | CRUD + 인증 플로우 |
| 3-5 | SSS 키 분배 | Logic + Serverless | 키 조각 생성/분배 |
| 3-6 | 출판 미리보기 + 시안확인 | UI Builder | 책 형태 프리뷰어 |
| 3-7 | 출판 결제 + 파파스 POD 연동 | Logic + Serverless | 포트원 결제 + POD API |

**Phase 3 완료 기준:** 시크릿 코드 암호화 + 가족 등록 + 출판 주문 가능

### Phase 4: Legacy Access + Capacitor 네이티브 (3주)

| 스프린트 | 작업 | 에이전트 | 산출물 |
|---------|------|---------|--------|
| 4-1 | 열람 공개 예약 | Logic + UI | 날짜 설정 + pg_cron |
| 4-2 | 유고 시 열람 프로세스 | Logic + Serverless | 열람 요청/승인/복호화 |
| 4-3 | 관리자 대시보드 | UI + Logic | 열람 승인, 출판 관리 |
| 4-4 | Capacitor 네이티브 완성 | Architect | 카메라, 생체인식, 푸시 플러그인 |
| 4-5 | 앱 스토어 배포 준비 | Architect | iOS/Android 빌드, 심사 제출 |

**Phase 4 완료 기준:** 유고 열람 전체 플로우 + 앱 스토어 심사 제출

### Phase 5: Polish & Launch (2주)

| 스프린트 | 작업 | 에이전트 | 산출물 |
|---------|------|---------|--------|
| 5-1 | AI 요약/제안 기능 | Serverless | Claude API 연동 |
| 5-2 | 알림 시스템 | Serverless | FCM 푸시 (Capacitor 연동) |
| 5-3 | PWA 설정 완료 | Architect | Service Worker, 매니페스트 |
| 5-4 | 전체 E2E 테스트 | QA | Playwright 시나리오 |
| 5-5 | 성능 최적화 + 버그 수정 | All | Lighthouse 90+ 달성 |

**Phase 5 완료 기준:** 웹 + iOS + Android 동시 런칭

### Phase 6: 서비스 통합 + 확장 (진행중)

| 단계 | 작업 | 참조 문서 |
|------|------|----------|
| 6-1 | 나의이야기(MyStory) AI 자서전 모듈 통합 | `STORIGE_INTEGRATION_GUIDE.md` Step 1 |
| 6-2 | Remember Storige 추모관 모듈 통합 | `STORIGE_INTEGRATION_GUIDE.md` Step 2 |
| 6-3 | 가족 커뮤니티 (H 그룹) | 본 문서 그룹 H |
| 6-4 | 영상 인터뷰 패키지 (I 그룹) | 본 문서 그룹 I |
| 6-5 | storige.co.kr 랜딩 리뉴얼 | `STORIGE_INTEGRATION_GUIDE.md` Step 3 |
| 6-6 | 음성 녹음 + STT | 본 문서 B-3 |
| 6-7 | 템플릿 시스템 | 본 문서 B-7 |

---

## 14. Claude Code 실행 가이드

### 14.1 프로젝트 시작 명령

```bash
# 1. 프로젝트 생성
npx create-next-app@latest storige --typescript --tailwind --eslint --app --src-dir

# 2. 핵심 의존성 설치
cd storige
npm install @supabase/supabase-js @supabase/ssr
npm install zustand @tanstack/react-query
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-placeholder
npm install framer-motion
npm install react-day-picker date-fns
npm install secrets.js-34r7h  # SSS 구현

# 3. Capacitor 설치 + 초기화
npm install @capacitor/core @capacitor/cli
npx cap init storige co.kr.storige --web-dir=out
npm install @capacitor/ios @capacitor/android
npm install @capacitor/camera @capacitor/filesystem @capacitor/push-notifications
npm install @capacitor/biometrics @capacitor/geolocation @capacitor/share @capacitor/splash-screen

# 4. shadcn/ui 초기화
npx shadcn@latest init

# 5. Supabase CLI 설치 + 로컬 개발 환경
npx supabase init
npx supabase start

# 6. 타입 생성
npx supabase gen types typescript --local > src/lib/supabase/types.ts

# 7. Capacitor 플랫폼 추가
npx cap add ios
npx cap add android
```

### 14.2 Claude Code 세션별 작업 가이드

각 세션 시작 시 아래 컨텍스트를 Claude Code에 전달한다:

```
프로젝트: Storige (이야기저장소 - 스토리지)
개발문서: STORIGE_DEV_PLAN.md
현재 Phase: [Phase 번호]
담당 에이전트: [에이전트 역할]
작업 범위: [구체적 스프린트 번호 + 이슈 ID]
테스트 요구사항: TDD — 테스트 먼저 작성 후 구현
코딩 원칙:
  - Over Engineering 금지
  - TypeScript strict mode
  - 함수형 컴포넌트 + 커스텀 훅 패턴
  - 한 파일 200줄 이내 (넘으면 분리)
  - 한글 주석 사용
```

### 14.3 CLAUDE.md 파일 (프로젝트 루트)

```markdown
# Storige — Claude Code 가이드

## 프로젝트 개요
디지털 레거시 플랫폼. 일기 기록, 보안 정보 보관, 유고 시 가족 전달, 종이책 출판.

## 기술 스택
- Next.js 14+ (App Router) + TypeScript
- Supabase (Auth, DB, Storage, Edge Functions)
- Tailwind CSS + shadcn/ui
- Zustand + React Query
- Tiptap (에디터)
- Vitest + Playwright (테스트)

## 핵심 규칙
1. TDD: 테스트 먼저 작성
2. 파일 200줄 이내
3. 한국어 주석
4. RLS로 보안 제어 (서버 로직 최소화)
5. 시크릿 코드는 반드시 클라이언트 사이드 암호화

## 디렉토리 규칙
- 페이지: src/app/(main)/[모듈]/page.tsx
- 컴포넌트: src/components/[모듈]/[Component].tsx
- 훅: src/hooks/use[Feature].ts
- 유틸: src/lib/[카테고리]/[util].ts
- 테스트: __tests__/ 또는 [파일명].test.ts

## 커밋 규칙
feat: 새 기능 | fix: 버그 수정 | test: 테스트 | docs: 문서 | refactor: 리팩토링
```

---

## 15. 필요 스킬 및 검증 체크리스트

### 15.1 Claude Code 스킬 검색 및 추가

개발 과정에서 아래 스킬들을 순서대로 검색하고 필요시 추가한다:

#### 필수 스킬 (Phase 1에서 확인)

| 스킬 | 용도 | 검증 방법 |
|------|------|----------|
| `frontend-design` | UI 컴포넌트 디자인 가이드 | `/mnt/skills/public/frontend-design/SKILL.md` 확인 완료 |
| `docx` 스킬 | 출판 미리보기용 문서 생성 참조 | `/mnt/skills/public/docx/SKILL.md` 필요시 참조 |
| `pdf` 스킬 | 출판 PDF 생성 | `/mnt/skills/public/pdf/SKILL.md` Phase 4에서 참조 |
| `xlsx` 스킬 | 관리자 데이터 내보내기 | `/mnt/skills/public/xlsx/SKILL.md` 필요시 참조 |

#### 검증 필요 기술

| 기술 | 검증 항목 | 검증 방법 |
|------|----------|----------|
| Supabase Auth 2FA | TOTP 등록/검증 플로우 | Supabase docs 확인 + 로컬 테스트 |
| Supabase Vault | 시크릿 저장/조회 API | Supabase CLI 로컬 환경에서 테스트 |
| Web Crypto API | AES-256-GCM 브라우저 호환성 | Chrome, Safari, Firefox에서 테스트 |
| SSS (secrets.js) | 키 분할/복원 정확성 | 유닛 테스트로 검증 |
| Tiptap | 한글 IME 호환성 | 실제 한글 입력 테스트 (조합 중 저장 문제) |
| Kakao Maps SDK | React 래퍼 호환성 | `react-kakao-maps-sdk` 버전 확인 |
| 포트원 결제 | 테스트 결제 플로우 | 포트원 테스트 모드 환경에서 검증 |
| Capacitor | Next.js 14 호환성 | Phase 6에서 PoC |

### 15.2 스킬 추가 프로세스

```bash
# Claude Code에서 스킬 검색
# 1. 기존 스킬 확인
ls /mnt/skills/public/
ls /mnt/skills/examples/

# 2. 사용자 정의 스킬 추가 (필요시)
# /mnt/skills/user/ 디렉토리에 커스텀 SKILL.md 추가 가능

# 3. 개발 중 스킬 참조 패턴
# 각 Phase 시작 시 관련 스킬을 먼저 읽고 지침을 따름
```

### 15.3 외부 라이브러리 검증 체크리스트

| 라이브러리 | 용도 | npm 주간 다운로드 기준 | 최신 버전 확인 |
|-----------|------|---------------------|-------------|
| `@supabase/supabase-js` | DB/Auth/Storage | 100K+ ✅ | v2.x |
| `@tiptap/react` | 리치 에디터 | 100K+ ✅ | v2.x |
| `zustand` | 상태 관리 | 3M+ ✅ | v4.x |
| `@tanstack/react-query` | 서버 상태 | 3M+ ✅ | v5.x |
| `framer-motion` | 애니메이션 | 3M+ ✅ | v11.x |
| `secrets.js-34r7h` | SSS 구현 | 1K+ ⚠️ (보안 감사 필요) | fork 최신 |
| `react-day-picker` | 캘린더 | 500K+ ✅ | v9.x |
| `@portone/browser-sdk` | 결제 | 한국 특화 ✅ | 최신 |

---

## 부록: 프로젝트 체크리스트

### MVP 출시 체크리스트

- [ ] 회원가입/로그인 동작
- [ ] 2FA 설정 및 인증 동작
- [ ] 일기 작성 (텍스트 + 사진)
- [ ] 일기 5개 뷰 전환
- [ ] Dear My Son 편지 작성/열람
- [ ] 시크릿 코드 암호화 저장/열람
- [ ] 가족 구성원 등록/인증
- [ ] 열람 공개 예약 설정
- [ ] 유고 시 열람 요청 프로세스
- [ ] 출판 미리보기 + 주문
- [ ] PWA 설치 가능
- [ ] 모바일 반응형 완벽 대응
- [ ] Lighthouse Performance 90+
- [ ] E2E 테스트 전체 통과
- [ ] 보안 감사 완료 (암호화 검증)

---

> **문서 버전:** v2.0  
> **작성일:** 2026-03-24  
> **주요 변경:** Capacitor 동시 배포, 출판 MVP 포함, 플랫폼 에코시스템 정의, 아코디언 UI 확정  
> **관련 문서:** `CLAUDE.md` (프로젝트 가이드), `STORIGE_INTEGRATION_GUIDE.md` (서비스 통합 가이드)  
> **다음 업데이트:** Phase 1 완료 후 피드백 반영
