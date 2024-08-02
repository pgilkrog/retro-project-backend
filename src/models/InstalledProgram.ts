import mongoose from 'mongoose'

const installedProgramSchema = new mongoose.Schema ({
  programId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },  
  gridPosition: {
    type: Number,
    required: true
  }
})

const InstalledProgram = mongoose.model('InstalledProgram', installedProgramSchema)

export { InstalledProgram }