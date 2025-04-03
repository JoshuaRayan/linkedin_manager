"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const campaignRoutes_1 = __importDefault(require("./routes/campaignRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/messageRoutes"));
// import { errorHandler } from './middleware/errorHandler';
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
// Enable CORS
app.use((0, cors_1.default)({
    origin: 'https://nodejs-frontend-alpha.vercel.app/', // Allow frontend access
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Routes
app.use('/api/campaigns', campaignRoutes_1.default);
app.use('/api/personalized-message', messageRoutes_1.default);
console.log('API routes initialized');
// app.use(errorHandler);
exports.default = app;
