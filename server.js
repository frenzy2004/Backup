// Main Express server entry point (ESM)
import express from 'express';
import cors from 'cors';
import bedrockChatRouter from './api/bedrock-chat.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Mount the Bedrock chat API
app.use('/api', bedrockChatRouter);

app.get('/', (req, res) => {
  res.send('Express backend is running.');
});

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
