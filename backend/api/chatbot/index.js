const express = require('express');
const { authenticate } = require('../../authentication');
const { createMessage, getMessages } = require('../../database/queries');
const { gemini } = require('../../google');

const router = express.Router();


router.post('/ask', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'user') throw new Error('Only users can use this AI feature');
        const { message } = req.body;
        const pM = await getMessages(req.user._id);
        const previousMessages = pM.slice(-5);
        await createMessage({
            user: req.user._id,
            content: message,
            sender: 'user'
        });
        const context = previousMessages.map(msg => `${msg.sender}: ${msg.content}`).join('\n');
        const promptWithContext = `${context}\nuser: ${message}\nbot: `;
        const results = await gemini.generateContent(promptWithContext);
        const reply = results.response.text();
        await createMessage({
            user: req.user._id,
            content: reply,
            sender: 'bot'
        });
        res.status(200).json({
            message: reply
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


module.exports = router;