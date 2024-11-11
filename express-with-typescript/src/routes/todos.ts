import { Router } from "express";

import { createTodo, deleteTodo, getTodos, updateTodo } from "../controllers/todos"

const router = Router();

router.post("/", createTodo);
router.get("/", getTodos);
router.patch("/:id", updateTodo); // express에서는 :id 이 부분을 dynamic segment라 부름
router.delete("/:id", deleteTodo);

export default router;
