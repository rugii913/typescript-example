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
