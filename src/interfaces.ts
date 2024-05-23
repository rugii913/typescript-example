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

// ---------------------------------------------------------------------

interface Named {
  readonly name?: string;

  optionalMethod?(): void; // optional method
}

interface Greetable extends Named {
  greet(phrase: string): void;
}

class Person implements Greetable {
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
let add: AddFunction;
add = (n1, n2) => n1 + n2;
