# 타입스크립트 예제

## TypeScript 설치 및 사용
- nvm-windows 설치 및 Node.js 버전 관리
  - npm은 이미 설치되어있는 상태여야 함
  - 참고 [\[NODE\] 📚 NVM 모듈 사용법 - 노드 버전 스위칭](https://inpa.tistory.com/entry/NODE-%F0%9F%93%9A-NVM-%EB%AA%A8%EB%93%88-%EC%82%AC%EC%9A%A9%EB%B2%95-%EB%85%B8%EB%93%9C-%EB%B2%84%EC%A0%84-%EA%B4%80%EB%A6%AC)
- (TypeScript 설치) npm install -g typescript
  - (확인) tsc --version
  - (컴파일러 사용법) tsc [경로+ts 파일명] → 확장자를 제외한 동일한 파일이름을 가진 js 파일 생성
- VSCode 확장
  - ESLint, Prettier - Code formatter, Path Intellisense, Material Icon Theme
- (npm lite-server 설치) 편의 기능 제공 개발 서버(개발 환경에서 새로 컴파일 시 자동 새로고침)
  - npm init
    - package name, version, description, entry point(기본 app.js), test command, git repository, keywords, author, license 등 설정
    - 기본값 그대로 사용할 경우 그냥 Enter 계속 누르면 됨
    - package.json 생성됨
  - npm install --save-dev lite-server
    - --save-dev 개발 환경 전용 의존성 표시
  - package.json scripts 부분에 "start": "lite-server" 추가
  - npm start 입력하면 lite-server가 index.html 파일의 서버로 동작함(기본 포트 3000)
  - 추후 package.json으로 구성된 라이브러리를 node_modules 디렉토리 및 하위 파일이 없는 상태로 다시 불러와서 사용하고 싶다면 npm install 입력