const path = require("path");

// Webpack이 사용하는 구성 객체가 됨
module.exports = {
  // 전체 프로젝트가 시작되는 파일(entry point) 명시
  entry: "./src/app.ts",
  // Webpack 동작 결과물 output point 정보를 담은 객체
  output: {
    filename: "bundle.js", // 번들링된 .js 파일
    path: path.resolve(__dirname, "dist"),
  },
};