import './config/instrument.js'
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import * as Sentry from "@sentry/node"
import companyRoutes from './routes/company.routes.js'
import connectCloudinary from './config/cloudinary.js';
import jobRoutes from './routes/job.route.js'
import userRoutes from './routes/user.route.js'

const app = express();
await connectDB();
await connectCloudinary();

// Check required environment variables
if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET environment variable is required!');
    process.exit(1);
}

// CORS configuration
const corsOptions = {
  origin: [
    'https://job-flow-gamma.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

//middlewares
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

//Routes
app.get('/',(req,res)=>{
    res.send("Api working");
});
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.use('/api/company',companyRoutes);
app.use('/api/jobs',jobRoutes);
app.use('/api/users',userRoutes);

//port
const PORT=process.env.PORT || 5000;
Sentry.setupExpressErrorHandler(app);

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})