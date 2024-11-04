import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import auth from '../middleware/auth'

import { Program } from '../models/index'
import { InstalledProgram } from '../models'

const router = express.Router()
const jsonParser = bodyParser.json()

// @route       GET api/program
// @desc        Get all programs
router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const fetchedItems = await Program.find()
    res.json(fetchedItems)
  } catch (error: any) {
    console.log(error.message)
    res.status(500).send('server error')
  }
})

// @route       DELETE api/program
// @desc        Delete program by id
router.delete('/:id', auth, async (req: Request, res: Response) => {
  try {
    const deletedItem = await Program.findByIdAndDelete({ _id: req.params.id })
    res.send({ item: deletedItem })
  } catch (error: any) {
    console.log(error.message)
    res.status(500).send('server error')
  }
})

// @route       POST api/program
// @desc        Create a program
router.post('/', auth, jsonParser, async (req: Request, res: Response) => {
  const { name, image, color, displayName, sortOrder, type } = req.query

  console.log(name, image, color, displayName, sortOrder, type)
  try {
    const newProgram = new Program({
      name,
      displayName,
      image,
      color,
      sortOrder,
      type,
    })

    await newProgram.save()
    res.json(newProgram)
  } catch (error: any) {
    console.log(error.message)
    res.status(500).send('server error')
  }
})

// @route       PUT api/program/:id
// @desc        Update program by id
router.put('/:id', auth, jsonParser, async (req: Request, res: Response) => {
  const { name, image, color, displayName, sortOrder, type } = req.query
  const id = req.params.id
  const programToUpdate = req.query
  console.log(
    'UPDATE Program',
    name,
    image,
    color,
    displayName,
    sortOrder,
    type
  )
  console.log('UPDATE Program', programToUpdate)
  try {
    const updateProgram = await Program.findByIdAndUpdate(id, programToUpdate, {
      new: true,
    })

    if (!updateProgram)
      return res.status(404).send({ error: 'Program not found' })

    res.send(updateProgram)
  } catch (error: any) {
    console.log(error.message)
    res.status(500).send('server error')
  }
})

// @route       Get api/installedProgram/id
// @desc        Get all installedPrograms by userId
router.get(
  '/installedProgram/:id',
  auth,
  async (req: Request, res: Response) => {
    try {
      const fetchedItems = await InstalledProgram.find({
        userId: req.params.id,
      })
      res.json(fetchedItems)
    } catch (error: any) {
      console.log(error.meesage)
      res.status(500).send('server error')
    }
  }
)

// @route       POST api/installedProgram
// @desc        Create a installedProgram
router.post(
  '/installedProgram',
  auth,
  jsonParser,
  async (req: Request, res: Response) => {
    const { programId, userId, gridPosition } = req.query

    console.log(req.params)
    console.log(req.query)
    try {
      const newInstalledProgram = new InstalledProgram({
        programId,
        userId,
        gridPosition,
      })

      await newInstalledProgram.save()
      res.json(newInstalledProgram)
    } catch (error: any) {
      console.log(error.message)
      res.status(500).send('server error')
    }
  }
)

// @route       DELETE api/program
// @desc        Delete program by id
router.delete(
  '/installedProgram/:id',
  auth,
  async (req: Request, res: Response) => {
    try {
      console.log('DELETE INSTALLED PROGRAM', req.params.id)
      const deletedItem = await InstalledProgram.findByIdAndDelete({
        _id: req.params.id,
      })
      res.send({ item: deletedItem })
    } catch (error: any) {
      console.log(error.message)
      res.status(500).send('server error')
    }
  }
)

// @route       PUT api/installedProgram/:id
// @desc        Update installedProgram by id
router.put(
  '/installedProgram/:id',
  auth,
  jsonParser,
  async (req: Request, res: Response) => {
    // const { gridPosition } = req.query
    const id = req.params.id
    const programToUpdate = req.query
    // console.log("UPDATE Program", gridPosition)
    console.log('UPDATE InstalledProgram', programToUpdate)
    try {
      const updateProgram = await InstalledProgram.findByIdAndUpdate(
        id,
        programToUpdate,
        { new: true }
      )

      if (!updateProgram)
        return res.status(404).send({ error: 'Program not found' })

      res.send(updateProgram)
    } catch (error: any) {
      console.log(error.message)
      res.status(500).send('server error')
    }
  }
)

export = router
