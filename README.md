## [API Layer Refactor] 데이터 구조 정리 및 타입 계층 분리

UI와 데이터 계층을 분리하고,
TMDB raw 데이터 의존 구조를 제거하기 위한 API 레이어 리팩토링.

#### ✅ API 레이어 분리

기존:

```
컴포넌트 → axios 직접 호출 → raw TMDB 데이터 사용
```

변경:

```
UI → hooks → api → mapper → TMDB
```

* `api/tmdb.ts` : TMDB 호출 전담
* `api/homefeed.ts` : 홈 피드 구성 로직 분리
* `api/mapper.ts` : raw 데이터 정규화

---

#### ✅ 데이터 정규화 도입

UI에서는 더 이상 TMDB raw 필드를 직접 사용하지 않습니다.

예:

* `poster_path` → `posterUrl`
* `backdrop_path` → `backdropUrl`
* `title/name` 분기 제거
* `release_date/first_air_date` 통합

UI는 `MediaCard` 타입 기반 데이터만 사용하도록 구조 통일.

---

#### ✅ 상세 번들 API 도입

단일 상세 호출 → 병렬 번들 호출 구조로 변경

포함:

* detail
* videos
* recommendations
* credits

`fetchDetailBundle()`에서 Promise.all 기반 병렬 처리

---

#### ✅ TypeScript 타입 계층 정리

추가:

* `types/app.ts`
* `types/tmdb.ts`

계층별 타입 고정:

* `MediaCard`
* `HomeFeed`
* `HomeSection`
* `DetailBundle`

---

주요 변경:

* TMDB raw 필드 직접 사용 제거
* MediaCard 타입 기반 정규화 도입
* 홈 피드 병렬 호출 구조 적용
* 상세 페이지 번들 API 도입
* 타입 계층 명확화

UI 작업하실 때는
raw 필드 대신 아래 필드 기준으로 사용해주세요:

* posterUrl
* backdropUrl
* title
* releaseDate
* mediaType

