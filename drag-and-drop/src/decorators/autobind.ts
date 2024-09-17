// decorator autobind
export function autobind(
  _target: any,
  _methodName: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const adjustedDescriptor: PropertyDescriptor = {
    configurable: true, // 변경할 수 있게 함
    get() {
      // 함수에 access할 때, 원래 함수 대신 이 getter의 return인 함수를 받음
      const boundFunction = originalMethod.bind(this);
      return boundFunction;
    },
  };
  return adjustedDescriptor;
}
