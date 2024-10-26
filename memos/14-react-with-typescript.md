## React.js 및 TypeScript

### React + TypeScript 프로젝트 설정하기
- 리액트 앱에서 TS를 사용하려면 프로젝트 설정이 까다로울 수 있음
  - .jsx의 리액트 코드를 처리, 컴파일, 최적화 및 TS를 JS로 컴파일 가능해야 함
  - 이러한 작업을 직접 설정하기는 까다로움
- 그런데 create-react-app, vite 등을 사용하면 쉽게 시작할 수 있음
  - [Create React App 공식 문서 - Adding TypeScript](https://create-react-app.dev/docs/adding-typescript/)
  - Vite를 사용할 경우 `npm create vite@latest [프로젝트 명] -- --template react-ts`
    - [Vite 공식 문서](https://ko.vitejs.dev/guide/#scaffolding-your-first-vite-project)
    - [Vite - create-vite - README.md](https://github.com/vitejs/vite/tree/main/packages/create-vite#readme)
    - [기타 블로그 - \[React, ts, vite\] react + typescript + vite로 시작해보기](https://velog.io/@zzangsubin/vitetyscriptreact)
  - cf. 강의와는 다르게 create-react-app 대신 Vite를 사용함
- 생성된 프로젝트에서 불필요한 코드 및 파일 제거

### React와 TypeScript는 어떻게 함께 작동하는가
- TypeScript 및 JSX를 JavaScript로 컴파일하여 리액트 앱을 빌드
- node_modules/@types의 react, react-dom에서 React의 기본적인 타입을 확인할 수 있음
- const App: React.FC = ...에서 FC?
  - FunctionComponent의 alias
  - React에서 functional component의 역할을 정의
    - cf. 클래스 기반 컴포넌트 타입은 ClassicComponent
  - 리액트 요소를 반환하는 함수가 아닌 함수를 할당하면 컴파일 오류 발생 → React에서도 타입 안정성 제공

### Props으로 작업하기 & Props의 타입
- React를 TS로 개발할 경우 하위 컴포넌트가 받는 props의 타입을 명시해야함
  - React.FC<...>과 같이 generic type 활용
  - 상위 컴포넌트에서 props 이름을 잘못 지정하는 경우 방지

### "ref"로 사용자 입력 받기
- useRef()는 generic function
  - ref에 저장될 데이터의 타입을 지정해야 함
    - ex. useRef<HTMLInputElement>()
  - 또한 컴파일 오류가 발생하지 않으려면 initialValue로 (null이라도) 넣어두어야 함
  - cf. React의 ref는 항상 current를 이용하여 접근
  - useRef<...>(null)처럼 initialValue로 null을 넘긴 경우
    - ref.current가 null일 수 있다는 오류가 발생함
    - 렌더링이 된 후에 호출되는 것이 확실하다면 ref.current!.value처럼 !을 붙여 오류를 억제

### 컴포넌트 간\(Cross-Component\) 커뮤니케이션
- props로 함수를 넘겨서 컴포넌트 간 통신하도록 하기
  - 이 때도 역시 FC의 generic type을 명시해서 props의 타입을 정해줘야 함
  - 마찬가지로 interface 혹은 type 등 여러 방법으로 타입을 지정해줄 수 있음

### 상태 및 타입 작업하기 + 더 나은 상태 관리하기 + 더 많은 Props 및 상태 작업
- useState hook을 사용할 때 TS에 어떤 state인지 명시해줘야 함
  - useState의 generic으로 state의 type을 명시
    - 단순하게 literal type을 넘길 수도 있고, 따로 xxx.model.ts 파일에 interface type을 작성해서 사용할 수도 있음  
  - generic 없이 useState([])만 있으면 빈 배열인 있는 state가 됨
- useState()로 받아온 상태 업데이트 함수 setXxx를 사용할 때 유의할 점
  - useState로 받아온 state xxx를 state 업데이트할 때 직접 사용하지 말 것
    - 이론상 React 상태 업데이트 일정이 변하므로 업데이트가 수행됐을 때 xxx가 최신임을 보장하지 못함
    - 최신 state인 xxx를 보장하려면 상태 업데이트 함수에 함수를 전달하는 방식으로 사용
  - ex. setTodos(\[...todos, { id: ..., text: ... }\]) 이런 방식이 아니라
    - setTodos(prevTodos => \[...prevTodos, { id: ..., text: ... }\]) 이런 방식이 안전
- props로 state를 filter하는 함수를 넘겨서 삭제 구현
  - 유의할 점은 onClick은 MouseEventHandler<T> type이고
    - cf. 앞선 todoAddHandler() 작업과 다른 부분
  - 이 type이 되기 위해서 bind()를 적절히 사용해주거나, 넘겨받은 함수를 실행하기 위한 방법을 적절히 구현해줘야 함
