import { guardarPreguntas, rellenarPreguntas } from './otdb/main.js';
import { showPantalla } from './otdb/router.js';
import { PANTALLA_JUEGO, PANTALLA_JUEGO2, PANTALLA_PROFILE, PANTALLA_SIGNUP } from './otdb/router.js';

const BASE_URL = "http://localhost:3000"

// =====================================================================
//  SESIÓN (token + usuario en localStorage)
// =====================================================================
function guardarSesion(token, usuario) {
    localStorage.setItem("token", token)
    localStorage.setItem("usuario", JSON.stringify(usuario))
}

function obtenerToken() {
    return localStorage.getItem("token")
}

function obtenerUsuarioActual() {
    const texto = localStorage.getItem("usuario")
    return texto ? JSON.parse(texto) : null
}
const btnCerrarSesion = document.querySelector("#btnLogOut")
btnCerrarSesion.addEventListener("click", () => {
    cerrarSesion()
    showPantalla(PANTALLA_SIGNUP)
    })

function cerrarSesion() {
    localStorage.removeItem("token")
    localStorage.removeItem("usuario")
}

// =====================================================================
//  FETCH CENTRAL: le pone el token a todo y maneja los errores
// =====================================================================
async function pedir(ruta, opciones = {}) {
    const headers = { ...(opciones.headers || {}) }

    if (opciones.body) {
        headers["Content-Type"] = "application/json"
    }

    const token = obtenerToken()
    if (token) {
        headers["Authorization"] = `Bearer ${token}`
    }

    let respuesta
    try {
        respuesta = await fetch(`${BASE_URL}${ruta}`, { ...opciones, headers })
    } catch (error) {
        throw new Error("Could not connect to the server. Is it running?")
    }

    let datos = null
    try {
        datos = await respuesta.json()
    } catch (error) {
        // la respuesta no tenía JSON
    }

    // token vencido o inválido en una ruta protegida -> se borra la sesión
    if (respuesta.status === 401 && ruta.startsWith("/trivias")) {
        cerrarSesion()
        throw new Error("Your session expired. Log in again")
    }

    if (!respuesta.ok) {
        throw new Error(datos?.mensaje || `Error ${respuesta.status}`)
    }

    return datos
}

// =====================================================================
//  USUARIOS
// =====================================================================
async function registrarUsuario(username, password) {
    return await pedir("/usuarios/registro", {
        method: "POST",
        body: JSON.stringify({ username, password })
    })
}

async function loginUsuario(username, password) {
    return await pedir("/usuarios/login", {
        method: "POST",
        body: JSON.stringify({ username, password })
    })
}

async function obtenerYo() {
    return await pedir("/usuarios/yo")
}

// foto = data URL ("data:image/jpeg;base64,...")
async function subirFoto(foto) {
    return await pedir("/usuarios/yo/foto", {
        method: "PUT",
        body: JSON.stringify({ foto })
    })
}



// =====================================================================
//  TRIVIAS
// =====================================================================
async function obtenerTrivias(orden, buscar, soloMias) {
    const params = new URLSearchParams({ orden: orden, buscar: buscar })
    if (soloMias) {
        params.append("autor", "yo")
    }
    return await pedir(`/trivias?${params}`)
}

async function obtenerTrivia(id) {
    return await pedir(`/trivias/${id}`)
}

async function agregarTrivia(trivia) {
    return await pedir("/trivias", {
        method: "POST",
        body: JSON.stringify(trivia)
    })
}

async function borrarTrivia(id) {
    return await pedir(`/trivias/${id}`, { method: "DELETE" })
}

// =====================================================================
//  REFERENCIAS AL HTML
// =====================================================================
// ----- Login / Registro -----
const formRegistro = document.querySelector("#formRegistro")
const inpRegistroUsername = document.querySelector("#registroUsername")
const inpRegistroPassword = document.querySelector("#registroPassword")
const pRegistroMensaje = document.querySelector("#registroMensaje")
const btnIrALogin = document.querySelector("#irALogin")

