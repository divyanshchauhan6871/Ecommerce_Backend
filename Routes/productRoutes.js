import express from "express";
import { isAdmin, requiredsignin } from "../Middlewares/authmiddleware.js";
import {
  createProductController,
  getProductController,
  getSingleProductController,
  productPhotoController,
  deleteProductCOntroller,
  updateProductController,
  handleProductFilter,
  searchProductController,
  relatedProductCOntroller,
  categoryWiseProductsController,
  braintreeTokenController,
  braintreePaymentCOntroller,
} from "../Controllers/productController.js";
import formidable from "express-formidable";

const router = express.Router();

router.post(
  "/create-product",
  requiredsignin,
  isAdmin,
  formidable(),
  createProductController
);

router.put(
  "/update-product/:pid",
  requiredsignin,
  isAdmin,
  formidable(),
  updateProductController
);

router.delete(
  "/delete-product/:pid",
  requiredsignin,
  isAdmin,
  deleteProductCOntroller
);

router.get("/get-product", getProductController);
router.get("/get-product/:slug", getSingleProductController);
router.get("/product-photo/:pid", productPhotoController);
router.post("/product-filter", handleProductFilter);
router.get("/search/:keyword", searchProductController);
router.get("/similar-product/:pid/:cid", relatedProductCOntroller);
router.get(
  "/categroies-wise-product/:category",
  categoryWiseProductsController
);

router.get("/braintree/token", braintreeTokenController);
router.post("/braintree/payment", requiredsignin, braintreePaymentCOntroller);

export default router;
