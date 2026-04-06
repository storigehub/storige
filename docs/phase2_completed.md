---
title: Storige Phase 2 완료 보고서
description: Phase 2 (Diary Core) 진행 내역 및 트러블슈팅 정리
---

# Storige Phase 2: Diary Core 완료 보고서

본 문서는 Phase 2 (Diary Core)의 주요 구현 내용과 발생했던 이슈의 해결 과정을 요약한 보고서입니다.

## 1. 주요 구현 내용

Phase 2의 핵심 목표인 **일기 작성/레이아웃/에디터/다양한 형태의 뷰**가 구현되었습니다.

- **리치 텍스트 에디터 도입:** Tiptap 라이브러리를 활용하여 `DiaryEditor` 및 툴바 구현. (자동 저장 기능 및 텍스트 추출 기능 포함)
- **다양한 일기 뷰(View) 추가:** 
  - `DiaryListView`: 아코디언 스타일로 일기를 펼쳐볼 수 있는 목록.
  - `DiaryCalendarView`: 달력 형태에서 기록일 확인 가능한 캘린더 뷰.
  - `DiaryMediaView`: 다중 첨부 파일을 그리드 형태로 감상하기 위한 미디어 뷰.
  - `DiaryMapView`: [`react-kakao-maps-sdk`](https://github.com/JaeSeoKim/react-kakao-maps-sdk)를 도입하여, 좌표 값(`location_lat`, `location_lng`) 기반의 클러스터·마커를 제공하는 지도 뷰 통합 완료.
- **Hook 아키텍처 도입:** 로직의 컴포넌트 결합도를 낮추기 위해 `useDiaryEditor`, `useDiaryList`, `useGeoWeather`, `useMediaUpload` 등의 커스텀 Hook 모듈화 완료.

## 2. 해결한 주요 이슈 (트러블슈팅)

### A. 빌드 실패 및 의존성 이슈 
- **문제 현상:** `tailwindcss/dist/lib.js` 누락 에러 및 Tiptap Peer Dependency 충돌로 인해 Next.js 빌드가 110여 개의 에러를 내뿜고 중단됨.
- **해결 방안:** 불완전했던 `node_modules` 폴더 및 `.next` 빌드 캐시를 완전히 삭제 후 `npm install` 클린 설치를 통해 의존성 문제를 해결했습니다.

### B. Supabase(v2.101) TypeScript Generic 오류
- **문제 현상:** `useDiaryEditor.ts` 등에서 Supabase Client의 `.from('entries').update()`를 호출할 때 `never` 타입 에러 발생.
- **원인 분석:** Supabase-js v2.100 이상 버전부터 `Database` 타입의 각 테이블 객체 내부에서 필수 프로퍼티로 `Relationships: []` 어레이를 요구합니다. 기존 `src/types/database.ts` 파일에는 해당 정의가 빠져 있어 **모든 테이블이 never 타입으로 평가**되는 현상이 있었습니다.
- **해결 방안:** 모든 테이블 정의(`.Row`, `.Insert`, `.Update` 뎁스 레벨 동일) 뒤에 `Relationships: []` 속성을 명시하여 타입 에러를 우회/해결했습니다.

---

## 3. 남은 과제 (Phase 3 연결)

Phase 2에서 기초 UI와 작성 코어가 잡혔기 때문에, 앞으로 구조 단계를 밟을 기반이 굳건해졌습니다.

- **미디어 클러스터 고도화:** 지도 뷰가 현재는 단일 일기 위치를 바라보고 있습니다. 추후 미디어의 EXIF 정보 촬영 위치 모드로 전환하는 로직 고도화 여부는 선택옵션에 있습니다.
- **필터링:** `DiarySearchBar`로 일반 검색은 적용되었지만 날짜/태그 필터 UI 추가는 남은 상태입니다. (추후 디자인 확정 후 진행 권장)

**다음 단계:** `Dear My Son` 편지, E2EE `Secret Code`(Shamir's Secret Sharing 포함), 가족 연동 및 `Publish`(책 시안 미리보기) 등 **Phase 3**를 착수할 예정입니다.
