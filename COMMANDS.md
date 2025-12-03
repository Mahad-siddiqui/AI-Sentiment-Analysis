# 🔧 Development Commands

## Backend Commands

### Start Backend Server
```powershell
cd backend
npm start
# or with auto-reload:
npm run dev
```

### Install Backend Dependencies
```powershell
cd backend
npm install
```

## Frontend Commands

### Start Frontend Development Server
```powershell
cd Frontend
npm run dev
```

### Build Frontend for Production
```powershell
cd Frontend
npm run build
```

### Preview Production Build
```powershell
cd Frontend
npm run preview
```

### Install Frontend Dependencies
```powershell
cd Frontend
npm install
```

## Quick Start Both Servers

### PowerShell (Windows)
```powershell
# Terminal 1 - Backend
cd C:\Users\DT\Desktop\mahad\ai-sentiment-app\backend
node server.js

# Terminal 2 - Frontend (open new terminal)
cd C:\Users\DT\Desktop\mahad\ai-sentiment-app\Frontend
npm run dev
```

## 🌐 Access Points

- **Frontend UI**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000

## 📝 Notes

- Both servers must be running to use the application
- Backend must be started before training the model
- Frontend will proxy API requests to backend automatically