const formLogin = document.querySelector("#formLogin")
const inpLoginUsername = document.querySelector("#loginUsername")
const inpLoginPassword = document.querySelector("#loginPassword")
const pLoginMensaje = document.querySelector("#loginMensaje")
const btnIrARegistro = document.querySelector("#irARegistro")

// ----- Menú / Perfil -----
const h1Bienvenida = document.querySelector("#menuBienvenida")
const imgFoto = document.querySelector("#menuFoto")
const btnCambiarFoto = document.querySelector("#MenuChangePfp")
const inputFoto = document.querySelector("#inputFoto")
const pMenuMensaje = document.querySelector("#menuMensaje")

// ----- World Wide -----
const cuerpoTabla = document.querySelector("#cuerpo-tabla")
const selectOrden = document.querySelector("#orden")
const inputBuscador = document.querySelector("#buscador")
const btnBuscar = document.querySelector("#buscar")

// ----- Your collection -----
const cuerpoColeccion = document.querySelector("#cuerpo-coleccion")
const selectOrdenColeccion = document.querySelector("#ordenColeccion")
const inputBuscadorColeccion = document.querySelector("#buscadorColeccion")

// ----- Popups -----
const popup = document.querySelector(".popup")
const popup2 = document.querySelector("#popup2")
const popupCategoria = document.querySelector("#popup-categoria")
const popupBorrar = document.querySelector("#popup-borrar")
const btnSi = document.querySelector("#btn-si")
const btnNo = document.querySelector("#btn-no")
const btnSi2 = document.querySelector("#btn-si2")
const btnNo2 = document.querySelector("#btn-no2")

// ----- Creador -----
const divPreguntas = document.querySelector("#CreatorPreguntas")
const pCreadorMensaje = document.querySelector("#CreatorMensaje")
const btnAgregarPregunta = document.querySelector("#AddQuestion")
const btnContinuar = document.querySelector("#CreatorContinue")

const inpNombreTrivia = document.querySelector("#TriviaTitle")
const pNombreMensaje = document.querySelector("#NombreMensaje")
const btnVolverAPreguntas = document.querySelector("#NombreGoBack")
const btnGuardarTrivia = document.querySelector("#CreatorSave")

const MINIMO_PREGUNTAS = 10
const DE_A_CUANTAS = 2

let triviaElegida = null
let BorrarElegida = null
let preguntasNuevas = []

// =====================================================================
//  LOGIN / REGISTRO
// =====================================================================
formRegistro.addEventListener("submit", async (evento) => {
    evento.preventDefault()

    const username = inpRegistroUsername.value.trim()
    const password = inpRegistroPassword.value

    if (username === "" || password === "") {
        pRegistroMensaje.textContent = "Complete user and password"
        return
    }
    if (password.length < 6) {
        pRegistroMensaje.textContent = "The password must have at least 6 characters"
        return
    }

    try {
        await registrarUsuario(username, password)

        // el registro no devuelve token, así que se loguea solo
        const { token, usuario } = await loginUsuario(username, password)
        guardarSesion(token, usuario)

        formRegistro.reset()
        pRegistroMensaje.textContent = `Account created! Welcome, ${usuario.username}`
        pLoginMensaje.textContent = ""
        mostrarUsuario(usuario)
        await cargarTodo()
    } catch (error) {
        pRegistroMensaje.textContent = error.message
    }
})

formLogin.addEventListener("submit", async (evento) => {
    evento.preventDefault()

    const username = inpLoginUsername.value.trim()
    const password = inpLoginPassword.value

    if (username === "" || password === "") {
        pLoginMensaje.textContent = "Complete user and password"
        return
    }

    try {
        const { token, usuario } = await loginUsuario(username, password)
        guardarSesion(token, usuario)

        formLogin.reset()
        pLoginMensaje.textContent = `Welcome, ${usuario.username}!`
        pRegistroMensaje.textContent = ""
        mostrarUsuario(usuario)
        await cargarTodo()
    } catch (error) {
        pLoginMensaje.textContent = error.message
    }
})

