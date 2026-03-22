require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const express = require('express');

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text) return;

    try {
        const response = await axios.post(
            'https://api.anthropic.com/v1/messages',
            {
                model: "claude-3-haiku-20240307",
                max_tokens: 500,
                messages: [
                    { role: "user", content: text }
                ]
            },
            {
                headers: {
                    "x-api-key": process.env.CLAUDE_API_KEY,
                    "anthropic-version": "2023-06-01",
                    "Content-Type": "application/json"
                }
            }
        );

        const reply = response.data.content[0].text;
        bot.sendMessage(chatId, reply);

    } catch (error) {
        console.error(error.response?.data || error.message);
        bot.sendMessage(chatId, "Bot lỗi 😅");
    }
});

// 🚀 Thêm server Express để Railway nhận app là đang chạy
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Bot Claude Telegram is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});