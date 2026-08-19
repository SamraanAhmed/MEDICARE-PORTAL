const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const dns = require('dns');
const cookieParser = require('cookie-parser');
const { connectDB } = require("./database/mongodb");
const chatbotRouter = require('./api/chatbot');
const databaseRouter = require('./api/data');

dotenv.config();
dns.setServers(['1.1.1.1', '8.8.8.8']);
const app = express();
app.use(cookieParser());

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (/^http:\/\/localhost(:\d+)?$/.test(origin) || origin === process.env.FRONTEND_URL) {
            return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));
app.use(express.json());
app.use('/api/database', databaseRouter);
app.use('/api/chatbot', chatbotRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running"
  });
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.warn("WARNING: MongoDB failed to connect. Mongoose operations will timeout. Error:", error.message);
  });

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});

process.on('unhandledRejection', (reason, promise) => {
  console.warn('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.warn('Uncaught Exception thrown:', error.message);
});