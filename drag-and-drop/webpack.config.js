const path = require("path");

// Webpack이 사용하는 구성 객체가 됨
module.exports = {
  mode: "development", // 개발 모드 설정
  entry: "./src/app.ts", // 전체 프로젝트가 시작되는 파일(entry point) 명시
  devServer: {
    static: [
      {
        directory: path.join(__dirname),
      },
    ],
  },
  output: { // Webpack 동작 결과물 output point 정보를 담은 객체
    filename: "bundle.js", // 번들링된 .js 파일
    path: path.resolve(__dirname, "dist"),
    publicPath: "/dist/", // webpack-dev-server를 위한 구성
  },
  devtool: "inline-source-map", // source map 설정(디버깅 개선)
  module: { // Webpack에게 무엇을 해야할지 알려주는 객체
    rules: [
      {
        test: /\.ts$/, // .ts로 끝나는 파일에 이 규칙을 적용
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: { // 경로를 resolve할 때 이용할 규칙
    extensions: [".ts", ".js"],
  },
};
