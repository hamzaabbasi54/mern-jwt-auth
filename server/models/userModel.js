import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    verifyOtp:{type:String,default:null},
    verifyOtpExpire:{type:Date,default:null},
    isAccountVerified:{type:Boolean,default:false},
    resetOtp:{type:String,default:null},
    resetOtpExpireAt:{type:Number,default:null},
    createdAt:{type:Date,default:Date.now}
})

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
