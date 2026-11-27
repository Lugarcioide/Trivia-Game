import mongoose from "mongoose"
export async function conectarBase() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to MongoDB Atlas")
    } catch (error) {
        console.log("Could not connect to the database:")
        console.log(error.message)
        process.exit(1)
    }
}