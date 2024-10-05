## TypeScript와 서드파티 라이브러리
- 볼 내용
  - (1) JS로도 사용하는 라이브러리를 TS에서 활용하는 방법
  - (2) 타입스크립트 전용 라이브러리
- (cf.) 강의에서 주어진 초기 프로젝트 구성 파일에서 몇 가지 변경해야 실행됨
  - webpack.config.js
    - devServer 설정 → 없으면 index.html의 경로가 src가 아님
    - output의 publicPath: "/dist/"
    -   module의 rules 배열의 test는 ...tsx...가 아닌 ...ts...로 변경(tsx로도 가능한지는 확인 필요)
  - package.json의 dependencies에 있는 것들은 모두 devDependencies로 변경함
  - tsconfig.json의 module, moduleResolution 등 변경

### TypeScript와 함께 JavaScript 라이브러리 사용하기 + 최후의 수단으로 "declare" 사용
- Lodash를 예시로 활용
  - lodash와 같이 널리 알려진 라이브러리들은 TS용 라이브러리(ex. @types/lodash)도 존재하므로 이를 사용하는 것이 편리
  - JS로만 작성된 라이브러리를 사용할 때 생각해볼 부분들이 있음

#### 순수 JS 라이브러리를 사용할 때 발생하는 문제
- npm i lodash 이후 .ts 파일에 import _ from "lodash";를 작성하면 다음과 유사한 오류 메시지를 보게 됨
  - "Could not find a declaration file for modul 'lodash'. ..."
