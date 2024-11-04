import bodyParser from 'body-parser'
import express, { Request, Response } from 'express'
import auth from '../../middleware/auth'
import { Slide } from '../../models'

const router = express.Router()
const jsonParser = bodyParser.json()

router.post('/', auth, jsonParser, async (req: Request, res: Response) => {
  try {
    const { id, title, text, image, type } = req.body

    const newSlide = new Slide({
      id,
      title,
      text,
      image,
      type,
    })

    await newSlide.save()
    res.json(newSlide)
  } catch (error: any) {
    console.log(error.message)
    res.status(500).send('server error')
  }
})

export = router