// no se apagan pantallas: solo lleva el foco al otro form
btnIrALogin.addEventListener("click", () => inpLoginUsername.focus())
btnIrARegistro.addEventListener("click", () => inpRegistroUsername.focus())

// =====================================================================
//  PERFIL Y FOTO
// =====================================================================
const TIPOS_FOTO = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const LADO_FOTO = 256          // la foto se achica a 256x256 como máximo

// Pinta nombre y foto en el menú
function mostrarUsuario(usuario) {
    if (!usuario) {
        h1Bienvenida.textContent = "Welcome!"
        imgFoto.removeAttribute("src")
        return
    }
    h1Bienvenida.textContent = `Welcome, ${usuario.username}!`
    if (usuario.foto) {
        imgFoto.src = usuario.foto
    } else {
        imgFoto.removeAttribute("src")
    }
}

// Lee el archivo y lo convierte en data URL (texto base64)
function leerComoDataURL(archivo) {
    return new Promise((resolve, reject) => {
        const lector = new FileReader()
        lector.onload = () => resolve(lector.result)
        lector.onerror = () => reject(new Error("Could not read the image"))
        lector.readAsDataURL(archivo)
    })
}

// Achica la imagen con un <canvas> para que no supere el 1MB del back.
function achicarImagen(dataURL) {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
            const escala = Math.min(1, LADO_FOTO / Math.max(img.width, img.height))
            const canvas = document.createElement("canvas")
            canvas.width = Math.round(img.width * escala)
            canvas.height = Math.round(img.height * escala)
            canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height)
            resolve(canvas.toDataURL("image/jpeg", 0.85))
        }
        img.onerror = () => reject(new Error("That file is not a valid image"))
        img.src = dataURL
    })
}

// El botón "Change PFP" abre el selector de archivos
btnCambiarFoto.addEventListener("click", () => inputFoto.click())

inputFoto.addEventListener("change", async () => {
    const archivo = inputFoto.files[0]
    if (!archivo) {
        return
    }

    if (!obtenerToken()) {
        pMenuMensaje.textContent = "Log in to change your picture"
        inputFoto.value = ""
        return
    }

    if (!TIPOS_FOTO.includes(archivo.type)) {
        pMenuMensaje.textContent = "The photo must be a JPG, PNG, WEBP or GIF image"
        inputFoto.value = ""
        return
    }

    const fotoAnterior = imgFoto.getAttribute("src")

    try {
        pMenuMensaje.textContent = "Uploading..."
        const original = await leerComoDataURL(archivo)
        const foto = await achicarImagen(original)

        imgFoto.src = foto
        const usuario = await subirFoto(foto)

        guardarSesion(obtenerToken(), usuario)
        mostrarUsuario(usuario)
        pMenuMensaje.textContent = "Picture updated!"
        await cargarTabla()
    } catch (error) {
        if (fotoAnterior) {
            imgFoto.src = fotoAnterior
        } else {
            imgFoto.removeAttribute("src")
        }
        pMenuMensaje.textContent = error.message
    }

    inputFoto.value = ""
})


// =====================================================================
//  TABLAS
// =====================================================================
function estrellas(rating) {
    let texto = ""
    for (let i = 1; i <= 5; i++) {
        texto += i <= rating ? "★" : "☆"
    }
    return texto
}

function avatar(autor) {
    if (autor.foto) {
        return `<img src="${autor.foto}" alt="${autor.username}" width="40" height="40">`
    }
    return "?"
}

