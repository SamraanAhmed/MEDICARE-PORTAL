const express = require('express');
const { createUser, findAllUser, findUserByID, login, deleteUser, findAllConversations, CreateNewConversation,
    findAllMessagesOfConversation, SendMessage, UpdateConversationTitle, DeleteConversation, updateProfile
 } = require('../database/query');
const { jwt, authenticate, checkAuthentication } = require('../middleware/jwt');
const { user } = require('../database/mongodb');

const router = express.Router();

router.post('/register/user', async (req, res) => {
    try {
        const { name, email, password, gender } = req.body;
        const results = await createUser(name, email, password, gender);
        const token = jwt.sign({
                _id: results._id, name: results.name, avatar: results.avatar, email: results.email
            }, process.env.SECRET_KEY, {
                expiresIn: "7d"
        });
        res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).json(results);
    } catch (error) {
        res.status(409).json({
            message: error.message
        })
        throw error;
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const results = await login(email, password);
        const token = jwt.sign({
            _id: results._id, name: results.name, avatar: results.avatar, email: results.email
        }, process.env.SECRET_KEY, {
            expiresIn: "7d"
        })
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).json(results);
    } catch (error) {
        res.status(409).json({
            message: error.message
        })
        throw error;
    }
});


router.post('/logout', authenticate, async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            path: '/',
            sameSite: "none"
        });
        res.status(200).json({
            message: 'successfull logout'
        });
    } catch (error) {
        res.status(409).json({
            message: error.message
        })
        throw error;
    }
});

router.get('/delete/profile', authenticate, async (req, res) => {
    try {
        const results = await deleteUser(req.user._id);
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });
        res.status(200).json({
            message: 'successfull delete and logout'
        });
    } catch (error) {
        res.status(409).json({
            message: error.message
        })
        throw error;
    }
});

router.get('/get/all/user', authenticate, async (req, res) => {
    try {
        const results = await findAllUser();
        res.status(200).json(results);
    } catch (error) {
        res.status(409).json({
            message: error.message
        })
        throw error;
    }
});

router.get('/get/profile', authenticate, async (req, res) => {
    try {
        const results = await findUserByID(req.user._id);
        res.status(200).json(results);
    } catch (error) {
        res.status(409).json({
            message: error.message
        })
        throw error;
    }
});

router.get('/get/user/conversations', authenticate, async (req, res) => {
    try {
        const user_id = req.user._id;
        const results = await findAllConversations(user_id);
        res.status(200).json(results);
    } catch (error) {
        res.status(409).json({
            message: error.message
        })
        throw error;
    }
});

router.post('/get/conversation/messages', authenticate, async (req, res) => {
    try {
        const results = await findAllMessagesOfConversation(req.body.conversation_id);
        res.status(200).json(results);
    } catch (error) {
        res.status(409).json({
            message: error.message
        })
    }
});

router.post('/register/conversation', authenticate, async (req, res) => {
    try {
        const results = await CreateNewConversation(req.user._id, req.body.title);
        res.status(200).json(results);
    } catch (error) {
        res.status(409).json({
            message: error.message
        })
        throw error;
    }
});

router.get('/check/authentication', authenticate, async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch(error) {
        res.status(500).json({
            message: 'authentication check failed'
        });
    }
});

router.post('/register/message', authenticate, async (req, res) => {
    try {
        const results = await SendMessage(req.body.content,req.body.conversation_id, req.body.sender );
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

router.post('/update/conversation/title', authenticate, async (req, res) => {
    try {
        const results = await UpdateConversationTitle(req.body.conversation_id, req.body.title);
        console.log(results)
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

router.post('/delete/conversation', authenticate, async (req, res) => {
    try {
        const results = await DeleteConversation(req.body.conversation_id);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

router.post('/update/profile', authenticate, async (req, res) => {
    try {
        const results = await updateProfile({
            _id: req.user._id,
            name: req.body.name,
            password: req.body.password,
            gender: req.body.gender,
        });
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });
        const token = jwt.sign({
            _id: results._id, name: results.name, avatar: results.avatar, email: results.email
        }, process.env.SECRET_KEY, {
            expiresIn: "7d"
        });
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;