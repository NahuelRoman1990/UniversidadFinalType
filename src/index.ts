// src/index.ts
import "reflect-metadata"; // Debe ser importado antes de cualquier operación de TypeORM
import app from "./app";
import { initializeDatabase } from "./db/conexion";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  try {
    await initializeDatabase();
    const port = process.env.PORT || 3000; // Cambiado de 3306 a 3000
    app.listen(port, () => {
      console.log(`**Servidor activo en -> http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
  }
}

main();
