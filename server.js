import dotenv from 'dotenv';
dotenv.config();
import fetch from 'node-fetch';
import express from 'express';
import cors from 'cors';
const app = express();
const PORT = 8000;
app.use(express.json());
app.use(cors());

const API_KEY = process.env.OPENAI_API_KEY;

console.log(`The authorization: Bearer ${process.env.OPENAI_API_KEY}`);

console.log('Siema Heniu!');

app.post('/completions', async (req, res) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: req.body.message }],
            max_tokens: 100,
        })
    }
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', options);
        const data = await response.json();
        res.send(data);
    } catch (error) {
        console.error(error);
    }
})

app.listen(PORT, () => console.log('Server is running on PORT: ' + PORT));