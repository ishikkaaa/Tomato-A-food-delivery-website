import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bycrypt from "bcrypt"
import validator from "validator"
import "dotenv/config.js"
//login user 
const loginUser=async(req,res)=>{
    const {email,password}=req.body
    try{
        const user= await userModel.findOne({email})
        if(!user){
           return res.json({success:false,message:"User does not exists"})
        }
        const isMatch=await bycrypt.compare(password,user.password)
        if(!isMatch) {
           return res.json({success:false,message:"Incorrect password!"})
        }
        const token=createToken(user._id)
        res.json({success:true,token})
    }
    catch (error){
        console.log(error);
        res.json({success:false,message:"Error!"})
    }
}

const createToken=(id)=>{
    return jwt.sign({id},"your-secret-key")
}
 
//register user
const registerUser=async(req,res)=>{
    const {name,email,password}=req.body;
    try{
        //checking if user already exists
        const exist=await userModel.findOne({email})
        if(exist){
             return res.json({success:false,message:"User already exists!"})
        }
         //validating email format and strong password
         if(!validator.isEmail(email)){
            return res.json({success:false,message:"Invalid email"})
         }
         if(password.length<8){
            return res.json({success:false,message:"Enter a strong password"})
         }
         //hashing user password
         const salt = await bycrypt.genSalt(10)
         const hashedPassword=await bycrypt.hash(password,salt)
         const newUser= new userModel({name:name,email:email,password:hashedPassword})
         const user=await newUser.save()
         const token=createToken(user._id)
         res.json({success:true,token})
    }
    catch(error){
        console.log(error)
        res.json({success:false,message:"Error!"})
    }
}

export {loginUser,registerUser}