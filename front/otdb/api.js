export const BASE_URL = "https://opentdb.com"

export async function cargarCategorias() {
    const respuesta = await fetch(`${BASE_URL}/api_category.php`);

    if (!respuesta.ok) throw new Error("We couldn't load the categories");

    const datos = await respuesta.json()
    return datos.trivia_categories;
}

export async function pedirPreguntas(config) {
    const url = `${BASE_URL}/api.php?amount=${config.amount}&category=${config.category}&difficulty=${config.difficulty}&type=${config.type}`;
    const respuesta = await fetch(url);

    if (!respuesta.ok) throw new Error("We were unable to communicate with the API");

    return respuesta.json();
}