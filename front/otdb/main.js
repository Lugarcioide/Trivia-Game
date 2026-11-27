import { cargarCategorias, pedirPreguntas } from './api.js';
import { llenarSelect, mostrarError, decodificar, mostrarPregunta, mostrarResultados, crearEstrellas, ajustarEscala } from './ui.js';
import { showPantalla } from './router.js';
import { PANTALLA_INICIAL, PANTALLA_JUGADORES, PANTALLA_CONFIG, PANTALLA_JUEGO, PANTALLA_JUEGO2, PANTALLA_FINAL } from './router.js';
import{cargarTabla} from '../script.js'
import { PANTALLA_SIGNUP, PANTALLA_LOGIN, PANTALLA_PROFILE, PANTALLA_YOUR_COLLECTION, PANTALLA_CREATOR, PANTALLA_NAME_TRIVIA, PANTALLA_USERS_CREATIONS } from './router.js';

const ROUNDS = document.querySelector("#rounds");
const ROUNDS_OUTPUT = document.querySelector("#roundsOutput");
const CATEGORIA = document.querySelector("#categoria");
const BTN_OK = document.querySelector("#btnOK");
const MENSAJE_ERROR = document.querySelector("#mensajeError");
const PANTALLA_INICIO = document.querySelector("#pantallaInicio");
const JUG1 = document.querySelector("#btnJUG1");
const JUG2 = document.querySelector("#btnJUG2");
const btnMENU = document.querySelector("#btnMenu");
const btnRESTART = document.querySelector("#btnRestart");
const btnMACACO = document.querySelector(".macaquito");
const btnGWW = document.querySelector("#btnWorldWide");
const btnIrLogin = document.querySelector("#irALogin");
const btnRegistro = document.querySelector("#btnRegistro");
const btnLogin = document.querySelector("#btnLogin");
const btnIrRegistro = document.querySelector("#irARegistro");
const btnMyCollection = document.querySelector("#MenuCollection");
const btnCollectionGB = document.querySelector("#ColeccionGoBack");
const btnCreate= document.querySelector("#MenuCreate");
const btnCreateGB = document.querySelector("#CreatorGoBack");
const btnNameTrivia = document.querySelector("#CreatorContinue");
const btnNameGB = document.querySelector("#NombreGoBack");
const btnConfirmName = document.querySelector("#CreatorSave");




let preguntasGuardadas = [];
let respuestasGuardadas = [];
let respuestasCorrectasGuardadas = [];
let UnJugador = true
let indicePregunta = 0;
let contador0 = 0;
let contador1 = 0;
let contador2 = 0;

//*-------------------- Pantalla de 1 Jugador --------------------
const preg0 = document.querySelector("#question0");
const contenedorResp0 = document.querySelector("#questions0");
const btnCONFIRM = document.querySelector("#btnConfirm");

//*-------------------- Pantalla de 2 Jugadores --------------------
const preg1 = document.querySelector("#question1");
const preg2 = document.querySelector("#question2");
const contenedorResp1 = document.querySelector("#questions1");
const contenedorResp2 = document.querySelector("#questions2");
const BTN_CONFIRM2 = document.querySelector("#btnConfirm2");

//* muestro el numero del slider
function actualizarSlider() {
    ROUNDS_OUTPUT.textContent = ROUNDS.value;
    const pct = (Number(ROUNDS.value) - Number(ROUNDS.min)) / (Number(ROUNDS.max) - Number(ROUNDS.min));
    ROUNDS.style.background = `linear-gradient(90deg, #9720b5 ${pct * 100}%, #3a0a4a ${pct * 100}%)`;
    ROUNDS_OUTPUT.style.left = `calc(7px + (100% - 14px) * ${pct})`;
}

ROUNDS.addEventListener('input', actualizarSlider);
actualizarSlider();

crearEstrellas(document.querySelector("#estrellas"));
ajustarEscala();
window.addEventListener("resize", ajustarEscala);

//*-------------------- Configuracion de Juego --------------------
BTN_OK.addEventListener("click", async () => {
    MENSAJE_ERROR.textContent = "";

    const cantidad = Number(ROUNDS.value);
    const config = {
        category: CATEGORIA.value,
        amount: UnJugador ? cantidad : cantidad * 2,
        difficulty: document.querySelector('input[name="difficulty"]:checked').value,
        type: document.querySelector('input[name="type"]:checked').value,
    };

    try {
        const data = await pedirPreguntas(config);

        if (data.response_code === 0) {

            showPantalla(UnJugador ? PANTALLA_JUEGO : PANTALLA_JUEGO2);
            guardarPreguntas(data.results);
            indicePregunta = 0;
            rellenarPreguntas();
        } else if (data.response_code === 1) {
            mostrarError(MENSAJE_ERROR, "There aren't enough questions for this configuration. Change the number of questions or the settings.");
        } else {
            mostrarError(MENSAJE_ERROR, "Something went wrong with the chosen configuration. Try again.");
        }
    } catch (error) {
        mostrarError(MENSAJE_ERROR, "We couldn't load the questions. Try again in a few seconds.");
    }
});

