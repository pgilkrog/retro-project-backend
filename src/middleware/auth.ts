import { Request, Response, NextFunction } from 'express'
import * as config from '../config/default.json'

const jwt = require('jsonwebtoken')

export = (req: Request, res: Response, next: NextFunction) => {
  // Get token from the header
  const token = req.header('Authorization')

  // Check if no token
  if (token == undefined) {
    return res.status(401).json({ msg: 'No Token, authorization denied!' })
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret)
    if (decoded) {
      next()
    } else {
      res.json({ message: 'could not decode token' })
    }
  } catch (error) {
    res.json({ message: 'not authorized' })
    req.body = {}
  }
}
