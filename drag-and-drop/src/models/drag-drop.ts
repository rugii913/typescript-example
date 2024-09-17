// interfaces for drag and drop
// (cf.) 인터페이스는 커스텀 객체 타입을 정의할 때 뿐만 아니라, 클래스에 대한 계약으로 사용할 수 있음
// - interface Draggable
export interface Draggable {
  // (cf.) DragEvent는 TS 내장 타입
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

// - interface DragTarget
export interface DragTarget {
  dragOverHandler(event: DragEvent): void; // 대상이 유효한 드래그 타겟임을 브라우저와 JS에 알림
  dropHandler(event: DragEvent): void; // 실제 드롭이 발생했을 때 반응
  dragLeaveHandler(event: DragEvent): void; // 아무 것도 하지 않고 드래그 타겟을 떠났을 때 사용자에게 시각적인 피드백을 주는 것과 관련
}
