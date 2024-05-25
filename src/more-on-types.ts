/* type intersection */
type Admin = {
  name: string;
  privileges: string[];
};

type Employee = {
  name: string;
  startDate: Date;
};

type ElevatedEmployee = Admin & Employee;
// interface ElevatedEmployee2 extends Admin, Employee {} // 이런 것도 가능

const employee1: ElevatedEmployee = {
  name: "Kim",
  privileges: ["create-server"],
  startDate: new Date()
};

type Combinable = string | number;
type Numeric = number | boolean;
type Universal = Combinable & Numeric; // → 두 type의 intersection인 number로 판단하게 됨

/* type guard */
function add2(a: Combinable, b: Combinable) {
  if (typeof a === "string" || typeof b === "string") { // → 이 부분이 type guard
    return a.toString() + b.toString();
  }
  return a + b;
}

type UnknownEmployee = Employee | Admin;

function printEmployeeInformation(emp: UnknownEmployee) {
  console.log(`Name: ${emp.name}`);
  // if (typeof emp === "object") {} // typeof를 type guard로 활용할 수 없음, 단지 object라는 정보만 얻을 수 있으므로
  // if (typeof emp === "Employee") {} // Employee는 JS가 모르는 type이므로 활용할 수 없음
  if ("privileges" in emp) {
    console.log(`Privileges: ${emp.privileges}`);
  }
  if ("startDate" in emp) {
    console.log(`Start Date: ${emp.startDate}`);
  }
}

printEmployeeInformation(employee1);
printEmployeeInformation({name: "Park", startDate: new Date()});

class Car {
  drive() {
    console.log("Driving...");
  }
}

class Truck {
  drive() {
    console.log("Driving a truck...");
  }

  loadCargo(amount: number) {
    console.log("Loading cargo... " + amount);
  }
}

type Vehicle = Car | Truck;

const vehicle1 = new Car();
const vehicle2 = new Truck();

function useVehicle(vehicle: Vehicle) {
  vehicle.drive();
//   if ("loadCargo" in vehicle) {
//     vehicle.loadCargo(1000);
//   }
  // class의 instance인 경우 instanceof 사용 가능
  if (vehicle instanceof Truck) {
    vehicle.loadCargo(1000);
  }
}

useVehicle(vehicle1);
useVehicle(vehicle2);

/* type guard 중 discriminated union */
// class에서도 동작하지만, interface로도 가능함을 보여주기 위해 interface로 예시를 듦
interface Bird {
  type: "bird"; // discriminated union을 위한 literal type
  flyingSpeed: number;
}

interface Horse {
  type: "horse"; // discriminated union을 위한 literal type
  runningSpeed: number;
}

type Animal = Bird | Horse;

function moveAnimal(animal: Animal) {
  // (1) in syntax를 사용한 경우 → 오타를 낼 수도 있음
  // if ("flyingSpeed" in animal) {
  //   console.log("Moving with speed: " + animal.flyingSpeed);
  // }
  // (2) JS가 아는 type이 아니므로 typeof를 사용할 수도 없고
  // (3) interface로 정의했으므로 instanceof를 사용할 수도 없음
  // if (animal instanceof Bird) {}
  let speed;
  switch (animal.type) {
    case "bird":
      speed = animal.flyingSpeed;
      break;
    case "horse":
      speed = animal.runningSpeed;
  }
  console.log("Moving at speed: " + speed);
}

moveAnimal({type: "bird", flyingSpeed: 10});

/* type casting */
// - 단순히 HTMLElement가 아니라 HTMLInputElement라는 것을 compiler에게 알려주기 위해 type casting
// const userInputElement = <HTMLInputElement>document.getElementById("user-input")!;
// - JSX 코드에서 사용하는 구문과 겹치지 않도록 다른 방식의 type casting syntax도 제공
// const userInputElement = document.getElementById("user-input") as HTMLInputElement; // cf. 여기서는 ! 생략 → type casting으로 받는 것 자체가 null이 아닐 거라고 얘기해주는 것
// userInputElement.value = "Hi there!";

// !는 되도록 사용 자제, null이 아닌 것을 단정할 수 없다면, if 등을 통해 null을 먼저 체크
const userInputElement = document.getElementById("user-input");
if (userInputElement) {
  (userInputElement as HTMLInputElement).value = "Hi there!";
}

/* index signature 관련 */
interface ErrorContainer {
  // id: number; // index signature가 하나라도 있다면, 명확한 property를 두도록 정의할 때에도 index signature의 규칙을 따라야 함
  [prop: string]: string;
}

const errorBag: ErrorContainer = {
  email: "Not a valid email!",
  username: "Must start with a capital character!",
};

/* function overload 관련 */
function add3(a: number, b: number): number;
function add3(a: number, b: string): string;
function add3(a: string, b: number): string;
function add3(a: string, b: string): string;
function add3(a: Combinable, b: Combinable) {
  if (typeof a === "string" || typeof b === "string") { // → 이 부분이 type guard
    return a.toString() + b.toString();
  }
  return a + b;
}

const result = add3("Lee", "Bada");

/* optional chaining, nullish coalescing 관련 */
const fetchedUserData = {
  id: "u1",
  name: "Choi",
  job: { title: "CEO", description: "My own company" },
};

// console.log(fetchedUserData.job && fetchedUserData.job.title); // JS에서는 이런 방식으로 runtime error를 회피
console.log(fetchedUserData?.job?.title);

const userInput = "";
// const storedData = userInput || "DEFAULT"; // falsy에 대해서 동작
const storedData = userInput ?? "DEFAULT"; // null, undefined에 대해서만 동작
console.log(storedData);
