document.getElementById("modal-modificar").style.display = "none";
document.getElementById("modal-alert").style.display = "none";

document.addEventListener("DOMContentLoaded", () => {
    obtenerEstudiantes();

    const formEstudiante = document.getElementById("form-estudiante");
    formEstudiante.addEventListener("submit", async (event) => {
        event.preventDefault();
        const dni = document.getElementById("dni").value;
        const nombre = document.getElementById("nombre").value;
        const apellido = document.getElementById("apellido").value;
        const email = document.getElementById("email").value;

        if (!validarEstudiante(dni, nombre, apellido, email)) {
            return;
        } else {
            const nuevoEstudiante = { dni, nombre, apellido, email };
            await agregarEstudiante(nuevoEstudiante);
            formEstudiante.reset();
        }
    });
});

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

function validarEstudiante(dni, nombre, apellido, email) {
    const dniVal = /^\d{8,8}$/; // Solo números, 8 dígitos
    const nombreApellidoVal = /^[a-zA-ZñÑ\s]{3,50}$/;
    const emailVal = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!dni || !nombre || !apellido || !email) {
        mostrarAlerta("Campos incompletos", "Por favor, complete todos los campos.");
        return false;
    }

    if (!dniVal.test(dni)) {
        mostrarAlerta("Error en el DNI", "El DNI debe ser numérico y tener 8 dígitos.");
        return false;
    }

    if (!nombreApellidoVal.test(nombre) || nombre.length < 2) {
        mostrarAlerta("Error en el Nombre", "El nombre debe ser más largo.");
        return false;
    }

    if (!nombreApellidoVal.test(apellido) || apellido.length < 2) {
        mostrarAlerta("Error en el Apellido", "El apellido debe ser más largo.");
        return false;
    }

    if (!emailVal.test(email)) {
        mostrarAlerta("Error en el Email", "Debes ingresar un correo electrónico válido.");
        return false;
    }

    return true;
}

async function obtenerEstudiantes() {
    try {
        const response = await fetch("http://localhost:3000/estudiantes", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const estudiantes = await response.json();
        const tbody = document.querySelector("#tabla-estudiantes");
        tbody.innerHTML = "";

        estudiantes.forEach((estudiante) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${estudiante.id}</td>
                <td>${estudiante.dni}</td>
                <td>${estudiante.nombre}</td>
                <td>${estudiante.apellido}</td>
                <td>${estudiante.email}</td>
                <td class="tabla-accion">
                    <button class="btn-modificar" onclick="mostrarFormularioModificar(${estudiante.id})">✏️</button>
                    <button class="btn-eliminar" onclick="eliminarEstudiante(${estudiante.id})">❌</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error("Error al obtener estudiantes:", error);
    }
}

async function agregarEstudiante(estudiante) {
    try {
        const response = await fetch("http://localhost:3000/estudiantes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(estudiante),
        });

        if (response.ok) {
            mostrarAlerta("Estudiante agregado", "El estudiante ha sido agregado exitosamente.");
            obtenerEstudiantes();
        } else {
            mostrarAlerta("Error al agregar estudiante", "No se pudo agregar el estudiante.");
        }
    } catch (error) {
        console.error("Error al agregar estudiante:", error);
    }
}

async function eliminarEstudiante(id) {
    if (confirm("¿Está seguro? No podrá revertir esta acción. ¿Desea eliminar al estudiante?")) {
        try {
            const response = await fetch(`http://localhost:3000/estudiantes/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                mostrarAlerta("Estudiante eliminado", "El estudiante ha sido eliminado exitosamente.");
                obtenerEstudiantes();
            } else {
                mostrarAlerta("Error al eliminar", "No se pudo eliminar el estudiante. Verifique si el alumno se encuentra inscripto a un curso.");
            }
        } catch (error) {
            console.error("Error al eliminar estudiante:", error);
        }
    }
}

async function mostrarFormularioModificar(id) {
    try {
        const response = await fetch(`http://localhost:3000/estudiantes/${id}`);
        const estudiante = await response.json();

        document.getElementById("modificar-id").value = estudiante.id;
        document.getElementById("modificar-dni").value = estudiante.dni;
        document.getElementById("modificar-nombre").value = estudiante.nombre;
        document.getElementById("modificar-apellido").value = estudiante.apellido;
        document.getElementById("modificar-email").value = estudiante.email;

        document.getElementById("modal-modificar").style.display = "block";
    } catch (error) {
        console.error("Error al obtener estudiante:", error);
    }
}

document.getElementById("form-modificar").addEventListener("submit", async function (event) {
    event.preventDefault();

    const id = document.getElementById("modificar-id").value;
    const dni = document.getElementById("modificar-dni").value;
    const nombre = document.getElementById("modificar-nombre").value;
    const apellido = document.getElementById("modificar-apellido").value;
    const email = document.getElementById("modificar-email").value;

    const validacionExitosa = validarEstudiante(dni, nombre, apellido, email);

    if (!validacionExitosa) {
        return;
    }
    const estudianteModificado = { dni, nombre, apellido, email };
    await modificarEstudiante(id, estudianteModificado);
});

async function modificarEstudiante(id, estudianteModificado) {
    try {
        const response = await fetch(`http://localhost:3000/estudiantes/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(estudianteModificado),
        });

        if (response.ok) {
            mostrarAlerta("Estudiante modificado", "El estudiante ha sido modificado exitosamente.");
            document.getElementById("modal-modificar").style.display = "none";
            await obtenerEstudiantes();
        } else {
            mostrarAlerta("Error al modificar", "No se pudo modificar el estudiante.");
        }
    } catch (error) {
        console.error("Error al modificar estudiante:", error);
    }
}

window.onclick = function (event) {
    const modal = document.getElementById("modal-modificar");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

document.querySelector(".close").onclick = function () {
    document.getElementById("modal-modificar").style.display = "none";
};