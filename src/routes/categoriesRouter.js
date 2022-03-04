import { Router } from "express";
import {getCategories, insertCategory }from "../controllers/categoriesController.js";
import validateCategory from "../middlewares/validateCategory.js";

const categoriesRouter = Router();

categoriesRouter.get('/categories', getCategories)
categoriesRouter.post('/categories', validateCategory, insertCategory)

export default categoriesRouter;