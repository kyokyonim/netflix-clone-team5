## Data Contract (MediaCard)

(🔸변경) UI 레이어에서는 TMDB raw 응답 필드를 직접 사용하지 않습니다.  
(🔸변경) 모든 화면 컴포넌트는 정규화된 `MediaCard` 타입만 사용.

### UI Allowed Fields
- `posterUrl`
- `backdropUrl`
- `title`
- `mediaType`

### UI Forbidden Raw Fields
- `poster_path`
- `backdrop_path`
- `title` / `name` 분기 직접 처리

## Mapping Rules

raw TMDB 응답 -> `MediaCard` 변환은 어댑터(매핑 레이어)에서만 수행.  
컴포넌트 내부에서 raw 응답 구조를 해석하지 않음.

- `title`: `title ?? name ?? "제목 없음"`
- `mediaType`: raw 값 사용, 없으면 컨텍스트 기준으로 `movie` 또는 `tv` 보정
- `posterUrl`/`backdropUrl`: 경로가 없으면 `null` 반환 후 UI fallback 표시

## UI Rendering Rules

- 이미지(`posterUrl`, `backdropUrl`)가 `null`이면 플레이스홀더 UI를 표시합니다.
- `loading`, `error`, `empty` 상태를 Row/모달에서 명시적으로 처리합니다.
- `movie`/`tv` 모두 동일한 `MediaCard` 인터페이스로 렌더링합니다.

## ⭐️PR Checklist⭐️

- [ ] UI 코드에서 raw TMDB 필드 직접 참조 없음
- [ ] `movie`/`tv` 모두 홈 피드 정상 렌더링
- [ ] 모달(트레일러/추천작/출연진) 정상 동작
- [ ] `loading`/`error`/`empty` 상태 확인
- [ ] 모바일 레이아웃 깨짐 없음
