// function Logger(constructor: Function) { // decorator function을 직접 정의한 경우
//   console.log("Logging...");
//   console.log(constructor);
// }

function Logger(logString: string) { // decorator factory 정의 // decorator function은 관례적으로 첫글자를 대문자로 사용함
  console.log("LOGGER FACTORY");
  return function(constructor: Function) {
    console.log(logString);
    console.log(constructor); // cf. constructor를 출력하면 클래스 전체가 출력되는 것으로 보임
  }
}

function WithTemplate(template: string, hookId: string) { // Angular 프레임워크에서 사용하는 @Component와 유사한 방식
  console.log("TEMPLATE FACTORY");
  // decorator가 constructor function을 반환하도록 함으로써 기존 class(constructor function)을 대체함
  // - super()를 호출함으로써 기존 class의 동작은 보존
  // - 또한 기존 class를 새로운 class로 대체하여 인스턴스화될 때 수행할 로직을 추가함
  //   - class 정의 시점이 아닌 instance 생성 시점에 실행되는 decorator 로직을 구현한 것임
  return function<T extends {new(...args: any[]): {name: string}}>(originalConstructor: T) {
    /* T의 type이 T extends {new(...args: any[]): {name: string}} → new는 이 argument가 constructor function임을 명시, {name: string}은 이 decorator가 붙은 class에 name property가 있음을 명시하기 위함 */
    return class extends originalConstructor {
      // 다른 constructor를 return 할 수도 있고, 여기처럼 parameter로 받은 constructor를 extend하는 class를 return 할 수도 있음
      // 여기처럼 상속을 받으면 super class의 property를 그대로 사용 가능
      constructor(..._: any[]) { // argument를 받기만 하고 사용하지 않을 때 발생하는 오류를 회피하기 위해 "_" 사용
        super(); // originalConstructor 호출
        console.log("Rendering template");
        const hookElement = document.getElementById(hookId);
        if (hookElement) {
          hookElement.innerHTML = template;
          hookElement.querySelector("h1")!.textContent = this.name;
        }
      }
    };
  }
}

/* 여러 데코레이터를 하나의 target에 붙일 수도 있음 */
// @Logger // decorator function을 직접 정의한 경우
@Logger("Logging - PERSON") // decorator factory의 return value를 사용한 경우
@WithTemplate("<h1>My Person Object</h1>", "app")
class Person {
  name = "Gang San";

  constructor() {
    console.log("Creating person object...");
  }
}

const person1 = new Person(); // 주석 처리할 경우 DOM 요소에 아무 것도 추가되지 않은 것을 확인할 수 있음 - 즉 class 정의 시점이 아닌 instance 생성 시점에 동작하는 로직을 가진 decorator를 정의한 것
console.log(person1);

// ---

/*
decorator가 받는 argument는 붙이는 곳에 따라 달라짐
- decorator가 property에 붙는 경우
  - 첫 번째 argument는 property의 target
    - instance property(instance를 생성해야 사용할 수 있는 property)의 경우 target argument로 생성된 객체의 prototype이 들어옴
    - static property의 경우 prototype 대신 constructor function이 들어옴
    - 어떤 type 데이터가 들어올지 모르므로 any로 둠
  - 두 번째 argument는 property의 이름
    - identifier이므로 string 혹은 Symbol type이 됨
*/
function Log(target: any, propertyName: string | Symbol) { // property에 붙일 decorator - 2개의 인자를 받음
  console.log("Property decorator!"); // 실행 시점 확인용
  console.log(target, propertyName);
}

