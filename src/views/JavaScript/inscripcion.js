document.getElementById("modal-modificar-nota").style.display = "none";
document.getElementById("modal-alert").style.display = "none";

function mostrarAlerta(titulo, texto) {
    document.getElementById("alert-title").innerText = titulo;
    document.getElementById("alert-text").innerText = texto;
    document.getElementById("modal-alert").style.display = "block";
}

document.getElementById("alert-button").onclick = function() {
    document.getElementById("modal-alert").style.display = "none";
};

document.querySelector(".close-alert").onclick = function () {
    document.getElementById("modal-alert").style.display = "none";
};

window.onclick = function (event) {
    const modalModificar = document.getElementById("modal-modificar-nota");
    const modalAlert = document.getElementById("modal-alert");
    if (event.target === modalModificar) {
        modalModificar.style.display = "none";
    }
    if (event.target === modalAlert) {
        modalAlert.style.display = "none";
    }
};

document.addEventListener("DOMContentLoaded", () => {
    cargarCursosConsultas();
    cargarEstudiantesConsultas();
    cargarCursosInscribir();
    cargarEstudiantesInscribir();

    const formInscripcion = document.getElementById("form-inscripcion");
    formInscripcion.addEventListener("submit", async (event) => {
        event.preventDefault();

        const estudiante_id = document.getElementById("estudiante").value;
        const curso_id = document.getElementById("curso").value;
        const nota = document.getElementById("nota").value;

        const validacionExitosa = validarInscripcion(
            estudiante_id,
            curso_id,
            nota
        );
        if (!validacionExitosa) {
            return;
        } else {
            const inscripcion = {
                estudiante_id,
                curso_id,
                nota: nota ? parseFloat(nota) : null,
            };
            await inscribirEstudiante(inscripcion);
            document.getElementById("form-inscripcion").reset();
        }
    });

    const botonConsultarTodas = document.getElementById("consultar-todas");
    botonConsultarTodas.addEventListener("click", obtenerInscripciones);

    document
        .getElementById("form-consultar-curso")
        .addEventListener("submit", async (event) => {
            event.preventDefault();
            const curso_id = document.getElementById("consulta-curso").value;
            await obtenerInscripcionesPorCurso(curso_id);
        });

    document
        .getElementById("form-consultar-estudiante")
        .addEventListener("submit", async (event) => {
            event.preventDefault();
            const estudiante_id = document.getElementById(
                "consulta-estudiante"
            ).value;
            await obtenerInscripcionesPorEstudiante(estudiante_id);
        });

    document.querySelector("#modal-modificar-nota .close").addEventListener("click", () => {
        document.getElementById("modal-modificar-nota").style.display = "none";
    });
});

function validarInscripcion(estudiante_id, curso_id, nota) {
    const estudianteVal = /^\d+$/;
    const cursoVal = /^\d+$/;
    const notaVal = /^\d+(\.\d{1,2})?$/;

    if (!estudianteVal.test(estudiante_id)) {
        mostrarAlerta("Estudiante inválido", "El estudiante no existe.");
        return false;
    }

    if (!cursoVal.test(curso_id)) {
        mostrarAlerta("Curso inválido", "El curso no existe.");
        return false;
    }

    if (nota && (isNaN(nota) || nota < 0 || nota > 10)) {
        mostrarAlerta("Error en la inscripción", "La nota, si se proporciona, debe estar entre 0 y 10.");
        return false;
    }

    return true;
}

function validarNota(nota) {
    const notaVal = /^\d+(\.\d{1,2})?$/;

    if (nota === "" || isNaN(nota) || nota < 0 || nota > 10 || !notaVal.test(nota)) {
        mostrarAlerta("Nota inválida", "La nota debe estar entre 0 y 10.");
        return false;
    }
    return true;
}

async function obtenerInscripciones() {
    try {
        const response = await fetch("http://localhost:3000/inscripciones");
        if (!response.ok) throw new Error("Error al obtener inscripciones.");
        const inscripciones = await response.json();
        llenarTablaInscripciones(inscripciones);
    } catch (error) {
        console.error("Error al obtener inscripciones:", error);
        mostrarAlerta("Error", "No se pudieron obtener las inscripciones.");
    }
}

