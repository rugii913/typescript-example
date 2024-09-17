/// <reference path="base-component.ts" />
/// <reference path="../decorators/autobind.ts" />
/// <reference path="../util/validation.ts" />
/// <reference path="../state/project-state.ts" />

namespace App {
  // class ProjectInput
  export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
      super("project-input", "app", true, "user-input");
      this.element.id = "user-input";

      // 객체의 필드를 이용해 필요한 모든 요소에 access 할 수 있도록 함
      this.titleInputElement = this.element.querySelector(
        "#title"
      ) as HTMLInputElement;
      this.descriptionInputElement = this.element.querySelector(
        "#description"
      ) as HTMLInputElement;
      this.peopleInputElement = this.element.querySelector(
        "#people"
      ) as HTMLInputElement;

      this.configure();
    }

    configure() {
      this.element.addEventListener("submit", this.submitHandler); // JS, TS의 this binding 때문에 bind()를 명시 → @autobind를 사용하여 명시된 bind()를 숨김
    }

    renderContent() {} // 상속을 위해 정의했지만, 아무것도 내용도 넣지 않음

    private gatherUserInput(): [string, string, number] | void {
      // return하지 않는 분기가 있으므로 void를 | 로 추가함, union type을 사용할 수도 있을 것 (cf.) undefined라고 작성하는 것은 권장하지 않음
      const enteredTitle = this.titleInputElement.value;
      const enteredDescription = this.descriptionInputElement.value;
      const enteredPeople = this.peopleInputElement.value;

      // 만약 Validatable을 class로 정의했다면 new 키워드로 인스턴스화해야할 것
      const titleValidatable: Validatable = {
        value: enteredTitle,
        required: true,
      };
      const descriptionValidatable: Validatable = {
        value: enteredDescription,
        required: true,
        minLength: 5,
      };
      const peopleValidatable: Validatable = {
        value: +enteredPeople,
        required: true,
        min: 1,
        max: 5,
      };

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
    private submitHandler(event: Event) {
      // 입력 값에 접근 및 검증 // configure() 안에서 addEventListener()의 콜백으로 넘겨짐
      event.preventDefault();
      const userInput = this.gatherUserInput();
      if (Array.isArray(userInput)) {
        // JS에는 tuple 개념이 없으므로 tuple 타입인지 확인할 수는 없음
        const [title, description, people] = userInput;
        projectState.addProject(title, description, people);
        this.clearInputs();
      }
    }
  }
}
