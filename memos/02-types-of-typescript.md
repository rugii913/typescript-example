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
