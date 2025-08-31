require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const uploadRoute = require("./routes/uploadRoute");




const app = express();

// Middleware to handle cors
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  methods: ["GET", "PUT", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Middleware to parse JSON bodies
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Your backend is up and running!");
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/upload", uploadRoute);


// Server upload folder 
app.use("/uploads", express.static(path.join(__dirname, "upload")));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
