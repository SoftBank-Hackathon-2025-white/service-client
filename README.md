# REACT Frontend 코드 저장소

> 해당 코드 베이스는 특정 규칙을 따릅니다. 참고하여 개발하시길 바랍니다.

## Component

- 공통 컴포넌트 만들 경우
  - `src/components/common`에 컴포넌트 추가
- 새로운 페이지를 만들 경우
  - `src/constants/paths.ts`에 PATH 추가
  - `main.tsx`에 routing 추가
  - `src/components/page`에 새로운 페이지에 대한 컴포넌트 추가
  - 부가적인 컴포넌트는 pages 폴더 밖에서 자유롭게 구조 선택

## State Management (zustand)

- stores의 형식을 보고 자유롭게 만들기 (immer를 쓸지 말지는 개발하는 사람 자유)

## Styling (styled-components)

- 전체적인 color셋은 `src/theme/theme.ts`에 존재
  - 사용방법: `color: ${(props) => props.theme.color.baseColor2};`
  - `src/theme/GlobalStyle.tsx`의 body > color 적용된 것을 참고
- 나머지는 알아서 진행

## API (axios & react-query)

- `src/api/_client.ts`에서 통합 client를 만들고 다른 곳에서 import하여 사용하는 방식입니다.
- react-query를 활용한 구조는 `src/api/example.ts`를 참고 바랍니다. (어느정도 익숙해졌다 싶으면 해당 파일은 삭제해도 좋습니다.)
- post, put, delete의 개념을 가진 useMutation은 제가 별로 사용하지 않아 axios로 그대로 호출 후, GET Query에 대해 InvalidQuery를 적용하는 편입니다. 허나 useMutation도 그대로 사용하신다면 그대로 사용하셔도 괜찮습니다.

---

## 기술 스택

- Node.js v24.11.1
- Base: React v19
- Bundler: Vite v7
- Language: TypeScript v5
- Styling: styled-components v6
- Status Management: zustand v5
- HTTP w/server: axios v1.13 + TanStack Query v5
- Package Manger: pnpm
- Code Rule & Formatting: Prettier, eslint
