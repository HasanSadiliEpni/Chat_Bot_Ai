import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 1300;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Inisialisasi Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post('/api/chat', async (req, res) => {
  const userInput = req.body.message;

  if (!userInput) {
    return res.status(400).json({ error: "No message provided" });
  }

  try {
    const result = await model.generateContent(userInput);
    const response = await result.response;
    const text = response.text();
    res.json({ reply: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get response from Gemini API" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
