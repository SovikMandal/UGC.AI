import './config/instrument.mjs'
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import clearkWebhook from "./controllers/cleark.controller.js";
import * as Sentry from "@sentry/node"
import userRouter from './routes/user.route.js'
import projectRouter from './routes/project.route.js'


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware //
app.use(cors());   
app.post('/api/clerk', express.raw({ type: 'application/json' }) ,clearkWebhook)
app.use(express.json());
app.use(clerkMiddleware());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api/user', userRouter);
app.use('/api/project', projectRouter);

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

Sentry.setupExpressErrorHandler(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 