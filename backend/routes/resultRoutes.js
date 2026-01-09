import express from "express";
import authMiddleWare from "../middleware/auth.js";
import { createResult, listResults } from "../controllers/ResultController.js";

const resultRouter = express.Router();

resultRouter.post('/',authMiddleWare,createResult);
resultRouter.get('/',authMiddleWare,listResults);

export default resultRouter;