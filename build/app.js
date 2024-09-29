"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const estudianteRoutes_1 = __importDefault(require("./routes/estudianteRoutes"));
const profesorRoutes_1 = __importDefault(require("./routes/profesorRoutes"));
const inscripcionRoutes_1 = __importDefault(require("./routes/inscripcionRoutes"));
const cursoRoutes_1 = __importDefault(require("./routes/cursoRoutes"));
const app = (0, express_1.default)();
// Middlewares
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)({
    origin: "http://127.0.0.1:5500", // Ajusta según tu frontend
}));
// Rutas API
app.use("/estudiantes", estudianteRoutes_1.default);
app.use("/profesores", profesorRoutes_1.default);
app.use("/cursos", cursoRoutes_1.default);
app.use("/inscripciones", inscripcionRoutes_1.default);
// Servir archivos estáticos (Frontend)
app.use(express_1.default.static(path_1.default.join(__dirname, "views")));
// Ruta principal para servir el index.html
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "views", "html", "index.html"));
});
exports.default = app;
