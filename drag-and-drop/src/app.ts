/// <reference path="drag-drop-interfaces.ts" />
/// <reference path="project-model.ts" />
/// <reference path="project-state.ts" />
/// <reference path="validation.ts" />
/// <reference path="autobind-decorator.ts" />

namespace App {
  // class Component - 렌더링 역할 클래스들의 base class 역할
  abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element: U;

    constructor(
      templateId: string,
      hostElementId: string,
      insertAtStart: boolean,
      newElementId?: string // (cf.) newElementId?로 파라미터 이름 뒤에 ?를 붙이는 대신 type을 string | undefined로 두는 것도 가능
      // templateId는 렌더링할 template의 id, hostElementId는 렌더링할 위치인 hostElement의 id, newElementId는 새로 삽입할 element의 id
    ) {
      this.templateElement = document.getElementById(
        templateId
      )! as HTMLTemplateElement;
      this.hostElement = document.getElementById(hostElementId)! as T;

      const importedNode = document.importNode(
        this.templateElement.content,
        true
      );
      /* 
    - (cf.) importNode()는 전역 document 객체의 메서드 - return type은 DocumentFragment
      - content는 <template> 사이에 있는 HTML 코드에 대한 참조, 두번째 인자는 깊은 복사 여부
    */

      this.element = importedNode.firstElementChild as U;
      if (newElementId) {
        // newElementId는 optional이므로 체크를 해줘야 함
        this.element.id = newElementId;
      }

      this.attach(insertAtStart);
      // (cf.) configure(), renderContent() 호출은 하위 type에서 진행
    }

    private attach(insertAtBeginning: boolean) {
      this.hostElement.insertAdjacentElement(
        insertAtBeginning ? "afterbegin" : "beforeend",
        this.element
      );
    }

