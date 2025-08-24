import express from "express";
import { buyCoin, getAllTrades, sellCoin } from "../controllers/tradeController.js";

const router = express.Router();

router.post("/buy", buyCoin);
router.post("/sell", sellCoin);
router.get("/get-all/:userId", getAllTrades);
export default router;
