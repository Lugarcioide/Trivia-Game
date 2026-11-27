import mongoose from "mongoose"

// El molde de UNA pregunta. _id: false porque no las buscamos sueltas,
// siempre viven adentro de su trivia.
const preguntaSchema = new mongoose.Schema({
    question: { type: String, required: true },
    correct_answer: { type: String, required: true },
    incorrect_answers: { type: [String], required: true }
}, { _id: false })

// El molde de una trivia.
// idAutor sigue siendo el número del usuario del array (datos.js):
// los usuarios pasan a la base recién en la clase 11.
const triviaSchema = new mongoose.Schema({
    category: { type: String, required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    vecesJugada: { type: Number, default: 0, min: 0 },
    questions: { type: [preguntaSchema], required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true }
},

    {
        // Además del _id, que el JSON traiga "id" (el mismo valor, como texto).
        // Así el front, que usa trivia.id, sigue andando sin tocarlo.
        toJSON: { virtuals: true }
    })

export const Trivia = mongoose.model("Trivia", triviaSchema)
