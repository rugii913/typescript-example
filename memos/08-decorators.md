## decorators
- decorator란? 
  - decorator는 meta-programming에 유용하게 사용
  - [영문 위키 - Metaprogramming 문서](https://en.wikipedia.org/wiki/Metaprogramming)
    - 다른 program을 data처럼 다루는 것 → end user에게 전달되는 비즈니스 로직이라기보다는 개발자의 개발 편의를 위한 코드라고 생각하면 될 것
- [TS 공식문서 - decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)

### decorator 작성 및 사용
- **decorator는 target인 class가 인스턴스화될 때가 아니라 정의될 때 실행됨**에 유의

#### (작성 방법 1) 직접 decorator function 정의
- decorator로 사용할 function을 작성 → decorator는 결국 function임
  - 특정 방식으로 class, property 등에 추가할 수 있는 function일 뿐
  - decorator function이 class에 붙는 경우, target class의 생성자 함수를 받을 parameter가 반드시 있어야 함
- class 위에 @\[decorator\] 를 붙임
  - @는 TS가 인식할 수 있는 특수한 identifier
  - @ 뒤에는 반드시 function이 와야 함 → 그러면 지정된 함수가 decorator가 됨

#### (작성 방법 2) decorator factory 정의
- 필요한 로직을 실행할 function을 return value로 줄 decorator factory 역할 function 작성
  - argument를 넘겨서 사용하는 등 유연하게 사용 가능

#### 실행 순서 관련 유의 사항
- 여러 decorator가 한 target에 붙어 있는 경우 아래에 있는 decorator가 먼저 실행됨
  - cf. decorator factory를 사용하는 경우, decorator function 실행 코드가 아닌
    - decorator factory의 실행 순서는 평범한 코드의 순서와 마찬가지로 위에서 아래로 실행
    - decorator function의 생성 순서라고 생각하면 될 것

#### decorator 적용 대상
- class, property, accessor(접근자), parameter

### decorator를 활용하는 라이브러리, 프레임워크 예시
- typestack/class-validator 라이브러리
- Angular 프레임워크
- NestJS 프레임워크

### TODO - decorator 관련 메모 추후 보완 필요