//*-------------------- Funcionamiento del Juego --------------------
export function guardarPreguntas(results) {
    const arrayPreguntas = [];
    const arrayRespuestas = [];
    const arrayRespuestasCorr = [];

    results.forEach((result) => {
        const todasLasRespuestas = [];
        result.incorrect_answers.forEach(r => todasLasRespuestas.push(r));
        todasLasRespuestas.push(result.correct_answer);
        todasLasRespuestas.sort(() => Math.random() - 0.5);

        arrayPreguntas.push(result.question);
        arrayRespuestas.push(todasLasRespuestas);
        arrayRespuestasCorr.push(result.correct_answer);
    })

    preguntasGuardadas = arrayPreguntas
    respuestasGuardadas = arrayRespuestas
    respuestasCorrectasGuardadas = arrayRespuestasCorr
}

export function rellenarPreguntas() {
    const bloques = UnJugador
        ? [[preg0, contenedorResp0]]
        : [[preg1, contenedorResp1], [preg2, contenedorResp2]];

    if (indicePregunta >= preguntasGuardadas.length) {
        return false;
    }

    bloques.forEach(([titulo, contenedor], indiceBloque) => {
        const n = indicePregunta + indiceBloque;
        mostrarPregunta(titulo, contenedor, preguntasGuardadas[n], respuestasGuardadas[n]);
    });

    indicePregunta += bloques.length;
    return true;
}

function confirmarRespuesta() {
    if (UnJugador) {
        const marcada0 = contenedorResp0.querySelector("input:checked");
        const pregunta = indicePregunta - 1;

        if (marcada0 !== null && marcada0.value === decodificar(respuestasCorrectasGuardadas[pregunta])) {
            contador0++;
        }

    } else {
        const marcada1 = contenedorResp1.querySelector("input:checked");
        const marcada2 = contenedorResp2.querySelector("input:checked");

        const pregunta1 = indicePregunta - 2;
        const pregunta2 = indicePregunta - 1;

        if (marcada1 !== null && marcada1.value === decodificar(respuestasCorrectasGuardadas[pregunta1])) {
            contador1++;
        }
        if (marcada2 !== null && marcada2.value === decodificar(respuestasCorrectasGuardadas[pregunta2])) {
            contador2++;
        }
    }

    if (!rellenarPreguntas()) {
        showPantalla(PANTALLA_FINAL);
        mostrarResultados(UnJugador, contador0, contador1, contador2);
    }
}

btnCONFIRM.addEventListener("click", confirmarRespuesta);
BTN_CONFIRM2.addEventListener("click", confirmarRespuesta);

async function entrarALaApp() {
    try {
        llenarSelect(CATEGORIA, await cargarCategorias());
    } catch (error) {
        mostrarError(MENSAJE_ERROR, "uhhhh... something went wrong...");
    }
}
entrarALaApp()


//*-------------------- Cambiar Entre Pantallas --------------------

//* cualquier tecla o click en la pantalla de inicio avanza
function empezar() {
    if (PANTALLA_INICIO.style.display === "none") return;
    showPantalla(PANTALLA_JUGADORES);
}

PANTALLA_INICIO.addEventListener('click', empezar);
document.addEventListener('keydown', empezar);

JUG1.addEventListener('click', (e) => {
    UnJugador = true;
    showPantalla(PANTALLA_CONFIG);
})

JUG2.addEventListener('click', (e) => {
    UnJugador = false;
    showPantalla(PANTALLA_CONFIG);
})

btnMACACO.addEventListener('click', () => {
    let isLoggedIn = localStorage.getItem('usuario') !== null 
                  && localStorage.getItem('token') !== null 
                  ? 'true' : 'false';
    if (isLoggedIn === 'true') {
        showPantalla(PANTALLA_PROFILE);
    } else {
        showPantalla(PANTALLA_SIGNUP)
    }
})

btnGWW.addEventListener('click', async () => {
    showPantalla(PANTALLA_USERS_CREATIONS);
})

btnIrLogin.addEventListener('click', () => {
    showPantalla(PANTALLA_LOGIN);
})

btnIrRegistro.addEventListener('click', () => {
    showPantalla(PANTALLA_SIGNUP);
})

btnRegistro.addEventListener('click', () => {
    showPantalla(PANTALLA_SIGNUP);
})

btnLogin.addEventListener('click', () => {
    showPantalla(PANTALLA_PROFILE);
})

btnMyCollection.addEventListener('click', () => {
    showPantalla(PANTALLA_YOUR_COLLECTION);
})

btnCollectionGB.addEventListener('click', () => {
    showPantalla(PANTALLA_PROFILE);
})

btnCreate.addEventListener('click', () => {
    showPantalla(PANTALLA_CREATOR);
})

btnCreateGB.addEventListener('click', () => {
    showPantalla(PANTALLA_PROFILE);
})

btnNameTrivia.addEventListener('click', () => {
    showPantalla(PANTALLA_NAME_TRIVIA);
})

btnNameGB.addEventListener('click', () => {
    showPantalla(PANTALLA_CREATOR);
})

btnConfirmName.addEventListener('click', () => {
    showPantalla(PANTALLA_YOUR_COLLECTION);
})



//* Es importante limpiar los contadores así no se suman los puntos entre rondas distintas :p
function reiniciarJuego() {
    indicePregunta = 0;
    contador0 = 0;
    contador1 = 0;
    contador2 = 0;
}

btnRESTART.addEventListener('click', () => {
    reiniciarJuego();
    showPantalla(PANTALLA_CONFIG);
})

btnMENU.addEventListener('click', () => {
    reiniciarJuego();
    showPantalla(PANTALLA_INICIAL);
})

showPantalla(PANTALLA_INICIAL);