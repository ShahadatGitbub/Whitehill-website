import express from "express";
import dotenv from "dotenv";  // Fixed import syntax
import mongoose from "mongoose";
import cors from "cors";
import subscriberRouter from "./routes/subscriberRoutes.js";  // Moved after express initialization
import visitorRouter from "./routes/visitorRoutes.js";

// Initialize dotenv before using process.env
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173','https://whitehilll.com'], // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],        // Allowed methods
    allowedHeaders: ['Content-Type'] // Allowed headers
  }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI,)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api', subscriberRouter);
app.use('/api', visitorRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});