const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const dns = require('dns');
const cookieParser = require('cookie-parser');
const { connectDB } = require("./database/mongodb");

dotenv.config();
dns.setServers(['1.1.1.1', '8.8.8.8']);
const app = express();
app.use(cookieParser());

app.use(cors({
    origin: process.env.FRONTEND_URL,
}));
app.use(express.json());

app.get("/check/health", (req, res) => {
  res.status(200).json({
    message: "Server is running"
  });
});

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT} and database is also connected`);
  });
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});