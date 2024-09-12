// interfaces for drag and drop
// (cf.) 인터페이스는 커스텀 객체 타입을 정의할 때 뿐만 아니라, 클래스에 대한 계약으로 사용할 수 있음
// - interface Draggable
interface Draggable {
  // (cf.) DragEvent는 TS 내장 타입
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}
// - interface DragTarget
interface DragTarget {
  dragOverHandler(event: DragEvent): void; // 대상이 유효한 드래그 타겟임을 브라우저와 JS에 알림
  dropHandler(event: DragEvent): void; // 실제 드롭이 발생했을 때 반응
  dragLeaveHandler(event: DragEvent): void; // 아무 것도 하지 않고 드래그 타겟을 떠났을 때 사용자에게 시각적인 피드백을 주는 것과 관련
}

// enum ProjectStatus - 사람이 읽어서 이해해야하는 텍스트를 줄이기 위해 enum 사용
enum ProjectStatus {
  Active,
  Finished,
}

// class Project - 타입 안정성을 위한 타입 추가, 인스턴스화하기 위해서 interface나 custom type이 아닌 class 사용
class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus// "active" | "finished", // union type 대신 enum 사용
  ) {}
}

// type Listener - 타입 안정성을 위해 타입 추가, 함수인데 특정한 parameter를 받는 함수임을 명시하기 위함
type Listener<T> = (items: T[]) => void;

// class State - 다양한 상태를 관리할 때를 대비한 일반화된 상태 관리 base class
class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFunction: Listener<T>) {
    this.listeners.push(listenerFunction);
  }
}

// class ProjectState - project state management
/* 
- ProjectInput 인스턴스 생성 시 ProjectList 인스턴스 참조를 넘겨 
  - 프로젝트 추가 버튼 클릭 시 ProjectList 인스턴스 내 addProject() 같은 메서드를 두어 호출하게 할 수도 있겠으나,
- 전역으로 관리되는 데이터(상태)를 두고 listener를 이용하는 방식을 사용함
  - ProjectList 인스턴스 생성 시 projectState.addListener()를 호출하여 listener를 등록
  - listener는 Project[]을 arg로 받아 ProjectList 인스턴스의 renderProjects()를 호출(renderContent()를 호출하는 게 아님)하는 함수
  - ProjectInput 인스턴스에서 버튼의 handler로 추가한 함수 내부 로직에 projectState.addProject()를 호출하는 부분이 있음
  - 이 addProject() 내 로직으로
    - 추가된 Project 인스턴스를 ProjectState의 project: Project[]에 push()하고 난 뒤
    - 각 ProjectList가 생성되며 등록된 모든 listener를 호출
*/
class ProjectState extends State<Project> {
  private projects: Project[] = []; // add projects 버튼을 누를 때, 전역 상태 관리 객체의 이 리스트에 프로젝트 항목을 추가하고자 함
  private static instance: ProjectState; // 싱글톤 static 필드

  private constructor() { // 생성을 막기 위해 생성자를 private으로 둠
    super();
  }

  static getInstance() { // 싱글톤 보장
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(title: string, description: string, numberOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(), // 엄밀히 말하면 고유한 값은 아닐 수 있지만, 정밀한 앱은 아니므로 이대로 사용
      title,
      description,
      numberOfPeople,
      ProjectStatus.Active, // 새 프로젝트를 만들면 기본값으로 Active 상태가 되도록 함
    );
    this.projects.push(newProject);

    // 새 프로젝트를 추가(addProject() 호출 시) 할 때 모든 listener 함수가 호출되도록 함
    for (const listenerFunction of this.listeners) {
      listenerFunction(this.projects.slice()); // slice()를 호출해서 projects 배열 원본이 아닌 사본을 arg로 넘김 - 원본은 수정하지 못하도록 함
    }
  }
}

const projectState = ProjectState.getInstance(); // 전역 상태 관리 인스턴스를 스크립트 위 쪽에 미리 생성해둠

// interface Validatable - validation
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

// decorator autobind
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

