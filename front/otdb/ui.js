const RESULTADOS_0P = document.querySelector("#resultados1P");
const RESULTADO_J0 = document.querySelector("#resultado");

const RESULTADOS_2P = document.querySelector("#resultados2P");
const TITULO_J1 = document.querySelector("#tituloJ1");
const TITULO_J2 = document.querySelector("#tituloJ2");
const RESULTADO_J1 = document.querySelector("#resultadoJ1");
const RESULTADO_J2 = document.querySelector("#resultadoJ2");

export function llenarSelect(select, items) {
    select.innerHTML = ""
    items.forEach(item => {
        select.innerHTML += `<option value="${item.id}">${item.name}</option>`
    })
}

export function mostrarError(parrafo, texto) {
    parrafo.textContent = texto
}

//* traductor
export function decodificar(texto) {
    const el = document.createElement("textarea");
    el.innerHTML = texto;
    return el.value;
}

export function mostrarPregunta(titulo, contenedor, pregunta, respuestas) {
    titulo.textContent = decodificar(pregunta);

    const labels = contenedor.querySelectorAll("label");

    labels.forEach((label, i) => {
        const input = label.querySelector("input");

        if (i < respuestas.length) {
            const texto = decodificar(respuestas[i]);

            input.value = texto;
            input.name = contenedor.id;   // mismo name = grupo de radios, nos habíamos olvidado :)
            input.checked = false;

            label.querySelector("span").textContent = texto;
            label.style.display = "";
        } else {
            label.style.display = "none";
        }
    });
}

//* muestra el puntaje: numero grande + "points" abajo
function pintarPuntaje(el, puntos) {
    el.innerHTML = `<span class="numero">${puntos}</span><span class="texto">points</span>`;
}

export function mostrarResultados(unJugador, contador0, contador1, contador2) {
    const CAJA_J1 = document.querySelector("#resultsPlayer1");
    const CAJA_J2 = document.querySelector("#resultsPlayer2");
    RESULTADOS_0P.style.display = "";
    RESULTADOS_2P.style.display = "";
    CAJA_J1.classList.remove("ganador");
    CAJA_J2.classList.remove("ganador");

    if (unJugador) {
        RESULTADOS_2P.style.display = "none";
        pintarPuntaje(RESULTADO_J0, contador0);
    } else {
        RESULTADOS_0P.style.display = "none";

        if (contador1 > contador2) {
            TITULO_J1.innerHTML = "Winner";
            TITULO_J2.innerHTML = "Womp womp...";
            CAJA_J1.classList.add("ganador");
        } else if (contador2 > contador1) {
            TITULO_J2.innerHTML = "Winner";
            TITULO_J1.innerHTML = "Womp womp...";
            CAJA_J2.classList.add("ganador");
        } else {
            TITULO_J1.innerHTML = "Draw";
            TITULO_J2.innerHTML = "Draw";
        }
        pintarPuntaje(RESULTADO_J1, contador1);
        pintarPuntaje(RESULTADO_J2, contador2);
    }
};

// generado con IA ^_^ (gracias claudia)
//* genera los cuadraditos que flotan en el fondo de la pantalla
const COLORES = [
    { color: "#e8892c", opacidad: 0.9 },
    { color: "#c46a2e", opacidad: 0.75 },
    { color: "#8b4a45", opacidad: 0.85 },
    { color: "#c9b3c4", opacidad: 0.7 },
    { color: "#f6e7c4", opacidad: 0.9 },
];

const azar = (min, max) => Math.random() * (max - min) + min;

export function crearEstrellas(contenedor, cantidad = 40) {
    for (let i = 0; i < cantidad; i++) {
        const { color, opacidad } = COLORES[Math.floor(Math.random() * COLORES.length)];
        const tam = Math.round(azar(3, 12));
        const e = document.createElement("span");
        e.className = "estrella";
        e.style.width = `${tam}px`;
        e.style.height = `${tam}px`;
        e.style.left = `${azar(4, 96)}%`;
        e.style.top = `${azar(6, 94)}%`;
        e.style.background = color;
        e.style.setProperty("--opacidad", opacidad);
        e.style.setProperty("--dx", `${azar(-60, 60)}px`);
        e.style.setProperty("--dy", `${azar(-45, 45)}px`);
        e.style.setProperty("--duracion", `${azar(6, 16)}s`);
        e.style.setProperty("--retraso", `${azar(-16, 0)}s`);
        contenedor.appendChild(e);
    }
}

//* escala el contenido para que el diseño (1600x900) entre en cualquier pantalla de compu
export function ajustarEscala() {
    const escala = Math.min(window.innerWidth / 1600, window.innerHeight / 900);
    document.documentElement.style.setProperty("--escala", escala);
}