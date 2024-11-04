import mongoose, { mongo } from 'mongoose'

const slideSchema = new mongoose.Schema({
  id: {
    required: true,
    type: Number,
  },
  title: {
    required: true,
    type: String,
  },
  text: {
    required: false,
    type: String,
  },
  image: {
    required: false,
    type: String,
  },
  type: {
    required: true,
    type: String,
  },
})

const Slide = mongoose.model('Slide', slideSchema)

export { Slide }
