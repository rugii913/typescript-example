// enum ProjectStatus - 사람이 읽어서 이해해야하는 텍스트를 줄이기 위해 enum 사용
export enum ProjectStatus {
  Active,
  Finished,
}

// class Project - 타입 안정성을 위한 타입 추가, 인스턴스화하기 위해서 interface나 custom type이 아닌 class 사용
export class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus // "active" | "finished", // union type 대신 enum 사용
  ) {}
}
