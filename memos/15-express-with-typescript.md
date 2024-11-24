## Node + Express + TypeScript

### Node.js로 TypeScript 코드 실행하기
- Node는 기본적으로 모든 파일을 js로 처리
  - TypeScript 고유 문법이 있는 .ts 파일을 실행시키면 오류 발생
  - tsc로 컴파일한 .js 파일만 제대로 실행할 수 있음
- ts-node 패키지
  - Node 실행 파일과 결합된 TS compiler를 제공
  - 이를 global로 설치해서 .ts 파일을 실행할 수 있음
- 문제는 production에서 웹 서버, 웹 호스트에서 ts-node를 활용해 스크립트를 제공하기엔 부적절
  - 코드를 실행할 때마다 추가 컴파일 단계를 거치므로 오버헤드가 발생 

### 프로젝트 설정하기
- npm init으로 package.json 생성
- tsc --init으로 TypeScript 프로젝트로 초기화 → tsconfig.json 생성
- tsconfig.json 설정
  - "target": "es2018"
  - "module": "commonjs"
  - "moduleResolution": "node" → 여러 파일과 import가 상호 작용하는 방법을 알림
  - "outDir": "./dist"
  - "rootDir": "./src" → .ts 파일과 .js 파일을 분리
  - "strict": true → 본인에게 편한 설정으로 조정
- src 디렉토리 생성
- npm i express body-parser → Express.js 종속성, 요청 body를 파싱할 body-parser 종속성 설치
- npm i -D nodemon → 개발 환경에서 코드 변경 사항 발생 시 감지하여 반영

### 설정 완료 및 Node + Express 앱에서 타입 작업하기 → Node 및 Express를 위한 type 지원 추가 등
- npm i -D @types/node → Node.js에서 사용할 type을 설치(require 관련)
- npm i -D @types/express → express()로 받아온 app에 대해 type을 활용하기 위해 필요
- Node.js가 기본적으로 사용하는 CommonJS import 구문인 require()를 사용하면 type 지원 불가
  - **브라우저 ES 모듈과 같은 import 구문을 사용해야 type 지원 가능**
  - cf. 실제 .js 출력 파일에서는 require()를 사용함을 확인할 수 있음
- nodemon을 사용하는 npm script 추가 뒤 실행 확인
  - "start": "nodemon dist/app.js"

### 미들웨어 및 타입 추가하기
- routes 디렉토리에 .ts 파일 작성하여 route 추가
  - 구성한 route들을 app.ts의 서버에 연결
    - express.Request, express.Response, express.NextFunction으로 구성된 전형적인 미들웨어 함수를 구성하기 
    - 가장 앞 parameter로 Error를 받아 미들웨어에서 오류 처리를 하도록 할 수 있음 → type 명시해줘야 함

### 컨트롤러 작업 및 요청 본문 파싱하기
- 역할에 따른 코드 분리
  - 비즈니스 로직은 controllers 디렉토리 하위로
  - 라우터는 routes 디렉토리 하위로
- models 하위 todo.ts 파일에 Todo 클래스 작성
  - 각 함수에서 사용할 할 일 객체의 blueprint
- controllers 하위의 todos.ts
  - 첫번째로 todo 등록 함수를 작성함
  - 라우터에서 매핑되는 함수 로직 작성
    - controllers 하위에 작성되는 함수는 RequestHandler type으로 명시하고
    - 이들은 express의 미들웨어 함수가 사용하는 일반적인 매개변수를 받음 → Request, Response, NextFunction type 인자들
      - 함수를 RequestHandler type으로 명시하면 parameter의 type은 알아서 추론해줌
      - cf. 실행되는 코드가 아니라 type만 import한 것이므로 실제 JS 코드에서는 import로도 나타나지 않음
    - Response 객체의 메서드 체이닝을 적절히 이용하여 응답을 구성
- routes 하위의 todos.ts
  - 요청이 각 route의 엔드포인트에 도달했을 때 실행할 함수 설정(handlers에 constrollers 하위에 작성한 함수 명시)
- app.ts에서 app.use(json());
  - 요청의 body를 파싱, JSON 데이터로 추출
    - controllers 하위의 함수가 Request 객체의 body에서 적절히 값을 가져올 수 있도록 하는 것

### 더 많은 CRUD 작업
- 조회, 수정, 삭제 API 작성
  - 수정, 삭제 API에서는 dynamic segment 이용 - req.params.id를 이용해 값을 쉽게 얻어올 수 있음
    - 이 때 params에 대한 type 추론을 활용하기 RequestHandler에 generic type 명시

### 마무리
- TS와 Express.js 예제를 살펴보려면 NestJS를 살펴보는 것을 추천
  - TS가 기본으로 지원되는 노드 프로젝트 시작 가능