function pintarTabla(lista, cuerpo, esColeccion) {
    cuerpo.innerHTML = ""
    const columnas = esColeccion ? 4 : 5

    // el back devuelve { mensaje } cuando la búsqueda no encuentra nada
    if (!Array.isArray(lista)) {
        cuerpo.innerHTML = `<tr><td colspan="${columnas}">${lista.mensaje}</td></tr>`
        return
    }

    if (lista.length === 0) {
        cuerpo.innerHTML = `<tr><td colspan="${columnas}">There are no trivias to show.</td></tr>`
        return
    }

    lista.forEach((trivia) => {
        const fila = document.createElement("tr")

        const celdaCategoria = `<td class="categoria">${trivia.category}</td>`
        const celdasRatingYConteo = `
            <td><span class="estrellas" aria-label="${trivia.rating} de 5">${estrellas(trivia.rating)}</span></td>
            <td class="conteo">${trivia.vecesJugada}</td>
       `

        if (esColeccion) {
            fila.innerHTML = celdaCategoria + celdasRatingYConteo +
                `<td><button type="button" class="btn-borrar" aria-label="Borrar ${trivia.category}">🗑️</button></td>`

            fila.querySelector(".btn-borrar").addEventListener("click", () => {
                BorrarElegida = trivia
                popupBorrar.textContent = trivia.category
                popup2.hidden = false
            })

            cuerpo.appendChild(fila)
            return
        }

        fila.innerHTML = celdaCategoria + `
            <td class="autor">${trivia.autor.username}</td>
            <td class="avatar-cell">${avatar(trivia.autor)}</td>
        `+ celdasRatingYConteo

        fila.addEventListener("click", async () => {
            try {
                triviaElegida = await obtenerTrivia(trivia.id)
                popupCategoria.textContent = triviaElegida.category
                popup.hidden = false
            } catch (error) {
                alert(error.message)
            }
        })

        cuerpo.appendChild(fila)
    })
}

export async function cargarTabla() {
    if (!obtenerToken()) {
        cuerpoTabla.innerHTML = `<tr><td colspan="5">Log in to see the trivias</td></tr>`
        return
    }
    try {
        const trivias = await obtenerTrivias(selectOrden.value, inputBuscador.value, false)
        pintarTabla(trivias, cuerpoTabla, false)
    } catch (error) {
        cuerpoTabla.innerHTML = `<tr><td colspan="5">${error.message}</td></tr>`
    }
}

async function cargarColeccion() {
    if (!obtenerToken()) {
        cuerpoColeccion.innerHTML = `<tr><td colspan="4">Log in to see your collection</td></tr>`
        return
    }
    try {
        const trivias = await obtenerTrivias(
            selectOrdenColeccion.value,
            inputBuscadorColeccion.value,
            true
        )
        pintarTabla(trivias, cuerpoColeccion, true)
    } catch (error) {
        cuerpoColeccion.innerHTML = `<tr><td colspan="4">${error.message}</td></tr>`
    }
}

async function cargarTodo() {
    await Promise.all([cargarTabla(), cargarColeccion()])
}

selectOrden.addEventListener("change", cargarTabla)
inputBuscador.addEventListener("input", cargarTabla)
btnBuscar.addEventListener("click", cargarTabla)

selectOrdenColeccion.addEventListener("change", cargarColeccion)
inputBuscadorColeccion.addEventListener("input", cargarColeccion)

// =====================================================================
//  POPUPS
// =====================================================================
btnNo.addEventListener("click", () => {
    popup.hidden = true
    triviaElegida = null
})

btnSi.addEventListener("click", () => {
    popup.hidden = true
    console.log("A jugar:", triviaElegida)
    startTrivia(triviaElegida)  // TODO
})

btnNo2.addEventListener("click", () => {
    popup2.hidden = true
    BorrarElegida = null
})

btnSi2.addEventListener("click", async () => {
    popup2.hidden = true
    try {
        await borrarTrivia(BorrarElegida.id)
        await cargarTodo()
    } catch (error) {
        alert(error.message)
    }
    BorrarElegida = null
})

