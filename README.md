# 🎬 Netflix Clone Project (TMDB API)

Next.js App Router와 TMDB API를 활용해 넷플릭스 UI/UX를 구현한 웹 애플리케이션입니다.  
UI 계층과 데이터 계층을 분리해 유지보수성과 확장성을 높였습니다.

## 📸 화면 구현 (UI/UX)

### 메인 홈 화면
히어로 섹션과 카테고리 Row(Top 10, Netflix Originals, Top Rated) 렌더링

![Main Home](docs/screenshot/home-main.png)

### 상세 모달 화면
콘텐츠 클릭 시 상세 모달 오픈, ESC/오버레이 닫기, 상세 데이터 상태 처리

![Detail Modal](docs/screenshot/home-modal.png)

---

## 🛠 Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript / JavaScript
- **State Management:** React Hooks (`useState`, `useEffect`)
- **Network:** Axios (TMDB API)
- **Media:** YouTube iframe (트레일러 재생)
- **Styling:** Component-scoped CSS (`Nav.css`, `Row.css`, `MovieModal.css`)
- **Infra:** Docker, AWS S3/EC2 (예정)

---

## 📐 Data Flow & Contract

### 데이터 흐름 (통일 기준)
`UI → hooks → api → mapper → TMDB`

### UI에서 사용하는 정규화 타입
- `posterUrl`
- `backdropUrl`
- `title`
- `mediaType`

### UI에서 직접 사용 금지 (raw 필드)
- `poster_path`
- `backdrop_path`
- `title/name` 분기 직접 처리

### 렌더링 규칙
- 이미지 누락 시 Placeholder UI 표시
- `loading / error / empty` 상태 명시 처리
- `movie / tv` 공통 `MediaCard` 인터페이스 사용

---

## 👥 역할 분담 (수행 내용 중심)

### 정윤서 (팀장)
- 팀 GitHub 세팅 및 협업 규칙 정리
- 프로젝트 초기 세팅 및 Next.js 구조 구성
- README 작성 및 문서 구조 정리
- TypeScript 타입 기반 설계 정리
- 브랜치 통합/정합성 확인 및 머지 관리

### 최희원
- TMDB API 통신 로직 설계
- 데이터 정규화 레이어(`api / mapper / hooks`) 구성
- 홈 피드/상세 번들 데이터 구조 정리

### 김다은
- 홈 화면 UI/UX 구현 (Hero + Row 레이아웃)
- 네비게이션/프로필 드롭다운 인터랙션 구현
- 상세 모달 UI 및 오픈/닫기 UX 구현
- 트레일러 오버레이 재생(YouTube iframe) 구현
- 모달 상세 정보 상태 처리(loading/error/empty)

### 조아영
- Dockerfile 작성 및 이미지 빌드
- AWS S3/EC2 배포 및 테스트 진행

---

## ✅ PR Checklist

- [ ] UI에서 raw TMDB 필드 직접 참조가 없는가?
- [ ] `movie / tv`가 홈 피드에서 정상 렌더링되는가?
- [ ] 모달 동작(열기/닫기/상세 데이터)이 정상인가?
- [ ] `loading / error / empty` 상태가 명확한가?
- [ ] 모바일/데스크탑 레이아웃이 안정적인가?
