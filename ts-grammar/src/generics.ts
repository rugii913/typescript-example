/* generic 사용 예시*/
// // - generic 예시 1 - TS에서는 JS에서 제공하는 array도 generic으로 다룸
// const names1: string[] = [];
// const names2: Array<string> = []; // 이런 게 가능

// // - generic 예시 2 - Promise
// const promise1: Promise<string> = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve("This is done!");
//   }, 2000);
// });

// promise1.then(data => {
//   data.split(" "); // Promist가 yield할 data의 type을 명확하게 알고 작업 가능
// })


// - generic function 작성 예시 1
function merge<T extends object, U extends object>(objA: T, objB: U) {
  return Object.assign(objA, objB);
}

const mergedObj1 = merge({name: "Kim"}, {age: 30});
console.log(mergedObj1.age) // → generic을 사용하지 않으면 TS가 이 object의 type을 알 수 없음

// const mergedObj2 = merge({name: "Kim"}, 30);
// merge 함수 정의 시 generic의 constraint를 사용하여 명확하게 object의 subtype임을 명시했음
// 만약 명시하지 않을 경우, 30 같은 number type도 넘길 수 있으며, 에러 메시지도 없이 Object.assign() 작업에 실패 → 디버깅하기 까다로워짐

// - generic function 작성 예시 2 - 구체적인 type 조건으로 constraint를 부여
// cf. 이미 존재하는 type을 member 존재 여부에 따라 특정 interface로 해석하는 게 가능함
interface Lengthy {
  length: number;
}

function countAndDescribe<T extends Lengthy>(element: T): [T, string] {
  let descriptionText = "Got no value.";
  if (element.length === 1) {
    descriptionText = "Got 1 element.";
  } else if (element.length > 1) {
    descriptionText = "Got " + element.length + " elements.";
  }
  return [element, descriptionText];
}

console.log(countAndDescribe("Hi there!"));
console.log(countAndDescribe(["Sports", "Cooking"]));
console.log(countAndDescribe([]));
// console.log(countAndDescribe(10)); // number는 length라는 member를 갖고 있지 않으므로 Lengthy로 판단 불가능

// - keyof constraint
function extractAndConvert<T extends object, U extends keyof T>(obj: T, key: U) {
  return "Value: " + obj[key];
}

// extractAndConvert({}, "name"); // compile error
console.log(extractAndConvert({ name: "Park" }, "name"));

// - generic class 예시
class DataStorage<T extends string | number | boolean> {
  private data: T[] = [];

  addItem(item: T) {
    this.data.push(item);
  }

  removeItem(item: T) {
    if (this.data.indexOf(item) === -1) {
      return;
    }
    this.data.splice(this.data.indexOf(item), 1);
  }

  getItems() {
    return [...this.data];
  }
}

const textStorage = new DataStorage<string>();
// textStorage.addItem(1); // generic 덕분에 compile error
textStorage.addItem("some text...");
textStorage.addItem("another text...");
textStorage.removeItem("another text...");
console.log(textStorage.getItems());

// object를 다룰 때 주의할 부분
// const objStorage = new DataStorage<object>();
// objStorage.addItem({ name: "Kim" });
// objStorage.addItem({ name: "Lee" });
// // cf. this.data.splice(this.data.indexOf(item), 1); 같은 방식으로 제거하려고 할 때, 원하는 대로 동작하지 않고, array의 마지막 요소를 제거 → object 값의 비교는 주소 비교가 기본이기 때문
// // 이를 고려할 때 object를 이용한 작업을 막는 경우도 있을 수 있음
// objStorage.removeItem({ name: "Kim" });
// console.log(objStorage.getItems());

// - utility type
// built-in type 중 Partial type 예시
interface CourseGoal {
  title: string;
  description: string;
  completeUntil: Date;
}

function createCourseGoal(
  title: string,
  description: string,
  date: Date,
): CourseGoal {
  let courseGoal: Partial<CourseGoal> = {};
  courseGoal.title = title;
  courseGoal.description = description;
  courseGoal.completeUntil = date;
  return courseGoal as CourseGoal;
}

// built-in type 중 Readonly type 예시
const names3: Readonly<string[]> = ["Max", "Anna"];
// names3.push("Manu"); // compile error
// names3.pop(); // compile error
