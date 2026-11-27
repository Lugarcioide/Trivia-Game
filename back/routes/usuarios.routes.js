import express from "express"
import { registrar, login, yo, foto } from "../controllers/usuarios.controller.js"
import { pedirToken } from "../middlewares/autorizacion.middleware.js"

const router = express.Router()

/* router.get("/", listar)   // GET /usuarios */

router.post("/registro", registrar)          // libre
router.post("/login", login)                 // libre

router.get("/yo", pedirToken, yo)    
router.put("/yo/foto", pedirToken, foto)        // protegida

export default router
