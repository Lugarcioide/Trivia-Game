import mongoose from "mongoose"
import { Usuario } from "../models/usuarios.js"

function idValido(id) {
    return mongoose.isValidObjectId(id)
}

export async function buscarPorUsername(username) {
    return await Usuario.findOne({ username: username })
}

export async function buscarPorId(id) {
    if (!idValido(id)) {
        return null
    }
    return await Usuario.findById(id)
}

export async function guardar(datos) {
    const nuevo = new Usuario(datos)
    return await nuevo.save()
}

export async function actualizar(id, datos) {
    if (!idValido(id)) {
        return null
    }
    return await Usuario.findByIdAndUpdate(id, datos, { returnDocument: "after" })
}
