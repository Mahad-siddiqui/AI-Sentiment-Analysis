import express from 'express';

const app = express();
const PORT = 5000;

console.log('Starting test server...');

app.get('/', (req, res) => {
  console.log('GET / called');
  res.json({ message: 'Hello' });
});

app.post('/api/test', (req, res) => {
  console.log('POST /api/test called');
  res.json({ message: 'Test' });
});

app.listen(PORT, () => {
  console.log(`✅ Test server listening on port ${PORT}`);
});

console.log('Test server setup complete');