// =====================================================================
//  CREADOR DE TRIVIAS
// =====================================================================
function agregarBloquePregunta() {
    const numero = divPreguntas.children.length + 1

    const bloque = document.createElement("div")
    bloque.className = "CreatorBloque"
    bloque.innerHTML = `
        <h3>Question ${numero}</h3>
        <input type="text" class="CreatorQuestion" placeholder="Question">
        <input type="text" class="CreatorAnswerCorrect" placeholder="Correct Answer">
        <input type="text" class="CreatorAnswerIncorrect" placeholder="Incorrect Answer">
        <input type="text" class="CreatorAnswerIncorrect" placeholder="Incorrect Answer">
        <input type="text" class="CreatorAnswerIncorrect" placeholder="Incorrect Answer">
    `
    divPreguntas.appendChild(bloque)
}

function reiniciarFormulario() {
    divPreguntas.innerHTML = ""
    for (let i = 1; i <= MINIMO_PREGUNTAS; i++) {
        agregarBloquePregunta()
    }
    preguntasNuevas = []
}

function leerPreguntas() {
    const bloques = document.querySelectorAll(".CreatorBloque")
    const preguntas = []

    for (let i = 0; i < bloques.length; i++) {
        const bloque = bloques[i]
        const question = bloque.querySelector(".CreatorQuestion").value.trim()
        const correct_answer = bloque.querySelector(".CreatorAnswerCorrect").value.trim()

        const incorrect_answers = []
        bloque.querySelectorAll(".CreatorAnswerIncorrect").forEach((inp) => {
            incorrect_answers.push(inp.value.trim())
        })

        if (question === "" || correct_answer === "" || incorrect_answers.includes("")) {
            pCreadorMensaje.textContent =
                `Complete the question ${i + 1}: the text, the correct answer and the 3 incorrect answers`
            return null
        }

        preguntas.push({ question, correct_answer, incorrect_answers })
    }

    return preguntas
}

btnAgregarPregunta.addEventListener("click", () => {
    for (let i = 1; i <= DE_A_CUANTAS; i++) {
        agregarBloquePregunta()
    }
    pCreadorMensaje.textContent = `Now there are ${divPreguntas.children.length} questions`
})

btnContinuar.addEventListener("click", () => {
    const preguntas = leerPreguntas()
    if (!preguntas) {
        return
    }
    preguntasNuevas = preguntas
    pCreadorMensaje.textContent = "Questions ready! Now name your trivia"
    inpNombreTrivia.focus()
})

btnVolverAPreguntas.addEventListener("click", () => {
    divPreguntas.querySelector("input").focus()
})

btnGuardarTrivia.addEventListener("click", async () => {
    if (!obtenerToken()) {
        pNombreMensaje.textContent = "Log in to save your trivia"
        return
    }

    if (preguntasNuevas.length === 0) {
        pNombreMensaje.textContent = "First complete the questions and press Continue"
        return
    }

    const category = inpNombreTrivia.value.trim()
    if (category === "") {
        pNombreMensaje.textContent = "Give your trivia a name"
        return
    }

    try {
        await agregarTrivia({ category, preguntas: preguntasNuevas })

        inpNombreTrivia.value = ""
        pNombreMensaje.textContent = "Trivia saved!"
        pCreadorMensaje.textContent = ""
        reiniciarFormulario()
        await cargarTodo()
    } catch (error) {
        pNombreMensaje.textContent = error.message
    }
})

// =====================================================================
//  ARRANQUE
// =====================================================================
reiniciarFormulario()

const usuarioGuardado = obtenerUsuarioActual()
if (obtenerToken() && usuarioGuardado) {
    pLoginMensaje.textContent = `Logged in as ${usuarioGuardado.username}`
    mostrarUsuario(usuarioGuardado)

    // se pide la versión fresca a la base (por si la foto cambió en otra pestaña)
    obtenerYo()
        .then((usuario) => {
            guardarSesion(obtenerToken(), usuario)
            mostrarUsuario(usuario)
        })
        .catch(() => {})
}

cargarTodo()

function startTrivia(trivia) {
    showPantalla(UnJugador ? PANTALLA_JUEGO : PANTALLA_JUEGO2);
    guardarPreguntas(trivia.results);
    indicePregunta = 0;
    rellenarPreguntas();
}