- npm start로 시작해보려고 해도 다음의 오류를 확인하게 됨
  - TS7016: Could not find a declaration file for module 'lodash'. 'C:\typescript-example\using-library-with-ts\node_modules\lodash\lodash.js' implicitly has an 'any' type.
  - Try \`npm i --save-dev @types/lodash\` if it exists or add a new declaration (.d.ts) file containing \`declare module 'lodash';\`
- lodash는 바닐라 JS 라이브러리이기 때문
  - node_modules/lodash에는 .js 파일들만 존재 → 패키지에 무엇이 있는지 TS는 알 수가 없음
    - lodash가 무엇을 export 하는지 알 수가 없음
  - (cf.) tsconfig.json 설정 중 noEmitOnError를 false로 변경한 뒤
    - app.ts에 console.log(_.shuffle([1,2,3])); 같은 것을 작성하고 페이지를 새로고침 해보면
    - lodash가 동작은 하고 있지만 TS에서 알지 못하는 것이기에 오류를 발생시키고 있음을 알 수 있음

#### 위 문제에 대한 해결 방법
- (1) TS를 위해 변환된 타입 변환 패키지\(@types/...과 같은 라이브러리\) 사용
  - lodash types로 구글링하면 @types/lodash라는 이름의 npm 패키지를 확인할 수 있음
  - 유명한 라이브러리들은 이처럼 TS용 라이브러리가 이미 존재함
    - GitHub의 DefinitelyTyped 리포지토리에 많은 서드파티 라이브러리 변환 파일들이 있음
  - xxx.d.ts 파일들
    - .ts 파일이 아니라 .d.ts 파일들 → 실제 로직은 없는 선언만 있는 파일들임
    - shuffle.d.ts 파일에는 TS에 전달할 지침들이 포함(동작 방식, 패키지에 무엇이 들어있는지 알리는 역할)
    - 이 파일들 덕분에 순수 JS를 TS에서 사용할 수 있게 됨
      - 라이브러리에 사용할 type을 찾고, 사용할 type, 메서드를 호출할 때 반환될 type 등을 정의
    - 공식 문서 지침을 따라 직접 .d.ts 파일을 작성해볼 수도 있음
  - 사용 시에는 바닐라 JS 프로젝트에서 lodash를 사용할 때와 똑같은 방법으로 사용하면 됨
    - import 할 때 @types 같은 것을 붙일 필요도 없음
    - (ex.) import _ from "lodash";
    - 이렇게 @types/... 라이브러리를 사용하면 컴파일 오류도 없고, 자동 완성 기능의 도움도 받을 수 있음
    - (cf.) @types/lodash를 사용할 때 lodash도 함께 설치되어 있어야함
      - @types/lodash에는 실행 코드가 없는 정의 파일이므로 원본 lodash가 필요
      - [stackoverflow 관련 질문](https://stackoverflow.com/questions/41530219/module-not-found-error-cannot-resolve-module-types-lodash)
      - 없을 경우 Can't resolve '@types/lodash' in '...' resolve '@types/lodash' in '...' 오류 발생
  - (cf.) 종종 순수 JS 라이브러리이지만 자체적으로 .d.ts 파일을 포함한 경우가 있음
    - 이런 경우 당연히 별도의 변환 패키지를 설치할 필요는 없음
- (2) 최후의 수단으로 declare 사용
  - lodash와 같이 유명한 라이브러리가 아니라서 @types가 붙은 패키지가 없는 경우 사용
  - 꼭 라이브러리가 아니더라도
    - index.html의 < script >에 추가된 전역 변수(따라서 window 객체에 추가된 변수)를 어떻게 사용할 수 있는가?
  - declare 키워드를 사용
    - declare로 선언하여 개발자가 알고 있는 패키지, 전역 변수를 TS에 알려줌
    - declare가 없다면 TS가 컴파일할 때 알 수 없는 이름을 TS가 오류 없이 처리하도록 해주는 것

### TypeScript 전용 라이브러리
- 강의 중 "필요한 타입 없음: class-transformer", "TypeScript 수용: 클래스 검증자" 내용

#### class-transformer 라이브러리
- 해결하고자 하는 문제
  - 다음과 같은 상황 가정
    - 외부에서 JSON 형식으로 데이터를 받아옴
    - 당연히 기본적으로 이 데이터의 type을 알 수 없음
      - 필요하다면 객체에 메타데이터를 직접 연결해줘야 함
      - 데이터의 구조가 겉으로는 같아보여도 외부에서 받아온 데이터로 만든 객체에서 메서드를 사용할 수 없다는 뜻
  - 이 외부에서 받아온 데이터로 만들어진 객체를 custom type 모델의 인스턴스로 바꾸려면
    - 원래는 일일히 생성자들을 사용하여 직접 바꿔줘야 함
  - 이 때 class-transforme 라이브러리를 사용하면 간편하게 변환 가능
- 사용 방법
  - [라이브러리 GitHub 문서 참고](https://github.com/typestack/class-transformer)
  - 라이브러리 설치
    - npm i class-transformer --save로 class-transformer 라이브러리 설치
    - npm i reflect-metadata --save로 reflect-metadata 라이브러리도 설치
  - 라이브러리 사용
    - reflect-metadata를 global로 import 해둠(class-transformer에서 의존하고 있는 라이브러리이므로 반드시 필요함)
    - class-transformer에서 plainToInstance 메서드 import
      - (cf.) 강의에서는 plainToClass를 사용했으나, 메서드명이 바뀌었음
    - plainToInstance(\[변환 목표 클래스\], \[변환하려는 데이터\])
      - 변환하려는 데이터로는 바꿀 대상 객체들을 담은 배열도 가능
- (cf.) TS에 기반해 만들어졌고 TS를 활용하기는 하나
  - 클래스 자체는 JS에도 있으므로 TS 전용 기능을 사용했다고 하기는 애매
  - 실제로 바닐라 JS를 사용한 프로젝트에서도 동작함

#### class-validator 라이브러리 - TypeScript 수용
- class-validator는 TS 전용 기능인 decorator를 을 사용하여, TS를 적극적으로 활용하는 패키지
  - 앞선 강의들에서 직접 작성해보았던 validator 기능을 더 정교하게 수행
  - decorator를 이용해 validation(유효성 검사) 규칙 추가 가능
  - class를 인스턴스화할 때 decorator를 이용하여 설정한 규칙 validation 가능
- 사용 방법
  - [라이브러리 GitHub 문서 참고](https://github.com/typestack/class-validator)
  - 라이브러리 설치
    - npm i class-validator --save
  - 라이브러리 사용
    - tsconfig.json에서 "experimentalDecorators": true로 설정
    - class-validator의 IsNotEmpty, IsNumber, IsPositive 등 데코레이터 import
    - 모델에서 validation할 필드 위(혹은 앞)에 데코레이터를 붙여 validation 규칙 추가
      - (ex.) @IsNotEmpty() title: string;
      - 모두 데코레이터 팩토리이므로 ()를 붙여 실행시켜줘야 함
    - 해당 모델을 사용하는 곳에서 class-validator의 validate를 import한 후
      - 해당 모델의 인스턴스를 인자로 넘기며 validate 호출
      - validate는 validation 결과를 담은 Promist 객체를 반환
      - .then(), await 등으로 결과를 받아서 오류 여부에 따라 다른 로직을 타도록 함
