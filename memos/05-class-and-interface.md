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
