import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import faqRoutes from './routes/faqRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/faqs', faqRoutes);

// Database Connection
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});