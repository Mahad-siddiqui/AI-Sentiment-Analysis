// backend/routes/sentimentRoutes.js
import express from 'express';
import { trainModel, predictSentiment, getModelInfo } from '../controllers/sentimentController.js';

const router = express.Router();

router.post('/train', trainModel);
router.post('/predict', predictSentiment);
router.get('/info', getModelInfo);

export default router;
