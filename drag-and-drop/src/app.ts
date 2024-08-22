// validation
interface Validatable {
  // 검증할 수 있는 객체를 정의
  // 객체의 구조를 정의하므로 interface를 사용했지만, 커스텀 타입인 type 혹은 class로 정의하는 것도 가능함
  value: string | number;
  // (cf.) ?를 사용하는 대신 boolean | undefined처럼 undefined를 허용할 수도 있음, ?가 같은 역할을 함
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: Validatable) {
  let isValid =true; // 우선 true로 두고 검증을 통과하지 못하면 false를 반환
  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0; // &&의 뒤에 있는 expression의 평가 결과가 false라면 isValid는 false가 됨
  }
  if (
    validatableInput.minLength != null &&
    // - 위에서 이미 length를 확인했기 때문에 minLenth의 값을 확인하는 것은 군더더기일 수 있으나, 안전성을 위해 검사
    //   - minLength가 falsy인 0이어도 이 검사를 실행하게될 것(validatableInput.minLength라고만 되어 있다면 minLength 값이 0이면 이 검사를 넘어갈 것임)
    // - !==를 사용한다면 undefined를 명시해줘야 하지만, != null로 undefined를 포함시킴
    typeof validatableInput.value === "string" // typeof로 타입 가드
  ) {
    isValid =
      isValid && validatableInput.value.length >= validatableInput.minLength;
  }
  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length <= validatableInput.maxLength;
  }
  if (
    validatableInput.min != null && typeof validatableInput.value === "number"
    // min 값이 0일 경우 문제가 생기므로 validatableInput.min처럼 truthy, falsy로 검사하지 않음
  ) {
    isValid = isValid && validatableInput.value >= validatableInput.min && Number.isInteger(validatableInput.value);
    // - Number.isInteger(validatableInput.value) 부분은 강의와 다르게 별도로 추가함
    // - HTML에서는 <input>의 type="number"로 방지하고 있었으나, HTML만 변경해도 제출할 수 있었음
  }
  if (
    validatableInput.max != null && typeof validatableInput.value === "number"
    // min 값이 0일 경우 문제가 생기므로 validatableInput.min처럼 truthy, falsy로 검사하지 않음
  ) {
    isValid = isValid && validatableInput.value <= validatableInput.max && Number.isInteger(validatableInput.value);
  }
  return isValid;
}

// autobind decorator
function autobind(
  _target: any,
  _methodName: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value;
  const adjustedDescriptor: PropertyDescriptor = {
    configurable: true, // 변경할 수 있게 함
    get() { // 함수에 access할 때, 원래 함수 대신 이 getter의 return인 함수를 받음
      const boundFunction = originalMethod.bind(this);
      return boundFunction;
    }
  };
  return adjustedDescriptor;
}

// ProjectInput Class
class ProjectInput {

  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById("project-input")! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    const importedNode = document.importNode(this.templateElement.content, true);
    // - importNode()는 전역 document 객체의 메서드 - return type은 DocumentFragment
    // - content는 <template> 사이에 있는 HTML 코드에 대한 참조, 두번째 인자는 깊은 복사 여부
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = "user-input";

    // 객체의 필드를 이용해 필요한 모든 요소에 access 할 수 있도록 함
    this.titleInputElement = this.element.querySelector("#title") as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector("#description") as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector("#people") as HTMLInputElement;

    this.configure();
    this.attach();
  }

  private gatherUserInput(): [string, string, number] | void { // return하지 않는 분기가 있으므로 void를 | 로 추가함, union type을 사용할 수도 있을 것 (cf.) undefined라고 작성하는 것은 권장하지 않음
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    // 만약 Validatable을 class로 정의했다면 new 키워드로 인스턴스화해야할 것
    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    }
    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    }
    const peopleValidatable: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5,
    }

    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert("Invalid input, please try again!");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople]; // parseFloat(enteredPeople) 대신 +를 붙여 숫자로 변환했음
    }
  }

  private clearInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  @autobind
  private submitHandler(event: Event) { // 입력 값에 접근 및 검증 // configure() 안에서 addEventListener()의 콜백으로 넘겨짐
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) { // JS에는 tuple 개념이 없으므로 tuple 타입인지 확인할 수는 없음
      const [title, description, people] = userInput;
      console.log(title, description, people);
      this.clearInputs();
    }
  }

  private configure() {
    this.element.addEventListener("submit", this.submitHandler); // JS, TS의 this binding 때문에 bind()를 명시 → @autobind를 사용하여 명시된 bind()를 숨김
  }

  private attach() { // 선택 로직과 렌더링 로직을 분리했음
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
    // - insertAdjacentElement()는 브라우저 제공 기본 JS 메서드, HTML element 삽입 시 사용
    //   - 첫번째 parameter인 where: InsertPosition은 "beforebegin"(시작 태그 앞), "afterbegin"(시작 태그 뒤), "beforeend"(종료 태그 앞), "afterend"(종료 태그 뒤) 중 하나
  }
}

const projectInput = new ProjectInput(); // constructor에서 template element 선택 후 렌더링 메서드를 호출했으므로, 인스턴스 생성만으로 form이 렌더링됨
