document.getElementById("modal-modificar").style.display = "none";
document.getElementById("modal-alert").style.display = "none";

document.addEventListener("DOMContentLoaded", () => {
    obtenerProfesores();

    const formProfesor = document.getElementById("form-profesor");
    formProfesor.addEventListener("submit", async (event) => {
        event.preventDefault();
        const dni = document.getElementById("dni").value.trim();
        const nombre = document.getElementById("nombre").value.trim();
        const apellido = document.getElementById("apellido").value.trim();
        const email = document.getElementById("email").value.trim();
        const profesion = document.getElementById("profesion").value.trim();
        const telefono = document.getElementById("telefono").value.trim();

        const validacionExitosa = validarProfesor(dni, nombre, apellido, email, profesion, telefono);

        if (!validacionExitosa) {
            return;
        }

        const nuevoProfesor = {
            dni,
            nombre,
            apellido,
            email,
            profesion,
            telefono,
        };

        await agregarProfesor(nuevoProfesor);
        formProfesor.reset();
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

function validarProfesor(dni, nombre, apellido, email, profesion, telefono) {
    const dniVal = /^\d{8}$/;
    const nombreApellidoVal = /^[a-zA-ZñÑ\s]{3,50}$/;
    const emailVal = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telefonoVal = /^\d{10}$/;

    if (!dni || !nombre || !apellido || !email || !profesion || !telefono) {
        mostrarAlerta("Campos incompletos", "Por favor, complete todos los campos.");
        return false;
    }

    if (!dniVal.test(dni)) {
        mostrarAlerta("Error en el DNI", "El DNI debe ser numérico y tener 8 dígitos.");
        return false;
    }

    if (!nombreApellidoVal.test(nombre) || nombre.length < 2) {
        mostrarAlerta("Error en el Nombre", "El nombre debe contener solo letras y tener al menos 2 caracteres.");
        return false;
    }

    if (!nombreApellidoVal.test(apellido) || apellido.length < 2) {
        mostrarAlerta("Error en el Apellido", "El apellido debe contener solo letras y tener al menos 2 caracteres.");
        return false;
    }

    if (!emailVal.test(email)) {
        mostrarAlerta("Error en el Email", "Debes ingresar un correo electrónico válido.");
        return false;
    }

    if (profesion.trim().length < 2) {
        mostrarAlerta("Error en la Profesión", "La profesión debe tener al menos 2 caracteres.");
        return false;
    }

    if (!telefonoVal.test(telefono)) {
        mostrarAlerta("Error en el Teléfono", "El teléfono debe ser numérico y tener 10 dígitos.");
        return false;
    }

    return true;
}

async function obtenerProfesores() {
    try {
        const response = await fetch("http://localhost:3000/profesores", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const profesores = await response.json();
        const tbody = document.querySelector("#tabla-profesores");
        tbody.innerHTML = "";

        profesores.forEach((profesor) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${profesor.id}</td>
                <td>${profesor.dni}</td>
                <td>${profesor.nombre}</td>
                <td>${profesor.apellido}</td>
                <td>${profesor.email}</td>
                <td>${profesor.profesion}</td>
                <td>${profesor.telefono}</td>
                <td class="tabla-accion">
                    <button class="btn-modificar" onclick="mostrarFormularioModificar(${profesor.id})">✏️</button>             
                    <button class="btn-eliminar" onclick="eliminarProfesor(${profesor.id})">❌</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error("Error al obtener profesores:", error);
        mostrarAlerta("Error", "No se pudo obtener la lista de profesores.");
    }
}

async function agregarProfesor(profesor) {
    try {
        const response = await fetch("http://localhost:3000/profesores", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(profesor),
        });

        if (response.ok) {
            mostrarAlerta("Profesor agregado", "El profesor ha sido agregado exitosamente.");
            obtenerProfesores();
        } else {
            mostrarAlerta("Error al agregar profesor", "No se pudo agregar el profesor.");
        }
    } catch (error) {
        console.error("Error al agregar profesor:", error);
        mostrarAlerta("Error", "Ocurrió un error al agregar el profesor.");
    }
}

async function eliminarProfesor(id) {

    mostrarConfirmacion("¿Está seguro?", "No podrá revertir esta acción. ¿Desea eliminar al profesor?", async (confirmado) => {
        if (confirmado) {
            try {
                const response = await fetch(`http://localhost:3000/profesores/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    mostrarAlerta("Profesor eliminado", "El profesor ha sido eliminado exitosamente.");
                    obtenerProfesores();
                } else {
                    mostrarAlerta("Error al eliminar profesor", "No se pudo eliminar el profesor. Verifique si el profesor está asignado a un curso.");
                }
            } catch (error) {
                console.error("Error al eliminar profesor:", error);
                mostrarAlerta("Error", "Ocurrió un error al eliminar el profesor.");
            }
        }
    });
}


function mostrarConfirmacion(titulo, texto, callback) {
    document.getElementById("alert-title").innerText = titulo;
    document.getElementById("alert-text").innerText = texto;
    
    const alertButton = document.getElementById("alert-button");
    alertButton.innerText = "Aceptar";

    alertButton.replaceWith(alertButton.cloneNode(true));

    const nuevoBoton = document.getElementById("alert-button");
    nuevoBoton.addEventListener("click", () => {
        document.getElementById("modal-alert").style.display = "none";
        callback(true);
    });

    document.getElementById("modal-alert").style.display = "block";
}

async function mostrarFormularioModificar(id) {
    try {
        const response = await fetch(`http://localhost:3000/profesores/${id}`);
        const profesor = await response.json();

        document.getElementById("modificar-id").value = profesor.id;
        document.getElementById("modificar-dni").value = profesor.dni;
        document.getElementById("modificar-nombre").value = profesor.nombre;
        document.getElementById("modificar-apellido").value = profesor.apellido;
        document.getElementById("modificar-email").value = profesor.email;
        document.getElementById("modificar-profesion").value = profesor.profesion;
        document.getElementById("modificar-telefono").value = profesor.telefono;

        document.getElementById("modal-modificar").style.display = "block";
    } catch (error) {
        console.error("Error al cargar los datos del profesor:", error);
        mostrarAlerta("Error", "No se pudieron cargar los datos del profesor.");
    }
}

document
    .getElementById("form-modificar")
    .addEventListener("submit", async function (event) {
        event.preventDefault();

        const id = document.getElementById("modificar-id").value;
        const dni = document.getElementById("modificar-dni").value.trim();
        const nombre = document.getElementById("modificar-nombre").value.trim();
        const apellido = document.getElementById("modificar-apellido").value.trim();
        const email = document.getElementById("modificar-email").value.trim();
        const profesion = document.getElementById("modificar-profesion").value.trim();
        const telefono = document.getElementById("modificar-telefono").value.trim();

        const validacionExitosa = validarProfesor(dni, nombre, apellido, email, profesion, telefono);

        if (!validacionExitosa) {
            return;
        }

        const profesorModificado = {
            dni,
            nombre,
            apellido,
            email,
            profesion,
            telefono,
        };

        await modificarProfesor(id, profesorModificado);
    });


async function modificarProfesor(id, profesorModificado) {
    try {
        const response = await fetch(`http://localhost:3000/profesores/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(profesorModificado),
        });

        if (response.ok) {
            mostrarAlerta("Profesor modificado", "El profesor ha sido modificado exitosamente.");
            document.getElementById("modal-modificar").style.display = "none";
            await obtenerProfesores();
        } else {
            mostrarAlerta("Error al modificar", "No se pudo modificar el profesor.");
        }
    } catch (error) {
        console.error("Error al modificar el profesor:", error);
        mostrarAlerta("Error", "Ocurrió un error al modificar el profesor.");
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
