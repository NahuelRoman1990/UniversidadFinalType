// src/app.ts
import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";

import estudianteRouter from "./routes/estudianteRoutes";
import profesorRouter from "./routes/profesorRoutes";
import inscripcionRouter from "./routes/inscripcionRoutes";
import cursoRouter from "./routes/cursoRoutes";

const app = express();

// Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://127.0.0.1:5500", // Ajusta según tu frontend
  })
);

// Rutas API
app.use("/estudiantes", estudianteRouter);
app.use("/profesores", profesorRouter);
app.use("/cursos", cursoRouter);
app.use("/inscripciones", inscripcionRouter);

// Servir archivos estáticos (Frontend)
app.use(express.static(path.join(__dirname, "views")));

// Ruta principal para servir el index.html
app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "views", "html", "index.html"));
});

export default app;
