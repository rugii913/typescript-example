# 타입스크립트 공부 메모
- [공식 문서 - TS Docs](https://www.typescriptlang.org/docs/)
- Udemy의 "Typescript:기초부터 실전형 프로젝트까지 with React + NodeJS" 강의 메모

## TypeScript 설치 및 사용
- [TypeScript 설치 및 사용 메모](memos/01-installing-typescript.md)
  - nvm-windows 설치 및 Node.js 버전 관리
  - TypeScript 설치 npm install -g typescript
  - 함께 사용할만한 VSCode 확장
  - npm init
  - npm lite-server 설치, package.json scriptps 수정

## TypeScript의 type
- [TypeScript의 type 메모](memos/02-types-of-typescript.md)
  - TS type vs. JS type
  - JS, TS 공통 기본 type들
  - TS만의 type → tuple, enum, any, void, unknown, never, ...
    - TS만의 type 관련 기능 → union type, literal type, type alias, ...
  - TS의 variable, parameter의 type 명시
  - object의 type
  - function과 type
- [TS 공식 handook - Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

## TypeScript의 compiler
- [TypeScript의 compiler 메모](memos/03-typescript-compiler.md)
  - tsc 명령어
  - tsconfig.json
    - tsconfig.json의 여러 옵션들
  - TypeScript 디버깅 → sourceMap

## JavaScript의 변화와 TypeScript
- [JavaScript의 변화와 TypeScript 메모](memos/04-modern-javascript-and-typescript.md)
  - let, const, arrow function, default function parameters, spread operator, rest parmeters, destructuring
  - JS의 변화와 TS의 관계 → tsconfig.json의 target
- (cf.) [ECMAScript compatibility table](https://compat-table.github.io/compat-table/es6/)

## class & interface
- [class & interface 메모](memos/05-class-and-interface.md)
  - OOP, class, instance 개념
  - class
    - class 작성 방법
    - this keyword 사용 시 유의 사항
    - visibility modifier, readonly modifier, parameter property
    - accessor(getter, setter)
    - static member(static method, static property)
    - inheritance
  - interface
    - interface와 object
    - interface와 type alias 비교
    - interface 관련 구문 → modifier, extend, function type, optional

## more on types
- [more on types 메모](memos/06-more-on-types.md)
  - intersection type
  - type guard
  - type casting
  - index signature
  - function overload
  - optional chaining, nullish coalescing
- [TypeScript의 TypeManipulation 공식 문서](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

## generics
- [generics 메모](memos/07-generics.md)
  - generic function
  - constraint
  - keyof constraint
  - generic class
  - utility type
  - generic type vs. union type
- [공식 문서 handbook](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- (cf.) [JavaScript의 Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

## decorators
- [decorators 관련 메모](memos/08-decorators.md)
  - decorator, meta-programming 개념
  - decorator 작성 및 사용
    - 직접 decorator function 정의
    - decorator factory 정의
    - 실행 순서 관련 유의 사항
    - decorator 적용 대상
  - decorator를 활용하는 라이브러리, 프레임워크 예시
- [TS 공식문서 - decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)

## drag & drop 프로젝트 예제
- [drag & drop 프로젝트 예제 메모](memos/09-drag-and-drop-example.md)
  - <template>과 TS 클래스를 이용한 렌더링
  - decorator 활용
  - DOM의 input 제어
  - interface를 활용한 검증
  - 프로젝트를 나타내는 데이터 구조를 작성하고, 리스트로 렌더링하도록 전달
  - 프로젝트 전역 상태 관리 인스턴스를 이용한 상태 관리
  - type 안정성을 활용하기 위해 Project 타입(클래스), Listener 타입(custom type) 추가
  - enum 사용
  - DOM에 렌더링하는 class들이 공통으로 갖는 모든 기능을 관리할 base class와 이를 상속한 클래스 사용
  - getter 사용(JS 문법) → [모던 JavaScript 튜토리얼 - 프로퍼티 getter와 setter](https://ko.javascript.info/property-accessors)
  - 드래그 앤 드롭 이벤트로 화면만 조정하는 것을 넘어서 상태 조정하기
  - (cf.) 드래그 앤 드롭 관련 참고 [MDN - HTML Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)

## 모듈 및 네임스페이스
- [모듈 및 네임스페이스 메모](memos/10-module-and-namespace.md)
  - modular code를 작성하여 코드를 여러 개의 파일로 분할하여 관리하기
    - 여러 .ts 파일 작성 / namespace & file bundling(TS) / ES6의 import, export (ES6 모듈)
  - TS namespace & file bundling 사용해보기
  - ES6 모듈을 활용한 import, export 사용해보기
- 참고 자료
  - https://medium.com/computed-comparisons/commonjs-vs-amd-vs-requirejs-vs-es6-modules-2e814b114a0b
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules

## TypeScript와 함께 Webpack 사용하기(A Modern Build Workflow)
- [TypeScript와 함께 Webpack 사용하기(A Modern Build Workflow) 메모](memos/11-typescript-with-webpack.md)
  - Webpack의 필요성
  - Webpack 설치, 중요 종속성 → webpack, webpack-cli, webpack-dev-server, typescript, ts-loader
  - 입출력 구성 추가
    - tsconfig.json 구성
    - webpack.config.js 구성
  - ts-loader 패키지로 TypeScript 지원 추가
    - webpack.config.js 구성
    - Webpack 사용하여 빌드하기
  - webpack-dev-server 추가, 개발 시 빌드 설정, Webpack config 조정
  - dev, production 빌드 분리 → production 코드를 위한 webpack 워크플로 추가

## TypeScript와 서드파티 라이브러리
- [TypeScript와 서드파티 라이브러리 메모](memos/12-third-party-library.md)
  - TypeScript에서 JavaScript 라이브러리 사용하기 + 최후의 수단으로 "declare" 사용
    - 순수 JS 라이브러리를 사용할 때 발생하는 문제와 해결 방법
  - TypeScript 전용 라이브러리
    - ex. class-transformer, class-validator

## 장소 선택 및 공유 앱 예제 - TypeScript 사용 시 third party library 활용하기 실습
- [장소 선택 및 공유 앱 예제 메모](memos/13-searching-places-example.md)
  - 여러 종류의 third party library 사용해보기
    - Google Geocoding API, Google Maps JavaScript API, Google API 키 설정
      - npm에 있는 라이브러리가 아니더라도 적절한 type 패키지 활용 가능
    - Axios
    - dotenv
  - TypeScript를 사용하는 프로젝트에서 Google 지도로 지도 렌더링하기

## React.js 및 TypeScript

### React + TypeScript 프로젝트 설정하기
