import './config/instrument.js'
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import * as Sentry from "@sentry/node"
import { clerkWebhooks } from './controllers/webhooks.js';
import companyRoutes from './routes/company.routes.js'
import connectCloudinary from './config/cloudinary.js';
import jobRoutes from './routes/job.route.js'
import userRoutes from './routes/user.route.js'
import {clerkMiddleware} from '@clerk/express'

const app = express();
await connectDB();
await connectCloudinary();

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
  allowedHeaders: ['Content-Type', 'Authorization', 'token', 'svix-id', 'svix-timestamp', 'svix-signature']
};

//middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(clerkMiddleware());

//Routes
app.get('/',(req,res)=>{
    res.send("Api working");
});
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});
app.post('/webhooks',clerkWebhooks);
app.use('/api/company',companyRoutes);
app.use('/api/jobs',jobRoutes);
app.use('/api/users',userRoutes);
//port
const PORT=process.env.PORT || 5000;
Sentry.setupExpressErrorHandler(app);

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})