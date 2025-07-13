import express from "express";
import * as controller from "../controllers/post";
import verifyToken, { isAdmin } from "../middlewares/verifyToken";

const router = express.Router();
router.get("/all", controller.getPosts);
router.get("/limit", controller.getPostsLimit);
router.get("/new-post", controller.getNewPosts);

router.use(verifyToken);
router.post("/create-new", controller.createNewPost);
router.get("/limit-admin", controller.getPostsLimitAdmin);
router.get("/post-admin", isAdmin, controller.getAllPosts);
router.put("/update", controller.updatePost);
router.delete("/delete", controller.deletePost);

export default router;
