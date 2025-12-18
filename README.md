# AI Sentiment Analysis App  :-)

A full-stack AI application that uses TensorFlow.js to analyze text sentiment in real-time.

## 🚀 Features

- Train a custom sentiment analysis model
- Real-time sentiment prediction
- Beautiful, responsive UI
- History tracking of recent analyses
- REST API backend

## 📁 Project Structure

```
ai-sentiment-app/
├── backend/          # Node.js + Express + TensorFlow.js
├── frontend/         # React + Vite
└── shared/           # Shared AI model code
```

## 🛠 Installation

### Backend Setup
```bash
cd backend
npm install
```

### Frontend Setup
```bash
cd frontend
npm install
```

## 🏃 Running the Application

### Start Backend Server (Terminal 1)
```bash
cd backend
npm run dev
```
Server runs on: http://localhost:5000

### Start Frontend Server (Terminal 2)
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:3000

## 📖 Usage

1. Open http://localhost:3000 in your browser
2. Click "🚀 Train Model" to train the AI model
3. Enter text to analyze (e.g., "I love this product")
4. Click "🎯 Analyze Sentiment" to get results

## 🎯 API Endpoints

- `POST /api/sentiment/train` - Train the model
- `POST /api/sentiment/predict` - Analyze sentiment
- `GET /api/sentiment/info` - Get model information

## 🧠 Technologies Used

- **Frontend:** React, Vite, Axios
- **Backend:** Node.js, Express
- **AI/ML:** TensorFlow.js
- **Database:** MongoDB (optional)

## 📝 License

MIT
