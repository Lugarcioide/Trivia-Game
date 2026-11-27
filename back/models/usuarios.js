
import mongoose from "mongoose"

const usuarioSchema = new mongoose.Schema({

    username: { type: String, required: true },
    password: { type: String, required: true },
    foto: { type: String, default: null },
})

export const Usuario = mongoose.model("Usuario", usuarioSchema)