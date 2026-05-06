# Navigation Consistency

## 원칙

Storige의 전역 메뉴는 `src/lib/navigation.ts`를 단일 진실 원천으로 사용한다.

- `PRIMARY_NAV_ITEMS`: 랜딩 헤더, 앱 헤더, 모바일 하단 탭이 공유하는 1차 메뉴
- `SECONDARY_NAV_ITEMS`: 드로어/보조 영역에 노출하는 확장 메뉴

## 현재 1차 메뉴

1. 읽기: `/diary`
2. 편지: `/dear`
3. 비밀: `/secret`
4. 출판: `/publish`
5. 관리: `/settings`

## 수정 규칙

- `src/app/page.tsx`, `src/components/layout/Header.tsx`, `src/components/layout/BottomNav.tsx` 안에 메뉴 배열을 새로 하드코딩하지 않는다.
- 메뉴명, 순서, 아이콘, 경로를 바꿀 때는 반드시 `src/lib/navigation.ts`만 수정한다.
- 랜딩 데스크탑 헤더와 모바일 드로어의 1차 메뉴명은 항상 동일해야 한다.
- 아직 라우트가 없는 경로를 랜딩 카드나 메뉴에 연결하지 않는다. 추모관은 UI가 구현되기 전까지 `/legacy`를 사용한다.

## 재발 원인

2026-05-06에 랜딩 페이지와 앱 레이아웃이 각각 별도의 메뉴 배열을 가지고 있어, rebase/페이지 리뉴얼 작업 중 랜딩 데스크탑 메뉴만 `아카이브/서신/AI 자서전/출판`으로 되돌아가는 문제가 발생했다. 이후 전역 메뉴를 `src/lib/navigation.ts`로 분리해 중복 정의를 제거했다.
