// backend/controllers/sentimentController.js
import SentimentModel from '../models/SentimentModel.js';
import { trainingData } from '../data/trainingData.js';

const sentimentModel = new SentimentModel();

export const trainModel = async (req, res) => {
  try {
    console.log('📚 Training model requested...');
    
    sentimentModel.train(trainingData);
    
    res.json({
      success: true,
      message: 'Model trained successfully',
      info: sentimentModel.getModelInfo()
    });
  } catch (error) {
    console.error('❌ Training error:', error);
    res.status(500).json({
      success: false,
      message: 'Error training model',
      error: error.message
    });
  }
};

export const predictSentiment = async (req, res) => {
  try {
    console.log('🔍 Prediction request received');
    const { text } = req.body;
    console.log('📝 Text:', text);
    
    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Text is required'
      });
    }

    // Train if not trained yet (rule-based model trains instantly)
    if (!sentimentModel.isTrained) {
      console.log('⚙️ Model not trained, training now...');
      sentimentModel.train(trainingData);
      console.log('✅ Model trained');
    }

    console.log('🎯 Making prediction...');
    const prediction = sentimentModel.predict(text);
    console.log('✅ Prediction made:', prediction);
    
    res.json({
      success: true,
      text: text,
      prediction: prediction
    });
  } catch (error) {
    console.error('❌ Prediction error:', error);
    res.status(500).json({
      success: false,
      message: 'Error making prediction',
      error: error.message
    });
  }
};

export const getModelInfo = (req, res) => {
  res.json({
    success: true,
    info: sentimentModel.getModelInfo()
  });
};
