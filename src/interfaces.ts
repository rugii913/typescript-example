interface PersonInterfaceEx {
  name: string;
  age: number;

  greet(phrase: string): void;
}

let user0: PersonInterfaceEx;
// interface 정의에 맞는 유효한 object 작성
user0 = {
  name: "Park",
  age: 30,
  greet(phrase: string) {
    console.log(`${phrase} ${this.name}`);
  },
};
console.log(user0); // 사용하지 않는 변수로 인한 TS compiler 오류를 막기위해 넣은 부분

// ---------------------------------------------------------------------

interface Named {
  readonly name?: string;

  optionalMethod?(): void; // optional method
}

interface Greetable extends Named {
  greet(phrase: string): void;
}

/* 
중복되는 이름 문제를 해결하기 위해 Person interface에 export를 명시
- export를 명시하지 않을 경우 기본으로 전역 스코프에서 사용 가능
  - 참고: https://www.typescriptlang.org/ko/docs/handbook/modules.html
*/
export class Person implements Greetable {
  age: number = 30;

  constructor(public name?: string) {
    this.name = name;
  }

  greet(phrase: string): void {
    console.log(`${phrase} ${this.name}`);
  }
}

let user1: Greetable;
user1 = new Person("Choi");
// user1.name = "Chim"; // interface에 readonly modifier 사용 가능
user1.greet("Hi there. I am");
console.log(user1);

let user2: Greetable = new Person(); // name property 및 constructor에서의 name parameter가 optional이므로, name을 전달하지 않을 수 있고, 이 경우 name은 undefined가 됨
console.log(user2);

// type AddFunction = (a: number, b: number) => number;
interface AddFunction {
  (a: number, b: number): number;
}
let add1: AddFunction;
add1 = (n1, n2) => n1 + n2;
add1(1, 2); // 사용하지 않는 변수로 인한 TS compiler 오류를 막기위해 넣은 부분
