const jwt = require('jsonwebtoken');


async function authenticate(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({
        message: 'You are not athorized'
    });
    try {
        req.user = jwt.verify(token, process.env.SECRET_KEY);
        next();
    } catch {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
}

async function checkAuthentication(req, res, next) {
    const token = req.cookies.token;
    if (!token) return next();
    try {
        req.user = jwt.verify(token, process.env.SECRET_KEY);
    } catch {
        req.user = null;
    }
    next();
}


module.exports = {
    authenticate, checkAuthentication, jwt
}