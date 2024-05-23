class Department {
  // private id: string;
  // private name: string;
  private employees: string[] = [];

  constructor(private readonly id: string, private name: string) {
    // field 구문을 사용하는 대신 parameter properties 사용
    // this.id = id;
    // this.name = name;
  }

  describe(this: Department) {
    console.log(`Department (${this.id}): ${this.name}`);
  }

  addEmployee(employee: string) {
    this.employees.push(employee);
  }

  printEmployeeInformation() {
    console.log(this.employees.length);
    console.log(this.employees);
  }
}

const accounting = new Department("d1", "Accounting");
console.log(accounting);
accounting.describe();

// describe()의 this parameter 덕분에 컴파일 에러가 발생함
// const accountingCopy = { describe: accounting.describe };
// accountingCopy.describe();
// cf. 적절한 property를 갖고 있다면, 컴파일 에러를 발생시키지는 않음
// const accountingCopy: Department = { name: "Accounting2", describe: accounting.describe };
// accountingCopy.describe();

accounting.addEmployee("Kim");
accounting.addEmployee("Lee");
// accounting.employees[2] = "Kwon"; // access modifier를 명시하지 않을 경우, 직접 접근하여 문제가 될 수 있음
accounting.printEmployeeInformation();
