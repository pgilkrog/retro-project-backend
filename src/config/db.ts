import mongoose from 'mongoose'
import * as config from './default.json'

export class ConnectionDatabase {
  connectDB = async () => {
    try {
      await mongoose.connect(config.mongoURI)

      console.log('MongooseDB connected')
    } catch (err: any) {
      console.error(err.message)
      process.exit(1)
    }
  }
}
