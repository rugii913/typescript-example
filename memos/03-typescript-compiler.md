## TypeScript의 compiler

### tsc
- 명령어 확인
  - 터미널에 tsc 입력하면 TS compiler의 기본적인 명령어 확인 가능
  - (공식 문서 참고) https://www.typescriptlang.org/docs/handbook/compiler-options.html

- watch mode
  - TS가 파일을 감시하도록 하여, 파일이 변경될 때마다 다시 compile하게 함
  - (방법) tsc [파일명] --watch 혹은 -w

- 전체 프로젝트 컴파일
  - (방법) tsc --init으로 TS 프로젝트 초기화(tsconfig.json 생성됨)
    - 이후 tsconfig.json에 주석 처리되어 있는 설정들을 변경할 수 있음
    - tsconfig.json 파일이 있는 상태에서 터미널에 tsc를 입력하면 모든 .ts 파일을 컴파일함
    - 여기서도 tsc --watch 혹은 -w로 감시 모드 사용 가능

### tsconfig.json
- tsconfig.json
  - TS compiler에게 파일들을 컴파일하는 방법을 알려주는 파일
    - (공식 문서 참고) https://www.typescriptlang.org/docs/handbook/tsconfig-json.html
- tsconfig.json에서 컴파일 대상 파일 관리하기
  - exclude, include, files property를 사용
  
#### tsconfig.json의 여러 옵션들
- tsconfig.json으로 컴파일 방법을 제어하고 컴파일 중 여러 옵션들 설정 가능(compilerOptions property 관련)
- (target 옵션) 어떤 버전 target JS 코드로 컴파일할지
- (module 옵션) TS 모듈과 여러 파일들을 연결하는 방법과 관련
- (lib 옵션) TS 객체 및 기능 기본값 지정
  - (공식 문서 참고) https://www.typescriptlang.org/tsconfig/#lib
  - TS는 꼭 브라우저용 script가 아니라 Node.js 애플리케이션용 코드가 될 수도 있는데, document 같은 것들이 있는 것을 어떻게 아는가?
  - 설정되지 않은 경우 target 옵션에 따라 lib 옵션이 달라짐, 예를 들어 target이 es6일 경우 기본적으로 DOM API 등을 포함시킴
  - lib 옵션을 명시할 경우, 미리 정의된 식별자를 자동 완성 기능의 도움을 받아서 찾아볼 수도 있음
    - ex. "lib": ["dom", "es6", "dom.iterable", "scripthost"] → target을 es6로 하고, lib 옵션을 명시하지 않을 경우 기본으로 설정될 핵심 library들
- (allowJS 옵션) JS 파일도 컴파일
- (checkJS 옵션) JS 파일을 컴파일 하지는 않지만, 구문 검사 및 잠재적 오류 보고
- (declaration 옵션) 라이브러리 배포 시 사용하는 manifest 파일인 .d.ts 파일(프로젝트에 포함된 모든 타입 설명) 관련
- (sourceMap 옵션) 디버깅 시 유용
  - 기본적으로 개발자 도구에서 Sources 탭을 확인하면 컴파일된 JS 파일만 확인 가능
  - "sourceMap": true로 설정 시 .js.map 파일이 함께 만들어짐 → Sources 탭에서 .ts 파일도 확인 가능, 중단점도 걸 수 있음
- (outDir 옵션) 컴파일러에 의해 생성된 파일을 저장하는 디렉토리 설정
- (rootDir 옵션) 컴파일러가 컴파일할 파일이 있는 디렉토리를 구체적으로 설정
  - "rootDir": "./src"를 명시하지 않아도 잘 동작하지만, 컴파일러가 다른 디렉토리를 찾지 않아도 되도록 만듦
  - 또한 명시하지 않을 경우, .ts 파일이 있는 가장 상위 경로를 기준으로 모든 구조를 복사하기 때문에 원하지 않는 결과가 나올 수 있음
- (removeComments 옵션) 컴파일 결과물 JS 파일 출력 시 주석은 제외 - 파일을 더 작게 만들 수 있음
- (noEmit 옵션) JS 파일을 생성하지 않음, 파일 검사, 오류 보고만 함
- (downlevelIteration 옵션) for loop 컴파일에서 문제 발생할 경우 사용
- (noEmitOnError 옵션) 기본값 false - true로 설정할 경우 컴파일 오류가 있으면 결과물 파일을 생성하지 않음
- (strict 옵션) true로 설정 시 다른 세부 옵션을 모두 true로 설정한 것과 같음, 이를 true로 두고, 다른 옵션은 false로 설정하여 각 세부 옵션 덮어쓰기 가능
  - (noImplicitAny 옵션) 암시적으로 any type이 추론될 경우 오류 발생시키는 것 관련
  - (strictNullChecks 옵션) 잠재적으로 null이 될 수 있는 값에 대한 체크 관련
  - (strictFunctionTypes 옵션) function type, class, inheriance 체크 관련
  - (strictBindCallApply 옵션) bind(), call(), apply() 함수 호출 시 설정한 내용이 타당한지 체크 관련
  - (strictPropertyInitialization 옵션) 클래스로 작업하는 경우와 관련
  - (noImplicitThis) 모호한 this 키워드 사용 관련
  - (alwaysStrict) 생성되는 .js 파일이 항상 strict mode를 사용하도록 제어
  - (noUnusedLocals, noUnusedParameters, noImplicitReturns 옵션) 코드 품질 관련 type check
    - cf. noImplicitReturns 관련, 어떤 분기에서 return 값이 있는 경우 다른 모든 분기에서도 return이 있어야 함, 그런데 return;으로 끝내는 것은 막지 않음

### TypeScript Debugging
- VSCode로 프로젝트 디버깅하기
  - tsconfig.json에서 "sourceMap": true로 설정
    - .js.map 파일이 디버거에서 .js 파일과 .ts 파일 사이의 다리 역할을 함
  - VSCode 확장 JavaScript Debugger 준비
    - 설치 후 VSCode 상단 메뉴 중 실행 → 디버깅 시작을 처음 클릭한다면 디버깅 구성 설정
    - .vscode/launch.json에서 사용할 브라우저, url 등 설정
  - 다시 VSCode 상단 메뉴 중 실행 → 디버깅 시작을 클릭하면 중단점 활용 등 디버깅 가능
  - (VSCode 공식 문서 참고) https://code.visualstudio.com/docs/typescript/typescript-debugging
- 물론 브라우저의 개발자 도구 중 Souces 탭을 이용한 디버깅도 가능은 함