    protected abstract configure(): void;
    protected abstract renderContent(): void;
  }

  // class ProjectItem
  class ProjectItem
    extends Component<HTMLUListElement, HTMLLIElement>
    implements Draggable
  {
    private project: Project;

    // getter는 보통 필드 아래 둠 // getter는 함수와 비슷하지만, ()를 붙이지 않음, property처럼 사용
    // (cf.) getter는 TS 고유 문법이 아니라, JS에서도 사용 가능
    get people() {
      if (this.project.people === 1) {
        return "1 person";
      } else {
        return `${this.project.people} people`;
      }
    }

    constructor(hostId: string, project: Project) {
      super("single-project", hostId, false, project.id);
      this.project = project;

      this.configure();
      this.renderContent();
    }

    @autobind // 항상 event listener에서는 this를 유의
    dragStartHandler(event: DragEvent) {
      // (cf.) 모든 drag 관련 event가 DataTransfer 타입 객체를 가진 event 객체를 제공하지는 않으므로 null일 수 있음
      // - 하지만 여기 drag를 시작하는 event는 DataTransfer 타입 객체가 있을 것이 명확함
      event.dataTransfer!.setData("text/plain", this.project.id); // format은 데이터의 형식을 나타내는 식별자(자세한 내용은 공식 문서 참고), data는 데이터 자체(여기서는 project의 id만 전달하면 충분)
      event.dataTransfer!.effectAllowed = "move"; // 커서의 모양을 제어하는 역할
    }

    dragEndHandler(_event: DragEvent) {
      console.log("DragEnd"); // 일단은 event가 트리거됐는지만 확인
    }

    protected configure(): void {
      this.element.addEventListener("dragstart", this.dragStartHandler);
      this.element.addEventListener("dragend", this.dragEndHandler);
    }

    protected renderContent(): void {
      this.element.querySelector("h2")!.textContent = this.project.title;
      this.element.querySelector("h3")!.textContent = this.people + " assigned";
      this.element.querySelector("p")!.textContent = this.project.description;
    }
  }

  // class ProjectList
  class ProjectList
    extends Component<HTMLDivElement, HTMLElement>
    implements DragTarget
  {
    // base class를 상속하면서 주석 처리
    // templateElement: HTMLTemplateElement;
    // hostElement: HTMLDivElement;
    // element: HTMLElement; // HTMLSectionElement type은 존재하지 않음(특별한 기능이 없으므로)
    assignedProjects: Project[];

    constructor(private type: "active" | "finished") {
      // constructor의 parameter에 접근제어자를 추가하여 같은 이름의 property가 클래스에 존재하도록 함
      // (cf.) 위 constructor의 parameter의 type으로는 ProjectStatus enum을 사용하지 않았음 → 문자열 리터럴을 그대로 사용하기 위함
      super("project-list", "app", false, `${type}-projects`); // base class의 생성자를 호출하여 base class의 생성자 로직을 사용
      this.assignedProjects = [];

      this.configure();
      this.renderContent();
    }

    @autobind
    dragOverHandler(event: DragEvent): void {
      if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
        event.preventDefault(); // JS drag and drop 이벤트의 기본값을 drop을 허용하지 않는 것 - 이 기본 동작을 막아 drop이 가능하도록 함
        const listElement = this.element.querySelector("ul")!;
        listElement.classList.add("droppable");
      }
    }

    @autobind
    dropHandler(event: DragEvent): void {
      const projectId = event.dataTransfer!.getData("text/plain");
      projectState.moveProject(
        projectId,
        this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
      );
    }

    @autobind
    dragLeaveHandler(_event: DragEvent): void {
      const listElement = this.element.querySelector("ul")!;
      listElement.classList.remove("droppable");
    }

    protected configure() {
      this.element.addEventListener("dragover", this.dragOverHandler);
      this.element.addEventListener("drop", this.dropHandler);
      this.element.addEventListener("dragleave", this.dragLeaveHandler);

      // 전역 상태에 listener를 추가하는 부분을 여기서 처리
      projectState.addListener((projects: Project[]) => {
        // listener 함수 등록
        // listener 함수 내에서 프로젝트를 저장하고 렌더링하기 전에 active/finished로 필터링
        const relevantProjects = projects.filter((project) => {
          if (this.type === "active") {
            return project.status === ProjectStatus.Active;
          }
          return project.status === ProjectStatus.Finished;
        });

        this.assignedProjects = relevantProjects;
        this.renderProjects();
      });
    }

    // renderContent와 사용하는 곳이 다름
    // - constructor에서 처음 assignedProjects를 렌더링할 때, ul 요소에 id 부여 + 렌더링할 제목 넣음
    protected renderContent() {
      // 원래는 private으로 두었으나, 상속해서 사용하기 위해 public으로 둠 → protected로 변경하여 함부로 사용하지 못하도록 변경
      const listId = `${this.type}-projects-list`;
      this.element.querySelector("ul")!.id = listId;
      this.element.querySelector("h2")!.textContent =
        this.type.toUpperCase() + " PROJECTS";
    }

    // ProjectState 싱글톤의 addListener()를 이용해 listener로 등록된 함수에서 이 renderProjects()를 호출
    // - ProjectInput에 의해 전역으로 관리되는 Project 인스턴스가 새로 추가될 때, ProjectList도 새로 렌더링해주기 위함
    private renderProjects() {
      const listElement = document.getElementById(
        `${this.type}-projects-list`
      )! as HTMLUListElement;
      /* 
    (cf.) 실제로 개발을 할 때는 모든 리스트 항목을 삭제하고 다시 렌더링하는 것은 피하고 싶을 수 있음
    - 새로운 프로젝트를 추가할 때마다 모든 프로젝트를 전부 다시 렌더링해야 하기 때문
    - 그런데 이미 렌더링된 것들을 확인하고 렌더링할 것이 무엇인지 확인해서 렌더링을 피하는 방법을 실제 DOM 요소에 대해 작업하는 방식은 성능이 좋지 않음
      - 일단은 이대로 놔두고 추후 개선 필요
    */
      listElement.innerHTML = "";

      for (const projectItem of this.assignedProjects) {
        /* (cf.) 단순하게 this.element.id를 넘길 경우, this.element는 <section> 요소이므로 원하는 대로 렌더링되지 않음에 유의 */
        new ProjectItem(this.element.querySelector("ul")!.id, projectItem);
      }
    }
  }

  // class ProjectInput
  class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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

  new ProjectInput(); // constructor에서 template element 선택 후 렌더링 메서드를 호출했으므로, 인스턴스 생성만으로 form이 렌더링됨
  new ProjectList("active");
  new ProjectList("finished");
}
