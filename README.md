# 📌 브랜치 변경 정리

## 1. 변경된 부분

### 1) TypeScript 전환

* App, index, Row, pages, hooks, api 일부를 TS/TSX로 전환
* 공통 타입 정의 파일 추가

  * `types/app.ts`
  * `MediaCard`, `HomeSection`, `HomeFeed`, `DetailBundle` 등 정의

### 2) API 구조 재정리

기존:
컴포넌트에서 직접 axios 호출 + TMDB raw 데이터 사용

변경:

```
UI → hooks → api → mapper → TMDB
```

* `api/tmdb.ts`에서 TMDB 호출
* `mapper.ts`에서 데이터 정규화
* hooks에서 UI에 전달

### 3) 데이터 정규화 도입

TMDB raw 필드 직접 사용하지 않음.

UI로 전달되는 데이터는 모두 `MediaCard` 타입 기반.

예:

* poster_path → posterUrl
* backdrop_path → backdropUrl
* title / name 분기 제거
* release_date / first_air_date 통합


### 4) 홈 피드 구조 변경

* `buildHomeFeed()`에서 홈 전체 데이터 구성
* 병렬 API 호출
* Top10 계산 로직 분리
* 섹션 단위 데이터 반환

UI는 `sections.map()`으로 렌더링


### 5) 상세 번들 API 도입

단일 상세 호출 → 병렬 번들 구조로 변경

포함:

* detail
* videos
* recommendations
* credits

`fetchDetailBundle()`로 통합 처리

### 6) 라우팅 변경

```
/detail/:mediaType/:id
```

movie, tv 모두 지원하도록 구조 확장



## 2. 변경으로 인한 효과

### 1) UI와 데이터 계층 분리

* UI는 렌더링만 담당
* API 로직과 완전 분리


### 2) 데이터 일관성 확보

* 모든 콘텐츠가 동일한 `MediaCard` 타입 사용
* 조건 분기 감소
* UI 코드 단순화
* 런타임 에러 가능성 감소


### 3) 확장성 증가

* 카테고리 추가 쉬움
* Top10 로직 변경 쉬움
* 추천 알고리즘 교체 가능
* 국가/장르 확장 가능

### 4) 성능 개선

* 홈 데이터 병렬 호출
* 상세 번들 병렬 호출
* 추후 캐싱 구조 적용 가능

단순 클론 구조에서 벗어나 확장 가능한 구조로 변경됨.



## 3. 다음 작업 유의사항

### 1) Raw TMDB 필드 직접 사용 금지

사용 금지:

* poster_path
* backdrop_path
* name
* release_date 등 raw 필드

반드시 사용:

* posterUrl
* backdropUrl
* title
* releaseDate
* mediaType


### 2) Row 컴포넌트

`items`는 이미 정규화된 `MediaCard[]`

Top10 여부는:

```
variant === "top10"
```

으로 판단

rank 값은 이미 계산되어 있음


### 3) Banner

hero 데이터도 `MediaCard` 기반

raw 필드 접근하지 말 것


### 4) 상세 페이지

라우팅 구조:

```
detail/:mediaType/:id
```

movie, tv 모두 대응해야 함

mediaType을 하드코딩하지 말 것


### 5) API 직접 호출 지양

컴포넌트에서 axios 직접 호출하지 말 것
필요한 경우 hooks 또는 api 레이어에 추가


### 6) 타입 유지

새 props 추가 시 타입 먼저 정의
any 사용 지양

### 7) import 확장자 규칙

TS 환경 전환 완료.

import 시:
```
import axios from "./axios";
```

처럼 확장자(.ts/.js) 명시하지 말 것

### 8) 기존 JS 코드 혼용 주의

아직 일부 컴포넌트는 JS 유지 중.

추가 기능 개발 시:

가능하면 TS로 작성

JS 파일에서 타입 필요하면 점진적 전환

## 하위 태스크 

### 1) API 통신 로직 및 데이터 구성

기존 구조:
```
컴포넌트 → axios 직접 호출 → raw TMDB 데이터 사용
```

현재 구조:
```
UI → hooks → api → mapper → TMDB
```

✔ api/tmdb.ts에서 단일 책임 원칙 기반 호출
✔ fetchList, fetchHero, fetchDetailBundle 분리
✔ 병렬 호출 (Promise.all) 적용
✔ 홈 데이터는 buildHomeFeed()에서 전체 구성

👉 API 레이어 분리 및 구조화 완료

### 2) TypeScript 타입 정의

✔ types/app.ts

* MediaCard

* HomeSection

* HomeFeed

* DetailBundle

✔ types/tmdb.ts

* TMDB raw 응답 타입 정의

* TMDBListResponse<T>

* TMDBDetail

* TMDBVideosResponse 등

✔ hooks 반환 타입 고정
```
Promise<HomeFeed>
Promise<MediaCard[]>
Promise<DetailBundle>
```
👉 계층별 타입 명확화 완료


##  현재 상태

* 홈 정상 렌더링
* 슬라이더 정상 동작
* 모달 정상 동작
* API 연동 정상

