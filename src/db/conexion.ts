// src/db/conexion.ts
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
dotenv.config();

import { Estudiante } from "../models/estudianteModels";
import { Curso } from "../models/cursoModels";
import { Profesor } from "../models/profesorModels";
import { Inscripcion } from "../models/inscripcionModels";

const port: number = process.env.DB_PORT
  ? parseInt(process.env.DB_PORT, 10)
  : 3306;

async function createDatabaseIfNotExists() {
  try {
    const { createConnection } = require("typeorm");
    const connection = await createConnection({
      type: "mysql",
      host: process.env.HOST || "localhost",
      port: port,
      username: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "universidad",
    });
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || "universidad"}\`;`
    );
    await connection.close();
    console.log("Database check/creación OK");
  } catch (error) {
    console.error("Error en createDatabaseIfNotExists:", error);
    throw error;
  }
}

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.HOST || "localhost",
  port: port,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "universidad",
  entities: [Estudiante, Curso, Profesor, Inscripcion],
  synchronize: true, // Cambiar a false en producción
  logging: false, // Habilitar si necesitas logs de TypeORM
});

export async function initializeDatabase() {
  try {
    await createDatabaseIfNotExists();
    await AppDataSource.initialize();
    console.log("Base de datos inicializada");
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
    throw error;
  }
}