/* 
- decorator가 accessor에 붙는 경우
  - 첫 번째 argument는 target → prototype, instance accessor, static accessor인 경우 constructor function
  - 두 번째 argument는 처리하는 member의 name → 즉 accessor의 name
  - 세 번째 argument는 property descriptor → type은 TS 기본 내장 타입인 PropertyDescriptor
*/
function Log2(target: any, name: string, descriptor: PropertyDescriptor) { // accessor에 붙일 decorator - 3개의 인자를 받음
  console.log("Accessor decorator!");
  console.log(target);
  console.log(name); // accessor 이름 출력, 여기서는 price가 출력 - _price가 아님에 유의
  console.log(descriptor); // property descriptor 출력

  // accessor나 method에 붙는 decorator는 PropertyDescriptor를 return하여, accessor나 method에서 변경할 값을 지정할 수 있음
  // return ..
}

/* 
- decorator가 method에 붙는 경우
  - 첫 번째 argument는 target → prototype, instance method, static method인 경우 constructor function
  - 두 번째 argument는 method의 이름 → string 혹은 Symbol이 됨
  - 세 번째 argument는 property descriptor → type은 TS 기본 내장 타입인 PropertyDescriptor
  - cf. 받는 argument는 accessor에 decorator가 붙는 경우와 동일함
*/
function Log3(target: any, name: string | Symbol, descriptor: PropertyDescriptor) { // method에 붙일 decorator - 3개의 인자를 받음
  console.log("Method decorator!");
  console.log(target);
  console.log(name);
  console.log(descriptor); // property descriptor 출력 - accessor의 decorator에서 출력된 것과 비교하면 accessor descriptor와 method descriptor의 차이를 확인할 수 있음
}

/* 
- decorator가 parameter에 붙는 경우
  - 첫 번째 argument는 target
  - 두 번째 argument는 parameter의 이름은 아니고 parameter를 사용하는 method의 이름
  - 세 번째 argument는 position → parameter의 번호
*/
function Log4(target: any, name: string | Symbol, position: number) { // parameter에 붙일 decorator - 3개의 인자를 받음
  console.log("Parameter decorator!");
  console.log(target);
  console.log(name);
  console.log(position); // property descriptor 출력 - accessor의 decorator에서 출력된 것과 비교하면 accessor descriptor와 method descriptor의 차이를 확인할 수 있음
}

class Product {
  @Log // 이 decorator는 @ 클래스 정의가 등록되는 시점에 실행
  private _title: string;
  private _price: number;

  @Log2
  set price(val: number) {
    if (val > 0) {
      this._price = val;
    } else {
      throw new Error("Invalid prece - should be positive!");
    }
  }

  constructor(t: string, p: number) {
    this._title = t;
    this._price = p;
  }

  @Log3
  getPriceWithTax(@Log4 tax: number) {
    console.log(this._title, this._price); // 사용하지 않는 변수로 인한 TS compiler 오류를 막기위해 넣은 부분
    return this.price * (1 + tax);
  }
}

const product1 = new Product("abc", 1_000);

/* 
decorator의 실행 순서
- 위에서 선언한 Log1 ~ Log4 decorator는 class의  instance가 만들어질 때 실행되는 것이 아니라
  - **class 혹은 method를 정의**하는 시점에 실행
  - method 호출, property 사용 때처럼 runtime에 실행되는 게 아님
  - class가 정의될 때, 배후에서 부가적인 설정 작업을 진행 → meta-programming
*/

/* 
## 예시: "Autobind" 데코레이터 만들기
*/
function Autobind(_1: any, _2: string, descriptor: PropertyDescriptor) {
  // method에 붙는 decorator는 PropertyDescriptor 객체의 value property가 해당 함수를 가리킴
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() { // 이 property 값(함수)에 접근(함수 실행)할 때 부가적인 로직을 수행
      // this는 getter를 실행시킨 대상을 가리키게 됨 → getter는 언제나 자신이 정의된 실제 객체에 의해 실행됨 → getter 내부의 this는 항상 해당 getter를 정의한 객체를 가리킴(addEventListener() 등에 의해 바뀌지 않음)
      const boundFunction = originalMethod.bind(this);
      return boundFunction;
    },
  };

  // accessor나 method에 붙는 decorator는 PropertyDescriptor를 return하여, accessor나 method에서 변경할 값을 지정할 수 있음
  return adjDescriptor; // 기존 descriptor를 덮어씀(TS가 알아서 처리)
}

