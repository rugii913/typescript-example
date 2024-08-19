class ProjectInput {

  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;

  constructor() {
    this.templateElement = document.getElementById("project-input")! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    const importedNode = document.importNode(this.templateElement.content, true);
    // - importNode()는 전역 document 객체의 메서드 - return type은 DocumentFragment
    // - content는 <template> 사이에 있는 HTML 코드에 대한 참조, 두번째 인자는 깊은 복사 여부
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.attach();
  }

  private attach() { // 선택 로직과 렌더링 로직을 분리했음
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
    // - insertAdjacentElement()는 브라우저 제공 기본 JS 메서드, HTML element 삽입 시 사용
    //   - 첫번째 parameter인 where: InsertPosition은 "beforebegin"(시작 태그 앞), "afterbegin"(시작 태그 뒤), "beforeend"(종료 태그 앞), "afterend"(종료 태그 뒤) 중 하나
  }
}

const projectInput = new ProjectInput(); // constructor에서 template element 선택 후 렌더링 메서드를 호출했으므로, 인스턴스 생성만으로 form이 렌더링됨
