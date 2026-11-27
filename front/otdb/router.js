// Pantallas trivia open tdb
export const PANTALLA_INICIAL = 0;
export const PANTALLA_JUGADORES = 1;
export const PANTALLA_CONFIG = 2;
export const PANTALLA_JUEGO = 3;
export const PANTALLA_JUEGO2 = 4;
export const PANTALLA_FINAL = 5;

// Pantallas trivia nuestra api
export const PANTALLA_SIGNUP = 6;
export const PANTALLA_LOGIN = 7;
export const PANTALLA_PROFILE = 8;
export const PANTALLA_YOUR_COLLECTION = 9;
export const PANTALLA_CREATOR = 10;
export const PANTALLA_NAME_TRIVIA = 11;
export const PANTALLA_USERS_CREATIONS = 12;

let arrayPantallas = [
    document.querySelector("#pantallaInicio"),
    document.querySelector("#pantallaJugadores"),
    document.querySelector("#pantallaConfig"),
    document.querySelector("#pantallaJuego"),
    document.querySelector("#pantallaJuego2"),
    document.querySelector("#pantallaFinal"),
    // pantallas api nuestra
    document.querySelector("#pantallaSignup"),
    document.querySelector("#pantallaLogin"),
    document.querySelector("#pantallaProfile"),
    document.querySelector("#pantallaYourCollection"),
    document.querySelector("#pantallaCreator"),
    document.querySelector("#pantallaNameTrivia"),
    document.querySelector("#pantallaUsersCreations")
];

export function showPantalla(pantalla) {
    arrayPantallas.forEach((p) => p.style.display = "none");
    arrayPantallas[pantalla].style.display = "flex";
}