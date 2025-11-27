// server.js
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.use(cors());
app.use(express.json());

// 從環境變數讀取 Gemini API Key（非常重要：不要寫死在程式裡）
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('缺少 GEMINI_API_KEY 環境變數');
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

app.post('/api/gemini', async (req, res) => {
  try {
    const prompt = req.body.prompt || '';
    if (!prompt) {
      return res.status(400).json({ error: '缺少 prompt' });
    }

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ reply: text });
  } catch (err) {
    console.error('Gemini API error:', err);
    res.status(500).json({ error: 'Gemini API 發生錯誤' });
  }
});

// Render / 本機啟動用的 port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Gemini backend listening on port ${PORT}`);
});
