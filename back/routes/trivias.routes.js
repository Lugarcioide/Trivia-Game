import express from "express"
import { listar, obtener, crear, borrar } from "../controllers/trivias.controller.js"

const router = express.Router()

router.get("/", listar)         // GET /trivias
router.get("/:id", obtener)     // GET /trivias/:id
router.post("/", crear)         // POST /trivias
router.delete("/:id", borrar)   // DELETE /trivias/:id

export default router
