import mongoose from 'mongoose';

export const connectDb=async()=>{
    await mongoose.connect('mongodb+srv://ishikkaaa:240703@cluster0.6kvhy.mongodb.net/FoodDelivery').then(()=>console.log("DB connected!"))
}