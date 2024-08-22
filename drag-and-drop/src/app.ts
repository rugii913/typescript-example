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

    if (
      enteredTitle.trim().length === 0 ||
      enteredDescription.trim().length === 0 ||
      enteredPeople.trim().length === 0
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
