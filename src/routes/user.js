import express from "express";
import verifyToken, { isAdmin } from "../middlewares/verifyToken";
import * as controller from "../controllers/user";

const router = express.Router();

router.use(verifyToken);
router.get("/get-current", controller.getCurrent);
router.get("/all", isAdmin, controller.getAllUsers);
router.delete("/block/:id", isAdmin, controller.blockUser);
router.put("/", controller.updateUser);

export default router;