async function cargarCursosConsultas() {
    try {
        const response = await fetch("http://localhost:3000/cursos");
        if (!response.ok) throw new Error("Error al cargar cursos.");
        const cursos = await response.json();

        const selectCurso = document.getElementById("consulta-curso");

        cursos.forEach((curso) => {
            const option = document.createElement("option");
            option.value = curso.id;
            option.textContent = curso.nombre;
            selectCurso.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar cursos:", error);
        mostrarAlerta("Error", "No se pudieron cargar los cursos.");
    }
}

async function cargarEstudiantesConsultas() {
    try {
        const response = await fetch("http://localhost:3000/estudiantes");
        if (!response.ok) throw new Error("Error al cargar estudiantes.");
        const estudiantes = await response.json();

        const selectEstudiante = document.getElementById("consulta-estudiante");
        estudiantes.forEach((estudiante) => {
            const option = document.createElement("option");
            option.value = estudiante.id;
            option.textContent = `${estudiante.nombre} ${estudiante.apellido}`;
            selectEstudiante.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar estudiantes:", error);
        mostrarAlerta("Error", "No se pudieron cargar los estudiantes.");
    }
}

async function cargarCursosInscribir() {
    try {
        const response = await fetch("http://localhost:3000/cursos");
        if (!response.ok) throw new Error("Error al cargar cursos.");
        const cursos = await response.json();

        const selectCurso = document.getElementById("curso");

        cursos.forEach((curso) => {
            const option = document.createElement("option");
            option.value = curso.id;
            option.textContent = curso.nombre;
            selectCurso.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar cursos:", error);
        mostrarAlerta("Error", "No se pudieron cargar los cursos.");
    }
}

async function cargarEstudiantesInscribir() {
    try {
        const response = await fetch("http://localhost:3000/estudiantes");
        if (!response.ok) throw new Error("Error al cargar estudiantes.");
        const estudiantes = await response.json();

        const selectEstudiante = document.getElementById("estudiante");
        estudiantes.forEach((estudiante) => {
            const option = document.createElement("option");
            option.value = estudiante.id;
            option.textContent = `${estudiante.nombre} ${estudiante.apellido}`;
            selectEstudiante.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar estudiantes:", error);
        mostrarAlerta("Error", "No se pudieron cargar los estudiantes.");
    }
}

function llenarTablaInscripciones(inscripciones) {
    const tablaInscripciones = document.getElementById("tabla-inscripciones");
    tablaInscripciones.innerHTML = "";

    inscripciones.forEach((inscripcion) => {
        const curso_id = inscripcion.curso ? inscripcion.curso.id : undefined;
        const estudiante_id = inscripcion.estudiante
            ? inscripcion.estudiante.id
            : undefined;

        if (!curso_id || !estudiante_id) {
            console.error(
                "Falta curso_id o estudiante_id en la inscripción:",
                inscripcion
            );
            return; 
        }

        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${inscripcion.curso.nombre}</td>
            <td>${inscripcion.estudiante.nombre} ${inscripcion.estudiante.apellido}</td>
            <td>${inscripcion.nota !== null ? inscripcion.nota : "No asignada"}</td>
            <td class="tabla-accion">
                <button class="btn-modificar" onclick="modificarNota(${inscripcion.curso.id}, ${inscripcion.estudiante.id})">✏️</button>
                <button class="btn-eliminar" onclick="eliminarInscripcion(${inscripcion.curso.id}, ${inscripcion.estudiante.id})">❌</button>
            </td>
        `;

        tablaInscripciones.appendChild(fila);
    });
}

async function obtenerInscripcionesPorCurso(curso_id) {
    try {
        const response = await fetch(
            `http://localhost:3000/inscripciones/curso/${curso_id}`
        );
        if (response.ok) {
            const inscripciones = await response.json();
            llenarTablaInscripciones(inscripciones);
        } else if (response.status === 404) {
            mostrarAlerta("Sin inscripciones", "No se encontraron alumnos inscriptos para este curso.");
            llenarTablaInscripciones([]);
        } else {
            throw new Error("Error inesperado al obtener inscripciones.");
        }
    } catch (error) {
        console.error("Error al obtener inscripciones por curso:", error);
        mostrarAlerta("Error", "No se pudieron obtener las inscripciones por curso.");
    }
}

async function obtenerInscripcionesPorEstudiante(estudiante_id) {
    try {
        const response = await fetch(
            `http://localhost:3000/inscripciones/estudiante/${estudiante_id}`
        );
        if (response.ok) {
            const inscripciones = await response.json();
            llenarTablaInscripciones(inscripciones);
        } else if (response.status === 404) {
            mostrarAlerta("Sin inscripciones", "No se encontraron inscripciones para este estudiante.");
            llenarTablaInscripciones([]);
        } else {
            throw new Error("Error inesperado al obtener inscripciones.");
        }
    } catch (error) {
        console.error("Error al obtener inscripciones por estudiante:", error);
        mostrarAlerta("Error", "No se pudieron obtener las inscripciones por estudiante.");
    }
}

async function inscribirEstudiante(inscripcion) {
    try {
        const response = await fetch("http://localhost:3000/inscripciones", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(inscripcion),
        });

        const result = await response.json();

        if (response.ok) {
            mostrarAlerta("Inscripción realizada", "La inscripción ha sido realizada correctamente.");
            obtenerInscripciones();
        } else if (
            result.message === "El estudiante ya está inscrito en este curso."
        ) {
            mostrarAlerta("No se puede inscribir", "El estudiante ya está inscrito en este curso.");
        } else {
            mostrarAlerta("Error al inscribir", "Hubo un problema al inscribir al estudiante.");
        }
    } catch (error) {
        console.error("Error al inscribir estudiante:", error);
        mostrarAlerta("Error", "Hubo un problema al inscribir al estudiante.");
    }
}

async function eliminarInscripcion(curso_id, estudiante_id) {
    if (confirm("¿Está seguro? No podrá revertir esta acción. ¿Desea eliminar la inscripción?")) {
        try {
            const response = await fetch(
                `http://localhost:3000/inscripciones/curso/${curso_id}/estudiante/${estudiante_id}`,
                {
                    method: "DELETE",
                }
            );

            if (response.ok) {
                mostrarAlerta("Inscripción eliminada", "La inscripción ha sido eliminada correctamente.");
                obtenerInscripciones();
            } else {
                mostrarAlerta("Error al eliminar", "Hubo un problema al eliminar la inscripción.");
            }
        } catch (error) {
            console.error("Error al eliminar inscripción:", error);
            mostrarAlerta("Error", "Hubo un problema al eliminar la inscripción.");
        }
    }
}

async function modificarNota(curso_id, estudiante_id) {
    const modal = document.getElementById("modal-modificar-nota");
    modal.style.display = "block";

    document.getElementById("modificar-inscripcion-id").value = JSON.stringify({
        curso_id,
        estudiante_id,
    });

    try {
        const response = await fetch(
            `http://localhost:3000/inscripciones/curso/${curso_id}/estudiante/${estudiante_id}`
        );
        const data = await response.json();
        document.getElementById("modificar-nota").value = data.nota !== null ? data.nota : "";
    } catch (error) {
        console.error("Error al cargar la inscripción:", error);
        mostrarAlerta("Error", "No se pudo cargar la inscripción para modificar la nota.");
    }
}

document.getElementById("form-modificar-nota").addEventListener("submit", async function (event) {
    event.preventDefault();

    const { curso_id, estudiante_id } = JSON.parse(
        document.getElementById("modificar-inscripcion-id").value
    );
    const nuevaNota = document.getElementById("modificar-nota").value;

    if (!validarNota(nuevaNota)) {
        return;
    }

    const data = {
        curso_id,
        estudiante_id,
        nota: parseFloat(nuevaNota),
    };

    try {
        const response = await fetch(
            `http://localhost:3000/inscripciones/curso/${curso_id}/estudiante/${estudiante_id}`,
            {
                method: "PUT", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            }
        );

        if (response.ok) {
            mostrarAlerta("Nota modificada", "La nota ha sido modificada correctamente.");
            document.getElementById("modal-modificar-nota").style.display = "none";
            obtenerInscripciones();
        } else {
            mostrarAlerta("Error al modificar la nota", "Hubo un problema al modificar la nota.");
        }
    } catch (error) {
        console.error("Error en la solicitud de modificación:", error);
        mostrarAlerta("Error", "Hubo un problema al modificar la nota.");
    }
});
