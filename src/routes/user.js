import express from "express";
import verifyToken from "../middlewares/verifyToken";
import * as controller from "../controllers/user"

const router = express.Router()

router.use(verifyToken)
router.get("/get-current" , controller.getCurrent)
router.put("/" , controller.updateUser)

export default router