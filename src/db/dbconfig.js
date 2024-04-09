import mongoose from 'mongoose'
import {DB_NAME} from '../constants.js'

 const connectDB = async ()=>{
      try {
           const connectionInstance = await mongoose.connect(`${process.env.MONGOOSE_URL}/${DB_NAME}`)
           console.log(`Mongoose is connected to the DB $connectionInstance.connection.host}`)
        
      } catch (error) {
            console.error("ERROR :",error)
            process.exit(1);
        
      }
}

export default connectDB;