// class Component - 렌더링 역할 클래스들의 base class 역할
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string, // (cf.) newElementId?로 파라미터 이름 뒤에 ?를 붙이는 대신 type을 string | undefined로 두는 것도 가능
    // templateId는 렌더링할 template의 id, hostElementId는 렌더링할 위치인 hostElement의 id, newElementId는 새로 삽입할 element의 id
  ) {
    this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as T;

    const importedNode = document.importNode(this.templateElement.content, true);
    /* 
    - (cf.) importNode()는 전역 document 객체의 메서드 - return type은 DocumentFragment
      - content는 <template> 사이에 있는 HTML 코드에 대한 참조, 두번째 인자는 깊은 복사 여부
    */

    this.element = importedNode.firstElementChild as U;
    if (newElementId) { // newElementId는 optional이므로 체크를 해줘야 함
      this.element.id = newElementId;
    }

    this.attach(insertAtStart);
    // (cf.) configure(), renderContent() 호출은 하위 type에서 진행
  }

  private attach(insertAtBeginning: boolean) {
    this.hostElement.insertAdjacentElement(insertAtBeginning ? "afterbegin" : "beforeend", this.element);
  }

  protected abstract configure(): void;
  protected abstract renderContent(): void;
}

// class ProjectItem
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
  private project: Project;
  
  // getter는 보통 필드 아래 둠 // getter는 함수와 비슷하지만, ()를 붙이지 않음, property처럼 사용
  // (cf.) getter는 TS 고유 문법이 아니라, JS에서도 사용 가능
  get people() { 
    if (this.project.people === 1) {
      return "1 person";
    } else {
      return `${this.project.people} people`
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
    console.log(event);
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
class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  // base class를 상속하면서 주석 처리
  // templateElement: HTMLTemplateElement;
  // hostElement: HTMLDivElement;
  // element: HTMLElement; // HTMLSectionElement type은 존재하지 않음(특별한 기능이 없으므로)
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") { // constructor의 parameter에 접근제어자를 추가하여 같은 이름의 property가 클래스에 존재하도록 함
    // (cf.) 위 constructor의 parameter의 type으로는 ProjectStatus enum을 사용하지 않았음 → 문자열 리터럴을 그대로 사용하기 위함
    super("project-list", "app", false, `${type}-projects`); // base class의 생성자를 호출하여 base class의 생성자 로직을 사용
    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  protected configure() { // 전역 상태에 listener를 추가하는 부분을 여기서 처리
    projectState.addListener((projects: Project[]) => { // listener 함수 등록
      // listener 함수 내에서 프로젝트를 저장하고 렌더링하기 전에 active/finished로 필터링
      const relevantProjects = projects.filter(project => {
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
  protected renderContent() { // 원래는 private으로 두었으나, 상속해서 사용하기 위해 public으로 둠 → protected로 변경하여 함부로 사용하지 못하도록 변경
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent = this.type.toUpperCase() + " PROJECTS";
  }

  // ProjectState 싱글톤의 addListener()를 이용해 listener로 등록된 함수에서 이 renderProjects()를 호출
  // - ProjectInput에 의해 전역으로 관리되는 Project 인스턴스가 새로 추가될 때, ProjectList도 새로 렌더링해주기 위함
  private renderProjects() {
    const listElement = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
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
    this.titleInputElement = this.element.querySelector("#title") as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector("#description") as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector("#people") as HTMLInputElement;

    this.configure();
  }

  configure() {
    this.element.addEventListener("submit", this.submitHandler); // JS, TS의 this binding 때문에 bind()를 명시 → @autobind를 사용하여 명시된 bind()를 숨김
  }

  renderContent() {} // 상속을 위해 정의했지만, 아무것도 내용도 넣지 않음

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
      projectState.addProject(title, description, people);
      this.clearInputs();
    }
  }
}

const projectInput = new ProjectInput(); // constructor에서 template element 선택 후 렌더링 메서드를 호출했으므로, 인스턴스 생성만으로 form이 렌더링됨
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");
