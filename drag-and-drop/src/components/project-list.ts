import { DragTarget } from "../models/drag-drop.js";
import { Project, ProjectStatus } from "../models/project.js";
import { Component } from "./base-component.js";
import { autobind } from "../decorators/autobind.js";
import { projectState } from "../state/project-state.js";
import { ProjectItem } from "./project-item.js";

// class ProjectList
export class ProjectList
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
