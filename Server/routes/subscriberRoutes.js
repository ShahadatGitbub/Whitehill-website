import express from "express"
import { getSubscribers, markAsNotified, subscribe } from "../controllers/subscriberController.js";
const router = express.Router();


router.post('/subscribe',subscribe);
router.get('/subscribers',getSubscribers);
router.post('/notify', markAsNotified);
export default router;