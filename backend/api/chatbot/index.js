const express = require('express');
//const { jwt, authenticate, checkAuthentication } = require('../middleware/jwt');
const { createMessage } = require('../../database/queries');
const { gemini } = require('../../google');

const router = express.Router();


router.post('/ask', async (req, res) => {
    try {
        const { content } = req.body;
        const results = await gemini.generateContent(content);
        const reply = results.response.text();
        const sendMessageResults = await createMessage(req.user._id, reply, 'bot');
        res.status(200).json({
            message: reply
        });
    } catch (error) {
        res.status(409).json({message: error.message});
    }
});


module.exports = router;