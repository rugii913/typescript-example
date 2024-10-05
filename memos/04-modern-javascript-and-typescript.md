## JavaScript의 변화와 TypeScript
- (cf.) [ECMAScript compatibility table](https://compat-table.github.io/compat-table/es6/)
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
