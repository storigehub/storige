# Storige 재시작 문서 — 2026-04-09 Phase 4 완료

> 이 문서를 읽고 CTO는 이전 작업 이어서 시작해주세요.

---

## 현재 상태 요약

- **현재 Phase:** 4 완료 / Phase 5 대기
- **최근 커밋:** `7c3b82e` (feat: Phase 4 — 포토앨범 + Legacy Access + Capacitor 설정 + 앱스토어 배포 준비)
- **빌드 상태:** ✅ 클린 (20 pages all pass)
- **배포:** GitHub Actions 자동배포 queued → Vercel Production

---

## Phase 4 완료 작업 요약

### Sprint 4-1: 포토앨범 (`/album`)
| 파일 | 내용 |
|------|------|
| `src/hooks/useAlbum.ts` | album_photos CRUD 훅 |
| `src/components/album/AlbumLightbox.tsx` | 라이트박스 컴포넌트 |
| `src/app/(main)/album/page.tsx` | 그리드 + 업로드 + 캡션 + 삭제 |
| Supabase migration | `album_photos` 테이블 + RLS |
| `src/lib/utils/camera.ts` | Capacitor Camera / 웹 fallback |

### Sprint 4-2: Legacy Access
| 파일 | 내용 |
|------|------|
| `src/hooks/useLegacy.ts` | 열람 요청/승인/뷰어 훅 |
| `src/app/(legacy)/layout.tsx` | 다크 독립 레이아웃 |
| `src/app/(legacy)/legacy/page.tsx` | 열람 전용 화면 |
| `src/app/(main)/settings/legacy/page.tsx` | 관리자 설정 (예약일, 요청 승인) |
| `src/app/(main)/settings/page.tsx` | Legacy 관리 섹션 링크 추가 |

### Sprint 4-3: Capacitor 설정
| 파일 | 내용 |
|------|------|
| `capacitor.config.ts` | 앱 ID, 플러그인 전체 설정 |
| `next.config.ts` | `CAPACITOR_BUILD=1` → static export |
| `package.json` | `build:mobile`, `cap:ios`, `cap:android` 스크립트 |

### Sprint 4-4: 앱스토어 배포 준비
| 파일 | 내용 |
|------|------|
| `docs/appstore-deploy-guide.md` | iOS/Android 빌드 + 배포 전체 가이드 |

---

## 남은 미완료 항목

### ⏸ 의도적으로 마지막으로 미룬 작업 (오너 결정 후 시작)
> 아래 4개는 외부 계약/계정이 필요하거나 비용이 발생하므로 모든 기능 개발 완료 후 마지막에 진행.

| 항목 | 필요한 것 | 문서 위치 |
|------|----------|----------|
| 포트원 결제 연동 (Sprint 3-7) | 포트원 API 키 | - |
| 파파스 POD API (Sprint 3-7) | 파파스 계약 + API 키 | - |
| iOS 실제 빌드 & 앱스토어 제출 | Apple Developer 계정 ($99/년) + Mac + Xcode | `docs/appstore-deploy-guide.md` |
| Android 실제 빌드 & Play 제출 | Google Play 계정 ($25) + Android Studio | `docs/appstore-deploy-guide.md` |

**Capacitor 빌드 준비 완료 메모:**  
`npm run cap:ios` 한 번으로 Next.js static export → Capacitor sync → Xcode 오픈까지 완전 자동화되어 있음.  
심사 체크리스트, Info.plist 권한 설정, 키스토어 생성 방법 모두 `docs/appstore-deploy-guide.md`에 기록됨.  
실제 빌드 시작 시점에 이 가이드 그대로 따르면 됨.

### 오너 직접 액션 필요
| 항목 | 방법 |
|------|------|
| 계정 탈퇴 완전 구현 | Supabase Edge Function 또는 admin API로 auth.users 삭제 |
| 앱 아이콘/스플래시 디자인 | 디자이너 또는 Figma에서 제작 |

---

## Phase 5 범위 (오너 Go 시)

1. AI 자서전 요약 — Claude API 연동
2. 푸시 알림 — FCM + Capacitor Push Notifications
3. PWA 설정 — Service Worker + 오프라인 캐시
4. 전체 E2E 테스트 — Playwright
5. 성능 최적화 — Lighthouse 90+ 달성
6. 에러 처리 전반 — 재시도 버튼 추가

**시작 명령:**
```
Phase 5를 agents/AUTOPILOT.md 기준으로 시작해주세요
```

---

## 주요 파일 경로

```
src/hooks/useAlbum.ts                    ← 앨범 훅
src/hooks/useLegacy.ts                   ← Legacy Access 훅
src/lib/utils/camera.ts                  ← Capacitor 카메라 유틸
src/app/(main)/album/page.tsx            ← 포토앨범 페이지
src/app/(legacy)/legacy/page.tsx         ← Legacy 열람 전용
src/app/(main)/settings/legacy/page.tsx ← Legacy 관리 설정
capacitor.config.ts                      ← Capacitor 전체 설정
docs/appstore-deploy-guide.md           ← 앱스토어 배포 가이드
```

## 인프라

- Supabase Project ID: `uobbgxwuukwptqtywxxj` (ap-northeast-2)
- Stitch Project ID: `18286796991837386984`
- Vercel Project: `prj_KOfHRMjPd7VhuBWhC5Xhz2qb4k7t`

## 배포 명령

```bash
# 웹 자동 배포 (표준)
git push origin main

# 모바일 빌드
npm run cap:ios     # iOS Xcode 오픈
npm run cap:android # Android Studio 오픈

# 배포 확인
gh run list --repo storigehub/storige --limit 3
```
