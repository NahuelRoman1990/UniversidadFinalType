document.getElementById("modal-modificar").style.display = "none";

document.addEventListener("DOMContentLoaded", () => {
  obtenerProfesores();

  const formProfesor = document.getElementById("form-profesor");
  formProfesor.addEventListener("submit", async (event) => {
    event.preventDefault();
    const dni = document.getElementById("dni").value;
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const email = document.getElementById("email").value;
    const profesion = document.getElementById("profesion").value;
    const telefono = document.getElementById("telefono").value;

    const validacionExitosa = validarProfesor(
      dni,
      nombre,
      apellido,
      email,
      profesion,
      telefono
    );

    if (!validacionExitosa) {
      return;
    } else {
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
    }
  });
});

function validarProfesor(dni, nombre, apellido, email, profesion, telefono) {
  const dniVal = /^\d{8,8}$/; 
  const nombreApellidoVal = /^[a-zA-ZnÑ\s]{3,50}$/; 
  const emailVal = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
  const telefonoVal = /^\d{10}$/; 

  if (!dni || !nombre || !apellido || !email) {
    Swal.fire({
      icon: "error",
      title: "Campos incompletos",
      text: "Por favor, complete todos los campos.",
    });
    return false;
  }

  if (!dniVal.test(dni)) {
    Swal.fire({
      icon: "error",
      title: "Error en el DNI",
      text: "El DNI debe ser numérico y tener 8 dígitos.",
    });
    return false;
  }

  if (!nombreApellidoVal.test(nombre) || nombre.length < 2) {
    Swal.fire({
      icon: "error",
      title: "Error en el Nombre",
      text: "El nombre debe ser solo letras",
    });
    return false;
  }


  if (!nombreApellidoVal.test(apellido) || apellido.length < 2) {
    Swal.fire({
      icon: "error",
      title: "Error en el Apellido",
      text: "El apellido debe ser solo letras",
    });
    return false;
  }

  if (!emailVal.test(email)) {
    Swal.fire({
      icon: "error",
      title: "Error en el Email",
      text: "Debes ingresar un correo electrónico válido.",
    });
    return false;
  }

  if (!telefonoVal.test(telefono)) {
    Swal.fire({
      icon: "error",
      title: "Error en el Telefono",
      text: "El telefono debe ser de 10 dígitos.",
    });
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
                <td class= "tabla-accion">
                    <button class="btn-modificar" onclick="mostrarFormularioModificar(${profesor.id})"><i class="fas fa-pencil-alt"></i></button>             
                    <button class="btn-eliminar" onclick="eliminarProfesor(${profesor.id})"><i class="fas fa-times"></i></button>
                </td>
            `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Error al obtener profesores:", error);
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
      Swal.fire({
        icon: "success",
        title: "Profesor agregado",
        text: "El profesor ha sido agregado exitosamente.",
      });
      obtenerProfesores();
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al agregar profesor",
        text: "No se pudo agregar el profesor.",
      });
    }
  } catch (error) {
    console.error("Error al agregar profesor:", error);
  }
}

async function eliminarProfesor(id) {
  Swal.fire({
    title: "¿Está seguro?",
    text: "No podrá revertir esta acción. ¿Desea eliminar al profesor?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#145c17",
    cancelButtonColor: "#6b1515",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:3000/profesores/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Profesor eliminado",
            text: "El profesor ha sido eliminado exitosamente.",
          });
          obtenerProfesores();
        } else {
          Swal.fire({
            icon: "error",
            title: "Error al eliminar profesor",
            text: "No se pudo eliminar el profesor.",
            footer: "Verifique si el profesor se encuentra asignado a un curso",
          });
        }
      } catch (error) {
        console.error("Error al eliminar profesor:", error);
      }
    }
  });
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
  }
}

document
  .getElementById("form-modificar")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const id = document.getElementById("modificar-id").value;
    const dni = document.getElementById("modificar-dni").value;
    const nombre = document.getElementById("modificar-nombre").value;
    const apellido = document.getElementById("modificar-apellido").value;
    const email = document.getElementById("modificar-email").value;
    const profesion = document.getElementById("modificar-profesion").value;
    const telefono = document.getElementById("modificar-telefono").value;

    const validacionExitosa = validarProfesor(
      dni,
      nombre,
      apellido,
      email,
      profesion,
      telefono
    );

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
      Swal.fire({
        icon: "success",
        title: "Profesor modificado",
        text: "El profesor ha sido modificado exitosamente.",
      });
      document.getElementById("modal-modificar").style.display = "none";
      await obtenerProfesores();
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al modificar",
        text: "No se pudo modificar el profesor.",
      });
    }
  } catch (error) {
    console.error("Error al modificar el profesor:", error);
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