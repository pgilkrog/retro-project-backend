import express from 'express'
import path from 'path'

const router = express()

// Folder for uploads
router.use('/api/uploads', express.static(path.join(__dirname, '../uploads')))

// router.use('/src/assets/pingpong', express.static(path.join(__dirname, '../src/assets/pingpong')))