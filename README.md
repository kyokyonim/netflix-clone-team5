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

## 팀원 역할 분담

### 정윤서(팀장) (2/15~16일까지 진행)
- 팀 깃허브 세팅
- 리드미 작성
- 프로젝트 세팅
- Next.js 구조 설정
- TypeScript 타입 정의

### 최희원 (2/18 오후 12시까지 진행)
- API 통신 로직 및 데이터 구성

### 김다은 (21일 오후 12시까지 진행)
- UI/UX 구성 및 페이지 디자인 (프론트)
- 인터랙션 추가

#### 김다은 상세 수행 작업 (머지 반영)
- 메인 홈 화면 UI 구성: 히어로 섹션 + 카테고리 Row(Top 10, Netflix Originals, Top Rated) 렌더링
- 히어로 인터랙션 구현: `재생` 버튼 트레일러 호출, 음소거 토글, `상세 정보` 버튼 연동
- 트레일러 재생 구현: YouTube trailer/teaser 키 선택 후 `iframe` 오버레이 재생 및 닫기 처리
- 모달 구현: 카드 클릭 시 상세 모달 오픈, ESC/오버레이 클릭 닫기, 바디 스크롤 잠금
- 상세 데이터 연동: 모달 오픈 시 TMDB detail API 호출 후 overview 표시(loading/error/empty 상태 처리)
- 네비게이션 UI 구현: 상단 메뉴/아이콘/프로필 영역, 프로필 드롭다운 토글 및 ESC/바깥 클릭 닫기
- 에셋 및 스타일 반영: 네비게이션/모달/로우 관련 CSS와 아이콘 이미지 리소스 추가
- Next.js 앱 라우터 반영: `src/app/layout.jsx`, `src/app/page.jsx` 기준으로 홈 화면 구조 통합

#### 김다은 결과 캡처
![Home Main](docs/screenshot/home-main.png)
![Home Modal](docs/screenshot/home-modal.png)

#### 김다은 적용 기술
- `Next.js App Router` 기반 화면 구성 (`layout.jsx`, `page.jsx`)
- `React Hooks` 상태 관리 (`useState`, `useEffect`)
- `Axios` 기반 TMDB API 연동
- `YouTube iframe` 트레일러 재생/음소거 토글
- `모달 UX` 처리 (ESC 닫기, 오버레이 클릭 닫기, body scroll lock)
- `CSS 모듈 분리`에 준하는 컴포넌트 단위 스타일 파일 분리 (`Nav.css`, `Row.css`, `MovieModal.css`)
- `데이터 정규화` 구조 준수 (`MediaCard` 기반 UI 렌더링)

### 조아영 (22일 오후 12시까지 진행)
- Dockerfile 작성 및 이미지 빌드
- AWS S3/EC2 배포 및 테스트

## ⭐️PR Checklist⭐️

- [ ] UI 코드에서 raw TMDB 필드 직접 참조 없음
- [ ] `movie`/`tv` 모두 홈 피드 정상 렌더링
- [ ] 모달(트레일러/추천작/출연진) 정상 동작
- [ ] `loading`/`error`/`empty` 상태 확인
- [ ] 모바일 레이아웃 깨짐 없음
