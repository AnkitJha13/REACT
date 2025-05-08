const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const departmentRoutes = require("./routes/department");
const employeeRoutes = require("./routes/employee");
require("dotenv").config();

const app = express();

// Update CORS to accept requests from both localhost:3000 and localhost:5173
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // Allow both frontends
  credentials: true
}));

// Middleware to parse JSON body
app.use(express.json());

// Routes for authentication, departments, and employees
app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/employees", employeeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
