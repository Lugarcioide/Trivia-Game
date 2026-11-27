
import {
    registrarUsuario,
    loginUsuario,
    obtenerUsuario,
    cambiarFoto
} from "../services/usuarios.service.js"


// POST /usuarios/registro
export async function registrar(req, res) {
    try {
        const nuevo = await registrarUsuario(req.body)
        res.status(201).json(nuevo)
    } catch (error) {
        res.status(error.status || 500).json({ mensaje: error.message })
    }
}

// POST /usuarios/login
export async function login(req, res) {
    try {
        const resultado = await loginUsuario(req.body)
        res.json(resultado)          // { token: "...", usuario: {...} }
    } catch (error) {
        res.status(error.status || 500).json({ mensaje: error.message })
    }
}

export async function yo(req, res) {
    try {
        const usuario = await obtenerUsuario(req.usuario.id)
        res.json(usuario)
    } catch (error) {
        res.status(error.status || 500).json({ mensaje: error.message })
    }
}

export async function foto(req, res) {
    try {
        const usuario = await cambiarFoto(req.usuario.id, req.body)
        res.json(usuario)
    } catch (error) {
        res.status(error.status || 500).json({ mensaje: error.message })
    }
}