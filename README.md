# 🎬 Netflix Clone Project (TMDB API)

Next.js App Router와 TMDB API를 활용하여 넷플릭스 UI/UX를 구현한 웹 애플리케이션입니다. 사용자 경험을 높이기 위한 다양한 인터랙션과 데이터 정규화 처리에 집중했습니다.

## 📸 화면 구현 (UI/UX)

### 메인 홈 화면
히어로 섹션 및 카테고리별(Top 10, Netflix Originals, Top Rated) Row 렌더링
![Main Home](./home-main.jpg)

### 상세 모달 화면
콘텐츠 클릭 시 상세 정보 모달 오픈 및 상태 처리 (Loading/Error/Empty)
![Detail Modal](./home-modal.jpg)

---

## 🛠 Tech Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **State Management:** React Hooks (`useState`, `useEffect`)
* **Network:** Axios (TMDB API 연동)
* **Media:** YouTube iframe API (트레일러 재생)
* **Styling:** CSS Modules (컴포넌트 단위 스타일 분리 - `Nav.css`, `Row.css`, `MovieModal.css`)
* **Infrastructure:** Docker, AWS S3/EC2 (예정)

---

## 📐 Data Contract (데이터 아키텍처 규칙)

본 프로젝트는 UI 컴포넌트의 독립성을 유지하기 위해 **TMDB raw 응답 필드를 직접 사용하지 않습니다.** 모든 화면 컴포넌트는 정규화된 `MediaCard` 타입만 사용합니다.

### 1. UI Allowed Fields (허용 필드)
* `posterUrl`
* `backdropUrl`
* `title`
* `mediaType`

### 2. UI Forbidden Raw Fields (사용 금지 필드)
* `poster_path`, `backdrop_path` 직접 사용 금지
* `title` / `name` 분기 직접 처리 금지

### 3. Mapping Rules (데이터 변환 규칙)
* **어댑터 패턴 적용:** raw TMDB 응답 -> `MediaCard` 변환은 어댑터(매핑 레이어)에서만 수행.
* **Title 보정:** `title ?? name ?? "제목 없음"`
* **MediaType 보정:** raw 값 사용, 없으면 컨텍스트 기준으로 `movie` 또는 `tv` 보정.
* **Image Fallback:** `posterUrl`, `backdropUrl` 경로가 없으면 `null` 반환 후 UI에서 Fallback 처리.

### 4. UI Rendering Rules (렌더링 규칙)
* 이미지(`posterUrl`, `backdropUrl`)가 `null`일 경우 **플레이스홀더 UI**를 표시합니다.
* `loading`, `error`, `empty` 상태를 Row 및 모달에서 명시적으로 처리합니다.
* `movie`와 `tv` 모두 동일한 `MediaCard` 인터페이스로 렌더링합니다.

---

## 👥 팀원 역할 분담 및 일정

| 이름 | 담당 기한 | 역할 및 수행 작업 |
| :--- | :--- | :--- |
| **정윤서 (팀장)** | ~ 2/16 | - 팀 깃허브 및 프로젝트 세팅<br>- README 작성<br>- Next.js 구조 설정 및 TypeScript 타입 정의 |
| **최희원** | ~ 2/18 12:00 | - API 통신 로직 및 데이터 구성 |
| **김다은** | ~ 2/21 12:00 | - 프론트 UI/UX 구성 및 페이지 디자인<br>- 메인 홈 화면/모달 구현 및 인터랙션 추가<br>- 트레일러 오버레이 재생 및 상세 데이터 연동 |
| **조아영** | ~ 2/22 12:00 | - Dockerfile 작성 및 이미지 빌드<br>- AWS S3/EC2 배포 및 테스트 |

---

## ✅ PR Checklist

코드 리뷰 시 아래 항목을 반드시 확인해 주세요.

- [ ] UI 코드에서 raw TMDB 필드(`poster_path`, `name` 등) 직접 참조가 없는가?
- [ ] `movie` / `tv` 모두 홈 피드에서 정상적으로 렌더링되는가?
- [ ] 모달(트레일러, 추천작, 출연진) 기능이 정상적으로 동작하는가? (ESC/오버레이 클릭 닫기 등)
- [ ] 데이터 API 호출 시 `loading` / `error` / `empty` 상태가 적절히 처리되었는가?
- [ ] 모바일 환경에서 레이아웃이 깨지지 않는가?
