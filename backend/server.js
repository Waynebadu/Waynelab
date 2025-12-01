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
const model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });

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
// 每日推薦食物：後端幫你去抓 TheMealDB 的隨機餐點
app.get('/api/food', async (req, res) => {
  try {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const data = await response.json();

    const meal = data.meals?.[0];
    if (!meal) {
      return res.status(500).json({ error: '找不到餐點資料' });
    }

    // 精簡後再回給前端
    res.json({
      name: meal.strMeal,          // 菜名
      category: meal.strCategory,  // 類別：Dessert、Beef...
      area: meal.strArea,          // 地區：Japanese、Italian...
      instructions: meal.strInstructions, // 作法（如果之後要用）
      image: meal.strMealThumb     // 食物圖片
    });
  } catch (err) {
    console.error('Food API error:', err);
    res.status(500).json({ error: 'Food API 發生錯誤' });
  }
});

app.listen(PORT, () => {
  console.log(`Gemini backend listening on port ${PORT}`);
});
