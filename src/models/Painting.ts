import mongoose from 'mongoose'

const PaintingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  canvas: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
})

const Painting = mongoose.model('Painting', PaintingSchema)

export { Painting }
