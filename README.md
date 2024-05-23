# 타입스크립트 예제
- [TS Docs](https://www.typescriptlang.org/docs/)

## TypeScript 설치 및 사용
- nvm-windows 설치 및 Node.js 버전 관리
  - npm은 이미 설치되어있는 상태여야 함
  - 참고 [\[NODE\] 📚 NVM 모듈 사용법 - 노드 버전 스위칭](https://inpa.tistory.com/entry/NODE-%F0%9F%93%9A-NVM-%EB%AA%A8%EB%93%88-%EC%82%AC%EC%9A%A9%EB%B2%95-%EB%85%B8%EB%93%9C-%EB%B2%84%EC%A0%84-%EA%B4%80%EB%A6%AC)
- (TypeScript 설치) npm install -g typescript
  - (확인) tsc --version
  - (컴파일러 사용법) tsc [경로+ts 파일명] → 확장자를 제외한 동일한 파일이름을 가진 js 파일 생성
- VSCode 확장
  - ESLint, Prettier - Code formatter, Path Intellisense, Material Icon Theme
- (npm lite-server 설치) 편의 기능 제공 개발 서버(개발 환경에서 새로 컴파일 시 자동 새로고침)
  - npm init
    - package name, version, description, entry point(기본 app.js), test command, git repository, keywords, author, license 등 설정
    - 기본값 그대로 사용할 경우 그냥 Enter 계속 누르면 됨
    - package.json 생성됨
  - npm install --save-dev lite-server
    - --save-dev 개발 환경 전용 의존성 표시
  - package.json scripts 부분에 "start": "lite-server" 추가
    - 추후 package.json으로 구성된 라이브러리를 node_modules 디렉토리 및 하위 파일이 없는 상태로 다시 불러와서 사용하고 싶다면 다시 npm install
  - npm start 입력 시 lite-server가 index.html 파일의 서버로 동작함(기본 포트 3000)

## TypeScript의 type
- [TS 공식 handook - Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### TS type vs. JS type
- typeof 연산자: typeof는 JS에도 존재
  - 오히려 input을 확인하기 위해 JS에서 활용도가 더 높을 수도 있음
  - runtime에 typeof로 type을 확인해야하는 JS와 달리 TS에서는 compile time에 type 확인 가능
- JS는 dynamically-typed, TS는 statically-typed
  - static types는 개발 시 변수와 매개변수의 type 정의가 끝, runtime에 type이 변경되지 않음
  - cf. 물론 TS가 JS로 컴파일되므로 컴파일 오류를 무시하고 런타임에 억지로 사용할 수는 있음

### JS, TS 공통 기본 type들
- number → 다른 언어처럼 integer, float과= 구분은 없음, 모두 기본적으로 float
- string → literal를 위한 세 가지 방식 존재, '..', "..", `..`, backtick은 template literal을 위한 것
- boolean → true/false - truthy, falsy가 아님에 유의
- object → 아래에서 볼 것
- Array → statically-typed인 JS와 달리 TS에서 어떤 변수를 특정 type의 배열로 선언했다면, 그 배열의 원소는 해당 type이어야만 함
- undefined → TS function과 type 부분에서 볼 것

### TS만의 type
- 커스텀 object의 type → 아래에서 볼 것
- tuple → fixed-length array라고 생각하면 될 것
  - (선언 시 형태 예시) role: [number, string]
    - 무엇을 tuple type으로 사용하기 위해서는 type 추론을 사용할 순 없고, Array 형태에 type을 명시해줘야 함
  - Tuple로 선언된 변수에 대해 초기화, 재할당 시에는 원소 개수도 체크해줌
    - 하지만  push()를 막아내진 못한다는 한계가 있음, 
- enum → 애플리케이션 전역 상수이며 숫자로 표현하지만, 읽을 때는 사람이 읽을 수 있는 레이블을 사용하는 것
  - (선언 시 형태 예시) enum Role { ADMIN, READ_ONLY, AUTHOR };
    - 커스텀 타입이므로 대문자로 시작, ':'나 '='를 사용하지 않음, 요소들은 관례적으로 모두 대문자로 표시
    - 사용 시에는 Role.ADMIN 과 같은 방식으로 사용
  - JS로 컴파일 시 property를 가진 function과 object인 var로 바뀜
  - 0이 아닌 숫자부터 시작하고 싶을 경우, 임의의 숫자 할당 가능, 문자열을 할당할 수도 있음
- any → 타입을 할당하지 않고, 어떤 값이든 할당 가능
  -  TS 컴파일러가 체크하지 못하게 하기에, JS와 다를 바 없어지므로 사용 자제
- void → 아래에서 볼 것
- unknown → 어떤 값이든 저장할 수 있지만, typecheck를 하긴 함
  - if 조건식에서 typeof 연산자 등으로 type을 확인했다면 블럭 내에서는 해당 type처럼 사용 가능
  - 아예 type check를 하지 않는 any보다는 낫지만 그래도 사용을 자제
- never → throw로 오류 관련 객체를 던지는 function의 return type은 never
  - return type 추론은 void로 보이지만 실제로는 never라고 볼 수 있고, never로 명시해도 컴파일 통과하며 의도도 명확함
  - throw하기만 하는 function은 script를 중단시키고, 아무것도 return 할 수 없으므로 never type인 것

#### TS만의 type과 관련된 기능
- union type → 애플리케이션에서 함수의 매개변수나 상수 혹은 변수가 다른 종류의 값을 받도록 할 때 사용
  - (선언 시 형태 예시) input: number | string | boolean
  - 컴파일러가 서로 다른 type 간 연산하는 것으로 판단하여 컴파일 에러를 띄우는 경우
    - typeof 연산자 등 코드를 이용해 런타임 type 체크 필요
- literal type → (기초적인 type에 기반하지만) 정확히 어떤 값이어야 하는지로 정의됨
  - (1) const는 자동으로 literal type으로 추론됨 (2) 함수 parameter에 특정 값을 명시하면 literal type으로 받아들임
  - union type과 함께 사용하여 enum 대용으로 사용 가능
  - 해당 literal type이 아닌 다른 값이 들어오면 컴파일 오류을 발생시킴
- type alias(타입 별칭)
  - 선언 시 형태 예시
    - type Combinable = number | string; → union type에 alias을 붙인 경우
    - type ConversionDescriptor = "as-number" | "as-text"; → literal type의 union type에 alias를 붙인 경우
    - type User = { name: string; age: number }; → object의 type에 alias를 붙인 경우
  - 재사용 가능한 type을 만들어냄

### TS의 variable, parameter의 type 명시
- variable, parameter 선언 시 identifier 뒤에 \[:타입명\]을 붙여줘 type을 명시
  - JS에는 없는 TS의 구문
- variable 선언 + 초기화 시에는 type 추론을 하므로, 굳이 type을 명시할 필요는 없음
  - 선언과 동시에 초기화하지 않을 경우에는 type 명시가 의미 있을 수 있음
- cf. TS에서 기본적으로 갖고 있는 type은 모두 소문자로 표시, 커스텀 타입은 대문자로 시작
  - 이에 따라 문자열은 string으로 모두 소문자
  
### object의 type
- (비교) JS object의 모양 ex.  {name: "Kim", age: 30} → 중괄호 안에 key-value pair, ','으로 구분
- object의 type의 형태는 JS object의 형태와 유사
  - 하지만 key-value pair가 있는 게 아니라 key-type pair를 가지며, ','이 아니라 ';'로 구분됨
- 객체의 구조 정보까지 제공하기 위해서는 특정 변수 등을 user: object처럼 generic object type을 줘선 안 되고
  - TS가 구체적인 object의 type을 추론하도록 두거나,
  - 객체 type 선언 시 key-type pair를 제공하여 구체적인 object의 type을 명시
- TS의 type alias 기능을 이용하여 재사용 가능하며 관리할 수 있는 type을 이용 가능

### TS function과 type
- return type
  - TS 컴파일러에 의해 추론됨 - Kotlin과 다르게 명시 필요 없음에 유의
    - 명시할 수도 있음, 하지만 특별한 이유가 없다면 추론하도록 두는 편이 좋음
    - (return type을 명시한 예시) function add(n1: number, n2: number): number { .. }
  - (void type) function에 return statement(반환 구문)이 없음을 나타냄
    - JS에는 없는 type
    - JS에서 return statement가 없는 function의 return value를 console.log()로 확인하려 하면 undefined 출력
      - cf. JS의 unddefined는 존재하지 않는 property나 object에 접근하려 할 때 나타나는 real value
      - cf. TS에서도 undefined를 type으로 사용 가능
        - 하지만 return statement가 없는 function의 return type을 undefined로 명시하려 하면 컴파일 에러(void로 명시는 가능)
        - TS와 JS는 function을 보는 관점이 다름을 알 수 있음
        - function의 return type을 undefined로 명시하고, return statement는 return;으로 두면 컴파일 에러 발생하지 않음
        - return type을 void로 명시하고, return statement는 return;으로 두는 것도 가능
        - 하지만 의미를 보았을 때 return statement가 return;인 경우 return type이 void인 것이 더 적절할 것
- function type
  - (선언 시 형태 예시)
    - (1) let combineValues: Function;
    - (2) let combineValues: (number, number) => number; → parameter의 개수, type, return type까지 명시 가능
  - 어떤 변수에 function을 할당하면 parameter의 개수, parameter의 type, return type까지 추론됨
  - parameter의 개수, parameter의 type, return type 명시가 필요한 경우
    - (1) 어떤 변수를 선언만 하고 초기화하지 않는 경우
    - (2) 어떤 function의 parameter로 callback function을 받는 경우 callback에 대해 명시
      - callback에 대해서도 컴파일 오류 체크 가능
      - cf. callback의 parameter에 대해서는 엄격하지만, return type에 대해서는 엄격하지 않음
        - ex. callback의 return type에 void를 명시해도 return value가 있는 function을 넘기는 것은 가능 ← 해당 callback의 결과를 사용하지 않으므로 문제가 없기 때문

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

## JavaScript의 변화와 TypeScript
- cf. (ECMAScript compatibility table)[https://compat-table.github.io/compat-table/es6/]
  - JS의 어떤 기능을 사용할 수 있는지, 무엇을 컴파일할 수 있는지, 어떤 target을 설정해야하는지 확인할 수 있는 표
  - 통상 next-gen JavaScript라 하면 ES6(ECMAScript 2015) 이후를 지칭함

- [let](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/let), [const](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/const)
  - (let) let keyword로 정의된 variable은 변경 가능(재할당 가능)
    - cf. var keyword는 사용 x(variable의 block scope 유무의 차이)
      - .ts 파일에서 var keyword variable로 block scope를 넘어서 사용하려 하면 컴파일러가 오류를 보여주긴 하지만 let을 쓰는 편이 나음
  - (const) const keyword로 정의된 variable은 변경 불가(재할당 불가)
    - cf. const인 variable에 어떤 값을 재할당 시도 시 VSCode에서 확인할 수 있는 오류는 TS compiler에 의한 것
      - JS의 경우 코드 실행 시 브라우저에서 오류가 발생

- [arrow function](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions/Arrow_functions): function keyword 없이 함수를 작성하는 방법
  - variable에 function keyword를 이용한 anonymous function을 할당할 때보다 코드가 간결해짐
  - function body에 expression 하나만 있는 경우 중괄호 생략 가능, return 생략, 표현식의 결과가 return
    - ex. const add = (a: number, b: number) => a + b;
  - argument가 하나인 경우 소괄호 생략 가능
    - 다만 TS에서는 function type 명시 때문에 조금 더 길어질 수도 있음
      - ex. const printOutput: (output: number | string) => void = output => console.log(output);
    - callback으로 arrow function을 넘기는 상황 등, function type을 추론할 수 있다면 간결하게 작성 가능

- [default function parameters](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions/Default_parameters)
  - function parameter에 기본값 설정 가능
    - ex. const add = (a: number, b: number = 0) => a + b;
  - default function parameters를 사용하려면 parameter 목록의 마지막에 있어야 함
    - 호출 시의 argument 순서 때문

- [spread operator 전개 구문](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
  - array literal에서 array의 element들을 쉼표로 구분된 값들처럼 사용
    - ex1. activeHobbies.push(...hobbies);
    - ex2. activeHobbies = ["Hiking", ...hobbies];
  - object literal에서 object의 property들\(key-value pairs\)을 새로운 object로 복사할 때 사용
    - ex1. const person = { name: "Kim", age: 30 }; const copiedPerson = { ...person };

- [rest parameters 나머지 구문](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions/rest_parameters)
  - cf. spread operator와 모양은 갖고 역할은 반대인 느낌
  - 정해지지 않은 수의 parameter를 array(tuple도 가능) 형태로 받아 하나의 identifier로 다룰 수 있음
    - ex1. const add = (...numbers: number\[\]) => numbers.reduce((currentResult, currentNumber) => currentResult + currentNumber, 0);
    - ex2. (tuple인 경우) const add = (...numbers: \[number, number, number\]) => numbers\[0\] + numbers\[1\] + numbers\[2\];

- [destructuring](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
  - array 혹은 object의 각 요소들을 destructure하여 각 값을 개별 변수에 담음
  - ex. (array의 경우) const \[hobby1, hobby2, ...remainingHobbies\] = hobbies; → cf. ...remainingHobbies에는 rest parameter가 적용된 것
    - array의 경우 순서대로 꺼내짐
  - ex. (object의 경우) const { nickname: userName, age } = person;
    - object의 경우 key의 이름에 따라 꺼내짐
    - object의 property 이름(key)과 다른 identifier를 사용하고 싶다면, 위처럼 nickname: userName과 같은 방식으로 덮어쓰기 가능
      - 이 때 key 이름은 사용할 수 없고, 덮어쓴 이름만 사용 가능
      - ':' 가 type 할당에 사용된 것이 아님에 유의 

- TypeScript와의 연관성
  - 위에서 살펴본 모던 JS의 문법들을 .ts에서 사용하고,
    - tsconfig.json에서 target을 es6 이상으로 설정할 경우, .js로 컴파일된 코드에서 그대로 확인 가능
    - tsconfig.json에서 target을 es5로 설정한다면, .js로 컴파일된 코드에서 위 모던 JS 문법 대신 예전 문법을 사용하도록 컴파일됨을 확인 가능

## class & interface
### OOP, class, instance
- Object-oriented Programming: object를 이용해 코드를 쉽게 이해하고 사용할 수 있도록 하는 것
  - object는 data와 method를 가짐
    - object를 이용해 연관 있는 data들을 그룹화  
    - app의 논리적 요소를 분할: (object가 없다면 더 혼재되어 있을) 코드를 논리에 따른 조각으로 분리 
  - 각 object가 자신이 가진 data와 method를 이용해 자신의 역할을 수행하도록 함
- class, instance
  - object는 app의 로직을 분할해서 관리할 때, data를 저장하고 method를 실행하는 데 사용하는 data structure
  - class에 object가 어떤 data를 저장하고 어떤 method를 가지는지 사전에 정의해둔 data(object의 blueprint)
    - class 기반으로 object를 생성했을 경우, 그 object는 해당 class의 instance라 함
    - object literal을 이용하는 경우와 비교했을 때, class를 이용할 경우 동일한 구조(property, method)에 data만 다른 object를 생성하기에 편리

### class
#### class 작성 방법
- defining a field(cf. field 구문은 ES6에서는 지원되지 않음)
  - ex. name: string; → JS의 object literal처럼 key-value pair가 아니라 key 이름만 정의한 것, let keyword를 붙이지 않음
  - field 구문을 사용하는 대신 constructor에서 parameter properties를 이용해 property를 바로 선언할 수 있음
    - 아래 visibility modifier 중 constructor의 parameter에 명시한 access modifier 부분 참고
- defining a constructor(cf. constructor는 object가 생성될 때 실행되는 특수한 함수, 객체의 초기화 작업 로직, 메서드라 할 수는 없고 utility function 정도로 볼 것)
  - ex. constructor(name: string) { this.name = name; }
  - constructor에서 parameter properties를 이용해 property를 바로 선언할 수 있음
    - 아래 visibility modifier 중 constructor의 parameter에 명시한 access modifier 부분 참고
- defining a method
  - class 내부에서 class property 혹은 method를 지칭하려면 this keyword를 사용
    - this keyword는 해당 class로 생성된 instance를 가리키며, '.'(dot notation)을 이용해 property와 method에 접근
    - 특히 method의 parameter로 this를 명시하여, this가 무엇을 지칭해야하는지 명확하게 할 수 있음
  - ex. describe(this: Department) { console.log("Department: " + this.name); }
    - cf. this.name이 아닌 name으로 작성할 경우 method block 안의 name이라는 local variable을 찾으려 하거나 class 외부의 global variable name을 사용함에 유의
    - this: Department는 무엇을 지칭해야하는지 명확하게 하기 위한 것
      - 명시할 경우 type 안전성을 지키기 좋음, 명시하지 않아도 동작하지만 부적절한 사용을 막으려면 명시하는 것이 바람직
  - cf. prototype
    - prototype은 JS를 공부할 때 살펴볼만한 주제 - TS는 직접 class를 사용하면 되므로 prototype을 직접 사용할 일이 없음
    - TypeScript에서 class를 정의하고 ES5 target으로 컴파일 해보면
      - TypeScript class에 정의된 method는 constructor function의 prototype 안에 정의되는 것을 확인해볼 수 있음
- 작성된 class 기반으로 instance를 생성하기
  - new \[class의 identifier\](\[class의 construct를 호출하기 위한 arguments 목록\])
#### cf. this keyword 사용 시 유의사항
- JS 및 TS에서 this를 사용할 때는 this가 무엇을 지칭하는지 잘 생각해봐야 함
- 적절하지 않은 방식으로 this가 사용되도록 놔둘 경우, 각 객체에서 정의되지 않은 property 등에 접근을 시도하여 undefined 같은 결과가 발생
#### cf. JavaScript의 class는 특별한 function - 참고 [모던 JavaScript 튜토리얼→코어 자바스크립트→클래스](https://ko.javascript.info/class#ref-805)
- target을 ES5로 컴파일하고 결과를 확인해보면 class 전체가 JS의 constructor function 형태가 됨
  - constructor function은 예전 JS에서 object의 blueprint를 작성하는 방법 - class가 없었던 예전 JS에도 blueprint 작성 방법은 있었다!
  - constructor function은 class와 비슷하게 new keyword를 이용해 호출할 수 있는 함수
  - property도 this를 이용해 적절하게 만들어줌
- 사실은 class 역시 JS의 특별한 function이라 할 수 있음
#### visibility modifier, readonly modifier + parameter property
- [visibility modifier](https://www.typescriptlang.org/docs/handbook/2/classes.html#member-visibility)
  - cf. TS에서만 사용 가능
    - 예전 JS 뿐만 아니라 모던 JS에서도 이런 방식으로 access를 제한할 수 없었음
    - ES2019부터 # prefix를 이용한 방법이 등장 - [Private class fields](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Classes/Private_properties)
  - (visibility modifier의 종류) public, private, protected(→ inheritance의 override 부분 참고)
  - field에 명시한 visibility modifier
    - field identifier 앞에 private을 붙이면 class 외부에서 class의 member(property, method)에 직접 접근하는 것을 막을 수 있음
    - 명시하지 않을 경우 public modifier가 있는 것과 동일
  - constructor의 parameter에 명시한 visibility modifier → [parameter properties](https://www.typescriptlang.org/docs/handbook/2/classes.html#parameter-properties)
    - constructor의 parameter에 modifier가 있는 경우, 해당 modifier를 가진 동일한 이름의 property를 생성해 argument로 받은 값을 property에 저장
- [readonly modifier](https://www.typescriptlang.org/docs/handbook/2/classes.html#readonly)
  - cf. TS에서만 사용 가능
  - readonly가 붙은 property는 초기화된 후 수정할 수 없음
#### accessor(getter, setter)
- [공식 문서](https://www.typescriptlang.org/docs/handbook/2/classes.html#getters--setters)
- 사용 방법
  - (getter) get \[사용할 property 이름\]\(\) { \[내부 로직\] }
  - (setter) set \[사용할 property 이름\]\(\[호출 시 받아올 data\]\) { \[내부 로직\] }
- field는 private으로 숨기고, 이 field에 필요한 작업을 위해 accessors 사용
  - 작성 시에는 함수, 메서드처럼 작성되지만, 호출 시에는 property처럼 사용 가능
  - cf. getter, setter 구현에서 필요한 특별한 logic이 없다면, 그냥 public field를 사용하는 편이 나음
#### static member(static method, static property)
- cf. ES6 이후 추가 기능
- (작성 방법) method, property 선언 시 앞에 static keyword 추가
- instance를 통해 접근하지 않더라도 사용할 수 있는 property, method
  - 주로 class에서 사용할 utility function, class에 저장할 global constant를 관리하기 위해 사용
  - property와 method를 묶는 namespace처럼 기능함 ex. Math.PI, Math.pow()
- JS, TS에서 static member에 대해 instance를 통한 접근은 불가능 - 항상 class 이름을 통해 접근해야 함
  - 당연히 this를 이용한 접근 역시 불가능 cf. static member끼리는 this를 이용한 접근 가능
#### inheritance
- (사용 방법) class 정의 시 → class [상속 class 이름] extends [피상속 class 이름]
  - JS에서도 다중 상속 불가
  - constructor
    - constructor를 명시하지 않을 경우, 상위 class의 constructor(의 로직) 상속
    - 하위 class에서 constructor를 명시할 경우, constructor는 상속하지 않으며, 명시한 constructor에서 super 사용 필요
    - constructor에서 this를 이용한 property 작업은 super를 호출한 뒤 진행되어야 함(어떤 로직을 먼저 진행할 것인지 생각해보면 당연)
    - singleton pattern
      - 한 class의 instance를 1개만 생성 → 평범한 경우라면 static member를 이용할 수도 있지만, static을 사용할 수 없거나, 사용하고 싶지 않을 때 활용
      - (작성 방법) constructor에 private modifier 적용, instance를 저장할 static private field 선언, instance를 가져올 수 있는 static method 정의
  - override
    - 상위 class의 property와 method를 override 가능
    - 하위 class에서 property에 접근하기 위해서는 property가 private이 아니라 **protected**여야 함
  - abstract class
    - 특정 class를 상속할 때, 특정 method를 구현하도록 강제
      - 상속 class에서 특정 method를 구현할 필요가 있으면서, 다르게 구현해야할 필요성이 있는 경우
    - class에 method 구조만 정의하고, body는 정의하지 않는 것
    - abstract class의 instance를 바로 생성할 수는 없음
    - 작성 방법
      - class 앞에 abstract keyword 붙임
      - 구현을 강제하고 싶은 method identifier 앞에 abstract keyword를 붙임 + return type 명시
