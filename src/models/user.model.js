import mongoose, {Schema} from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        index: true,
        trim: true,
        uniqe:true,
        lowarecase: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        uniqe:true,
        lowarecase: true
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
    },
    avatar: {
        type: String,         //URL 
        required: true,
    },
    coverImage: {
        type: String,         //URL
    },    
    watchHistory:[
        {
            type: Schema.Types.ObjectId,
            ref: "video"
        }
    ],
    password: {
        type: String,
        required:[true, "password is required"]
    },
    refreshToken: {
        type: String
    }
},{timestamps : true})

userSchema.pre("save", function async(next){               // this is for password incription
        if(!this.isModified("password"))    return next();

         this.password = this.password.hash(this.password, 10)
        next();
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);
