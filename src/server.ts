import * as http from 'http'
import express from 'express'
import cors from 'cors'
import {config} from './config/config'

const router = express()
router.use(express.json({ limit: '10mb'}))

const corsOptions = {
    origin: process.env.APP_URL,
    credentials: true
}
router.use(cors(corsOptions))

router.options('*', cors(corsOptions))

router.get('/ping', (req, res, next) => res.status(200).json({ hello: 'world' }))

http.createServer(router).listen(config.server.port, () => console.log(`Server started on port ${config.server.port}`))