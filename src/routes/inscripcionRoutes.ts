import { Router } from "express";
import { check } from "express-validator";
import {
  consultarInscripciones,
  insertarInscripcion,
  modificarNota,
  eliminarInscripcion,
  consultarNota,
  consultarInscripcionesPorCurso,
  consultarInscripcionesPorEstudiante,
} from "../controller/inscripcionController";
import { validarCampos } from "../middlewares/validarCampos";

const routes = Router();

routes.get("/", consultarInscripciones);

routes.post(
  "/",
  [
    check("curso_id").not().isEmpty().withMessage("El curso es obligatorio"),
    check("estudiante_id")
      .not()
      .isEmpty()
      .withMessage("El estudiante es obligatorio"),
    check("nota")
      .optional({ checkFalsy: true })
      .isFloat({ min: 0, max: 10 })
      .withMessage("La nota debe ser entre 1 y 10"),
    validarCampos,
  ],
  insertarInscripcion
);

routes.get("/estudiante/:estudiante_id", consultarInscripcionesPorEstudiante);

routes.get("/curso/:curso_id", consultarInscripcionesPorCurso);

routes
  .route("/curso/:curso_id/estudiante/:estudiante_id")
  .get(consultarNota)
  .delete(eliminarInscripcion);

routes.put(
  "/curso/:curso_id/estudiante/:estudiante_id",
  [
    check("curso_id").not().isEmpty().withMessage("El curso es obligatorio"),
    check("estudiante_id")
      .not()
      .isEmpty()
      .withMessage("El estudiante es obligatorio"),
    check("nota")
      .optional()
      .isFloat({ min: 0, max: 10 })
      .withMessage("La nota debe ser entre 0 y 10"),
    validarCampos,
  ],
  modificarNota
);

export default routes;
