abstract class Department {
  static fiscalYear = 2024;
  // private id: string;
  // private name: string;
  protected employees: string[] = [];

  constructor(protected readonly id: string, protected name: string) {
    // field 구문을 사용하는 대신 parameter properties 사용
    // this.id = id;
    // this.name = name;
  }

  abstract describe(this: Department): void;

  addEmployee(employee: string) {
    this.employees.push(employee);
  }

  printEmployeeInformation() {
    console.log(this.employees.length);
    console.log(this.employees);
  }
}

class ITDepartment extends Department {
  constructor(id: string, public admins: string[]) {
    super(id, "IT");
    this.admins = admins;
  }

  describe(this: ITDepartment) {
    console.log(`IT Department - ID: ${this.id}`);
  }
}

class AccountingDepartment extends Department {
  private static instance: AccountingDepartment;
  private _lastReport: string;

  get lastReport() {
    if (this._lastReport) { // lastReport가 truthy일 경우
      return this._lastReport;
    } 
    throw new Error("No report found."); // lastReport가 falsy일 경우
  }

  set lastReport(value: string) {
    if (!value) {
      throw new Error("Please pass in a valid value!");
    }
    this.addReport(value);
  }

  private constructor(id: string, private reports: string[]) {
    super(id, "Accounting");
    this._lastReport = reports[0];
  }

  static getInstance() {
    if (this.instance) { // cf. static member끼리는 this를 이용한 접근 가능
      return this.instance;
    }
    this.instance = new AccountingDepartment("d2", []);
    return this.instance;
  }

  addEmployee(employee: string) { // override한 method
    if (employee === "Max") {
      return;
    }
    this.employees.push(employee);
  }

  addReport(text: string) {
    this.reports.push(text);
    this._lastReport = text;
  }

  printReports() {
    console.log(this.reports);
  }

  describe(this: AccountingDepartment): void {
    console.log(`Accounting Department - ID: ${this.id}`);
  }
}

// * obejct literal로 특정 class의 object를 작성할 경우, this 관련 유의점
// describe()의 this parameter 덕분에 컴파일 에러가 발생함
// const accountingTemp = new Department("d0", "Accounting");
// const accountingCopy = { describe: accounting.describe };
// accountingCopy.describe();
// cf. 적절한 property를 갖고 있다면, 컴파일 에러를 발생시키지는 않음
// const accountingCopy: Department = { name: "Accounting2", describe: accounting.describe };
// accountingCopy.describe();

const it = new ITDepartment("d1", ["Bob"]);
console.log(it);

const accounting = AccountingDepartment.getInstance();
// console.log(accounting.mostRecentReport); // getter 로직에 따라 에러 발생
accounting.addReport("Something went wrong...");
// accounting.mostRecentReport = "" // setter 로직에 따라 에러 발생
accounting.lastReport = "Year End Report" // setter 사용
accounting.printReports();
console.log(accounting.lastReport); // getter 사용
accounting.addEmployee("Kim");
accounting.addEmployee("Lee");
accounting.addEmployee("Max");
// accounting.employees[2] = "Kwon"; // access modifier를 명시하지 않을 경우, 직접 접근하여 문제가 될 수 있음
accounting.printEmployeeInformation();
console.log(accounting);

// console.log(accounting.fiscalYear); // JS, TS에서 static member에 대해 instance를 통한 접근은 불가능
console.log(Department.fiscalYear);
it.describe();
accounting.describe();
console.log(AccountingDepartment.getInstance() === AccountingDepartment.getInstance());
