## TypeScript와 함께 Webpack 사용하기(A Modern Build Workflow)

### Webpack의 필요성
- ES6 모듈만을 이용해 여러 개의 파일로 분할했을 때의 문제점
  - 그리 용량이 크지 않은 개별 .js 파일을 받아오는데 여러 번 요청을 보내고 있음
  - 개발자 도구에서 요청, 응답을 확인해봤을 때
    - Request/Response 부분은 필수적이라고 하더라도
    - Resource Scheduling, Connection Start로 분류되는 시간이 요청 시마다 매번 추가됨
      - 브라우저가 요청 자체를 설정하고 전송하는 데에 필요한 시간
  - 실제로 웹에 배포하면, 많은 요청으로 인해 latency가 길어질 것
    - 요청의 양을 줄일 수 있는 솔루션이 필요함
- Webpack의 필요성
  - Webpack이란?
    - bundling & build orchestration tool
  - Webpack으로 할 수 있는 것들
    - 여러 파일들을 번들링해서 요청의 수를 줄일 수 있음
    - 빌드 단계에서 빌드 도구를 이용해 CSS 파일 최적화 등 최적화 가능
  - Webpack를 사용하지 않은 경우와 사용한 경우 비교
    - 사용하지 않은 경우
      - 여러 .ts 파일과 import 사용 → 여러 .js 파일로 인한 많은 HTTP 요청
      - 최적화되지 않은 코드 → 개별 파일 용량 측면에서 불리
        - 최적화하기 위해 변수, 함수 이름들을 바꿀 수 있지만, 수동으로 작업하기 까다로움
      - lite server와 같은 외부 개발 서버 구성 필요
    - 사용한 경우
      - 파일 번들링으로 요청 수 줄임
      - 짧은 코드로 최적화해서 다운로드할 파일의 용량 줄임
      - 빌드 단계 추가 용이\(개발 서버 추가도 쉬움\)
