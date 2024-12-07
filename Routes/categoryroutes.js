import express from "express";
import { isAdmin, requiredsignin } from "../Middlewares/authmiddleware.js";
import {
  createCategoryController,
  updateCategoryController,
  categoryController,
  singleCategoryController,
  deleteCategoryController,
} from "../Controllers/categoryController.js";
const router = express.Router();

router.post(
  "/create-category",
  requiredsignin,
  isAdmin,
  createCategoryController
);

router.put(
  "/update-category/:id",
  requiredsignin,
  isAdmin,
  updateCategoryController
);

router.get("/get-category", categoryController);

router.get("/single-category/:slug", singleCategoryController);

router.delete(
  "/delete-category/:id",
  requiredsignin,
  isAdmin,
  deleteCategoryController
);
export default router;
