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
- [type alias\(타입 별칭\)](https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html#reusable-types-type-aliases)
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
- 참고 자료
  - [MDN 클래스 문서](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
  - [TS 클래스 공식 문서](https://www.typescriptlang.org/docs/handbook/2/classes.html)
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
  - optional property, optional method, optional parameter
    - 아래 interface에서 관련 부분 참고

### interface
- TS에서만 지원(JS에서는 지원 x)
  - .ts를 .js로 컴파일해도 interface는 컴파일되지 않음 → runtime에는 interface를 전혀 확인할 수 없음
#### interface와 object
- interface는 object가 어떻게 구성되어야 할지 구조(structure)를 정의
  - custom type\(type alias\)처럼 사용, 하지만 blueprint로 사용하는 것은 아님
  - TS의 경우 property를 사용하므로, interface에서 data에 관련된 구조까지 정의할 수 있음
    - cf. property가 있는 구조는 정의할 수 있지만, property에 값을 할당할 수는 없음
- object의 구조가 interface의 구조와 일치하는지 type 체크 가능
  - 어떤 object가 특정 interface라는 type을 갖는 것으로 확인되면, 그 interface에 명시된 구조를 갖도록 compile time 중 강제함
#### interface와 type alias 비교
- [type alias](https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html#reusable-types-type-aliases)로 type의 구조\(cf. [object types](https://www.typescriptlang.org/docs/handbook/2/objects.html)\)를 만들 수도 있고, 재사용도 가능한데  왜 interface를 사용하는가?
  - [interface SomeType { .. }과 type SomeType = { .. }의 다른 점?](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces)
  - interface를 사용하면 object의 구조를 정의하고자 하는 의도 자체가 명확함
  - interface를 사용하여 class가 구현해야 하는 구조를 interface에 정의해둘 수 있음
    - 상속하는 class에 포함되어야 하는 기능의 구조를 정의할 수 있음
    - abstract class와 유사하지만 abstract class는 일부에 대한 구현을 강제한다는 느낌, interface는 구조(에 따라 객체가 외부에 드러내야할 기능)를 강제한다는 느낌
  - cf. 예전에는 TS에서 type alias(custom type)를 지금처럼 유연하게 사용할 수 없기도 했음
#### interface 관련 구문
- interface와 modifier
  - interface 내에 public, private keyword는 사용 불가
  - readonly keyword는 사용 가능
    - object가 초기화 된 후에는 해당 property를 수정할 수 없게 함(cf. type alias에서도 같은 방식 사용 가능)
- extending an interface
  - 한 interface가 다른 여러 interface들을 extend 가능
- function type으로서의 interface
  - TS에서 function도 object로 다뤄지므로 function type을 정의하는 데에 interface 사용 가능
  - (작성 방법) interface \[identifier\] { (\[type을 명시한 paramerter 목록\]): \[return type\]; }
    - interface 안에 anonymous function 하나만 정의한 형태로 보면 됨
    - 이런 경우에는 type alias를 사용하는 것이 나을 수도 있음
- optional property, optional method, optional parameter - class에서의 optional property, optional method, optional parameter와 같음
  - (작성 방법) interface 내에 property 혹은 method 선언 시 identifier 뒤에 ?를 붙임 ex. name?: string;
  - optional property, optional method는 제외한 object 존재 가능
    - 해당 interface를 구현할 때 optional property, optional method는 제외하고 구현 가능
    - interface에서는 optional인데, class에서는 optional이 아니도록 할 수도 있음
  - constructor, method의 parameter도 optional로 할 수 있음
    - 기본값이 undefined가 됨

## more on types
- [TypeScript의 TypeManipulation 공식 문서](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)
### intersection type
- 여러 type을 조합 → 여러 interface를 함께 구현하는 것과 유사
  - 실제로 어떤 interface를 두 type을 extend하게 하여 작성할 수도 있음
  - union type 간 intersection이라면 교차되는 type들에 공통적으로 있는 것이 intersection이 됨
  - object type 간 intersection이라면 각 객체의 속성을 모두 조합한 것이 intersection이 됨
- (방법) type \[정의할 type 이름\] = \[type 1\] & \[type 2\]

### type guard
- 어떤 type 혹은 object에 특정 property나 method가 존재하는지 object를 사용하기 전 확인하는 작업
  - union type의 유연성을 활용하면서도, runtime에 오류 없이 동작하게 할 수 있음
- type guard로 활용할 수 있는 구문
  - (1) typeof → JS 기능
    - (사용 방법) typeof \[확인할 object\] === \[확인할 type을 표시하는 문자열\]
    - (한계점) typeof를 활용한 type guard는 JS가 아는 type만 가능 → number, boolean, string, object 등 → custom type에 활용 불가
  - (2) in → JS 기능
    - (사용 방법) \[확인할 member를 표시하는 문자열\] in \[확인할 object\]
    - 문자열로 표시된 member가 해당 object에 있는지 체크
    - (한계점) 문자열을 기반으로 작업하므로 오타를 낼 수도 있음
  - (3) instanceof → JS 기능(constructor 함수로 생성된 객체인지 판단 가능)
    - (사용 방법) \[확인할 object\] instanceof \[class 이름\]
    - class의 instance인 경우 활용 가능
    - (한계점) interface의 경우 JS 코드로 컴파일 되지 않으므로, 런타임에 instanceof를 사용할 수 없음
  - (4) discriminated union → TS compiler 이용
    - (사용 방법) union에 속한 모든 객체에 추가로 공통 속성을 부여
      - 주로 kind, type 같은 이름으로 literal type을 부여
      - 사용하는 곳에서는 switch statement 사용 → literal type을 이용하여 안전하게 분기(literal type을 compiler가 인식하고 있음)
    - object와 union type을 대상으로 type guard를 구현할 때 사용 가능한 패턴
      - 관련성이 높거나 비슷해서 어떤 function에서 union type으로 받았으나,
        - interface들 혹은 object들이 각각 다른 property와 method를 갖고 있을 경우

### type casting
- 어떤 value가 어떤 type인지 TypeScript에게 알림
  - TypeScript가 어떤 type인지 정확하게 판단할 수 없는 경우 사용 ex. DOM 요소 선택하여 가져온 value
  - cf. 다른 언어에서처럼 type casting이 string → number 같은 식의 형 변환이라고 이해하면 안 됨
    - "어떤 value가 어떤 type인지 알리는 것"이라는 의미로 충분함
- 사용 방법
  - 한 프로젝트에서는 아래 둘 중 하나의 방식만 사용할 것을 권장
  - (1) <\[type casting할 type 이름\]>\[object 이름\]
  - (2) \[object 이름\] as \[type casting할 type 이름\]

### index signature
- [공식 문서 참고](https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures)
- object의 property의 type은 정해졌으나
  - property가 몇 개일지, property의 이름이 무엇인지 정해지지 않았을 때 사용
  - object가 더 유연한 property를 가질 수 있게 함
- 사용 방법
  - custom type, interface, class 등 선언 시 property 정의 위치에
    - \[\[적당한 이름\]: \[property 이름의 type\]\]: \[property value의 type\];
  - ex. interface ErrorContainer { \[prop: string\]: string; }

### function overload
- 넘겨지는 argument type 조합에 따른 function의 return type을 명시
  - TypeScript가 스스로 return type을 식별할 수 없을 때에 사용 가능
- (사용 방법) 이미 정의된 function 위에 parameter type에 따른 return type을 명시하는 signature 추가
  - 자세한 방법은 [공식 문서](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads) 참고
  - 되도록 매 signature 끝에 ";"를 붙여서 구분해줄 것

### optional chaining, nullish coalescing
#### optional chaining
- 정의 여부가 불확실한 것의 뒤에 "?"를 붙여, 정의된 경우에만 접근 시도
  - 실제로는 if를 통해 확인 후 접근하는 것과 같음
- TypeScript 3.7 이상에서만 사용 가능\([release note 참고](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html)\)
  - [jaeheon.kr 참고](https://jaeheon.kr/155)
  - cf. JavaScript에도 optional chaining이 있음
    - [MDN References](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
    - [모던 JavaScript 튜토리얼](https://ko.javascript.info/optional-chaining)
#### nullish coalescing
- falsy한 모든 것에 대해서 동작하지 않고, null과 undefined에 대해서만 fallback 값을 사용
- (사용 방법) \[평가 대상\] ?? \[fallback 값\]
  - cf. falsy인 모든 것에 대해서 동작하게 하려면 OR 연산자로 \[평가 대상\] || \[fallback 값\]처럼 사용
-  cf. JavaScript에도 nullish coalescing이 있음
  - [MDN References](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
  - [모던 JavaScript 튜토리얼](https://ko.javascript.info/nullish-coalescing-operator)

## generics
- [공식 문서 handbook](https://www.typescriptlang.org/docs/handbook/2/generics.html)
  - JS에는 없고 TS에만 존재
    - compile 이후에는 존재 x, compile 단계에서 유연성과 type 안정성 제공
  - 자세한 설명은 코드로 대체 generics.ts
- cf. JavaScript의 Promise - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
- generic function
- constraint
- keyof constraint
  - parameter의 값이 다른 type의 property의 이름이라는 것을 확실히 하도록 generic을 사용
  - 존재하지 않는 property에 접근하는 것을 방지함
- generic class
- [utility type](https://www.typescriptlang.org/docs/handbook/utility-types.html)
  - Partial type, Readonly 등 일부 상황에서 유용하게 사용할 수 있을 generic을 이용한 built-in type들
- generic type vs. union type 헷갈리지 말기

## decorators
- decorator란? 
  - decorator는 meta-programming에 유용하게 사용
  - [영문 위키 - Metaprogramming 문서](https://en.wikipedia.org/wiki/Metaprogramming)
    - 다른 program을 data처럼 다루는 것 → end user에게 전달되는 비즈니스 로직이라기보다는 개발자의 개발 편의를 위한 코드라고 생각하면 될 것
- [TS 공식문서 - decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)

### decorator 작성 및 사용
- **decorator는 target인 class가 인스턴스화될 때가 아니라 정의될 때 실행됨**에 유의

#### (작성 방법 1) 직접 decorator function 정의
- decorator로 사용할 function을 작성 → decorator는 결국 function임
  - 특정 방식으로 class, property 등에 추가할 수 있는 function일 뿐
  - decorator function이 class에 붙는 경우, target class의 생성자 함수를 받을 parameter가 반드시 있어야 함
- class 위에 @\[decorator\] 를 붙임
  - @는 TS가 인식할 수 있는 특수한 identifier
  - @ 뒤에는 반드시 function이 와야 함 → 그러면 지정된 함수가 decorator가 됨

#### (작성 방법 2) decorator factory 정의
- 필요한 로직을 실행할 function을 return value로 줄 decorator factory 역할 function 작성
  - argument를 넘겨서 사용하는 등 유연하게 사용 가능

#### 실행 순서 관련 유의 사항
- 여러 decorator가 한 target에 붙어 있는 경우 아래에 있는 decorator가 먼저 실행됨
  - cf. decorator factory를 사용하는 경우, decorator function 실행 코드가 아닌
    - decorator factory의 실행 순서는 평범한 코드의 순서와 마찬가지로 위에서 아래로 실행
    - decorator function의 생성 순서라고 생각하면 될 것

#### decorator 적용 대상
- class, property, accessor(접근자), parameter

### decorator를 활용하는 라이브러리, 프레임워크 예시
- typestack/class-validator 라이브러리
- Angular 프레임워크
- NestJS 프레임워크

### TODO - decorator 관련 메모 추후 보완 필요

## drag & drop 프로젝트 예제
- <template>과 TS 클래스를 이용한 렌더링
  - 사용자 입력 관련 렌더링 클래스
  - 리스트 렌더링 클래스
  - 리스트 내 프로젝트 단건 렌더링 클래스
- decorator 활용
- DOM의 input 제어
- interface를 활용한 검증
- 프로젝트를 나타내는 데이터 구조를 작성하고, 리스트로 렌더링하도록 전달
- 프로젝트 전역 상태 관리 인스턴스를 이용한 상태 관리
  - 다른 객체에서도 쉽게 사용할 수 있도록 전역으로 관리
  - 프로젝트 전체에서 하나만 존재하도록 싱글톤 패턴 사용
- type 안정성을 활용하기 위해 Project 타입(클래스), Listener 타입(custom type) 추가
- enum 사용
  - (cf.) TS에서 enum을 사용하는 것에 대해서 반대 의견이 있음
- DOM에 렌더링하는 class들이 공통으로 갖는 모든 기능을 관리할 base class와 이를 상속한 클래스 사용
  - generic을 사용하여 유연하게 상속할 수 있도록 함
  - base class는 abstract class로 둠 -직접 인스턴스화할 수 없도록 함
  - configure(), renderContent는 abstract method로 두어 재정의를 강제함
    - (cf.) TS에서 private abstract method는 불가능
- getter 사용(JS 문법)
  - [모던 JavaScript 튜토리얼 - 프로퍼티 getter와 setter](https://ko.javascript.info/property-accessors)
    - data property vs. accessor property
    - getter, setter는 accessor property에 해당
- 드래그 앤 드롭 이벤트로 화면만 조정하는 것을 넘어서 상태를 조정함
  - interface를 활용하여 드래그할 element(Draggable)와 드래그할 지점(DragTarget)을 구현하도록 함
    - 드래그할 element에는 HTML에서도 draggable="true"를 붙여줘야함에 유의
  - 항상 event listener에서는 this를 조심
  - drag event의 dataTransfer 프로퍼티를 활용
    - drag event에 데이터를 첨부하고, drop 시에 해당 데이터를 추출할 수 있음
  - drop이 발생할 때 Project 객체의 상태가 변경되도록 함
    - 전역 상태 관리 객체인 ProjectState에 대해서 작업
  - (cf.) 드래그 앤 드롭 관련 참고
    - [MDN - HTML Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)

## 모듈 및 네임스페이스
- modular code를 작성해서 코드를 여러 개의 파일로 분할하여 관리
  - 각 파일은 브라우저 혹은 서드파티 빌드 도구를 이용해 TS로 연결됨
- 여러 파일로 코드를 구성할 때의 방법들
  - (방법 1) 여러 개의 .ts 파일 작성
    - 소스 디렉토리의 모든 코드 파일을 컴파일하고, 컴파일된 각각의 .js 파일을 HTML로 가져옴
    - (단점) 규모가 큰 프로젝트에서는 매우 불리함
      - 모든 import를 수동으로 관리해야함 → 관리, 유지보수 시 오류 발생 가능성 높음
      - 특정 TS 기능 타입을 사용할 때 타입 지원도 불가능
        - a 파일에서 정의한 타입을 b 파일에서 사용해도 TS가 이 연결에 대해 알 수 없음
  - (방법 2) namespace & file bundling
    - namespace syntax 활용
      - 특수한 코드를 추가
      - namespace 아래에 코드를 그룹으로 묶고 종속성 있는 다른 파일 import
    - per-file or bundled compilation
      - tsconfig.json 설정을 통해 여러 파일을 하나의 파일로 bundling 하기 편리
    - ES6 모듈을 사용한 경우와 비교했을 때
      - 타입 안정성이 떨어지고
      - 파일 간 종속성을 명확하게 처리할 수 없음
  - (방법 3) ES6의 import/export (ES6 모듈)
    - TS와는 별개로 모던 JS에서 제공하는 솔루션 → 대규모 프로젝트에서는 JS에서도 같은 문제를 겪기 때문
    - ES6의 import/export syntax 사용
      - 여러 파일 사이의 종속성을 명시
      - 모던 브라우저가 이를 이해하고 종속된 파일을 자동으로 받아서 실행
    - 기본적으로 per-file compilation이며, HTML에서 \< script \> 를 이용해 적어도 하나의 파일은 가져와야 함
      - 종속성을 갖는 파일을 개별 요청으로 받아오기 때문에 HTTP 요청이 늘어난다는 단점
    - HTTP 요청을 줄이기 위해 Webpack 등 도구를 이용해 bundling 하는 경우도 많음

### namespace & file bundling
- namespace는 JS의 기능이 아닌 TS 기능
  - 대응되는 기능이 없으므로 JS로 컴파일 되지 않음
  - namespace를 구성하고 property가 보존되는 객체로 컴파일
- export와 import
  - export 키워드를 이용해 다른 파일에서도 사용할 수 있게 함
  - 다른 파일에서 import는 다음과 같은 형식의 특수 구문을 이용
    - /// < reference path="사용할 ts 파일명" />
  - 하지만 단순히 export와 import만으로는 불가능
    - 참조하려는 코드들이 동일한 namespace 안에 있어야 함
- file bundling
  - 코드들을 동일한 namespace에 두고, export와 import를 위한 특수 구문을 적절히 사용했다고 하더라도 여전히 문제는 남아있음
    - 위 과정은 type을 어디서 찾을지 TSC에 알려준 것일 뿐임
    - JS로 컴파일이 완료되면 연결이 끊어짐
  - tsconfig.json 파일에서 outFile을 명시
    - 참조한 내용을 컴파일할 때 여러 개의 JS 파일이 아니라 단일 JS 파일로 컴파일하도록 함
    - 이 때 여러 작업 파일을 하나로 번들링 처리하기 위해
      - tsconfig.json의 module을 commonjs가 아닌 amd로 설정
      - 이 부분은 역사적인 이유 혹은 개발 과정으로 인해 생긴 이슈, 자세한 내용은 다음의 강의 참고 자료 확인
        - [Medium - CommonJS vs AMD vs RequireJS vs ES6 Modules](https://medium.com/computed-comparisons/commonjs-vs-amd-vs-requirejs-vs-es6-modules-2e814b114a0b)
  - **TS 컴파일 안 되는 문제 관련**
    - 이 때 tsc 명령어로 TS 컴파일이 안 되는 문제 발생함, 오류 메시지는 아래와 같음
      - Cannot find module 'undici-types'. Did you mean to set the 'moduleResolution' option to 'nodenext', or to add aliases to the 'paths' option?
    - 이를 해결하기 위해 다음과 같은 글들을 참고했으나 해결되지 않음
      - https://www.inflearn.com/community/questions/1073374/tsc-%EB%AA%85%EB%A0%B9%EC%96%B4%EB%A5%BC-%EC%8B%A4%ED%96%89%ED%95%98%EB%A9%B4-cannot-find-module-undici-type-%EC%9D%B4%EB%9D%BC%EB%8A%94-%EC%98%A4%EB%A5%98%EA%B0%80-%EB%9C%B9%EB%8B%88%EB%8B%A4?srsltid=AfmBOorQp4HlpT4KEASJBpY7NfQ0xjKq0aVwuWMG4b2sKWAPmYDja58g
      - https://www.inflearn.com/community/questions/1053604/%EC%84%A4%EC%B9%98-%EC%98%A4%EB%A5%98-%ED%95%B4%EA%B2%B0%EC%B1%85%EC%9D%84-%EB%AA%A8%EB%A5%B4%EA%B2%A0%EC%8A%B5%EB%8B%88%EB%8B%A4-%EC%84%A4%EC%B9%98%EA%B4%80%EB%A0%A8-undici-types?focusComment=292567
      - https://github.com/pop-os/shell/issues/1664#issue-1954078073
      - https://velog.io/@jihwan1211/VSCode-Typescript-버전-변경하기
    - 문제의 원인으로 @types/node, undici 등을 의심했고 global 라이브러리를 변경해보았으나 해결되지 않았음
    - 결론적으로 오류 메시지에서 보여주는 해결책과 유사하게 tsconfig.json에서 다음을 추가하여 해결함
      - "moduleResolution": "node"
      - 값을 "nodenext"로 주어도 동작하는지, 이것이 무엇을 의미하는지에 대해서는 확인이 필요함
    - 문제가 발생하는 정확한 원인은 확인하지 못했음
      - undici 라이브러리의 문제인지?
      - 새로 출시된 typescript 5.7.0과 VSCode의 문제인지?
    - 이 외에도 node 버전과 npm 버전을 최신화하였는데, 이것이 문제 해결에 영향을 끼쳤는지에 대해서는 조사하지 않았음
      - node 버전은 20에서 22로 변경, npm은 10.8.2 사용
- **TS의 namespace를 이용한 방법의 단점**
  - 각 파일의 종속성을 모두 수동으로 추가해줘야 함
    - 즉 해당 파일에서 필요로 하는 다른 파일을 직접 reference로 명시해야 함
  - 그런데 문제는 reference를 명시하지 않아도 컴파일되는 경우가 있다는 것
    - 예를 들어 B 파일에서 A 파일을 reference로 가져오고 있고, C 파일에서 A 파일을 필요로 하지만 reference로 명시하지 않은 경우
    - 하나의 파일로 번들링하게 되면 문제 없이 컴파일되며 잘 동작함
  - 동작하더라도 왜 동작하는지, 동작하지 않으면 왜 동작하지 않는지 혼란스러운 상황이 발생할 수 있음

### ES6 모듈을 활용한 import, export
- 구문
  - 가져올 대상에서 export 명시(TS namespace 관련 구문이 아니라 ES6 모듈 관련 구문, 예약어는 같음)
  - import { 가져올 대상 } from "파일 경로(.js로 명시)"
  - 이 때 tsconfig.json에서 module이 AMD 등 다른 것으로 되어있다면 모듈을 도입한 ECMAScript 버전인 es2015(혹은 es6)로 바꿔줘야 함
    - TSC에게 import를 바꾸지 말고 그대로 두도록 함
  - 그리고 outFile이 명시되어 있다면 삭제하거나 주석 처리
    - 하나의 파일로 번들링되지 않도록 한 것
    - 번들링되면 순수 JS에서는 이해할 수 없는 구문이 됨
  - JS 파일을 가져오는 HTML 파일에서는 모듈임을 명시(type="module")
    - 모던 브라우저는 ES6 모듈을 지원하지만, 모듈을 사용한다고 명시해줘야 함
    - 명시하지 않는 경우 다음 오류 발생
      - Uncaught SyntaxError: Cannot use import statement outside a module
  - (cf.) Webpack과 같은 빌드 도구를 사용한다면, import 시 .js 확장자를 생략할 수 있지만, 
    - 브라우저에 의지해서 파일을 import 할 때는 .js 확장자를 명시해줘야 함
- 장점
  - 파일마다 필요한 것을 명시하기에 편리
  - 명시가 잘못된 경우 tsc에서 경고를 보냄
  - 타입 안정성도 강화됨
  - 되도록 namespace보다는 ES 모듈을 사용하고
    - 구형 브라우저를 사용할 수밖에 없는 경우, ES 모듈이나 번들러 등을 사용할 수 없는 경우에만 TS의 namespace를 사용할 것을 권장
- 단점
  - 개발자 도구 네트워크 탭을 보면 요청이 많음을 확인 가능
    - HTML \< script \>로 불러온 첫 JS 파일을 가져오면서 import가 명시된 모든 파일들을 가져오는 것
- 추가로 알아두면 좋을 import, export 관련 구문
  - import bundling
    - import { \[가져올 대상\] } ... 대신 import * as \[사용할 이름\] from "\[가져올 파일\]"; 구문을 사용
    - 사용할 때는 \[사용할 이름\].\[가져올 대상\] 방식으로 사용
    - 이렇게 import 대상을 그룹화할 수 있음
      - 이름 충돌을 방지할 때도 유용할 수 있음
  - alias
    - 위 import bundling에서 사용한 as는 가져올 대상에게도 직접 사용할 수 있음
    - (ex.) import { autobind as Autobind } from ...
    - 이름 충돌을 방지할 수 있음
  - default export(↔ named export)
    - (cf.) 같은 파일에서 named export와 default export를 조합해서 사용하는 것도 가능함
    - 파일에서 내보내는 대상이 하나만 있을 때 유용하게 사용 가능
      - default export는 파일마다 하나만 존재 가능
    - export default ... 구문으로 사용
    - 가져오는 쪽에서는
      - 중괄호 없이 해당 파일에서 사용할 이름을 적어줌
        - (ex.) import Cmp from "./base-component.js"
      - as 없이 아무 이름을 골라서 사용 가능
- 모듈의 코드가 실행되는 방식
  - 예를 들어 project-state.ts에서 다음을 export 함
    - export const projectState = ProjectState.getInstance();
  - 그런데 projectState는 project-input.ts, project-list.ts 등 여러 파일에서 import 하고 있음
    - 그렇다면 해당 코드는 전체 앱에서 한 번만 실행될까? 아니면 import 될 때마다 실행될까?
  - import된 코드는 다른 파일에 파일이 최초로 import 될 때 한 번만 실행됨
    - 다른 파일에서 또 import 한다고 해도 다시 실행되진 않음
    - import 되는 파일에 console.log를 찍어 확인해볼 수 있음
  - 한 번만 실행되는 방식으로 작동한다는 점을 알아두고 앱을 계획하는 것이 좋음

### 참고 자료
- https://medium.com/computed-comparisons/commonjs-vs-amd-vs-requirejs-vs-es6-modules-2e814b114a0b
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules

## TypeScript와 함께 Webpack 사용하기(A Modern Build Workflow)

### Webpack의 필요성
- ES6 모듈만을 이용해 여러 개의 파일로 분할했을 때의 문제점
  - 그리 용량이 크지 않은 개별 .js 파일을 받아오는데 여러 번 요청을 보내고 있음
  - 개발자 도구에서 요청, 응답을 확인해봤을 때
    - Request/Response 부분은 필수적이라고 하더라도
    - Resource Scheduling, Connection Start로 분류되는 시간이 요청 시마다 매번 추가됨
      - 브라우저가 요청 자체를 설정하고 전송하는 데에 필요한 시간
  - 실제로 웹에 배포하면, 많은 요청으로 인해 latency가 길어질 것
    - 요청의 양을 줄일 수 있는 솔루션이 필요함
- Webpack의 필요성
  - Webpack이란?
    - bundling & build orchestration tool
  - Webpack으로 할 수 있는 것들
    - 여러 파일들을 번들링해서 요청의 수를 줄일 수 있음
    - 빌드 단계에서 빌드 도구를 이용해 CSS 파일 최적화 등 최적화 가능
  - Webpack를 사용하지 않은 경우와 사용한 경우 비교
    - 사용하지 않은 경우
      - 여러 .ts 파일과 import 사용 → 여러 .js 파일로 인한 많은 HTTP 요청
      - 최적화되지 않은 코드 → 개별 파일 용량 측면에서 불리
        - 최적화하기 위해 변수, 함수 이름들을 바꿀 수 있지만, 수동으로 작업하기 까다로움
      - lite server와 같은 외부 개발 서버 구성 필요
    - 사용한 경우
      - 파일 번들링으로 요청 수 줄임
      - 짧은 코드로 최적화해서 다운로드할 파일의 용량 줄임
      - 빌드 단계 추가 용이\(개발 서버 추가도 쉬움\)
- Webpack 참고
  - [공식 사이트](https://webpack.js.org/)
  - [공식 docs](https://webpack.js.org/concepts/)

### Webpack 설치, 중요 종속성
- 프로젝트에 Webpack 서드파티 라이브러리 추가
  - npm install --save-dev webpack webpack-cli webpack-dev-server typescript ts-loader
    - \(cf.\) --save-dev 대신 -D로도 가능
      - [NPM docs 참고](https://docs.npmjs.com/cli/v10/commands/npm-install#description)
- 위에서 추가한 라이브러리 설명
  - webpack: 코드 번들링을 위한 플러그인 및 코드 변환을 돕는 도구
    - 코드 변환 기능을 이용해 .js 출력 파일을 번들링하기보다는 TS 코드를 JS로 변환 후 번들링한 .js 파일을 내놓도록 구성할 수 있음
      - 이 때 ts-loader를 활용
  - webpack-cli: 웹팩 명령을 프로젝트에서 실행
  - webpack-dev-server: 빌트인 개발 서버 구성, 내부에서 웹팩을 가동해서 파일의 변경 내역을 감시하고, 무언가 변경되면 자동으로 웹팩을 트리거해서 다시 컴파일하도록 함
  - typescript: 글로벌 typescript가 아니라 프로젝트마다 typescript를 두어 글로벌 TS 버전이 바뀌더라도 이미 설정된 프로젝트를 깨지지 않게 하려는 것
  - ts-loader: Webpack이 동작할 때 TS 코드를 JS로 변환하는 방법을 알려줌

### 입출력 구성 추가

#### tsconfig.json 구성 확인
- target → ES5 혹은 ES6로 설정
  - webpack과 ts-loader가 이 target 설정 기반으로 코드 변환 방식을 결정
    - ES5로 설정할 경우 구버전 브라우저에서도 실행되게 함
    - ES6로 설정할 경우 모던 브라우저세서만 실행
- module → ES6(ES2015)로 설정
- outDir
  - 기본적으로 세팅되어있는 "./dist"를 사용해도 되고
  - 컴파일 결과물을 다른 디렉토리에 두고 싶다면 변경
- rootDir → 불필요
  - webpack에서 root 파일 위치를 결정하므로 설정값 불필요

#### webpack.config.js 파일 추가 및 입출력 구성
- webpack.config.js 파일?
  - Webpack이 프로젝트 작업 방법을 전달할 때 자동으로 찾는 파일
    - 이 구성을 잘 해둬야 Webpack이 제대로 작동
  - (cf.) 이 파일에서는 JS 코드, Node.js 기능을 사용
- webpack.config.js 파일 작성
  - (cf.) Node.js의 export syntax 활용, JS 객체를 내보냄
  - entry: 전체 프로젝트가 시작되는 entry point 파일 경로
  - output: Webpack 동작 결과물 output point, 객체로 표현
    - filename: 번들링한 최종 결과물 .js 파일
      - (cf.) 동적인 부분을 추가할 수도 있음 (ex.) \[contenthash\]를 넣어 Webpack이 빌드마다 고유 해시를 만들게 하여 브라우저 캐싱 지원
    - path: 출력 파일 경로
      - tsconfig.json에 설정된 outDir 경로와 일치해야 오류가 발생하지 않음
      - 이 때 Webpack이 절대 경로를 사용해야 하므로
        - 코어 Node.js 모듈인 path를 이용하여 path.resolve()로 절대 경로를 구성하도록 도움
- 여기까지 구성했다면 Webpack이 기본적인 번들러로 기능하도록 설정한 것
  - .ts 파일로 무엇을 할지 설정하기 위해서는 추가적인 구성 필요
- (cf.) Webpack이 제대로 동작하려면 각 .ts 파일 import 구문에서 .js 확장자를 모두 제거해야 함

### ts-loader 패키지로 TypeScript 지원 추가

#### Webpack workflow 구성 - webpack.config.js의 Webpack 구성 객체 작성
- webpack.config.js의 module 프로퍼티
  - 역할
    - 명시된 파일로 Webpack에게 무엇을 해야할지 알려줌
    - module 프로퍼티는 JS 객체를 가져와서 구성
  - module 프로퍼티 구성하기
    - rules 프로퍼티 → 명시된 파일에 적용할 규칙을 설정하는 배열
      - 복잡한 프로젝트의 경우 CSS 파일, 이미지 등 다양한 형태의 파일을 위한 규칙 설정 가능
      - 특정 파일을 어떻게 다뤄야 할지 알려주는 패키지인 loader 활용
        - [Webpack docs의 loader 부분 참고](https://webpack.js.org/concepts/#loaders)
        - 여기서는 ts-loader를 사용할 것
    - rules 배열의 각 원소인 객체의 프로퍼티 예시
      - test: Webpack이 파일을 찾을 때마다 규칙이 적용되는 파일인지 확인하는 작업을 수행하기 위한 정규식
      - use: 대상 파일을 가지고 무엇을 해야할지
        - "ts-loader"로 명시하면 자동으로 tsconfig.json 파일을 가져와 활용
      - exclude: 탐색에서 제외할 경로 정규식
      - (cf.) test, exclude에 명시하는 정규식에 ""가 붙어있으면 안 됨
        - "/\\.ts$/" 이런 식이 아니라 /\\.ts$/ 이런 식으로 명시되어 있어야 함
- resolve 프로퍼티 → 경로를 resolve할 때 이용할 규칙
  - extensions: 명시된 이름의 파일 확장자 부분에 대한 규칙
    - 찾아낸 import 구문에 어떤 파일 확장자를 추가할지 명시
    - Webpack은 자동으로 확장자를 추가하고, 기본값으로 .js 파일을 찾도록 되어있음
    - 여기서는 추가로 .ts 파일도 찾아서 함께 번들링하도록 함
- devtool 프로퍼티 → "inline-source-map"으로 설정
  - Webpack에게 추출해야하는 source map이 생성될 것임을 알려줌
  - Webpack이 제대로 번들을 구현하도록 구성하도록 도움
  - tsconfig.json 구성의 sourceMap과 관련
- (cf.) tsconfig.json 구성 확인
  - sourceMap은 true로 설정
    - 코드 디버깅 및 웹페이지 지원 가능하도록 함
    - 실제 동작 코드는 .js 파일이지만, 브라우저의 개발자 도구에서 .ts 파일을 통해서도 디버깅할 수 있도록 함

#### Webpack 사용하여 빌드하기
- package.json의 scripts에 build 추가
  - "build": "webpack"
- npm run build로 빌드

### webpack-dev-server 추가, 개발 시의 빌드 설정 + Webpack config 조정
- webpack-dev-server 추가 → package.json의 scripts의 start 수정 및 webpack.config.js의 output 등 수정
  - package.json의 "scripts"의 "start" 수정
    - 기존 "lite-server"에서 "webpack-dev-server"로 수정
  - (cf.) webpack-dev-server 모드에서는 개발 서버 가동 중에 dist 디렉토리로 파일을 새로 빌드하지 않음
    - 생성 후 메모리에서만 가지고 있는 번들을 로드함
  - webpack.config.js의 output에 publicPath: "/dist/" 추가
    - 개발 서버 실행 중 코드 변경 시 변경된 부분이 반영하기 위해 필요한 수정
      - (cf.) 강의에는 "dist"로 작성했으나, 최신 Webpack에서는 "/dist/"라 해야한다고 함
      - webpack-dev-server가 기본적으로 index.html과는 잘 연결되어 script를 실행할 때 경로를 찾는 데에 문제가 없지만
        - dist 디렉토리는 연결짓지 못하기 때문에 publicPath를 명시하여 bundle.js를 찾을 수 있게 해야하는 것이라고 함
    - (cf.) 이 덕분에 lite-server를 사용할 때처럼 tsc -w를 실행시켜둘 필요가 없음
  - (cf.) 또한 최신 Webpack에서는 webpack.config.js의 devServer - static - ... - directory도 명시해야 함
    - [Webpack devServer, ..., directory 프로퍼티 관련 공식 문서 참고](https://webpack.kr/configuration/dev-server/#directory)
- webpack에 개발 모드 추가 → webpack.config.js에 mode: "development" 추가
  - 개발을 위한 빌드 시에는 디버깅 등에 용이한 방식으로 간소하게 최적화

### production 코드를 위한 워크플로 추가
- webpack.config.prod.js 파일 작성
- webpack.config.prod.js가 webpack.config.js와 다른 점 비교
  - mode: production → 코드 최적화, 최소화
  - output에서 publicPath 제거
  - devtool: "none"(x) → devtool 프로퍼티 주석 처리(o)
    - source map을 생성하지 않게 함
    - production에서는 불필요
    - (cf.) Webpack 5부터 devtool의 값에 대한 검증이 까다로워짐 - webpack 5: The devtool option is more strict
      - [Webpack devtool 공식 문서 참고](https://webpack.kr/configuration/devtool/)
  - plugins 추가
    - (cf.) plugins를 Webpack workflow에 추가하면 기본적으로 전체 출력, 전체 프로젝트에 적용
      - (cf.) module, rules는 파일 단위로 구체적으로 적용됨
    - clean-webpack-plugin
      - clean-webpack-plugin 패키지 개발 종속성 추가
        - npm install --save-dev clean-webpack-plugin
        - 프로젝트를 다시 빌드할 때마다 dist 디렉토리의 내용을 지우는 기능
      - webpack.config.prod.js에서 import
        - const CleanPlugin = require("clean-webpack-plugin")
      - plugins 배열에 new CleanPlugin.CleanWebpackPlugin() 추가
      - package.json의 scripts의 build 수정
        - 빌드 시 webpack.config.js가 아닌 새로 작성한 webpack.config.prod.js를 사용하도록 설정
        - "build": "webpack --config webpack.config.prod.js"

### (참고) webpack.config.js 파일에서 "파일이 CommonJS 모듈입니다. ES 모듈로 변환될 수 있습니다" 문제 메시지 관련
- [기타 블로그 참고 - Node.JS에서 CommonJS vs ES modules](https://velog.io/@tenacious_mzzz/Node.JS에서-CommonJS-vs-ES-modules)
  - webpack.config.js 파일로 Node.js 위에서 동작하므로 ES 모듈을 사용해도 무방할 것으로 보임
  - 하지만 Webpack 공식 문서 예시에서 CommonJS 모듈을 사용하고 있으므로,
    - 혼동을 피하기 위해 특별한 이유가 없다면 일단은 CommonJS 모듈을 사용하는 편이 나을 듯함

## TypeScript와 서드파티 라이브러리
- 볼 내용
  - (1) JS로도 사용하는 라이브러리를 TS에서 활용하는 방법
  - (2) 타입스크립트 전용 라이브러리
- (cf.) 강의에서 주어진 초기 프로젝트 구성 파일에서 몇 가지 변경해야 실행됨
  - webpack.config.js
    - devServer 설정 → 없으면 index.html의 경로가 src가 아님
    - output의 publicPath: "/dist/"
    -   module의 rules 배열의 test는 ...tsx...가 아닌 ...ts...로 변경(tsx로도 가능한지는 확인 필요)
  - package.json의 dependencies에 있는 것들은 모두 devDependencies로 변경함
  - tsconfig.json의 module, moduleResolution 등 변경

### TypeScript와 함께 JavaScript 라이브러리 사용하기 + 최후의 수단으로 "declare" 사용
- Lodash를 예시로 활용
  - lodash와 같이 널리 알려진 라이브러리들은 TS용 라이브러리(ex. @types/lodash)도 존재하므로 이를 사용하는 것이 편리
  - JS로만 작성된 라이브러리를 사용할 때 생각해볼 부분들이 있음

#### 순수 JS 라이브러리를 사용할 때 발생하는 문제
- npm i lodash 이후 .ts 파일에 import _ from "lodash";를 작성하면 다음과 유사한 오류 메시지를 보게 됨
  - "Could not find a declaration file for modul 'lodash'. ..."
- npm start로 시작해보려고 해도 다음의 오류를 확인하게 됨
  - TS7016: Could not find a declaration file for module 'lodash'. 'C:\typescript-example\using-library-with-ts\node_modules\lodash\lodash.js' implicitly has an 'any' type.
  - Try \`npm i --save-dev @types/lodash\` if it exists or add a new declaration (.d.ts) file containing \`declare module 'lodash';\`
- lodash는 바닐라 JS 라이브러리이기 때문
  - node_modules/lodash에는 .js 파일들만 존재 → 패키지에 무엇이 있는지 TS는 알 수가 없음
    - lodash가 무엇을 export 하는지 알 수가 없음
  - (cf.) tsconfig.json 설정 중 noEmitOnError를 false로 변경한 뒤
    - app.ts에 console.log(_.shuffle([1,2,3])); 같은 것을 작성하고 페이지를 새로고침 해보면
    - lodash가 동작은 하고 있지만 TS에서 알지 못하는 것이기에 오류를 발생시키고 있음을 알 수 있음

#### 위 문제에 대한 해결 방법
- (1) TS를 위해 변환된 타입 변환 패키지\(@types/...과 같은 라이브러리\) 사용
  - lodash types로 구글링하면 @types/lodash라는 이름의 npm 패키지를 확인할 수 있음
  - 유명한 라이브러리들은 이처럼 TS용 라이브러리가 이미 존재함
    - GitHub의 DefinitelyTyped 리포지토리에 많은 서드파티 라이브러리 변환 파일들이 있음
  - xxx.d.ts 파일들
    - .ts 파일이 아니라 .d.ts 파일들 → 실제 로직은 없는 선언만 있는 파일들임
    - shuffle.d.ts 파일에는 TS에 전달할 지침들이 포함(동작 방식, 패키지에 무엇이 들어있는지 알리는 역할)
    - 이 파일들 덕분에 순수 JS를 TS에서 사용할 수 있게 됨
      - 라이브러리에 사용할 type을 찾고, 사용할 type, 메서드를 호출할 때 반환될 type 등을 정의
    - 공식 문서 지침을 따라 직접 .d.ts 파일을 작성해볼 수도 있음
  - 사용 시에는 바닐라 JS 프로젝트에서 lodash를 사용할 때와 똑같은 방법으로 사용하면 됨
    - import 할 때 @types 같은 것을 붙일 필요도 없음
    - (ex.) import _ from "lodash";
    - 이렇게 @types/... 라이브러리를 사용하면 컴파일 오류도 없고, 자동 완성 기능의 도움도 받을 수 있음
    - (cf.) @types/lodash를 사용할 때 lodash도 함께 설치되어 있어야함
      - @types/lodash에는 실행 코드가 없는 정의 파일이므로 원본 lodash가 필요
      - [stackoverflow 관련 질문](https://stackoverflow.com/questions/41530219/module-not-found-error-cannot-resolve-module-types-lodash)
      - 없을 경우 Can't resolve '@types/lodash' in '...' resolve '@types/lodash' in '...' 오류 발생
  - (cf.) 종종 순수 JS 라이브러리이지만 자체적으로 .d.ts 파일을 포함한 경우가 있음
    - 이런 경우 당연히 별도의 변환 패키지를 설치할 필요는 없음
- (2) 최후의 수단으로 declare 사용
  - lodash와 같이 유명한 라이브러리가 아니라서 @types가 붙은 패키지가 없는 경우 사용
  - 꼭 라이브러리가 아니더라도
    - index.html의 < script >에 추가된 전역 변수(따라서 window 객체에 추가된 변수)를 어떻게 사용할 수 있는가?
  - declare 키워드를 사용
    - declare로 선언하여 개발자가 알고 있는 패키지, 전역 변수를 TS에 알려줌
    - declare가 없다면 TS가 컴파일할 때 알 수 없는 이름을 TS가 오류 없이 처리하도록 해주는 것

### TypeScript 전용 라이브러리
- 강의 중 "필요한 타입 없음: class-transformer", "TypeScript 수용: 클래스 검증자" 내용

#### class-transformer 라이브러리
- 해결하고자 하는 문제
  - 다음과 같은 상황 가정
    - 외부에서 JSON 형식으로 데이터를 받아옴
    - 당연히 기본적으로 이 데이터의 type을 알 수 없음
      - 필요하다면 객체에 메타데이터를 직접 연결해줘야 함
      - 데이터의 구조가 겉으로는 같아보여도 외부에서 받아온 데이터로 만든 객체에서 메서드를 사용할 수 없다는 뜻
  - 이 외부에서 받아온 데이터로 만들어진 객체를 custom type 모델의 인스턴스로 바꾸려면
    - 원래는 일일히 생성자들을 사용하여 직접 바꿔줘야 함
  - 이 때 class-transforme 라이브러리를 사용하면 간편하게 변환 가능
- 사용 방법
  - [라이브러리 GitHub 문서 참고](https://github.com/typestack/class-transformer)
  - 라이브러리 설치
    - npm i class-transformer --save로 class-transformer 라이브러리 설치
    - npm i reflect-metadata --save로 reflect-metadata 라이브러리도 설치
  - 라이브러리 사용
    - reflect-metadata를 global로 import 해둠(class-transformer에서 의존하고 있는 라이브러리이므로 반드시 필요함)
    - class-transformer에서 plainToInstance 메서드 import
      - (cf.) 강의에서는 plainToClass를 사용했으나, 메서드명이 바뀌었음
    - plainToInstance(\[변환 목표 클래스\], \[변환하려는 데이터\])
      - 변환하려는 데이터로는 바꿀 대상 객체들을 담은 배열도 가능
- (cf.) TS에 기반해 만들어졌고 TS를 활용하기는 하나
  - 클래스 자체는 JS에도 있으므로 TS 전용 기능을 사용했다고 하기는 애매
  - 실제로 바닐라 JS를 사용한 프로젝트에서도 동작함

#### class-validator 라이브러리 - TypeScript 수용
- class-validator는 TS 전용 기능인 decorator를 을 사용하여, TS를 적극적으로 활용하는 패키지
  - 앞선 강의들에서 직접 작성해보았던 validator 기능을 더 정교하게 수행
  - decorator를 이용해 validation(유효성 검사) 규칙 추가 가능
  - class를 인스턴스화할 때 decorator를 이용하여 설정한 규칙 validation 가능
- 사용 방법
  - [라이브러리 GitHub 문서 참고](https://github.com/typestack/class-validator)
  - 라이브러리 설치
    - npm i class-validator --save
  - 라이브러리 사용
    - tsconfig.json에서 "experimentalDecorators": true로 설정
    - class-validator의 IsNotEmpty, IsNumber, IsPositive 등 데코레이터 import
    - 모델에서 validation할 필드 위(혹은 앞)에 데코레이터를 붙여 validation 규칙 추가
      - (ex.) @IsNotEmpty() title: string;
      - 모두 데코레이터 팩토리이므로 ()를 붙여 실행시켜줘야 함
    - 해당 모델을 사용하는 곳에서 class-validator의 validate를 import한 후
      - 해당 모델의 인스턴스를 인자로 넘기며 validate 호출
      - validate는 validation 결과를 담은 Promist 객체를 반환
      - .then(), await 등으로 결과를 받아서 오류 여부에 따라 다른 로직을 타도록 함

## 장소 선택 및 공유 앱 예제 - TypeScript 사용 시 third party library 활용하기 실습
- 여러 종류의 third party library를 사용해보기
  - HTTP 전송 라이브러리, 구글 지도 라이브러리 활용
  - axios로 자체 .d.ts를 갖고 있는 라이브러리를 사용하기
  - Google Maps로 npm으로 설치되지 않더라도 적절한 type 패키지를 가진 라이브러리를 사용하기

### Google API 키 설정
- Google Geocoding API
  - [공식 문서 참고](https://developers.google.com/maps/documentation/geocoding/start?hl=ko)
  - 주소를 좌표쌍으로 변환하거나 좌표쌍을 주소로 변환 가능
- Google API 키 설정
  - 유료 서비스이지만 일정 사용량까지는 무료로 사용, 하지만 API 키 발급을 위해 신용카드 등록 필요
    - (cf.) 신용 카드 없이 지도 작업을 하려면 OpenLayers 등 다른 지도 서비스 사용
    - (cf.) [Google Maps Platform 과금 정책](https://mapsplatform.google.com/pricing/)
  - 절차에 따라 API 키를 발급받고 복사해둠
    - (cf.) 구글 개발자 콘솔에서 발급받은 키를 사용할 수 있는 앱을 제한할 수도 있음

### Axios를 사용하여 입력된 주소의 좌표 가져오기
- (cf.) third party 패키지 없이 최신 브라우저 및 최신 JS에서 지원하는 fetch API를 사용할 수도 있음
  - URL에 요청을 보내는 데 사용
  - 브라우저에 구축되어 전역적으로 사용 가능
- axios
  - JS, TS로 HTTP 요청을 보내는 데에 사용하는 패키지
  - 설치: npm install --save axios(혹은 npm i axios)
    - node_modules/axios를 살펴보면 라이브러리 자체에서 .d.ts 파일을 포함
    - 라이브러리와 TS 변환 패키지를 함께 제공한 것
- axios로 Google Geocoding API에 요청 보내기
  - [다시 한 번 Geocoding API 문서 참고](https://developers.google.com/maps/documentation/geocoding/start?hl=ko)
  - https://maps.googleapis.com/maps/api/geocode/json?address=...&key=... 형태의 url
    - 위 address 부분에는 url로 사용 가능한 문자만 들어갈 수 있음
    - 이를 위해 JS의 빌트인 함수 encodeURI() 활용
    - 문자열을 URL에서 호환 가능한 문자열로 바꿔줌
  - 요청 코드를 작성할 때 generic으로 되어 있는 응답 타입을 지정할 수 있음
    - 예상되는 응답 타입을 TS에 알려 추후 작업하기 편하게 하는 것
    - (ex.) axios.get`<{results: {geometry: {location: {lat: number, lng: number}}}[]}>`(...)
      - 물론 별도의 custom type alias로 빼낼 수도 있음
    - 이 외에도 상태 코드, 다른 geometry 등 정보들이 있지만 앱에서 필요해서 사용하는 값만 명시해도 상관이 없음

### \(별도 진행\) TS, Webpack을 사용한 프로젝트에서 dotenv 활용
- 참고 자료
  - [기타 블로그 - Webpack 개발 환경과 배포 환경의 환경변수 분리 | Dotenv | DefinePlugin | Environment Variable](https://dev-son.tistory.com/10)
  - [기타 블로그 - 웹팩(Webpack) DefinePlugin, EnvironmentPlugin 사용법](https://www.daleseo.com/webpack-plugins-define-environment/)
  - [Webpack - DefinePlugin](https://webpack.kr/plugins/define-plugin/)
  - 위와 같은 여러 자료들을 참고했으나 결국 ChatGPT의 코드로 해결함
- TODO 정확한 원리를 모르는 상태로 사용했으므로 추가 조사 필요

### Google 지도로 지도 렌더링(Types 포함)
- Google Maps JavaScript API
  - [공식 문서 - Maps JavaScript API 개요](https://developers.google.com/maps/documentation/javascript/overview?hl=ko)
- 시작하기
  - (방법 1)index.html에 script 추가(기존 스크립트 로드 태그 사용)
    - [공식 문서 - Maps JavaScript API 로드하기](https://developers.google.com/maps/documentation/javascript/load-maps-js-api?hl=ko&_gl=1#use-legacy-tag)
    - index.html에 다음 스크립트 추가 `<script src="https://maps.googleapis.com/maps/api/js?key=..." async defer></script>`
    - 공식 문서에서는 이 방법은 추천하지 않고, Dynamic Library Loading API 방식을 사용하길 권장함
  - (방법 2) 동적 라이브러리 가져오기
    - [공식 문서 참고](https://developers.google.com/maps/documentation/javascript/load-maps-js-api?hl=ko&_gl=1)
      - [공식 문서 - TypeScript 및 Google 지도](https://developers.google.com/maps/documentation/javascript/using-typescript?hl=ko&_gl=1) → TS에서 Google 지도를 사용할 때 참고
      - [공식 문서 - 라이브러리](https://developers.google.com/maps/documentation/javascript/libraries?hl=ko) → 동적 라이브러리 가져오기 방식에서 라이브러리를 가져오는 방법
      - [공식 문서 - 고급 마커로 이전](https://developers.google.com/maps/documentation/javascript/advanced-markers/migration?hl=ko) → v3.56 이후의 버전에서 advanced marker 사용하는 방법
  - (방법 3) NPM js-api-loader 패키지 사용
    - [공식 문서 참고](https://developers.google.com/maps/documentation/javascript/load-maps-js-api?hl=ko&_gl=1#js-api-loader)
    - 방법 1, 방법 3 대신 방법 2를 사용할 것을 권장함
- Google maps를 사용할 때 TS의 type 지원 기능을 활용하려면 @types/googlemaps 패키지 설치
  - npm i -D @types/googlemaps(혹은 npm install --save-dev @types/googlemaps)
  - (cf.) 현재 @types/googlemaps는 deprecated
    - 스크립트 로드 태그 사용 방식 자체가 deprecated이므로 이에 대한 타입 지원인 @types/googlemaps도 deprecated인 것
    - 다른 방식으로 Google maps를 불러올 때는 @types/google.maps를 대신 사용

## React.js 및 TypeScript

### React + TypeScript 프로젝트 설정하기