- Webpack 참고
  - [공식 사이트](https://webpack.js.org/)
  - [공식 docs](https://webpack.js.org/concepts/)

### Webpack 설치, 중요 종속성
- 프로젝트에 Webpack 서드파티 라이브러리 추가
  - npm install --save-dev webpack webpack-cli webpack-dev-server typescript ts-loader
    - \(cf.\) --save-dev 대신 -D로도 가능
      - [NPM docs 참고](https://docs.npmjs.com/cli/v10/commands/npm-install#description)
- 위에서 추가한 라이브러리 설명
  - webpack: 코드 번들링을 위한 플러그인 및 코드 변환을 돕는 도구
    - 코드 변환 기능을 이용해 .js 출력 파일을 번들링하기보다는 TS 코드를 JS로 변환 후 번들링한 .js 파일을 내놓도록 구성할 수 있음
      - 이 때 ts-loader를 활용
  - webpack-cli: 웹팩 명령을 프로젝트에서 실행
  - webpack-dev-server: 빌트인 개발 서버 구성, 내부에서 웹팩을 가동해서 파일의 변경 내역을 감시하고, 무언가 변경되면 자동으로 웹팩을 트리거해서 다시 컴파일하도록 함
  - typescript: 글로벌 typescript가 아니라 프로젝트마다 typescript를 두어 글로벌 TS 버전이 바뀌더라도 이미 설정된 프로젝트를 깨지지 않게 하려는 것
  - ts-loader: Webpack이 동작할 때 TS 코드를 JS로 변환하는 방법을 알려줌

### 입출력 구성 추가

#### tsconfig.json 구성 확인
- target → ES5 혹은 ES6로 설정
  - webpack과 ts-loader가 이 target 설정 기반으로 코드 변환 방식을 결정
    - ES5로 설정할 경우 구버전 브라우저에서도 실행되게 함
    - ES6로 설정할 경우 모던 브라우저세서만 실행
- module → ES6(ES2015)로 설정
- outDir
  - 기본적으로 세팅되어있는 "./dist"를 사용해도 되고
  - 컴파일 결과물을 다른 디렉토리에 두고 싶다면 변경
- rootDir → 불필요
  - webpack에서 root 파일 위치를 결정하므로 설정값 불필요

#### webpack.config.js 파일 추가 및 입출력 구성
- webpack.config.js 파일?
  - Webpack이 프로젝트 작업 방법을 전달할 때 자동으로 찾는 파일
    - 이 구성을 잘 해둬야 Webpack이 제대로 작동
  - (cf.) 이 파일에서는 JS 코드, Node.js 기능을 사용
- webpack.config.js 파일 작성
  - (cf.) Node.js의 export syntax 활용, JS 객체를 내보냄
  - entry: 전체 프로젝트가 시작되는 entry point 파일 경로
  - output: Webpack 동작 결과물 output point, 객체로 표현
    - filename: 번들링한 최종 결과물 .js 파일
      - (cf.) 동적인 부분을 추가할 수도 있음 (ex.) \[contenthash\]를 넣어 Webpack이 빌드마다 고유 해시를 만들게 하여 브라우저 캐싱 지원
    - path: 출력 파일 경로
      - tsconfig.json에 설정된 outDir 경로와 일치해야 오류가 발생하지 않음
      - 이 때 Webpack이 절대 경로를 사용해야 하므로
        - 코어 Node.js 모듈인 path를 이용하여 path.resolve()로 절대 경로를 구성하도록 도움
- 여기까지 구성했다면 Webpack이 기본적인 번들러로 기능하도록 설정한 것
  - .ts 파일로 무엇을 할지 설정하기 위해서는 추가적인 구성 필요
- (cf.) Webpack이 제대로 동작하려면 각 .ts 파일 import 구문에서 .js 확장자를 모두 제거해야 함

### ts-loader 패키지로 TypeScript 지원 추가

#### Webpack workflow 구성 - webpack.config.js의 Webpack 구성 객체 작성
- webpack.config.js의 module 프로퍼티
  - 역할
    - 명시된 파일로 Webpack에게 무엇을 해야할지 알려줌
    - module 프로퍼티는 JS 객체를 가져와서 구성
  - module 프로퍼티 구성하기
    - rules 프로퍼티 → 명시된 파일에 적용할 규칙을 설정하는 배열
      - 복잡한 프로젝트의 경우 CSS 파일, 이미지 등 다양한 형태의 파일을 위한 규칙 설정 가능
      - 특정 파일을 어떻게 다뤄야 할지 알려주는 패키지인 loader 활용
        - [Webpack docs의 loader 부분 참고](https://webpack.js.org/concepts/#loaders)
        - 여기서는 ts-loader를 사용할 것
    - rules 배열의 각 원소인 객체의 프로퍼티 예시
      - test: Webpack이 파일을 찾을 때마다 규칙이 적용되는 파일인지 확인하는 작업을 수행하기 위한 정규식
      - use: 대상 파일을 가지고 무엇을 해야할지
        - "ts-loader"로 명시하면 자동으로 tsconfig.json 파일을 가져와 활용
      - exclude: 탐색에서 제외할 경로 정규식
      - (cf.) test, exclude에 명시하는 정규식에 ""가 붙어있으면 안 됨
        - "/\\.ts$/" 이런 식이 아니라 /\\.ts$/ 이런 식으로 명시되어 있어야 함
- resolve 프로퍼티 → 경로를 resolve할 때 이용할 규칙
  - extensions: 명시된 이름의 파일 확장자 부분에 대한 규칙
    - 찾아낸 import 구문에 어떤 파일 확장자를 추가할지 명시
    - Webpack은 자동으로 확장자를 추가하고, 기본값으로 .js 파일을 찾도록 되어있음
    - 여기서는 추가로 .ts 파일도 찾아서 함께 번들링하도록 함
- devtool 프로퍼티 → "inline-source-map"으로 설정
  - Webpack에게 추출해야하는 source map이 생성될 것임을 알려줌
  - Webpack이 제대로 번들을 구현하도록 구성하도록 도움
  - tsconfig.json 구성의 sourceMap과 관련
- (cf.) tsconfig.json 구성 확인
  - sourceMap은 true로 설정
    - 코드 디버깅 및 웹페이지 지원 가능하도록 함
    - 실제 동작 코드는 .js 파일이지만, 브라우저의 개발자 도구에서 .ts 파일을 통해서도 디버깅할 수 있도록 함

#### Webpack 사용하여 빌드하기
- package.json의 scripts에 build 추가
  - "build": "webpack"
- npm run build로 빌드

### webpack-dev-server 추가, 개발 시의 빌드 설정 + Webpack config 조정
- webpack-dev-server 추가 → package.json의 scripts의 start 수정 및 webpack.config.js의 output 등 수정
  - package.json의 "scripts"의 "start" 수정
    - 기존 "lite-server"에서 "webpack-dev-server"로 수정
  - (cf.) webpack-dev-server 모드에서는 개발 서버 가동 중에 dist 디렉토리로 파일을 새로 빌드하지 않음
    - 생성 후 메모리에서만 가지고 있는 번들을 로드함
  - webpack.config.js의 output에 publicPath: "/dist/" 추가
    - 개발 서버 실행 중 코드 변경 시 변경된 부분이 반영하기 위해 필요한 수정
      - (cf.) 강의에는 "dist"로 작성했으나, 최신 Webpack에서는 "/dist/"라 해야한다고 함
      - webpack-dev-server가 기본적으로 index.html과는 잘 연결되어 script를 실행할 때 경로를 찾는 데에 문제가 없지만
        - dist 디렉토리는 연결짓지 못하기 때문에 publicPath를 명시하여 bundle.js를 찾을 수 있게 해야하는 것이라고 함
    - (cf.) 이 덕분에 lite-server를 사용할 때처럼 tsc -w를 실행시켜둘 필요가 없음
  - (cf.) 또한 최신 Webpack에서는 webpack.config.js의 devServer - static - ... - directory도 명시해야 함
    - [Webpack devServer, ..., directory 프로퍼티 관련 공식 문서 참고](https://webpack.kr/configuration/dev-server/#directory)
- webpack에 개발 모드 추가 → webpack.config.js에 mode: "development" 추가
  - 개발을 위한 빌드 시에는 디버깅 등에 용이한 방식으로 간소하게 최적화

### production 코드를 위한 워크플로 추가
- webpack.config.prod.js 파일 작성
- webpack.config.prod.js가 webpack.config.js와 다른 점 비교
  - mode: production → 코드 최적화, 최소화
  - output에서 publicPath 제거
  - devtool: "none"(x) → devtool 프로퍼티 주석 처리(o)
    - source map을 생성하지 않게 함
    - production에서는 불필요
    - (cf.) Webpack 5부터 devtool의 값에 대한 검증이 까다로워짐 - webpack 5: The devtool option is more strict
      - [Webpack devtool 공식 문서 참고](https://webpack.kr/configuration/devtool/)
  - plugins 추가
    - (cf.) plugins를 Webpack workflow에 추가하면 기본적으로 전체 출력, 전체 프로젝트에 적용
      - (cf.) module, rules는 파일 단위로 구체적으로 적용됨
    - clean-webpack-plugin
      - clean-webpack-plugin 패키지 개발 종속성 추가
        - npm install --save-dev clean-webpack-plugin
        - 프로젝트를 다시 빌드할 때마다 dist 디렉토리의 내용을 지우는 기능
      - webpack.config.prod.js에서 import
        - const CleanPlugin = require("clean-webpack-plugin")
      - plugins 배열에 new CleanPlugin.CleanWebpackPlugin() 추가
      - package.json의 scripts의 build 수정
        - 빌드 시 webpack.config.js가 아닌 새로 작성한 webpack.config.prod.js를 사용하도록 설정
        - "build": "webpack --config webpack.config.prod.js"

### (참고) webpack.config.js 파일에서 "파일이 CommonJS 모듈입니다. ES 모듈로 변환될 수 있습니다" 문제 메시지 관련
- [기타 블로그 참고 - Node.JS에서 CommonJS vs ES modules](https://velog.io/@tenacious_mzzz/Node.JS에서-CommonJS-vs-ES-modules)
  - webpack.config.js 파일로 Node.js 위에서 동작하므로 ES 모듈을 사용해도 무방할 것으로 보임
  - 하지만 Webpack 공식 문서 예시에서 CommonJS 모듈을 사용하고 있으므로,
    - 혼동을 피하기 위해 특별한 이유가 없다면 일단은 CommonJS 모듈을 사용하는 편이 나을 듯함
