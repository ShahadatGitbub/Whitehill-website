import express from 'express';
import { subscribe, getSubscribers, markAsNotified } from '../controllers/subscriberController.js';

const subscriberRouter = express.Router();

subscriberRouter.post('/subscribe', subscribe);
subscriberRouter.get('/subscribers', getSubscribers);
subscriberRouter.post('/notify', markAsNotified);

export default subscriberRouter;