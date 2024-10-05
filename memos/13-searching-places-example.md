## 장소 선택 및 공유 앱 예제 - TypeScript 사용 시 third party library 활용하기 실습
- 여러 종류의 third party library를 사용해보기
  - HTTP 전송 라이브러리, 구글 지도 라이브러리 활용
  - axios로 자체 .d.ts를 갖고 있는 라이브러리를 사용하기
  - Google Maps로 npm으로 설치되지 않더라도 적절한 type 패키지를 가진 라이브러리를 사용하기

### Google API 키 설정
- Google Geocoding API
  - [공식 문서 참고](https://developers.google.com/maps/documentation/geocoding/start?hl=ko)
  - 주소를 좌표쌍으로 변환하거나 좌표쌍을 주소로 변환 가능
- Google API 키 설정
  - 유료 서비스이지만 일정 사용량까지는 무료로 사용, 하지만 API 키 발급을 위해 신용카드 등록 필요
    - (cf.) 신용 카드 없이 지도 작업을 하려면 OpenLayers 등 다른 지도 서비스 사용
    - (cf.) [Google Maps Platform 과금 정책](https://mapsplatform.google.com/pricing/)
  - 절차에 따라 API 키를 발급받고 복사해둠
    - (cf.) 구글 개발자 콘솔에서 발급받은 키를 사용할 수 있는 앱을 제한할 수도 있음

### Axios를 사용하여 입력된 주소의 좌표 가져오기
- (cf.) third party 패키지 없이 최신 브라우저 및 최신 JS에서 지원하는 fetch API를 사용할 수도 있음
  - URL에 요청을 보내는 데 사용
  - 브라우저에 구축되어 전역적으로 사용 가능
- axios
  - JS, TS로 HTTP 요청을 보내는 데에 사용하는 패키지
  - 설치: npm install --save axios(혹은 npm i axios)
    - node_modules/axios를 살펴보면 라이브러리 자체에서 .d.ts 파일을 포함
    - 라이브러리와 TS 변환 패키지를 함께 제공한 것
- axios로 Google Geocoding API에 요청 보내기
  - [다시 한 번 Geocoding API 문서 참고](https://developers.google.com/maps/documentation/geocoding/start?hl=ko)
  - https://maps.googleapis.com/maps/api/geocode/json?address=...&key=... 형태의 url
    - 위 address 부분에는 url로 사용 가능한 문자만 들어갈 수 있음
    - 이를 위해 JS의 빌트인 함수 encodeURI() 활용
    - 문자열을 URL에서 호환 가능한 문자열로 바꿔줌
  - 요청 코드를 작성할 때 generic으로 되어 있는 응답 타입을 지정할 수 있음
    - 예상되는 응답 타입을 TS에 알려 추후 작업하기 편하게 하는 것
    - (ex.) axios.get`<{results: {geometry: {location: {lat: number, lng: number}}}[]}>`(...)
      - 물론 별도의 custom type alias로 빼낼 수도 있음
    - 이 외에도 상태 코드, 다른 geometry 등 정보들이 있지만 앱에서 필요해서 사용하는 값만 명시해도 상관이 없음

### \(별도 진행\) TS, Webpack을 사용한 프로젝트에서 dotenv 활용
- 참고 자료
  - [기타 블로그 - Webpack 개발 환경과 배포 환경의 환경변수 분리 | Dotenv | DefinePlugin | Environment Variable](https://dev-son.tistory.com/10)
  - [기타 블로그 - 웹팩(Webpack) DefinePlugin, EnvironmentPlugin 사용법](https://www.daleseo.com/webpack-plugins-define-environment/)
  - [Webpack - DefinePlugin](https://webpack.kr/plugins/define-plugin/)
  - 위와 같은 여러 자료들을 참고했으나 결국 ChatGPT의 코드로 해결함
- TODO 정확한 원리를 모르는 상태로 사용했으므로 추가 조사 필요

### Google 지도로 지도 렌더링(Types 포함)
- Google Maps JavaScript API
  - [공식 문서 - Maps JavaScript API 개요](https://developers.google.com/maps/documentation/javascript/overview?hl=ko)
- 시작하기
  - (방법 1)index.html에 script 추가(기존 스크립트 로드 태그 사용)
    - [공식 문서 - Maps JavaScript API 로드하기](https://developers.google.com/maps/documentation/javascript/load-maps-js-api?hl=ko&_gl=1#use-legacy-tag)
    - index.html에 다음 스크립트 추가 `<script src="https://maps.googleapis.com/maps/api/js?key=..." async defer></script>`
    - 공식 문서에서는 이 방법은 추천하지 않고, Dynamic Library Loading API 방식을 사용하길 권장함
  - (방법 2) 동적 라이브러리 가져오기
    - [공식 문서 참고](https://developers.google.com/maps/documentation/javascript/load-maps-js-api?hl=ko&_gl=1)
      - [공식 문서 - TypeScript 및 Google 지도](https://developers.google.com/maps/documentation/javascript/using-typescript?hl=ko&_gl=1) → TS에서 Google 지도를 사용할 때 참고
      - [공식 문서 - 라이브러리](https://developers.google.com/maps/documentation/javascript/libraries?hl=ko) → 동적 라이브러리 가져오기 방식에서 라이브러리를 가져오는 방법
      - [공식 문서 - 고급 마커로 이전](https://developers.google.com/maps/documentation/javascript/advanced-markers/migration?hl=ko) → v3.56 이후의 버전에서 advanced marker 사용하는 방법
  - (방법 3) NPM js-api-loader 패키지 사용
    - [공식 문서 참고](https://developers.google.com/maps/documentation/javascript/load-maps-js-api?hl=ko&_gl=1#js-api-loader)
    - 방법 1, 방법 3 대신 방법 2를 사용할 것을 권장함
- Google maps를 사용할 때 TS의 type 지원 기능을 활용하려면 @types/googlemaps 패키지 설치
  - npm i -D @types/googlemaps(혹은 npm install --save-dev @types/googlemaps)
  - (cf.) 현재 @types/googlemaps는 deprecated
    - 스크립트 로드 태그 사용 방식 자체가 deprecated이므로 이에 대한 타입 지원인 @types/googlemaps도 deprecated인 것
    - 다른 방식으로 Google maps를 불러올 때는 @types/google.maps를 대신 사용
