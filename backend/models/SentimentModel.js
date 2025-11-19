// SentimentModel.js - Rule-Based Sentiment Analysis
// Uses keyword matching with weights instead of neural networks
// Designed for small datasets with immediate accuracy

class SentimentModel {
  constructor() {
    this.isTrained = false;
    this.vocabulary = new Set();
    
    // Sentiment dictionaries with weights (1-10 scale)
    this.positiveWords = {
      // English
      'good': 8, 'great': 9, 'excellent': 10, 'amazing': 9, 'awesome': 9,
      'love': 8, 'perfect': 9, 'wonderful': 9, 'fantastic': 9, 'brilliant': 9,
      'happy': 8, 'glad': 7, 'beautiful': 8, 'nice': 7,
      'best': 9, 'better': 7, 'liked': 7,
      'positive': 8, 'success': 8, 'successful': 8, 'well': 6, 'okay': 5,
      'ok': 5, 'fine': 5, 'decent': 6, 'pretty': 6, 'cool': 7,
      'lovely': 8, 'stunning': 9, 'impressive': 8, 'superb': 9,
      'outstanding': 9, 'incredible': 9, 'gorgeous': 8,
      'delighted': 9, 'thrilled': 9, 'pleased': 7, 'satisfied': 7, 'content': 6,
      'excited': 8, 'hopeful': 7, 'inspired': 8, 'energetic': 7, 'vibrant': 7,
      // Urdu/Hindi
      'acha': 7, 'bahat': 8, 'behtreen': 9, 'khoobsurat': 8, 'shandar': 9,
      'bhanda': 8, 'shukriya': 7, 'khush': 8, 'khushnuma': 8, 'pyara': 8,
      'dilkash': 8, 'khub': 7, 'behtar': 7, 'banaa': 7,
      'accha': 7, 'bahut': 8, 'sundar': 8, 'shaan': 8, 'shaandar': 9,
      'pyaara': 8, 'khubsurat': 8, 'kamal': 8, 'badha': 7
    };

    this.negativeWords = {
      // English
      'bad': 8, 'terrible': 9, 'awful': 9, 'horrible': 10, 'hate': 9,
      'worst': 10, 'worse': 8, 'wrong': 7, 'sad': 7,
      'angry': 8, 'disappointed': 8, 'frustrated': 7, 'annoyed': 6, 'upset': 7,
      'poor': 7, 'weak': 6, 'stupid': 8, 'dumb': 8,
      'ugly': 8, 'disgusting': 9, 'gross': 7, 'filthy': 8, 'dirty': 6,
      'negative': 8, 'failure': 8, 'failed': 8, 'problem': 6, 'issue': 5,
      'no': 5, 'nope': 7, 'nah': 6, 'never': 6, 'neither': 5,
      'cannot': 6, 'wont': 7, 'incorrect': 7, 'false': 6, 'broken': 7,
      'useless': 8, 'waste': 7, 'wasteful': 7, 'pointless': 7, 'meaningless': 7,
      'pain': 7, 'hurt': 7, 'suffering': 8, 'anguish': 8, 'torment': 8,
      'scary': 7, 'frightening': 8, 'terrifying': 9, 'fear': 7, 'afraid': 7,
      // Urdu/Hindi
      'bura': 8, 'kharab': 8, 'ghalat': 7, 'galat': 7, 'nahi': 6, 'nhi': 6,
      'nahin': 6, 'pagal': 8, 'bewakoof': 8, 'ulloo': 7, 'jahil': 8,
      'badmash': 8, 'shaitan': 8, 'bhataar': 8, 'khatarnak': 8,
      'ganda': 7, 'gandaa': 7, 'azeeb': 7, 'bekaar': 8, 'kamzor': 6,
      'dukhi': 7, 'udaas': 7, 'naraz': 8, 'ghussay': 8, 'kinna': 6,
      'paagal': 8, 'bilkul': 6, 'chakla': 7, 'gandha': 7, 'anokha': 7,
      'udas': 7, 'gussa': 8, 'chinta': 6
    };

    // Negation words that flip sentiment
    this.negationWords = new Set([
      'not', 'no', 'never', 'neither', 'nobody', 'nothing', 'nowhere',
      'nope', 'nah', 'noway', 'cannot', 'wont',
      'isnt', 'arent', 'wasnt', 'werent', 'havent',
      'hasnt', 'hadnt', 'doesnt', 'dont', 'didnt', 'mustnt',
      'aint', 'nahi', 'nhi', 'nahin', 'na', 'kabhi', 'kabi', 'kuch', 'kuchu'
    ]);

    // Intensifiers (amplify sentiment)
    this.intensifiers = {
      'very': 1.5, 'really': 1.4, 'so': 1.3, 'extremely': 1.6,
      'absolutely': 1.5, 'completely': 1.4, 'totally': 1.4,
      'utterly': 1.5, 'bloody': 1.3
    };
  }

