# 🌊 Lambda the Sea

<div align="center">

**Serverless Lambda를 투명한 바다처럼 가시화하는 Observability 플랫폼**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**언어 / Language:** [🇯🇵 日本語](README.md) | [🇰🇷 한국어](README.ko.md) | [🇺🇸 English](README.en.md)

</div>

---

## 📝 프로젝트 개요

**Lambda the Sea**는 ECS 기반의 Serverless 모델로 다양한 언어를 실행할 수 있으며, Lambda가 제공하지 않았던 단계별 실행 흐름 가시화를 통해 Whitebox Execution을 제공하는 Observability 플랫폼입니다.

### 🎯 해커톤 테마

기존 Serverless 환경에서 불투명했던 실행 프로세스를 "투명한 바다"처럼 가시화하여, 개발자가 Lambda 함수의 동작을 직관적으로 이해할 수 있도록 하는 것을 목표로 했습니다.

---

## ✨ 주요 기능

### 1. 🔍 Whitebox Execution

- 단계별 실행 흐름 가시화
- 실시간 실행 상태 모니터링
- 상세한 로그 및 트레이스 정보

### 2. 🚀 Multi-Language Support

- ECS 기반 Serverless 모델
- 다양한 프로그래밍 언어 지원
- 유연한 실행 환경

### 3. 📊 프로젝트 관리

- 프로젝트 목록 및 상세 정보
- 실행 이력 추적
- 상태 기반 필터링

### 4. 🎨 직관적인 UI/UX

- 모던하고 사용하기 쉬운 인터페이스
- 실시간 메트릭 표시
- 다크 모드 지원

---

## 🛠️ 기술 스택

### 프론트엔드

- **React 19** - 최신 React 프레임워크
- **TypeScript** - 타입 안전한 개발
- **Vite** - 고속 빌드 도구
- **Styled Components** - CSS-in-JS
- **React Router v7** - 라우팅

### 상태 관리 & 데이터 페칭

- **Zustand** - 경량 상태 관리
- **TanStack Query** - 서버 상태 관리
- **Axios** - HTTP 클라이언트
- **Immer** - 불변 상태 업데이트

### UI/UX

- **ECharts** - 데이터 시각화
- **Framer Motion** - 부드러운 애니메이션
- **Lucide React** - 아이콘 라이브러리

### 개발 도구

- **MSW (Mock Service Worker)** - API 모킹
- **ESLint** - 코드 품질
- **Prettier** - 코드 포맷팅

---

## 🚀 빠른 시작

### 사전 요구사항

- Node.js 18 이상
- pnpm (권장) 또는 npm

### 설치

```bash
# 리포지토리 클론
git clone <repository-url>
cd service-client

# 의존성 패키지 설치
pnpm install

# 환경 변수 설정
cp .env.example .env
# .env 파일을 편집하여 MSW on/off 설정

# 개발 서버 시작
pnpm dev
```

### 환경 변수 설정

`.env` 파일에서 다음 설정이 가능합니다:

| 변수명              | 설명                                                                                   | 기본값                  |
| ------------------- | -------------------------------------------------------------------------------------- | ----------------------- |
| `VITE_ENABLE_MSW`   | MSW 모킹을 활성화할지 여부<br/>`true`: 모킹 API 사용<br/>`false`: 실제 백엔드 API 사용 | `true`                  |
| `VITE_API_BASE_URL` | 백엔드 API의 베이스 URL<br/>(MSW 비활성화 시 사용)                                     | `http://localhost:8000` |

**예: MSW를 비활성화하고 실제 백엔드를 사용하는 경우**

```env
VITE_ENABLE_MSW=false
VITE_API_BASE_URL=http://localhost:8000
```

### 접속

브라우저에서 `http://localhost:5173`에 접속하세요.

---

## 📦 프로젝트 구조

```
service-client/
├── src/
│   ├── api/               # API 통신
│   │   ├── _client.ts    # Axios 클라이언트
│   │   ├── execution.ts  # 실행 관련 API
│   │   ├── monitoring.ts # 모니터링 API
│   │   └── project.ts    # 프로젝트 관리 API
│   ├── components/        # React 컴포넌트
│   │   ├── common/       # 공통 컴포넌트
│   │   ├── pages/        # 페이지 컴포넌트
│   │   ├── pipeline/     # 파이프라인 실행 단계
│   │   └── whiteboard/   # 데이터 시각화
│   ├── constants/        # 상수 정의
│   ├── mocks/            # MSW 모킹
│   ├── types/            # TypeScript 타입 정의
│   ├── utils/            # 유틸리티 함수
│   └── theme/            # 테마 설정
├── public/               # 정적 파일
└── index.html           # 진입점
```

---

## 🧪 개발 모드

### MSW (Mock Service Worker)

백엔드 없이 프론트엔드 개발을 할 수 있도록 MSW로 API를 모킹하고 있습니다.

**프로젝트 실행 시뮬레이션:**

- 실시간 로그 스트리밍
- 상태 전환 가시화
- 메트릭 수집 및 모니터링

---

## 📱 주요 화면

### 1. 랜딩 페이지 (`/`)

프로젝트 소개 및 주요 기능을 표시합니다.

### 2. 프로젝트 목록 (`/projects`)

- 프로젝트 목록 표시
- 상태별 필터링
- 검색 기능
- 신규 프로젝트 생성

### 3. 프로젝트 상세 (`/projects/:id`)

- 실행 이력
- 상세 메트릭
- 로그 뷰어
- 실행 관리

### 4. Whiteboard (`/whiteboard`)

- 시스템 메트릭 가시화
- 실시간 모니터링
- 성능 분석

---

## 🎯 향후 확장 계획

- [ ] 더욱 상세한 실행 흐름 분석 기능
- [ ] 멀티 리전 지원
- [ ] 비용 최적화 제안 기능
- [ ] 팀 협업 기능

---

## 👥 팀

**Lambda the Sea Team**

- Software Engineer × 5명

---

## 🙏 감사의 말

이 프로젝트는 해커톤을 위해 개발되었습니다.
Serverless 개발을 더욱 투명하고 이해하기 쉽게 만드는 것을 목표로 합니다.

---

<div align="center">

**Made with ❤️ and 🌊**

</div>
