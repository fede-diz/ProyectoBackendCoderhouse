import { Router } from "express";
import { mockProducts } from "../controller/mock.controller.js";

const mockRouter = Router()

mockRouter.get('/', mockProducts)

export default mockRouter