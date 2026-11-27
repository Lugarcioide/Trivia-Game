import mongoose from "mongoose"
import { Trivia } from "../models/trivia.js"

function idValido(id) {
    return mongoose.isValidObjectId(id)
}

// todas, o solo las de un autor
export async function buscarTodas(usuarioId) {
    if (usuarioId) {
        return await Trivia.find({ usuario: usuarioId })
    }
    return await Trivia.find()
}

// si no existe devuelve undefined: NO decide, informa
export async function buscarPorId(id) {
    if (!idValido(id)) {
        return null
    }
    return await Trivia.findById(id)
}

export async function guardar(datos) {
   const nueva = new Trivia(datos)
    return await nueva.save()
}

export async function actualizar(id, datos) {
    if (!idValido(id)) { 
        return null
    }
    return await Trivia.findByIdAndUpdate(id, datos, { returnDocument: "after" })
}

export async function eliminar(id) {
    if (!idValido(id)) {
        return null
    }
    return await Trivia.findByIdAndDelete(id)
}