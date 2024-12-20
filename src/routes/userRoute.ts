import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import { User, UserSettings } from '../models'
import auth from '../middleware/auth'

const router = express.Router()
const jsonParser = bodyParser.json()

// @route       GET api/user
// @desc        GET all users
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const userFound = await User.findById({ _id: id }).populate('settings')

    res.json({ user: userFound, status: true })
  } catch (error: any) {
    console.log(error.message)
    res.status(500).json('server error')
    res.json({ status: false })
  }
})

// @route       PUT api/user/:id
// @desc        Update user by id
router.put('/:id', auth, jsonParser, async (req: Request, res: Response) => {
  const { id } = req.params
  const userUpdate = req.query

  try {
    const updatedUser = await User.findByIdAndUpdate(id, userUpdate, {
      new: true,
    }).populate('settings')
    if (!updatedUser) return res.status(404).json({ error: 'User not found' })

    res.json({ user: updatedUser, status: true })
  } catch (error: any) {
    console.log(error.message)
    res.status(500).json('server error')
    res.json({ status: false })
  }
})

// @route       PUT api/user/settings/:id
// @desc        Update userSettings by id
router.put(
  '/settings/:id',
  auth,
  jsonParser,
  async (req: Request, res: Response) => {
    try {
      const id = req.params.id
      const userSettingsUpdate = req.body
      console.log('UPDATE USERSETTINGS', id, userSettingsUpdate)

      const updateUserSetting = await UserSettings.findByIdAndUpdate(
        id,
        userSettingsUpdate,
        { new: true }
      )

      if (!updateUserSetting)
        return res.status(404).json({ error: 'Program not found' })

      res.json(updateUserSetting)
    } catch (error: any) {
      console.log(error.message)
      res.status(500).json('server error')
    }
  }
)

// @route       GET api/user
// @desc        Get all users
router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const fetchedItems = await User.find().populate('settings')
    res.json({ users: fetchedItems, status: true })
  } catch (error: any) {
    console.log(error.message)
    res.status(500).json('server error')
    res.json({ users: [], status: false })
  }
})

export = router
