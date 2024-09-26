import { ProjectInput } from "./components/project-input";
import { ProjectList } from "./components/project-list";

new ProjectInput(); // constructor에서 template element 선택 후 렌더링 메서드를 호출했으므로, 인스턴스 생성만으로 form이 렌더링됨
new ProjectList("active");
new ProjectList("finished");
