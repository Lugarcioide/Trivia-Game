import express from "express"
import cors from "cors"
import triviaRouter from "./routes/trivias.routes.js"
import usuarioRouter from "./routes/usuarios.routes.js"
import { pedirToken } from "./middlewares/autorizacion.middleware.js"
import dotenv from "dotenv"
dotenv.config()                    // 1) leer el .env

import { conectarBase } from "./config/db.js"
await conectarBase() 

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())

app.use(express.json({ limit: "2mb" }))

app.use((req, res, next) => {
  console.log(req.method + " " + req.url)
  next()
})

app.get("/", (req, res) => {
  res.send("play")
})

app.use("/usuarios", usuarioRouter)
app.use("/trivias", pedirToken, triviaRouter)

app.use((req, res) => {
  res.status(404).json({ mensaje: "That route does not exist on the server" })
})

app.use((err, req, res, next) => {
  console.error(err)
  const codigo = err.status || 500
  res.status(codigo).json({ mensaje: "Something went wrong (error " + codigo + ")" })
})

app.listen(PORT, () => {
  console.log("Trivia abierta en http://localhost:" + PORT)
})  