class Printer {
  message = "This works!";

  @Autobind
  showMessage() {
    console.log(this.message);
  }
}

const printer = new Printer();

const button = document.querySelector("button")!;
// button.addEventListener("click", printer.showMessage.bind(printer));
button.addEventListener("click", printer.showMessage);

/* 
## 데코레이터로 타당성 검증 - 첫 번째 단계 → decorator를 이용한 validation
## 데코레이터로 타당성 검증 - 완료
*/
interface ValidatorConfig { // 값을 보관하는 저장소로 사용
  // index sinature 사용
  [property: string]: {
    [validatableProp: string]: string[] // ["required", "positive"]와 같이 유효성 검사기 이름이 string[] 형태로 추가
  }
}

const registeredValidators: ValidatorConfig = {}; // 우선 빈 객체로 초기화

/* 
property decorator의 parameter는 2개
- target: property가 속한 객체의 prototype / static property일 경우 constructor function
- propertyName: property 이름
- (cf.) property decorator는 descriptor는 받지 않음
*/
function Required(target: any, propertyName: string) {
  // instance의 prototype의 constructor key를 활용 - 객체 생성에 사용된 constructor를 가리킴 (ex.) Course 같은 constructor function 이름이 들어감
  // 또한 constructor는 function이므로 name property를 활용 - (cf.) name은 JS의 모든 function에 존재
  registeredValidators[target.constructor.name] = {
    // 검사를  추가할 property의 이름을 key로 사용
    // 기존에 등록된 validators를 가져온 후 배열에 복사하고, 추가하려는 값을 추가
    ...registeredValidators[target.constructor.name],
    [propertyName]: [...(registeredValidators[target.constructor.name]?.propertyName ?? []), "required"],
  };
}

function PositiveNumber(target: any, propertyName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propertyName]: [...(registeredValidators[target.constructor.name]?.propertyName ?? []), "positive"],
  };
}

// 등록된 validator를 모두 살펴보고, 필요한 검증 항목을 찾아 해당 로직을 수행
function validate(obj: any) {
  // 객체에 등록된 validator 목록을 가져오는 작업
  // constructor property를 가져옴
  const objValidatorConfig = registeredValidators[obj.constructor.name]; // obj.constructor.name로 Course가 반환될 것
  if (!objValidatorConfig) {
    return true; // 등록된 validator가 없는 경우, 별다른 검증을 하지 않고 true를 반환하여 검증을 종료(유효한 객체)
  }

  let isValid = true;
  for (const property in objValidatorConfig) { // for in문으로 내부 객체의 값을 가져옴 - 즉, validator가 등록된 property 이름을 모두 가져옴
    for (const validator of objValidatorConfig[property]) {
      switch (validator) {
        case "required":
          isValid = isValid && !!obj[property];
          break;
        case "positive":
          isValid = isValid && obj[property] > 0;
          break;
      }
    }
  }
  return isValid;
}

class Course {
  @Required
  title: string;
  @PositiveNumber
  price: number;

  constructor(title: string, price: number) {
    this.title = title;
    this.price = price;
  }
}
// 위까지의 작업을 통해, property 이름과 각 property의 validator가 class 정의 시점에 global로 저장됨

const courseForm = document.querySelector("form")!;
courseForm.addEventListener("submit", event => {
  event.preventDefault();
  const titleElement = document.getElementById("title") as HTMLInputElement;
  const priceElement = document.getElementById("price") as HTMLInputElement;

  const title = titleElement.value;
  const price = +priceElement.value; // 간단하게 number 자료형으로 변환하기 위해 +를 붙임

  const createdCourse = new Course(title, price);

  if (!validate(createdCourse)) {
    alert("Invalid input, please try again!");
    return;
  }
  
  console.log(createdCourse);
});
