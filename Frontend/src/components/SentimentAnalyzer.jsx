import React, { useState, useEffect } from 'react';
import { sentimentAPI } from '../services/api';

const SentimentAnalyzer = () => {
  const [text, setText] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [modelInfo, setModelInfo] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchModelInfo();
  }, []);

  const fetchModelInfo = async () => {
    try {
      const response = await sentimentAPI.getModelInfo();
      if (response.success) {
        setModelInfo(response.info);
      }
    } catch (error) {
      console.error('Error fetching model info:', error);
    }
  };

  const trainModel = async () => {
    try {
      setIsTraining(true);
      const response = await sentimentAPI.trainModel();
      
      if (response.success) {
        setModelInfo(response.info);
        alert('Model trained successfully!');
      }
    } catch (error) {
      console.error('Training error:', error);
      alert('Error training model: ' + error.message);
    } finally {
      setIsTraining(false);
    }
  };

  const analyzeSentiment = async () => {
    if (!text.trim()) return;

    try {
      setIsPredicting(true);
      const response = await sentimentAPI.predictSentiment(text);
      
      if (response.success) {
        setPrediction(response.prediction);
        
        // Add to history
        setHistory(prev => [{
          text: text,
          prediction: response.prediction,
          timestamp: new Date().toLocaleTimeString(),
          confidence: response.prediction.confidence
        }, ...prev.slice(0, 4)]); // Keep last 5 items
      }
    } catch (error) {
      console.error('Prediction error:', error);
      alert('Error analyzing sentiment: ' + error.message);
    } finally {
      setIsPredicting(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    setPrediction(null);
    setText('');
  };

  return (
    <div className="sentiment-analyzer">
      <header className="header">
        <h1>🤖 AI Sentiment Analysis</h1>
        <p>Train a simple AI model to analyze text sentiment</p>
      </header>

      <div className="container">
        {/* Model Info & Training Section */}
        <div className="model-section">
          <div className="model-info">
            <h2>Model Status</h2>
            {modelInfo ? (
              <div className="info-cards">
                <div className={`info-card ${modelInfo.isTrained ? 'trained' : 'not-trained'}`}>
                  <span>Status:</span>
                  <strong>{modelInfo.isTrained ? 'Trained' : 'Not Trained'}</strong>
                </div>
                <div className="info-card">
                  <span>Vocabulary:</span>
                  <strong>{modelInfo.vocabularySize} words</strong>
                </div>
                <div className="info-card">
                  <span>Max Length:</span>
                  <strong>{modelInfo.maxLength} words</strong>
                </div>
              </div>
            ) : (
              <p>Loading model information...</p>
            )}
          </div>

          <button 
            onClick={trainModel} 
            disabled={isTraining}
            className={`train-btn ${isTraining ? 'training' : ''}`}
          >
            {isTraining ? '🔄 Training...' : '🚀 Train Model'}
          </button>
        </div>

        {/* Analysis Section */}
        <div className="analysis-section">
          <h2>Analyze Sentiment</h2>
          <div className="input-group">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to analyze sentiment (e.g., 'I love this product', 'This is terrible')..."
              className="text-input"
              rows="4"
            />
            
            <button
              onClick={analyzeSentiment}
              disabled={!text.trim() || isPredicting || !modelInfo?.isTrained}
              className={`analyze-btn ${!modelInfo?.isTrained ? 'disabled' : ''}`}
            >
              {isPredicting ? '🔍 Analyzing...' : '🎯 Analyze Sentiment'}
            </button>
          </div>

          {!modelInfo?.isTrained && (
            <div className="warning">
              ⚠️ Please train the model first before analyzing sentiment
            </div>
          )}
        </div>

        {/* Prediction Result */}
        {prediction && (
          <div className={`result-section ${prediction.sentiment}`}>
            <h3>Analysis Result</h3>
            <div className="result-card">
              <div className="sentiment-badge">
                {prediction.sentiment === 'positive' ? '😊 Positive' : '😞 Negative'}
              </div>
              <div className="confidence">
                Confidence: <strong>{(prediction.confidence * 100).toFixed(2)}%</strong>
              </div>
              <div className="text-preview">
                "{text.length > 50 ? text.substring(0, 50) + '...' : text}"
              </div>
            </div>
          </div>
        )}

        {/* History Section */}
        {history.length > 0 && (
          <div className="history-section">
            <div className="history-header">
              <h3>Recent Analysis</h3>
              <button onClick={clearHistory} className="clear-btn">
                Clear History
              </button>
            </div>
            <div className="history-list">
              {history.map((item, index) => (
                <div key={index} className="history-item">
                  <div className="history-text">
                    {item.text.length > 30 ? item.text.substring(0, 30) + '...' : item.text}
                  </div>
                  <div className={`history-sentiment ${item.prediction.sentiment}`}>
                    {item.prediction.sentiment}
                  </div>
                  <div className="history-confidence">
                    {(item.confidence * 100).toFixed(1)}%
                  </div>
                  <div className="history-time">{item.timestamp}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SentimentAnalyzer;
