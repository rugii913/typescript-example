// interface Validatable - validation
export interface Validatable {
  // 검증할 수 있는 객체를 정의
  // 객체의 구조를 정의하므로 interface를 사용했지만, 커스텀 타입인 type 혹은 class로 정의하는 것도 가능함
  value: string | number;
  // (cf.) ?를 사용하는 대신 boolean | undefined처럼 undefined를 허용할 수도 있음, ?가 같은 역할을 함
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

export function validate(validatableInput: Validatable) {
  let isValid = true; // 우선 true로 두고 검증을 통과하지 못하면 false를 반환
  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0; // &&의 뒤에 있는 expression의 평가 결과가 false라면 isValid는 false가 됨
  }
  if (
    validatableInput.minLength != null &&
    // - 위에서 이미 length를 확인했기 때문에 minLenth의 값을 확인하는 것은 군더더기일 수 있으나, 안전성을 위해 검사
    //   - minLength가 falsy인 0이어도 이 검사를 실행하게될 것(validatableInput.minLength라고만 되어 있다면 minLength 값이 0이면 이 검사를 넘어갈 것임)
    // - !==를 사용한다면 undefined를 명시해줘야 하지만, != null로 undefined를 포함시킴
    typeof validatableInput.value === "string" // typeof로 타입 가드
  ) {
    isValid =
      isValid && validatableInput.value.length >= validatableInput.minLength;
  }
  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length <= validatableInput.maxLength;
  }
  if (
    validatableInput.min != null &&
    typeof validatableInput.value === "number"
    // min 값이 0일 경우 문제가 생기므로 validatableInput.min처럼 truthy, falsy로 검사하지 않음
  ) {
    isValid =
      isValid &&
      validatableInput.value >= validatableInput.min &&
      Number.isInteger(validatableInput.value);
    // - Number.isInteger(validatableInput.value) 부분은 강의와 다르게 별도로 추가함
    // - HTML에서는 <input>의 type="number"로 방지하고 있었으나, HTML만 변경해도 제출할 수 있었음
  }
  if (
    validatableInput.max != null &&
    typeof validatableInput.value === "number"
    // min 값이 0일 경우 문제가 생기므로 validatableInput.min처럼 truthy, falsy로 검사하지 않음
  ) {
    isValid =
      isValid &&
      validatableInput.value <= validatableInput.max &&
      Number.isInteger(validatableInput.value);
  }
  return isValid;
}
