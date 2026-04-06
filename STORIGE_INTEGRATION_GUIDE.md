# 🔗 Storige 서비스 통합 가이드

> 나의이야기(MyStory) + Remember Storige + storige.co.kr을  
> Storige 메인 플랫폼에 단계적으로 통합하기 위한 실행 계획서

---

## 목차

1. [통합 전략 개요](#1-통합-전략-개요)
2. [현재 서비스별 분석](#2-현재-서비스별-분석)
3. [Step 1: 나의이야기 → AI 자서전 모듈 통합](#3-step-1-나의이야기--ai-자서전-모듈-통합)
4. [Step 2: Remember Storige → 디지털 추모관 모듈 통합](#4-step-2-remember-storige--디지털-추모관-모듈-통합)
5. [Step 3: storige.co.kr 랜딩 리뉴얼](#5-step-3-storigecokr-랜딩-리뉴얼)
6. [통합 DB 스키마 확장 계획](#6-통합-db-스키마-확장-계획)
7. [URL/라우팅 전략](#7-url라우팅-전략)
8. [통합 체크리스트](#8-통합-체크리스트)

---

## 1. 통합 전략 개요

### 1.1 왜 통합하는가

| 관점 | 개별 서비스 유지 | 통합 플랫폼 |
|------|-----------------|------------|
| 사용자 경험 | 앱 4개 설치/전환 필요 → 고령자 이탈 | 하나의 앱에서 모든 기능 접근 |
| 계정 관리 | 서비스마다 별도 가입 | 통합 계정 (Supabase Auth 공유) |
| 미디어 저장 | 사진/영상 각각 업로드 | 한 번 업로드 → 일기/자서전/추모관 공유 |
| 가족 관리 | 서비스마다 가족 등록 | 한 번 등록 → 전체 서비스 공유 |
| 출판/POD | 출판 연동 각각 구현 | 파파스컴퍼니 POD 한 번만 연동 |
| 개발 리소스 | 4배 개발/유지 비용 | 공유 인프라로 비용 절감 |
| 데이터 흐름 | 서비스 간 데이터 단절 | 일기 → 자서전 → 추모관 자연스러운 흐름 |

### 1.2 통합 원칙

1. **Storige MVP 먼저 완성** → 통합은 Phase 6 이후
2. **기존 서비스 URL 유지** → 리다이렉트로 연결 (사용자 혼란 최소화)
3. **모듈 단위 독립성** → 통합 후에도 각 모듈은 독립적으로 on/off 가능
4. **DB 스키마 사전 설계** → MVP 때부터 확장 가능한 구조로

### 1.3 통합 타임라인

```
Phase 5 완료 (Storige MVP 런칭)
    │
    ▼ 2~4주 안정화
    │
Step 1: 나의이야기 통합 (3~4주)
    │   - AI 자서전 모듈 구현
    │   - 기존 MyStory 사용자 마이그레이션
    │   - bookmoa-mobile.vercel.app → 리다이렉트
    │
    ▼
Step 2: Remember 통합 (3~4주)
    │   - 추모관 모듈 구현
    │   - 공개 추모 페이지 구현
    │   - remember-storige.replit.app → 리다이렉트
    │
    ▼
Step 3: 랜딩 리뉴얼 (1~2주)
    │   - storige.co.kr 전체 서비스 소개로 확장
    │   - 앱 다운로드/접속 CTA 강화
    │
    ▼
통합 완료 → 단일 플랫폼 운영
```

---

## 2. 현재 서비스별 분석

### 2.1 나의이야기 (MyStory)

| 항목 | 내용 |
|------|------|
| **URL** | bookmoa-mobile.vercel.app |
| **기술 스택** | React (단일 JSX 파일), Vercel 배포 |
| **핵심 기능** | AI 대화형 자서전 작성, 주제별 카드, 음성 입력 |
| **데이터 저장** | localStorage (서버 저장 없음) |
| **사용자 인증** | 없음 |
| **현재 한계** | 서버 저장 미지원, 출판 연동 미완성, 단일 파일 구조 |

**통합 시 가져올 핵심 자산:**
- 14개 카테고리 × 6~8개 주제카드 = 약 100개 인터뷰 질문 풀
- AI 대화 모드 UX 패턴 (질문→답변→후속질문 흐름)
- 자서전 원고 자동 생성 로직
- 음성 입력(STT) 연동 구조

### 2.2 Remember Storige

| 항목 | 내용 |
|------|------|
| **URL** | remember-storige.replit.app |
| **기술 스택** | Replit 호스팅 (정확한 스택 미확인) |
| **핵심 기능** | 디지털 추모관, "기억의 유산" 브랜드 |
| **데이터 저장** | 미확인 |
| **사용자 인증** | 미확인 |
| **현재 한계** | 프로토타입 수준, Replit 호스팅 안정성 |

**통합 시 가져올 핵심 자산:**
- 추모관 UI/UX 컨셉 (조문객 공유 화면)
- "기억의 유산" 브랜딩 요소
- 장례식장 연계 서비스 설계

### 2.3 storige.co.kr

| 항목 | 내용 |
|------|------|
| **URL** | storige.co.kr |
| **핵심 기능** | 서비스 소개 랜딩 페이지 |
| **브랜드** | "세상의 모든 이야기가 저장되는 곳" |
| **역할** | 마케팅 진입점, SEO |

**통합 후 역할:**
- Storige 전체 에코시스템 소개
- 앱 다운로드 / 웹 접속 CTA
- 가격/플랜 안내
- 블로그/콘텐츠 마케팅

---

## 3. Step 1: 나의이야기 → AI 자서전 모듈 통합

### 3.1 통합 후 위치

```
Storige 앱
├── 일기 (Diary)
├── 편지 (Dear My Son)
├── 시크릿 코드 (Secret Code)
├── ✨ AI 자서전 (MyStory) ← 여기에 통합
├── 포토앨범 (Album)
├── 출판 (Publish)
└── 설정 (Settings)
```

### 3.2 구현 범위

#### 새로 만들 페이지

```
src/app/(main)/mystory/
├── page.tsx              # AI 자서전 메인 (주제 카드 목록)
├── [topicId]/page.tsx    # 주제별 인터뷰 대화 화면
├── preview/page.tsx      # 자서전 원고 미리보기
└── publish/page.tsx      # 자서전 출판 (기존 출판 모듈 재사용)
```

#### 새로 만들 컴포넌트

```
src/components/mystory/
├── TopicCard.tsx          # 주제 카드 (탄생, 유년시절, 학창시절 등)
├── TopicCategoryGrid.tsx  # 카테고리별 카드 그리드
├── InterviewChat.tsx      # AI 대화 인터페이스
├── InterviewProgress.tsx  # 질문 진행률 표시
├── ManuscriptPreview.tsx  # 자서전 원고 미리보기
└── VoiceInput.tsx         # 음성 입력 버튼 (Capacitor 연동)
```

### 3.3 DB 스키마 확장

```sql
-- 기존 entries 테이블의 journal_type에 'mystory' 추가
-- journal_type: 'diary' | 'dear' | 'secret_note' | 'mystory'

-- AI 자서전 세션 (인터뷰 대화 단위)
CREATE TABLE mystory_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  topic_id TEXT NOT NULL,          -- 'birth-story', 'childhood-home' 등
  topic_category TEXT NOT NULL,    -- '탄생과 뿌리', '유년시절' 등
  status TEXT DEFAULT 'in_progress', -- in_progress, completed, published
  messages JSONB DEFAULT '[]',     -- 대화 이력 [{role, content, ts}]
  generated_text TEXT,             -- AI가 생성한 자서전 원고
  word_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: 본인만 접근
ALTER TABLE mystory_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mystory_owner" ON mystory_sessions
  FOR ALL USING (auth.uid() = user_id);
```

### 3.4 핵심 로직 이관

#### 질문 풀 이관

기존 MyStory의 `TOPICS` + `getQ()` 함수에서 질문 데이터를 추출하여 Supabase에 저장하거나 정적 JSON으로 관리:

```typescript
// src/lib/mystory/questions.ts
export const TOPIC_QUESTIONS: Record<string, string[]> = {
  'birth-story': [
    '어디에서 태어나셨나요?',
    '태어났을 때 어떤 에피소드가 있었나요?',
    '부모님이 들려주신 탄생 이야기가 있나요?',
    // ... 기존 MyStory에서 이관
  ],
  'childhood-home': [
    '어린 시절 살던 집은 어떤 모습이었나요?',
    // ...
  ],
};
```

#### AI 자서전 생성 로직

```typescript
// src/lib/mystory/generator.ts
// Edge Function: mystory-generate
// 대화 내용을 Claude API에 전달하여 자서전 형식으로 재구성
export async function generateManuscript(
  sessionMessages: Message[],
  topicTitle: string
): Promise<string> {
  // Claude API 호출
  // 프롬프트: "아래 인터뷰 대화를 기반으로 자서전 한 챕터를 작성해주세요..."
  // 결과: 자서전 형식의 문단
}
```

### 3.5 Storige 일기 데이터 활용 시너지

**핵심 시너지:** 사용자가 이미 Storige에 쓴 일기를 AI 자서전의 소스로 활용

```
사용자의 Storige 일기 (entries 테이블)
    │
    ▼ 주제별 자동 분류 (AI 태깅)
    │
AI 자서전 인터뷰 시 "일기에서 이런 내용을 쓰셨는데, 더 이야기해주세요" 형태로 활용
    │
    ▼
자서전 원고에 일기 내용 + 인터뷰 답변 통합
    │
    ▼
출판 모듈로 종이책 제작
```

### 3.6 기존 서비스 마이그레이션

```
1. bookmoa-mobile.vercel.app에 "Storige로 이전되었습니다" 안내 배너
2. localStorage 데이터 → Storige 계정으로 가져오기 기능 제공
   - 내보내기: JSON 다운로드
   - 가져오기: Storige 앱에서 JSON 업로드 → mystory_sessions에 저장
3. 3개월 후 bookmoa-mobile.vercel.app → app.storige.co.kr/mystory 리다이렉트
```

---

## 4. Step 2: Remember Storige → 디지털 추모관 모듈 통합

### 4.1 통합 후 위치

```
Storige 앱
├── (기존 메뉴들)
├── ✨ 추모관 설정 (Remember) ← 설정 내 추가
└── ...

별도 공개 URL:
├── remember.storige.co.kr/[userId] ← 조문객용 공개 추모 페이지
```

### 4.2 추모관의 두 가지 모드

#### 모드 A: 생전 설정 (사용자 본인)

사용자가 살아있는 동안 미리 설정하는 추모관:

- 추모관 활성화 여부 설정
- 추모관에 공개할 콘텐츠 선택 (일기 중 공개 가능 항목)
- 추모관 디자인 테마 선택
- 추모 메시지 미리 작성
- 조문객에게 공개할 사진/영상 선택

#### 모드 B: 유고 후 활성화 (가족이 관리)

소유자 유고 후 자동/수동으로 활성화:

- 기존 열람 공개 프로세스(legacy_settings)와 연동
- 가족이 추모관 콘텐츠 추가/편집
- 조문객 방명록
- 장례식장에서 QR 코드로 접근
- 추모 영상 자동 생성 (사진 슬라이드쇼)

### 4.3 구현 범위

#### 새로 만들 페이지

```
# 앱 내 (인증 필요)
src/app/(main)/settings/remember/
├── page.tsx              # 추모관 설정 메인
├── content/page.tsx      # 공개 콘텐츠 선택
├── design/page.tsx       # 테마/디자인 설정
└── preview/page.tsx      # 추모관 미리보기

# 공개 페이지 (인증 불필요)
src/app/(public)/remember/
├── [userId]/page.tsx     # 공개 추모 페이지
├── [userId]/photos/page.tsx  # 사진 갤러리
└── [userId]/guestbook/page.tsx  # 방명록
```

#### 새로 만들 컴포넌트

```
src/components/remember/
├── MemorialPage.tsx       # 추모 메인 페이지 (공개용)
├── PhotoSlideshow.tsx     # 사진 슬라이드쇼
├── GuestBook.tsx          # 방명록 (이름+메시지)
├── MemorialTimeline.tsx   # 생애 타임라인
├── QRCodeGenerator.tsx    # 장례식장용 QR 코드
└── ContentSelector.tsx    # 공개할 콘텐츠 선택 UI
```

### 4.4 DB 스키마 확장

```sql
-- 추모관 설정
CREATE TABLE memorial_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) UNIQUE,
  is_enabled BOOLEAN DEFAULT false,      -- 추모관 활성화 여부
  is_active BOOLEAN DEFAULT false,       -- 유고 후 공개 여부
  theme TEXT DEFAULT 'serene',           -- 테마: serene, warm, modern
  memorial_message TEXT,                 -- 추모 메시지
  public_entries UUID[] DEFAULT '{}',    -- 공개할 일기 ID 목록
  public_media UUID[] DEFAULT '{}',      -- 공개할 미디어 ID 목록
  public_url_slug TEXT UNIQUE,           -- 공개 URL 슬러그
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 방명록
CREATE TABLE guestbook_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memorial_user_id UUID NOT NULL REFERENCES profiles(id),
  guest_name TEXT NOT NULL,
  guest_relation TEXT,                   -- 관계 (친구, 동료, 가족 등)
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: 추모관 설정은 본인만, 방명록은 공개 추모관이면 누구나 쓰기 가능
ALTER TABLE memorial_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "memorial_owner" ON memorial_settings
  FOR ALL USING (auth.uid() = user_id);

ALTER TABLE guestbook_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "guestbook_read" ON guestbook_entries
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM memorial_settings ms
            WHERE ms.user_id = memorial_user_id
            AND ms.is_active = true)
  );
CREATE POLICY "guestbook_insert" ON guestbook_entries
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM memorial_settings ms
            WHERE ms.user_id = memorial_user_id
            AND ms.is_active = true)
  );
```

### 4.5 Storige 데이터 자동 활용

```
Storige 기존 데이터 → 추모관 자동 구성
─────────────────────────────────────────
프로필 사진      → 추모관 대표 이미지
일기 (공개 선택분)  → 생애 기록 타임라인
Dear My Son 편지  → 유언/편지 공개 (가족 승인 후)
포토앨범         → 추모관 사진 갤러리
AI 자서전        → 생애 이야기 자동 채움
가족 구성원      → 추모관 관리자 자동 지정
```

### 4.6 장례식장 연계

```
장례식장 파트너 플로우:
1. 파트너 장례식장에 Storige 추모관 서비스 안내
2. 유족이 Storige 사용자 → 추모관 자동 활성화
3. 유족이 비사용자 → 간편 추모관 생성 (사진+정보만 입력)
4. QR 코드 생성 → 장례식장 현장에 비치
5. 조문객이 QR 스캔 → 공개 추모 페이지 접속
6. 방명록 작성, 사진 열람

수익 모델:
- 기본 추모관: 무료 (30일 유지)
- 영구 추모관: 연 49,000원
- 프리미엄 추모관: 연 99,000원 (영상 슬라이드쇼, 맞춤 디자인)
- 장례식장 파트너 수수료: 건당 10,000원
```

### 4.7 기존 서비스 마이그레이션

```
1. remember-storige.replit.app → remember.storige.co.kr 리다이렉트
2. 기존 데이터 → Storige memorial_settings + guestbook_entries로 이관
3. Replit 호스팅 종료
```

---

## 5. Step 3: storige.co.kr 랜딩 리뉴얼

### 5.1 현재 → 변경 후

```
현재: 단순 서비스 소개 페이지
    ↓
변경: Storige 에코시스템 전체 소개 + 앱 진입점

섹션 구성:
1. 히어로: "기억을 저장하고, 내일을 준비합니다"
2. 서비스 소개: 일기 → 편지 → 시크릿 코드 → AI 자서전 → 추모관
3. 사용자 여정: "생전에 기록 → 가족에게 전달 → 추모관으로 기억"
4. 가격/플랜: 무료 / 프리미엄 / 출판
5. 앱 다운로드: App Store + Play Store + 웹 접속
6. 추모관 서비스 안내 (장례식장 파트너용)
7. 회사 소개: 파파스컴퍼니
```

### 5.2 URL 구조

```
storige.co.kr                  → 메인 랜딩
storige.co.kr/pricing          → 가격 안내
storige.co.kr/features         → 기능 상세
storige.co.kr/partners         → 장례식장 파트너 안내
storige.co.kr/blog             → 블로그/콘텐츠

app.storige.co.kr              → Storige 웹앱 (메인 플랫폼)
remember.storige.co.kr/[slug]  → 공개 추모 페이지
```

---

## 6. 통합 DB 스키마 확장 계획

### MVP 때부터 미리 고려할 사항

아래 필드/테이블은 MVP 스키마에 이미 포함되어 있거나, 확장이 용이하도록 설계되어 있다:

| MVP 테이블 | 통합 시 활용 | 확장 방법 |
|-----------|------------|----------|
| `entries.journal_type` | `'mystory'` 타입 추가 | ENUM이 아닌 TEXT이므로 바로 추가 가능 |
| `entries.content` | AI 자서전 원고 저장 | JSONB이므로 구조 자유 |
| `media` | 추모관 갤러리 공유 | `entry_id` 없는 독립 미디어도 지원 |
| `family_members` | 추모관 관리자 지정 | `access_permissions` JSONB 확장 |
| `legacy_settings` | 추모관 활성화 트리거 | `is_active` 전환 시 추모관도 활성화 |
| `profiles` | 추모관 대표 정보 | 이미 필요한 필드 보유 |

### Step 1에서 추가할 테이블

```
mystory_sessions  — AI 자서전 인터뷰 세션
```

### Step 2에서 추가할 테이블

```
memorial_settings  — 추모관 설정
guestbook_entries  — 방명록
```

---

## 7. URL/라우팅 전략

### 최종 URL 맵

```
[브랜드/마케팅]
storige.co.kr                     → 랜딩 (Next.js 정적)
storige.co.kr/pricing             → 가격
storige.co.kr/blog                → 블로그

[메인 앱]
app.storige.co.kr                 → 웹앱 메인
app.storige.co.kr/diary           → 일기
app.storige.co.kr/dear            → 편지
app.storige.co.kr/secret          → 시크릿 코드
app.storige.co.kr/mystory         → AI 자서전 (Step 1 후)
app.storige.co.kr/album           → 포토앨범
app.storige.co.kr/publish         → 출판
app.storige.co.kr/settings        → 설정
app.storige.co.kr/settings/remember → 추모관 설정 (Step 2 후)

[공개 페이지]
remember.storige.co.kr/[slug]     → 공개 추모관 (Step 2 후)

[리다이렉트]
bookmoa-mobile.vercel.app  → app.storige.co.kr/mystory  (Step 1 후)
remember-storige.replit.app → remember.storige.co.kr     (Step 2 후)
```

### Capacitor 앱에서의 라우팅

```
네이티브 앱 → WebView로 app.storige.co.kr 로드
Deep Link: storige://diary, storige://mystory, storige://secret 등
```

---

## 8. 통합 체크리스트

### Step 1: 나의이야기 통합 체크리스트

- [ ] Storige 앱 내 "AI 자서전" 메뉴 추가
- [ ] 주제 카드 목록 페이지 구현
- [ ] 인터뷰 대화 UI 구현 (기존 MyStory ChatEd 참조)
- [ ] 질문 풀 이관 (약 100개 질문)
- [ ] Claude API 연동 (자서전 원고 생성)
- [ ] Capacitor 음성 입력 연동
- [ ] mystory_sessions 테이블 마이그레이션
- [ ] 일기 데이터 → 자서전 소스 연동
- [ ] 자서전 출판 → 기존 출판 모듈 연결
- [ ] 기존 MyStory 사용자 데이터 가져오기 기능
- [ ] bookmoa-mobile.vercel.app 리다이렉트 설정
- [ ] E2E 테스트

### Step 2: Remember 통합 체크리스트

- [ ] 추모관 설정 페이지 구현
- [ ] 공개 콘텐츠 선택 UI 구현
- [ ] 추모관 테마/디자인 선택
- [ ] 공개 추모 페이지 구현 (비인증 접근)
- [ ] 사진 슬라이드쇼 구현
- [ ] 방명록 기능 구현
- [ ] QR 코드 생성
- [ ] memorial_settings + guestbook_entries 마이그레이션
- [ ] legacy_settings ↔ memorial_settings 연동
- [ ] 장례식장 파트너 온보딩 페이지
- [ ] remember.storige.co.kr 서브도메인 설정
- [ ] remember-storige.replit.app 리다이렉트
- [ ] E2E 테스트

### Step 3: 랜딩 리뉴얼 체크리스트

- [ ] 전체 서비스 소개 콘텐츠 작성
- [ ] 히어로 섹션 리디자인
- [ ] 서비스 여정 시각화 (생전→전달→추모)
- [ ] 가격/플랜 페이지
- [ ] 앱 다운로드 CTA
- [ ] 장례식장 파트너 안내 페이지
- [ ] SEO 최적화
- [ ] 반응형 확인

---

## 부록: 통합 후 네비게이션 구조

```
햄버거 메뉴 (≡) — 통합 완료 후
├── 🏠 홈 (일기 목록)
├── ✉️ Dear My Son
├── 🔐 시크릿 코드
├── 📸 포토앨범
├── 📝 AI 자서전 ← Step 1 추가
├── 📖 출판하기
├── 👨‍👩‍👧‍👦 가족 커뮤니티
├── ⚙️ 내 스토리지 관리
│   ├── 가족구성원 설정
│   ├── 보안 설정
│   ├── 열람 공개 예약
│   ├── 🕊️ 추모관 설정 ← Step 2 추가
│   └── 구독 관리
├── 🎥 영상 인터뷰
└── ❓ 도움말
```

---

> **문서 버전:** v1.0  
> **작성일:** 2026-03-24  
> **전제 조건:** `STORIGE_DEV_PLAN.md` Phase 5 완료 후 시작  
> **다음 업데이트:** Step 1 시작 시 상세 태스크 분해
