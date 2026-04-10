# Storige 개발 진행 상태

> 이 파일은 스프린트 완료 이력과 대기 중인 작업을 관리합니다.  
> CLAUDE.md의 "현재 상태" 섹션은 이 파일을 요약한 것입니다.

---

## 최종 업데이트: 2026-04-11

**현재 Phase:** Phase 1~6 완료 / Auth 보완 완료 / 결제 연동 대기  
**빌드:** 클린 (에러 0) | 최신 커밋: `7bfc5df`  
**배포:** https://storige.vercel.app

---

## 완료된 작업

### Phase 1~3 (전체 완료)
- Auth (로그인/회원가입/2FA)
- Diary CRUD, 아코디언 목록, 5개 뷰, 미디어
- Dear My Son 편지
- Secret Code E2EE (AES-256-GCM + SSS — 23개 암호화 테스트 Green)
- 가족 구성원 CRUD + 원형 뱃지 UI
- SSS 복구 키 배분 (useSSSKeyManager + SSSKeySetup)
- 출판 미리보기 + 주문 폼
- Midnight Archive 디자인 마이그레이션 (38파일)

### Phase 4 (전체 완료)
- Sprint 4-1: 포토앨범 (useAlbum + AlbumLightbox + album_photos Supabase 테이블)
- Sprint 4-2: Legacy Access (/legacy 열람화면 + /settings/legacy 관리)
- Sprint 4-3: Capacitor 설정 (capacitor.config.ts + camera.ts + 빌드 스크립트)
- Sprint 4-4: 앱스토어 배포 가이드 (docs/appstore-deploy-guide.md)

### Phase 5 (전체 완료)
- Sprint 5-1: AI 기능 (Claude Haiku API, 일기 요약 + 글감 제안, /api/ai/*)
- Sprint 5-2: 알림 시스템 (FCM/WebPush, Supabase Edge Function send-reminder)
- Sprint 5-3: PWA (manifest.json + sw.js Service Worker)
- Sprint 5-4: E2E 테스트 (Playwright, e2e/*.spec.ts)
- Sprint 5-5: 성능 최적화 (AVIF/WebP, 보안헤더, optimizePackageImports)

### Phase 6 (완료 / 일부 보류)
- Sprint 6-1: AI 자서전(MyStory) ✅ — 코어 완성, BottomNav 5번째 탭, Header 사이드메뉴
  - 미완(낮은 우선순위): 음성입력, 출판연결, 질문풀 완성
- Sprint 6-2: 디지털 추모관 25% — DB + useMemorial 훅 완성, UI 미구현
  - ⏸ 마일스톤 최후순위 보류 | 기획서: docs/sprint6-memorial-plan.md
- Sprint 6-3: 랜딩 리뉴얼 ✅ — 6개 서비스카드, 가격/플랜, 앱 다운로드 CTA

### Auth 보완 (2026-04-10)
- ✅ middleware.ts → (main)/layout.tsx 서버사이드 인증으로 대체 (Turbopack nft.json 버그 우회)
- ✅ 비밀번호 찾기 (/forgot-password) + 재설정 (/reset-password)
- ✅ Google OAuth 연동 완료
- ✅ 카카오 OAuth 연동 완료 (scope: profile_nickname + profile_image, 이메일 제외)
  - 카카오 비즈앱 미인증 상태. 인증 후 account_email scope 추가 가능
- ✅ 로고 교체 (storige_logo2.png → public/logo.png), 헤더 h-16 → h-20

### 기타 (2026-04-10~11)
- ✅ secret/new 페이지 Midnight Archive 리디자인 (이모지 제거, Material Symbols, dark 패스프레이즈 패널)
- ✅ ChunkLoadError 자동 새로고침 처리 (error.tsx + global-error.tsx + layout.tsx 스크립트)
- ✅ (main) 페이지 클라이언트 중복 인증 체크 제거 (layout.tsx 서버사이드로 통합)
- ✅ GEMINI.md 추가, supabase/.temp gitignore 등록

---

## 다음 작업 (우선순위 순)

### 1순위: 결제 연동 (블로커 있음)
- **포트원(PortOne) 구독 결제** — API 키 필요 (오너 제공)
  - 구독: 월 9,900원 / 연 99,000원
  - 관련 파일: `src/app/(main)/settings/`
- **포트원 출판 단건 결제** — API 키 필요
  - 출판: 39,000원~
  - 관련 파일: `src/app/(main)/publish/`
- **파파스컴퍼니 POD API 연동** — 계약 필요 (오너 결정)

### 2순위: 보류 중 (오너 결정 후)
- Phase 6 Sprint 6-2: 추모관 UI 구현 — 최후순위
- 카카오 비즈앱 인증 후 이메일 scope 추가
- iOS 앱스토어 제출 (Apple Dev 계정 + Mac + Xcode 필요)
- Android Play Store 제출 (Google Play 계정 필요)
  - Capacitor 빌드 준비 완료: `npm run cap:ios`
  - 가이드: docs/appstore-deploy-guide.md
