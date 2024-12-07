import express from "express";
import { isAdmin, requiredsignin } from "../Middlewares/authmiddleware.js";
import {
  registerController,
  logincontroller,
  testcontroller,
  forgotPassword,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusCOntroller,
} from "../Controllers/authcontroller.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", logincontroller);
router.get("/test", requiredsignin, isAdmin, testcontroller);
router.post("/forgot-password", forgotPassword);
router.get("/user-auth", requiredsignin, (req, res) => {
  res.status(200).send({ ok: true });
});
router.get("/admin-auth", requiredsignin, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});
router.put("/profile", requiredsignin, updateProfileController);
router.get("/orders", requiredsignin, getOrdersController);
router.get("/all-orders", requiredsignin, isAdmin, getAllOrdersController);
router.put(
  "/order-status/:orderId",
  requiredsignin,
  isAdmin,
  orderStatusCOntroller
);

export default router;
