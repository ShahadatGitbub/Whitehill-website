import express from 'express';
import { incrementVisitorCount, getVisitorCount } from '../controllers/visitorController.js';

const visitorRouter = express.Router();

visitorRouter.post('/visitors/increment', incrementVisitorCount);
visitorRouter.get('/visitors', getVisitorCount);

export default visitorRouter;