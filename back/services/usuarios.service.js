import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

import {
    buscarPorUsername,
    buscarPorId,
    guardar,
    actualizar
} from "../repositories/usuarios.repository.js"


const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const TAMANO_MAXIMO = 1024 * 1024 // ~1MB de texto

// El mismo de siempre, desde la clase 8.
function errorCon(status, mensaje) {
    const error = new Error(mensaje)
    error.status = status
    return error
}

const VUELTAS = 10

function sinPassword(usuario) {
    return {
        _id: usuario._id,
        username: usuario.username,
        foto: usuario.foto,
    }
}


function validar(datos) {
    const username = datos.username
    const password = datos.password
    const foto = datos.foto

    if (!username || username.trim()==="" || !password) {
        throw errorCon(400, "Missing data: username and password")
    }

    if (password.length < 6) {
        throw errorCon(400, "The password must have at least 6 characters")
    }

    return { username: username.trim(), password: password, foto: foto || null}
}

async function chequearUsernameLibre(username) {
    const existente = await buscarPorUsername(username)

    if (existente) {
        throw errorCon(409, "the username '" + username + "' is already taken")
    }
}


// =====================================================================
//  REGISTRO
// =====================================================================

export async function registrarUsuario(datos) {
    const limpios = validar(datos)              
    await chequearUsernameLibre(limpios.username)    

    const hash = await bcrypt.hash(limpios.password, VUELTAS)

    const guardado = await guardar({
        username: limpios.username,
        password: hash,        
        foto: limpios.foto
    })

    return sinPassword(guardado)
}


// =====================================================================
//  LOGIN
// =====================================================================

export async function loginUsuario(datos) {
    if (!datos.username || !datos.password) {
        throw errorCon(400, "Missing username and password")
    }

    const usuario = await buscarPorUsername(datos.username)

    if (!usuario) {
        throw errorCon(401, "Username or password is incorrect")
    }

    // bcrypt.compare vuelve a hashear lo que escribió el usuario y lo
    // compara con el hash guardado. NO desencripta nada: no se puede.
    const coincide = await bcrypt.compare(datos.password, usuario.password)

    if (!coincide) {
        throw errorCon(401, "Username or password is incorrect")
    }

    const token = jwt.sign(
        { id: usuario._id },            // qué dice adentro
        process.env.JWT_SECRET,         // con qué se firma (del .env)
        { expiresIn: "2h" }             // cuánto dura
    )
    
    return {
        token: token,
        usuario: sinPassword(usuario)
    }
}


export async function obtenerUsuario(id) {
    const usuario = await buscarPorId(id)

    if (!usuario) {
        throw errorCon(404, "There is no user with id " + id)
    }

    return sinPassword(usuario)
}

export async function cambiarFoto(id, datos) {
    const foto = datos.foto

    if (!foto || typeof foto !== "string" || foto.trim() === "") {
        throw errorCon(400, "Missing the photo")
    }

    const tipo = foto.slice(5, foto.indexOf(";"))   // lo que está entre "data:" y ";"
    if (!foto.startsWith("data:image/") || !TIPOS_PERMITIDOS.includes(tipo)) {
        throw errorCon(400, "The photo must be a JPG, PNG, WEBP or GIF image")
    }

    if (foto.length > TAMANO_MAXIMO) {
        throw errorCon(413, "The photo is too big (max 1MB)")
    }

    const actualizado = await actualizar(id, { foto: foto })
    if (!actualizado) {
        throw errorCon(404, "There's no user with id " + id)
    }

    return sinPassword(actualizado)
}