// 애플리케이션의 state를 전역으로 관리하기 위한 부분
namespace App {
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
  export class ProjectState extends State<Project> {
    private projects: Project[] = []; // add projects 버튼을 누를 때, 전역 상태 관리 객체의 이 리스트에 프로젝트 항목을 추가하고자 함
    private static instance: ProjectState; // 싱글톤 static 필드

    private constructor() {
      // 생성을 막기 위해 생성자를 private으로 둠
      super();
    }

    static getInstance() {
      // 싱글톤 보장
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
        ProjectStatus.Active // 새 프로젝트를 만들면 기본값으로 Active 상태가 되도록 함
      );
      this.projects.push(newProject);
      this.updateListeners();
    }

    moveProject(projectId: string, newStatus: ProjectStatus) {
      const project = this.projects.find((project) => project.id === projectId);
      if (project && project.status !== newStatus) {
        // 기존 status와 같은 경우 불필요한 재렌더링 방지
        project.status = newStatus;
        this.updateListeners();
      }
    }

    private updateListeners() {
      // 새 프로젝트 추가, 프로젝트 이동 시 모든 listener 함수가 호출되도록 함
      for (const listenerFunction of this.listeners) {
        listenerFunction(this.projects.slice()); // slice()를 호출해서 projects 배열 원본이 아닌 사본을 arg로 넘김 - 원본은 수정하지 못하도록 함
      }
    }
  }

  export const projectState = ProjectState.getInstance(); // 전역 상태 관리 인스턴스를 스크립트 위 쪽에 미리 생성해둠
}
