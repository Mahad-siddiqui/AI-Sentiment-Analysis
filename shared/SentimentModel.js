// shared/SentimentModel.js
import * as tf from '@tensorflow/tfjs';

class SentimentModel {
  constructor() {
    this.model = null;
    this.vocabulary = new Set();
    this.maxLength = 10;
    this.wordIndex = {};
    this.isTrained = false;
  }

  preprocessText(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(' ')
      .filter(word => word.length > 0);
  }

  buildVocabulary(trainingData) {
    this.vocabulary = new Set();
    
    trainingData.forEach(item => {
      const words = this.preprocessText(item.text);
      words.forEach(word => this.vocabulary.add(word));
    });

    this.vocabulary = Array.from(this.vocabulary);
    this.wordIndex = {};
    
    this.vocabulary.forEach((word, index) => {
      this.wordIndex[word] = index + 1;
    });

    console.log(`Vocabulary built with ${this.vocabulary.length} words`);
  }

  textToSequence(text) {
    const words = this.preprocessText(text);
    const sequence = words.map(word => this.wordIndex[word] || 0);
    
    while (sequence.length < this.maxLength) {
      sequence.push(0);
    }
    
    return sequence.slice(0, this.maxLength);
  }

  prepareData(trainingData) {
    this.buildVocabulary(trainingData);
    
    const texts = trainingData.map(item => item.text);
    const labels = trainingData.map(item => 
      item.sentiment === 'positive' ? 1 : 0
    );

    const sequences = texts.map(text => this.textToSequence(text));
    
    return {
      x: tf.tensor2d(sequences),
      y: tf.tensor1d(labels)
    };
  }

  createModel() {
    const model = tf.sequential();
    
    model.add(tf.layers.dense({
      inputShape: [this.maxLength],
      units: 16,
      activation: 'relu'
    }));
    
    model.add(tf.layers.dense({
      units: 8,
      activation: 'relu'
    }));
    
    model.add(tf.layers.dense({
      units: 1,
      activation: 'sigmoid'
    }));

    model.compile({
      optimizer: 'adam',
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    this.model = model;
    console.log('Model created successfully');
    return model;
  }

  async train(trainingData, epochs = 100) {
    if (!this.model) {
      this.createModel();
    }

    const { x, y } = this.prepareData(trainingData);
    
    console.log('Starting model training...');
    
    await this.model.fit(x, y, {
      epochs: epochs,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          if ((epoch + 1) % 10 === 0) {
            console.log(`Epoch ${epoch + 1}: loss = ${logs.loss.toFixed(4)}, accuracy = ${logs.acc.toFixed(4)}`);
          }
        }
      }
    });
    
    x.dispose();
    y.dispose();
    
    this.isTrained = true;
    console.log('Model training completed!');
  }

  predict(text) {
    if (!this.model || !this.isTrained) {
      throw new Error('Model not trained yet. Please train the model first.');
    }

    const sequence = this.textToSequence(text);
    const tensor = tf.tensor2d([sequence]);
    
    const prediction = this.model.predict(tensor);
    const score = prediction.dataSync()[0];
    
    tensor.dispose();
    prediction.dispose();
    
    return {
      sentiment: score > 0.5 ? 'positive' : 'negative',
      confidence: score > 0.5 ? score : 1 - score,
      rawScore: score
    };
  }

  getModelInfo() {
    return {
      isTrained: this.isTrained,
      vocabularySize: this.vocabulary.length,
      maxLength: this.maxLength
    };
  }
}

export default SentimentModel;
