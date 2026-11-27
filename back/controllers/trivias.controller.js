import { listarTrivias, obtenerTrivia, crearTrivia, borrarTrivia } from "../services/trivias.service.js"

// GET /trivias · GET /trivias?buscar=poke&orden=popular-desc&autor=1
export async function listar(req, res) {
    try {
        const buscar = req.query.buscar;
        const soloMias=req.query.autor ==="yo";
        const lista = await listarTrivias(buscar, req.query.orden, req.usuario.id, soloMias)

        if (buscar && lista.length === 0) {
            return res.status(200).json({ mensaje: `There are no trivias with "${buscar}"` })
        }

        res.json(lista)
    } catch (error) {
        // error.status lo puso el service. Si no hay: 500.
        res.status(error.status || 500).json({ mensaje: error.message })
    }
}

// GET /trivias/:id
export async function obtener(req, res) {
    try {
        const trivia = await obtenerTrivia(req.params.id)
        res.json(trivia)
    } catch (error) {
        res.status(error.status || 500).json({ mensaje: error.message })
    }
}

// POST /trivias
export async function crear(req, res) {
    try {
        const nueva = await crearTrivia(req.body, req.usuario.id)
        res.status(201).json(nueva)
    } catch (error) {
        res.status(error.status || 500).json({ mensaje: error.message })
    }
}

// DELETE /trivias/:id
export async function borrar(req, res) {
    try {
        const id = req.params.id
        await borrarTrivia(id, req.usuario.id)
        res.json({ mensaje: "Trivia " + id + " deleted" })
    } catch (error) {
        res.status(error.status || 500).json({ mensaje: error.message })
    }
}
