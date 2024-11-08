import * as http from 'http'
import express from 'express'
import cors from 'cors'
import { config } from './config/config'
import { setupSocketIO } from './middleware/socketHander'
import { ConnectionDatabase } from './config/db'
import path from 'path'

const connection = new ConnectionDatabase()
connection.connectDB()

const router = express()
router.use(express.json({ limit: '10mb' }))

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://pawgilkrog.dk',
    'http://127.0.0.1:5173',
  ],
  credentials: true,
}
router.use(cors(corsOptions))

router.options('*', cors(corsOptions))

router.get('/ping', (req, res, next) =>
  res.status(200).json({ message: 'its alive' })
)

// set up routes
router.use('/api/program', require('./routes/programRoute'))
router.use('/api/auth', require('./routes/authRoute'))
router.use('/api/user', require('./routes/userRoute'))
router.use('/api/error', require('./routes/errorRoute'))
router.use('/api/files', require('./routes/fileRoute'))
router.use('/api/paint', require('./routes/paintRoute'))

// Folder for uploads
router.use('/api/uploads', express.static(path.join(__dirname, '../uploads')))

// Files for reading files from backend to the frontend
router.use(
  '/api/assets/pingpong',
  express.static(path.join(__dirname, '../src/assets/pingpong'))
)
router.use(
  '/api/assets/flappydisk',
  express.static(path.join(__dirname, '../src/assets/flappydisk'))
)
router.use(
  '/api/assets/teststuff',
  express.static(path.join(__dirname, '../src/assets/teststuff'))
)
router.use(
  '/api/assets/spaceshooter',
  express.static(path.join(__dirname, '../src/assets/spaceshooter'))
)

// Create the server
const server = http.createServer(router)

setupSocketIO(server, router)

server.listen(config.server.port, () =>
  console.log(`Server started on port ${config.server.port}`)
)
