"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config/config");
const socketHander_1 = require("./middleware/socketHander");
const db_1 = require("./config/db");
const path_1 = __importDefault(require("path"));
const connection = new db_1.ConnectionDatabase();
connection.connectDB();
const router = (0, express_1.default)();
router.use(express_1.default.json({ limit: '10mb' }));
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'https://pawgilkrog.dk',
        'http://127.0.0.1:5173',
    ],
    credentials: true,
};
router.use((0, cors_1.default)(corsOptions));
router.options('*', (0, cors_1.default)(corsOptions));
router.get('/ping', (req, res, next) => res.status(200).json({ message: 'its alive' }));
// set up routes
router.use('/api/program', require('./routes/programRoute'));
router.use('/api/auth', require('./routes/authRoute'));
router.use('/api/user', require('./routes/userRoute'));
router.use('/api/error', require('./routes/errorRoute'));
router.use('/api/files', require('./routes/fileRoute'));
router.use('/api/paint', require('./routes/paintRoute'));
// Folder for uploads
router.use('/api/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Files for reading files from backend to the frontend
router.use('/api/assets/pingpong', express_1.default.static(path_1.default.join(__dirname, '../src/assets/pingpong')));
router.use('/api/assets/flappydisk', express_1.default.static(path_1.default.join(__dirname, '../src/assets/flappydisk')));
router.use('/api/assets/teststuff', express_1.default.static(path_1.default.join(__dirname, '../src/assets/teststuff')));
router.use('/api/assets/spaceshooter', express_1.default.static(path_1.default.join(__dirname, '../src/assets/spaceshooter')));
// Create the server
const server = http.createServer(router);
(0, socketHander_1.setupSocketIO)(server, router);
server.listen(config_1.config.server.port, () => console.log(`Server started on port ${config_1.config.server.port}`));
