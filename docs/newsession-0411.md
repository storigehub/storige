# Storige 재시작 문서 — 2026-04-09 Phase 5 완료

> 이 문서를 읽고 CTO는 이전 작업 이어서 시작해주세요.

---

## 현재 상태 요약

- **현재 Phase:** 5 완료 / Phase 6 대기
- **최근 커밋:** `9343426` (feat: Phase 5 — AI 기능 + 알림 + PWA + E2E 테스트 + 성능 최적화)
- **빌드 상태:** ✅ 클린 (20 pages + AI API 3개 라우트)
- **배포:** GitHub Actions queued → Vercel Production

---

## Phase 5 완료 작업 요약

### Sprint 5-1: AI 요약/제안 기능
| 파일 | 내용 |
|------|------|
| `src/lib/ai/claude.ts` | Claude Haiku API 래퍼 (요약 + 글감 제안) |
| `src/app/api/ai/summarize/route.ts` | POST /api/ai/summarize |
| `src/app/api/ai/suggest/route.ts` | POST /api/ai/suggest |
| `src/hooks/useAI.ts` | useDiarySummary, useWritingSuggestions |
| `DiaryAccordionItem.tsx` | AI 요약 버튼 + 결과 패널 |
| `diary/page.tsx` | 요약 탭 — AI 글감 제안 카드 실제 구현 |

**환경 변수 필요:** `ANTHROPIC_API_KEY` — Vercel 환경 변수에 추가 필요

### Sprint 5-2: 알림 시스템
| 파일 | 내용 |
|------|------|
| `src/lib/push/notifications.ts` | FCM / Web Push fallback |
| `src/hooks/usePushNotifications.ts` | 토큰 등록 훅 |
| `src/app/api/push/register/route.ts` | 토큰 저장 API |
| `supabase/functions/send-reminder/index.ts` | 매일 리마인더 Edge Function |

**필요 작업:**
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` Vercel 환경 변수 추가 (Web Push용)
- `FCM_SERVER_KEY` Supabase Vault에 저장
- Supabase Cron Job 설정: `0 11 * * *` (UTC = KST 20시)
- profiles 테이블에 `push_token` 컬럼 추가 migration 필요

### Sprint 5-3: PWA
| 파일 | 내용 |
|------|------|
| `public/manifest.json` | PWA 매니페스트 (shortcuts, icons) |
| `public/sw.js` | Service Worker (Cache-First + Web Push) |
| `src/app/layout.tsx` | SW 자동 등록 스크립트 |

**필요 작업:**
- `public/icons/icon-192.png`, `public/icons/icon-512.png` 실제 아이콘 파일 추가 필요

### Sprint 5-4: E2E 테스트
| 파일 | 내용 |
|------|------|
| `playwright.config.ts` | Desktop Chrome + Mobile Chrome |
| `e2e/auth.spec.ts` | 인증 플로우 테스트 |
| `e2e/diary.spec.ts` | 일기 접근 테스트 |
| `e2e/landing.spec.ts` | 라우트 접근성 테스트 |

**실행:** `npx playwright test`

### Sprint 5-5: 성능 최적화
- `next.config.ts` — AVIF/WebP, 보안 헤더, optimizePackageImports
- `tsconfig.json` — supabase/functions Deno 제외

---

## 오너 액션 필요 (AI 기능 활성화)

| 항목 | 방법 |
|------|------|
| `ANTHROPIC_API_KEY` 등록 | Vercel Dashboard → storige → Settings → Environment Variables |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Web Push VAPID 키 생성 후 등록 |
| profiles push_token 컬럼 | Supabase에서 migration 실행 필요 |
| PWA 아이콘 | `public/icons/icon-192.png`, `icon-512.png` 추가 |

---

## ⏸ 여전히 마지막으로 미룬 작업
- 포트원 결제 연동 (API 키 필요)
- 파파스 POD API (계약 필요)
- iOS/Android 앱스토어 제출
→ 가이드: `docs/appstore-deploy-guide.md`

---

## Phase 6 범위 (오너 Go 시)

1. 나의이야기(MyStory) AI 자서전 모듈 통합
2. Remember Storige 추모관 모듈 통합
3. 가족 커뮤니티 기능
4. storige.co.kr 랜딩 리뉴얼

**시작 명령:**
```
Phase 6를 agents/AUTOPILOT.md 기준으로 시작해주세요
```

---

## 배포 명령

```bash
git push origin main          # 웹 자동 배포
npm run test:e2e              # E2E 테스트
npm run cap:ios               # iOS 빌드
gh run list --repo storigehub/storige --limit 3  # 배포 확인
```
