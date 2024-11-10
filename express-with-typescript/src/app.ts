import express, { Request, Response, NextFunction } from "express";
import { json } from "body-parser";

import todoRoutes from "./routes/todos"

const app = express();
app.use(json()); // 이 미들웨어 역할을 하는 json() 함수는 서버가 수신한 요청의 body를 파싱, JSON 데이터를 추출 → controllers 하위의 함수가 Request 객체의 body에서 적절히 값을 가져올 수 있도록 하는 것
app.use("/todos", todoRoutes);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message });
});
app.listen(3000);
