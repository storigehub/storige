# Storige 재시작 문서 — 2026-04-09 (최종 업데이트)

> 이 문서를 읽고 CTO는 이전 작업 이어서 시작해주세요.

---

## 현재 상태 요약

- **현재 Phase:** 3 완료 / Phase 4 대기
- **최근 커밋:** `289adb4` (feat: CEO/CTO/디자인리드 감사 — 미구현 기능 전체 수정)
- **최신 Vercel 배포:** `storige-lyndmwiw1-yohans-projects-de3234df.vercel.app` ● Ready
- **빌드 상태:** ✅ 클린 (18 pages all pass)

---

## 오늘 세션 전체 완료 작업

### 디자인 정합성 (Stitch _5/dear_my_son_2 기준)
| 파일 | 변경 |
|------|------|
| `DiaryAccordionItem.tsx` | 날짜 한국어, 닫힌 패딩 p-6, tonal layering |
| `DearAccordionItem.tsx` | border-l-4 제거, 날짜 한국어, 편지지 bg #fdfcf8, 틸 바 |

### P1~P2 기능
| 항목 | 상태 |
|------|------|
| Settings 통계 실데이터 (`useArchiveStats`) | ✅ |
| Dear 빈 state 개선 + CTA | ✅ |
| Diary 라이트박스 (`DiaryLightbox.tsx`) | ✅ |

### CEO/CTO/디자인리드 감사 → 수정 완료
| 항목 | 상태 |
|------|------|
| DiaryEditor 사진 첨부 버튼 + 미리보기 | ✅ |
| DiaryEditor 위치/날씨 태깅 버튼 | ✅ |
| useDiaryEditor locationMeta → DB 저장 | ✅ |
| DiaryListView 즐겨찾기 필터 버튼 | ✅ |
| `/settings/profile` 프로필 편집 페이지 | ✅ |
| Settings 계정 탈퇴 확인 모달 ('탈퇴' 입력) | ✅ |
| Settings 데이터 백업 버튼 클릭 안내 | ✅ |

---

## 남은 미완료 항목

### 블로커 있음 (외부 의존)
| 항목 | 블로커 |
|------|--------|
| 포트원 결제 연동 (Sprint 3-7) | 포트원 API 키 필요 |
| 파파스 POD API (Sprint 3-7) | 파파스 계약/API 키 필요 |
| Phase 4 시작 | 오너 Go 사인 필요 |

### 오너 직접 액션 필요
| 항목 | 방법 |
|------|------|
| Vercel GitHub webhook 재연결 | vercel.com → storige → Settings → Git → 재연결 |
| 계정 탈퇴 완전 구현 | Supabase Edge Function 또는 admin 권한으로 auth.users 삭제 필요 |

### 낮은 우선순위 (Phase 5)
- 에러 처리 전반 재시도 버튼 추가
- AI 자서전 요약 (Claude API 연동)
- Secret 금고 쉴드 "개인 키 입력" 실제 기능화 (전역 패스프레이즈 관리)

---

## Phase 4 범위 (오너 Go 시)

1. 포토앨범 (`/album`) — Capacitor camera 연동 (현재 플레이스홀더)
2. Legacy Access (`/legacy`) — 유고 후 열람 전용 화면
3. Capacitor 네이티브 빌드 — iOS + Android
4. 앱스토어 배포 준비

**시작 명령:**
```
Phase 4를 agents/AUTOPILOT.md 기준으로 시작해주세요
```

---

## 주요 파일 경로

```
src/hooks/useArchiveStats.ts              ← 설정 통계
src/hooks/useDiaryEditor.ts               ← locationMeta 포함
src/components/diary/DiaryEditor.tsx      ← 미디어+위치 버튼
src/components/diary/DiaryListView.tsx    ← 즐겨찾기 필터
src/components/diary/DiaryLightbox.tsx    ← 라이트박스
src/components/dear/DearAccordionItem.tsx
src/components/dear/DearListView.tsx
src/app/(main)/settings/page.tsx          ← 탈퇴 모달
src/app/(main)/settings/profile/page.tsx ← 프로필 편집 (신규)
```

## 인프라

- Supabase Project ID: `uobbgxwuukwptqtywxxj` (ap-northeast-2)
- Stitch Project ID: `18286796991837386984`
- Vercel Project: `prj_KOfHRMjPd7VhuBWhC5Xhz2qb4k7t`

## 배포 명령 (GitHub Actions 자동화 완료)

```bash
# 자동 배포 (표준) — git push만 하면 GitHub Actions가 Vercel 배포 실행
git push origin main

# 긴급 수동
npx vercel deploy --prod

# 배포 확인
gh run list --repo storigehub/storige --limit 3
```