  preprocessText(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 0);
  }

  buildVocabulary(trainingData) {
    this.vocabulary = new Set();
    
    if (trainingData && Array.isArray(trainingData)) {
      trainingData.forEach(item => {
        const words = this.preprocessText(item.text);
        words.forEach(word => this.vocabulary.add(word));
      });
    }

    console.log(`Vocabulary built with ${this.vocabulary.size} words`);
  }

  predictSentiment(text) {
    const words = this.preprocessText(text);
    let sentimentScore = 0;
    let totalWeight = 0;

    // Calculate sentiment score word by word
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      let wordWeight = 0;
      let isPositive = false;

      if (this.positiveWords[word]) {
        wordWeight = this.positiveWords[word];
        isPositive = true;
      } else if (this.negativeWords[word]) {
        wordWeight = this.negativeWords[word];
        isPositive = false;
      }

      if (wordWeight > 0) {
        // Check for intensifier before this word
        if (i > 0 && this.intensifiers[words[i - 1]]) {
          wordWeight *= this.intensifiers[words[i - 1]];
        }

        // Check for negation near this word (within 2 words before)
        let isNegated = false;
        for (let j = Math.max(0, i - 2); j < i; j++) {
          if (this.negationWords.has(words[j])) {
            isNegated = true;
            break;
          }
        }

        // Apply sentiment with negation flip
        if (isNegated) {
          sentimentScore += isPositive ? -wordWeight : wordWeight;
        } else {
          sentimentScore += isPositive ? wordWeight : -wordWeight;
        }

        totalWeight += wordWeight;
      }
    }

    // Calculate confidence based on total word weight
    let confidence = totalWeight > 0 ? 50 + Math.min(totalWeight * 2.5, 45) : 50;
    confidence = Math.max(0, Math.min(100, confidence));

    // Determine sentiment
    let sentiment = 'neutral';
    if (sentimentScore > 1) {
      sentiment = 'positive';
    } else if (sentimentScore < -1) {
      sentiment = 'negative';
    }

    return {
      sentiment,
      confidence: Math.round(confidence * 10) / 10,
      score: sentimentScore,
      wordsFound: words.length
    };
  }

  train(trainingData) {
    // Rule-based model doesn't need actual training
    // Just build vocabulary for compatibility with API
    this.buildVocabulary(trainingData);
    this.isTrained = true;
    console.log('✅ Rule-based sentiment model initialized with word dictionaries');
    return { status: 'success', message: 'Model ready for predictions' };
  }

  predict(text) {
    // Alias for compatibility
    return this.predictSentiment(text);
  }

  getModelInfo() {
    return {
      isTrained: this.isTrained,
      type: 'rule-based',
      vocabularySize: this.vocabulary.size || 0,
      modelType: 'Rule-based keyword sentiment analysis with negation handling',
      description: 'Uses sentiment word dictionaries for English, Urdu, and Hindi with negation detection and intensifier support'
    };
  }
}

export default SentimentModel;
