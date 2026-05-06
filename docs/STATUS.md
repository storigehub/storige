# Storige 개발 진행 상태

> 이 파일은 스프린트 완료 이력과 대기 중인 작업을 관리합니다.  
> CLAUDE.md의 "현재 상태" 섹션은 이 파일을 요약한 것입니다.

---

## 최종 업데이트: 2026-05-06

**현재 Phase:** Phase 1~6 완료 / MyStory-출판 연결 완료 / AI 인터뷰어 전문화 완료 / 결제 연동 대기  
**빌드:** 클린 (에러 0)  
**배포:** https://storige.vercel.app

---

## 2026-05-06 코드베이스 업데이트 내역

**신규 완료 항목:**
- ✅ **MyStory → 출판 연결**: `mystory/preview`에서 출판 신청 시 원고 자동 선택 및 미리보기 연동 완료
- ✅ **AI 인터뷰어 전문화**: '전문 전기 작가(Heritage Biographer)' 페르소나 및 감각적/에피소드 중심 취재 지침 적용
- ✅ **인터뷰어 전용 스킬**: `mystory-interviewer.skill` 제작 및 워크스페이스 설치 완료

---

## 완료된 작업 (누적)

### Phase 1~5 (전체 완료)
- Auth (Email, Social OAuth, 2FA)
- Diary Core (CRUD, 5개 뷰, 미디어, 지도, 캘린더)
- Secret Code (E2EE 암호화 + SSS 키 복구)
- 가족 구성원 관리 (CRUD, 인증 플로우, 권한 설정)
- AI 기능 (Claude 연동, 요약, 글감 제안)
- PWA & 모바일 최적화 (Capacitor 설정 완료)

### Phase 6 & MyStory (완료)
- AI 자서전(MyStory): 20개 토픽 인터뷰, 음성 입력, 사진 첨부
- MyStory 개인화: 동적 후속 질문, 바이오 프로필 누적, 답변 깊이 감지
- MyStory 공유: 공유 링크 생성 및 비인증 열람 페이지
- **MyStory 출판 연동**: 원고 데이터를 출판 모듈(`/publish`)로 자동 전달 및 미리보기 지원

---

## 다음 작업 (우선순위 순)

### 1순위: 결제 연동 (블로커: API 키 제공 필요)
- **포트원(PortOne) 구독 결제** — 월/연 단위 프리미엄 플랜
- **포트원 출판 단건 결제** — 자서전 및 일기 출판 결제
- **파파스컴퍼니 POD API 연동** — 실제 도서 제작 주문 전송

### 2순위: 보류 및 추가 고도화
- **디지털 추모관(Memorial) UI 구현**: 현재 DB 및 훅(useMemorial)만 존재, UI 컴포넌트 미구현
- **Resend 도메인 인증**: 공유 링크 이메일 발송 신뢰도 향상
- **앱스토어 출시**: iOS/Android 최종 빌드 및 심사 제출 (가이드: `docs/appstore-deploy-guide.md`)


---

## MyStory 모듈 현황 (2026-04-13 기준)

### 완성된 기능
| 기능 | 파일 |
|------|------|
| AI 인터뷰 (20개 토픽) | `src/app/(main)/mystory/[topicId]/page.tsx` |
| 음성 입력 (ko-KR) | `src/hooks/useSpeechSTT.ts` |
| 사진 첨부 | `src/hooks/useMystoryPhoto.ts` + `src/lib/utils/compressImage.ts` |
| 스크롤 북리더 + PDF | `src/app/(main)/mystory/preview/page.tsx` |
| 공유 링크 | `src/app/(main)/mystory/share/[token]/page.tsx` |
| 출판 CTA | preview 페이지 (3챕터 이상) |
| AI 개인화 — 동적 후속 질문 | `src/app/api/ai/interview/route.ts` |
| AI 개인화 — 바이오 프로필 누적 | `src/hooks/useMystoryProfile.ts` |
| AI 개인화 — 팩트 추출 | `src/app/api/ai/profile-extract/route.ts` |
| AI 개인화 — 답변 깊이 감지 | `src/app/api/ai/interview/route.ts` (classifyAnswer) |

### Supabase 인프라
- 테이블: `mystory_sessions` (share_token 컬럼 포함)
- 테이블: `mystory_profile` (facts JSONB + completed_topics — 2026-04-13 추가)
- 버킷: `mystory-photos` (Public)
- RLS: 공유 토큰 기반 공개 열람 / 본인 프로필 읽기·쓰기

### API 엔드포인트
| 경로 | 역할 |
|------|------|
| `POST /api/ai/interview` | AI 동적 후속 질문 생성 (프로필 컨텍스트 + 깊이 감지) |
| `POST /api/ai/profile-extract` | 완료 세션에서 전기적 사실 추출 → mystory_profile 저장 |
| `POST /api/ai/manuscript` | 자서전 원고 생성 |
| `POST /api/ai/suggest` | 글감 제안 |
| `POST /api/ai/summarize` | 요약 |
