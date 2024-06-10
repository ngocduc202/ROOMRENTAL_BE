import express from "express";
import * as controller from "../controllers/post"

const router = express.Router()
router.get('/all' , controller.getPosts)
router.get('/limit' , controller.getPostsLimit)

export default router