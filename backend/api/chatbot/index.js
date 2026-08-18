const express = require('express');
const { authenticate, checkAuthentication } = require('../../authentication');
const { createMessage } = require('../../database/queries');
const { gemini } = require('../../google');

const router = express.Router();


router.post('/ask', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'user') throw new Error('Only users can use this AI feature');
        const { message } = req.body;
        const sendMessage = await createMessage({
            user: req.user._id,
            content: message,
            sender: 'user'
        });
        const results = await gemini.generateContent(message);
        const reply = results.response.text();
        const sendMessageResults = await createMessage({
            user: req.user._id,
            content: reply,
            sender: 'bot'
        });
        res.status(200).json({
            message: reply
        });
    } catch (error) {
        res.status(409).json({message: error.message});
    }
});


module.exports = router;