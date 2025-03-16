require("dotenv").config(); // .env faylni yuklash
const express = require("express");
const cors = require("cors");
const checkIpRouter = require("./router/checkIp");

const app = express();

app.use(cors());
app.use(express.json());

// API yo‘nalishini qo‘shamiz
app.use("/api/v1", checkIpRouter);

// Serverni 3000-portda ishga tushiramiz
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server ${PORT}-portda ishga tushdi!`));
