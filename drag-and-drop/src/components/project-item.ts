/// <reference path="base-component.ts" />

namespace App {
  // class ProjectItem
  export class ProjectItem
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
}
