import express from "express";


const router = express.Router()

router.post('/login' , (req , res) => {
  res.send(200).json('ok')
 })

export default router