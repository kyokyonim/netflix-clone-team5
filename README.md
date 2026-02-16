# Netflix Clone Team5

Next.js(App Router) + JavaScript 기반 넷플릭스 클론 프로젝트입니다.

## Tech Stack

- Next.js 16
- React 19
- JavaScript
- ESLint
- Tailwind CSS
- Axios

## Project Setup

1. Install dependencies

```bash
npm install
```

2. Set environment variables

```bash
cp .env.example .env.local
```

`.env.local`에서 아래 값을 채워주세요.

```bash
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
```

3. Start dev server

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## Folder Structure

```text
src/
  app/
  api/
    axios.js
    requests.js
```

## Git Branch Strategy

- `main`: 배포 가능한 안정 브랜치
- `develop`: 팀 통합 개발 브랜치
- `feat/<name>-<feature>`: 개인 기능 작업 브랜치 (예: `feat/heewon-api-logic`)
- `fix/<name>-<issue>`: 버그 수정 브랜치

## Collaboration Flow (GitHub)

1. 이슈 생성 (Bug report / Feature request 템플릿 사용)
2. `develop`에서 작업 브랜치 생성
3. 작업 후 커밋/푸시
4. `develop` 대상으로 Pull Request 생성 (PR 템플릿 사용)
5. 리뷰 후 `develop` 머지
6. 배포 시점에 `develop -> main` PR 머지

## Team Roles & Timeline

- 정윤서(팀장) - 2/15~2/16
  - 팀 GitHub 세팅
  - README 작성
  - 프로젝트 세팅
  - Next.js 구조 설정
  - JavaScript 기반 초기 구조 정리
- 최희원 - 2/18 12:00까지
  - API 통신 로직 및 데이터 구성
- 김다은 - 2/21 12:00까지
  - UI/UX 구성 및 페이지 디자인
  - 인터랙션 추가
- 조아영 - 2/22 12:00까지
  - Dockerfile 작성 및 이미지 빌드
  - AWS S3/EC2 배포 및 테스트

## API Notes

- 공통 Axios 인스턴스: `src/api/axios.js`
- 엔드포인트 상수: `src/api/requests.js`
- 민감 정보(API 키)는 코드에 하드코딩하지 않고 `.env.local` 사용
