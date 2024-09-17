namespace App {
  // class Component - 렌더링 역할 클래스들의 base class 역할
  export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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
}
