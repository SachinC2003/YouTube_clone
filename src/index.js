//require('dotenv').config({path:'./env'})
import dotenv from "dotenv"
import connectDB from "./db/dbconfig.js";
import {app} from "./app.js"
dotenv.config({
    path: './.env'
})

  
connectDB()
.then(()=>{
        app.listen(process.env.PORT || 8000, ()=>{
            console.log(`server is running on port ${process.env.PORt}`)
        })
})
.catch((err)=>{
        console.log(`Mongo db connection is failed`, err)
})


/*import express from 'express'
const app = express()

(async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGOOSE_URL}/${DB_NAME}`)
        app.on('error', ()=>{           //if erroe is happen in app 
            console.log("ERROR: ",error)
            throw(err)
        })

        app.listen(process.env.PORT, ()=>{
            console.log(`App is listening on port ${process.env.PORT}`)
        })
    } catch (error) {
        console.error("ERROR :",error)
        throw(err)
    }
})()*/