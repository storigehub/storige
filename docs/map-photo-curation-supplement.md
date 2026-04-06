---
title: 지도 기반 사진 큐레이션 보완 초안
description: STORIGE_DEV_PLAN과 조화하는 EXIF·지도 큐레이션 보완안
---

# 지도 기반 사진 큐레이션 보완 초안 (기존 계획과의 조화)

## 원칙 (위배 방지)

- **지도 스택 변경 없음:** [AGENT_CTO.md](../agents/AGENT_CTO.md) 및 MOD-02에 맞춰 **Kakao Maps SDK + `react-kakao-maps-sdk`** 유지.
- **모듈 경계 유지:** 일기는 계속 [`(main)/diary/`](../src/app/(main)/diary/) · `journal_type` 확장 가능 설계([STORIGE_DEV_PLAN.md](../STORIGE_DEV_PLAN.md) 통합 설계 문구) 준수.
- **데이터:** 기존 [`entries`](../src/types/database.ts)의 `location_lat/lng`는 **「일기 작성 시점 위치/역지오코딩」** 용도로 그대로 두고, **사진 촬영 위치**는 **`media` 행 단위**로 보관하는 방식이 스키마와 역할 분리에 맞음 (아래 스키마 참고).
- **오토파일럿:** [AUTOPILOT.md](../agents/AUTOPILOT.md) 파이프라인(계획서 → 디자인 → 테스트 → 구현 → 리뷰) 그대로 적용. 스코프가 커지면 **STOP-7**로 분리 페이즈 명시.

---

## 현재 계획과의 관계

| 기존 (문서) | 보완안에서의 위치 |
|-------------|-------------------|
| Screen 05: 전체 화면 카카오맵, **클러스터 마커**, 탭 → 일기 미리보기 | **그대로 유지** + 클러스터 **시각**을 썸네일+건수(애플 사진 Places 유사)로 **옵션 강화** |
| B-5 미디어 뷰 + 지도 뷰 | **Phase 2 B-5**에서 **M1: 일기 위치 기반 지도**까지 완료 후, **M2: 사진 EXIF 좌표 + 썸네일 클러스터**를 **같은 Phase 내 서브마일스톤** 또는 **2.x 소규모 스프린트**로 추가 (우선순위는 팀이 STOP-2에서 결정) |
| B-6 위치/날씨 (`navigator.geolocation` + 역지오코딩) | **변경 없음** — 일기 헤더 메타와 별개로, **업로드 파이프라인에서만** EXIF 추출 |

---

## 데이터 모델 보완 (제안)

**[`media`](../src/types/database.ts) 테이블**에 nullable 컬럼 추가 (마이그레이션 + 타입 재생성):

- `taken_at` (timestamptz, optional) — EXIF DateTimeOriginal 등
- `gps_lat`, `gps_lng` (double precision, optional) — 촬영 위치; 없으면 지도에서는 해당 사진 핀 생략 또는 일기 `entries.location_*`로 폴백(정책을 한 가지로 고정)

**인덱스:** `(user_id)` 기존과 함께 지도 쿼리용으로 `gps_lat/lng`가 NOT NULL인 행만 필터하는 부분 인덱스 또는 앱에서 bounds 필터.

**개인정보:** EXIF에 포함될 수 있는 기타 태그는 저장하지 않거나 업로드 시 스트립(Edge Function `media-process`와 [STORIGE_DEV_PLAN.md](../STORIGE_DEV_PLAN.md)의 미디어 파이프라인과 정합).

---

## 구현 단계 (조화로운 순서)

### M1 — 문서에 이미 있는 지도 뷰 (변경 최소)

- 데이터 소스: **`entries`**의 `location_lat/lng` (일기당 최대 1점 또는 일기당 여러 미디어가 있어도 **일기 위치 1개**로 표시).
- UI: Kakao **MarkerClusterer** + 탭 시 **일기 미리보기** ([Screen 05](../STORIGE_DEV_PLAN.md) 스펙).

### M2 — 사진 큐레이션 (이번 보완의 핵심, 기존 스택 내)

1. **클라이언트:** 사진 선택/업로드 시 `exifr` 등으로 **GPS·촬영시각**만 읽어 `media` insert/update에 반영 (대용량은 워커/청크 고려).
2. **서버:** 기존 **`media-process`** Edge Function에서 썸네일 생성과 함께 **EXIF 미처리분 보강**(선택) 또는 **스토리지 업로드 후 메타만 갱신**.
3. **지도 뷰:**  
   - 표시 단위를 **「일기」→「사진(미디어)」**로 전환 가능한 **토글** 또는 **탭(일기 위치 | 촬영 위치)** 권장 — 기존 QA **「클러스터 탭 → 줌/목록」** 시나리오와 충돌 없음.  
   - **CustomOverlay** 또는 커스텀 **MarkerImage**로 **대표 썸네일 + 건수** (Kakao 공식 샘플: 이미지 마커·커스텀 오버레이 패턴).
4. **클러스터 로직:** 사진 수가 많아지면 **뷰포트+bounds**로 `media`만 조회 후, 클라이언트 **MarkerClusterer** 또는 **supercluster** 등으로 묶음(필요 시 Phase 5 이전에만 서버 집계 API 검토).

### M3 — 폴리시 (문서 한 줄)

- [STORIGE_DEV_PLAN.md](../STORIGE_DEV_PLAN.md) MOD-02 또는 Screen 05에 **「촬영 위치 모드」** 한 단락 추가 시, 에이전트·QC가 동일 기준으로 검증 가능.

---

## 비기능·QC 연계

- [AGENT_QC.md](../agents/AGENT_QC.md): 기존 5개 뷰 전환에 **「지도 — 일기 위치 / 촬영 위치」** 전환 동작 추가 테스트 케이스.
- 개인정보: 위치 정밀도·EXIF 제거 정책을 설정 화면 문구와 맞출지 **STOP-2** 후보.

---

## 요약

기존 계획은 **카카오맵 + 클러스터 + 일기 미리보기**로 이미 정렬되어 있으므로, **위배 없이** 보완하려면 **`media`에 GPS·촬영시각**, **업로드 시 EXIF 추출**, **지도 뷰에 표시 모드(일기 vs 사진)** 세 가지를 묶어 **B-5 확장 또는 B-5.1** 식으로 스프린트에 넣는 것이 가장 자연스럽습니다.

---

## 실행 체크리스트 (참고)

| 항목 | 내용 |
|------|------|
| 스키마 | Supabase 마이그레이션: `media`에 `gps_lat`, `gps_lng`, `taken_at` (nullable) + RLS 유지 |
| 업로드 | EXIF 추출(exifr) 및 media 메타 저장, `media-process`와 역할 분담 |
| 지도 UI | 일기 위치(M1) vs 촬영 위치(M2) 토글 + CustomOverlay 썸네일·건수 클러스터 |
| 문서·QC | STORIGE_DEV_PLAN Screen 05/MOD-02 한 단락 보완 + AGENT_QC 시나리오 추가 |
