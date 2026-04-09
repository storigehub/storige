# Storige 배포 인프라 가이드

> 최종 업데이트: 2026-04-09  
> 작성 배경: Vercel-GitHub 자동 배포 연결 실패 사고 발생 → 1시간 낭비 → GitHub Actions로 해결

---

## 1. 인프라 구성 요약

| 항목 | 값 |
|------|-----|
| 프론트엔드 | Next.js 14 (App Router) |
| 배포 플랫폼 | Vercel (Hobby Plan) |
| Vercel 계정 | `papas-yohan` (`team_dOpgsAqfLyl4qNlVgSiFVm6B`) |
| Vercel 프로젝트 ID | `prj_KOfHRMjPd7VhuBWhC5Xhz2qb4k7t` |
| GitHub 레포 | `storigehub/storige` |
| GitHub 계정 | `storigehub` (레포 소유자) |
| Supabase 프로젝트 ID | `uobbgxwuukwptqtywxxj` (ap-northeast-2) |
| 커스텀 도메인 | `storige.vercel.app` |

---

## 2. 배포 방식 — GitHub Actions (확정)

### 왜 GitHub Actions인가?

**핵심 구조적 문제:**  
Vercel 계정(`papas-yohan`)과 GitHub 레포 소유자(`storigehub`)가 **다른 계정**이다.  
Vercel Dashboard의 "Connected Git Repository"는 OAuth 기반으로 동일 계정 또는 명시적으로 연결된 조직만 지원한다.  
이 구조에서는 Vercel Dashboard/CLI를 통한 GitHub 자동배포 연결이 **원천적으로 불가**하다.

**시도했으나 실패한 방법들 (재시도 금지):**
- `npx vercel git connect` — CLI 토큰이 `storigehub` GitHub 접근 권한 없음
- Vercel Dashboard → Settings → Git → Namespace 선택 — `storigehub` 계정이 목록에 안 뜸
- Vercel GitHub App을 `storigehub`에 설치 — Dashboard가 설치를 인식 못 함
- Vercel Dashboard → "Add GitHub Account" — OAuth 루프 발생, 반복만 됨
- Vercel Deploy Hook — 프로젝트가 Git 레포에 연결 안 되면 생성 불가

**결론: GitHub Actions가 유일한 자동화 경로이자 더 견고한 방법이다.**

---

### 현재 자동 배포 흐름

```
git push origin main
        ↓
GitHub: .github/workflows/deploy.yml 실행
        ↓
ubuntu-latest에서 Node.js 20 설치
        ↓
npx vercel deploy --prod --token=$VERCEL_TOKEN
        ↓
Vercel Production 배포 완료 (~1분)
```

### GitHub Actions 워크플로우 파일

경로: `.github/workflows/deploy.yml`

```yaml
name: Deploy to Vercel

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Vercel CLI
        run: npm install -g vercel@latest

      - name: Deploy to Vercel Production
        run: vercel deploy --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

### GitHub Repository Secrets

`storigehub/storige` 레포에 등록된 시크릿:

| Secret 이름 | 값 | 용도 |
|------------|-----|------|
| `VERCEL_TOKEN` | Vercel CLI 인증 토큰 | 배포 인증 |
| `VERCEL_ORG_ID` | `team_dOpgsAqfLyl4qNlVgSiFVm6B` | 팀 식별 |
| `VERCEL_PROJECT_ID` | `prj_KOfHRMjPd7VhuBWhC5Xhz2qb4k7t` | 프로젝트 식별 |

> ⚠️ **VERCEL_TOKEN 만료 시:** Vercel Dashboard → Account Settings → Tokens에서 새 토큰 발급 후 GitHub Secret 업데이트 필요

---

## 3. 로컬 개발 → 배포 표준 워크플로우

```bash
# 1. 코드 수정 후 빌드 확인
npm run build

# 2. 커밋 & 푸시
git add <파일>
git commit -m "feat: 기능 설명"
git push origin main

# 3. 자동 배포 확인 (선택)
gh run list --repo storigehub/storige --limit 3
```

### 배포 상태 확인 방법

```bash
# GitHub Actions 실행 현황
gh run list --repo storigehub/storige --limit 5

# Vercel 최신 배포 목록
npx vercel ls --prod

# 특정 Actions 런 로그
gh run view <run-id> --log
```

---

## 4. 긴급 수동 배포 (GitHub Actions 우회 시)

GitHub Actions가 실패하거나 즉시 배포가 필요한 경우:

```bash
npx vercel deploy --prod
```

---

## 5. Supabase 연결 정보

| 항목 | 값 |
|------|-----|
| 프로젝트 ID | `uobbgxwuukwptqtywxxj` |
| 리전 | `ap-northeast-2` (서울) |
| API URL | `https://uobbgxwuukwptqtywxxj.supabase.co` |
| 환경 변수 파일 | `.env.local` (git 제외) |

### 필수 환경 변수 (`.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://uobbgxwuukwptqtywxxj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
```

### Vercel 환경 변수 확인/추가

```bash
npx vercel env ls          # 현재 등록된 환경 변수 목록
npx vercel env add <name>  # 새 환경 변수 추가
```

---

## 6. 사고 기록 — 2026-04-09

### 발생 경위

Vercel GitHub 자동 배포 webhook이 끊어져 있어 `git push` 후 자동 배포가 트리거되지 않았다. Vercel Dashboard에서 Git 연결을 복구하려 했으나 1시간 이상 실패했다.

### 근본 원인

Vercel 계정(`papas-yohan`)과 GitHub 레포 소유 계정(`storigehub`)이 다른 계정이다. Vercel의 GitHub OAuth 연동은 동일 계정 기반으로 설계되어 있어, 타 계정의 레포를 Dashboard에서 연결하는 것이 구조적으로 불가능하다.

### 시간이 낭비된 이유

한 가지 방법(Dashboard OAuth)이 실패했을 때 즉시 다른 경로로 전환하지 않고, 같은 방법의 변형을 반복했다. CLI → Dashboard → App 재설치 → Add Account → 루프, 총 6가지 변형을 시도했으나 모두 동일한 구조적 문제로 실패했다.

### 교훈 — 에이전트 행동 원칙

> **같은 접근법이 2회 연속 실패하면 즉시 다른 경로로 전환한다.**  
> **외부 서비스 OAuth 문제는 서비스 구조적 한계일 수 있다. 우회로를 먼저 찾는다.**  
> **"왜 안 되는가"를 파악하는 데 5분, 넘으면 다른 방법을 선택한다.**

### 최종 해결

GitHub Actions 워크플로우(`.github/workflows/deploy.yml`) + GitHub Repository Secrets 3개 설정으로 완전 자동화 달성. 오히려 Vercel Dashboard 연동보다 더 명시적이고 제어 가능한 배포 파이프라인이 됐다.
