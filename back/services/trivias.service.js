import { buscarTodas, buscarPorId, guardar, eliminar } from "../repositories/trivias.repository.js"
import { buscarPorId as buscarUsuarioPorId } from "../repositories/usuarios.repository.js"

// Un error normal, pero con un número adentro.
// El controller lo va a leer para elegir el código.
function errorCon(status, mensaje) {
    const error = new Error(mensaje)
    error.status = status
    return error
}

// LA regla de las trivias, escrita UNA vez.
function validar(datos) {
    const category = datos.category
    const preguntas = datos.preguntas

    if (!category || category.trim() === "") {
        throw errorCon(400, "Trivia name is missing")
    }

    if (!preguntas || preguntas.length < 10) {
        throw errorCon(400, "This trivia needs at least 10 questions")
    }

    if (preguntas.length % 2 !== 0) {
        throw errorCon(400, "The number of questions must be even")
    }

    const incompleta = preguntas.find((p) =>
        !p.question ||
        !p.correct_answer ||
        !p.incorrect_answers ||
        p.incorrect_answers.length !== 3 ||
        p.incorrect_answers.includes("")
    )

    if (incompleta) {
        throw errorCon(400, "Each question needs the text, the correct answer and 3 incorrect answers")
    }

    return { category: category.trim(), preguntas: preguntas }
}


function chequearQueSeaTuya(trivia, usuarioId) {
    if (trivia.usuario.toString() !== usuarioId) {
        throw errorCon(403, "That trivia is not yours")
    }
}
// Lo que se muestra en la tabla: la trivia con los datos de su autor
async function filaDeLaTabla(trivia) {
    const autor = await buscarUsuarioPorId(trivia.usuario)
    return {
        id: trivia.id,
        category: trivia.category,
        autor: autor
            ? { username: autor.username, foto: autor.foto }
            : { username: "deleted user", foto: null },
        rating: trivia.rating,
        vecesJugada: trivia.vecesJugada,
    }
}

export async function listarTrivias(buscar, orden, usuarioId, soloMias) {
    const trivias = await buscarTodas(soloMias ? usuarioId : null)

    let lista = []
    for (const t of trivias) {
        lista.push(await filaDeLaTabla(t))
    }

    if (buscar) {
        const texto = buscar.toLowerCase()
        lista = lista.filter((t) =>
            t.category.toLowerCase().includes(texto) ||
            t.autor.username.toLowerCase().includes(texto)
        )
    }

    if (orden === "popular-desc") {
        lista.sort((a, b) => b.rating - a.rating)
    } else if (orden === "popular-asc") {
        lista.sort((a, b) => a.rating - b.rating)
    } else if (orden === "jugadas-desc") {
        lista.sort((a, b) => b.vecesJugada - a.vecesJugada)
    } else if (orden === "jugadas-asc") {
        lista.sort((a, b) => a.vecesJugada - b.vecesJugada)
    }

    return lista
}

export async function obtenerTrivia(id) {
    const trivia = await buscarPorId(id)
    if (!trivia) {
        throw errorCon(404, "There's no trivia with id " + id)
    }
    return trivia
}

export async function crearTrivia(datos, usuarioId) {
    const limpios = validar(datos)
   const autor = await buscarUsuarioPorId(usuarioId)
    if (!autor) {
        throw errorCon(404, "There's no user with id " + usuarioId)
    }
    limpios.usuario = usuarioId // el autor es el usuario que crea la trivia
    
    return await guardar(limpios)
}

export async function borrarTrivia(id, usuarioId) {
    const trivia = await obtenerTrivia(id)
    chequearQueSeaTuya(trivia, usuarioId)
    return await eliminar(id)
}
