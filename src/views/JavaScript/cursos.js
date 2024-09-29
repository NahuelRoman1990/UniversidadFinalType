document.getElementById("modal-modificar").style.display = "none";

document.addEventListener("DOMContentLoaded", () => {
  obtenerCursos();
  obtenerProfesoresParaFormulario();


  const formCurso = document.getElementById("form-curso");
  formCurso.addEventListener("submit", async (event) => {
    event.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value;
    const profesor_id = document.getElementById("profesor").value;

    const validacionExitosa = validarCurso(nombre, descripcion, profesor_id);
    if (!validacionExitosa) {
      return;
    } else {
      const nuevoCurso = { nombre, descripcion, profesor_id };
      await agregarCurso(nuevoCurso);
      formCurso.reset();
    }
  });
});

function validarCurso(nombre, descripcion, profesor_id) {
  const nombreVal = /^[a-zA-ZÑñ0-9\s]{3,50}$/;
  const descripcionVal = /^.{5,200}$/; 
  const profesor_idVal = /^\d+$/; 

  if (!nombreVal.test(nombre) && !descripcionVal.test(descripcion)) {
    Swal.fire({
      icon: "error",
      title: "Campos incompletos",
      text: "Por favor, complete todos los campos.",
    });
    return false;
  }

  
  if (!nombreVal.test(nombre)) {
    Swal.fire({
      icon: "warning",
      title: "Falta el Nombre",
      text: "El nombre debe tener al menos 3 caracteres.",
    });
    return false;
  }

  
  if (!descripcionVal.test(descripcion)) {
    Swal.fire({
      icon: "warning",
      title: "Falta la Descripción",
      text: "La descripción debe tener al menos 10 caracteres.",
    });
    return false;
  }

  
  if (!profesor_idVal.test(profesor_id)) {
    Swal.fire({
      icon: "error",
      title: "Profesor no seleccionado",
      text: "Debe seleccionar un profesor para el curso.",
    });
    return false;
  }

  return true;
}


async function obtenerCursos() {
  try {
    const response = await fetch("http://localhost:3000/cursos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const cursos = await response.json();
    const tbody = document.querySelector("#tabla-cursos");
    tbody.innerHTML = "";

    cursos.forEach((curso) => {
      const row = document.createElement("tr");
      row.innerHTML = `
            <td>${curso.id}</td>
            <td>${curso.nombre}</td>
            <td>${curso.descripcion}</td>
            <td>${curso.profesor.nombre} ${curso.profesor.apellido}</td>
            <td class= "tabla-accion">
              <button class="btn-modificar" onclick="mostrarFormularioModificar(${curso.id})"><i class="fas fa-pencil-alt"></i></button>
              <button class="btn-eliminar" onclick="eliminarCurso(${curso.id})"><i class="fas fa-times"></i></button>
            </td>
          `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Error al obtener cursos:", error);
  }
}


async function obtenerProfesoresParaFormulario() {
  try {
    const response = await fetch("http://localhost:3000/profesores");
    const profesores = await response.json();
    const selectProfesor = document.getElementById("profesor");

    profesores.forEach((profesor) => {
      const option = document.createElement("option");
      option.value = profesor.id;
      option.text = `${profesor.nombre} ${profesor.apellido}`;
      selectProfesor.appendChild(option);
    });
  } catch (error) {
    console.error("Error al obtener profesores:", error);
  }
}

async function agregarCurso(curso) {
    try {
      const response = await fetch("http://localhost:3000/cursos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(curso),
      });
  
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Curso agregado",
          text: "El curso ha sido agregado correctamente.",
          showConfirmButton: true, 
          confirmButtonText: 'Aceptar', 
          
          customClass: {
            popup: 'alerta-curso-agregado' 
          }
        });
        obtenerCursos();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error al agregar curso",
          text: "Hubo un problema al agregar el curso.",
        });
      }
    } catch (error) {
      console.error("Error al agregar curso:", error);
    }
  }
  
async function eliminarCurso(id) {
  Swal.fire({
    title: "¿Está seguro?",
    text: "No podrá revertir esta acción. ¿Desea eliminar el curso?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#145c17",
    cancelButtonColor: "#6b1515",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:3000/cursos/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Curso eliminado",
            text: "El curso ha sido eliminado exitosamente.",
          });
          obtenerCursos();
        } else {
          Swal.fire({
            icon: "error",
            title: "Error al eliminar curso",
            text: "No se pudo eliminar el curso.",
          });
        }
      } catch (error) {
        console.error("Error al eliminar curso:", error);
      }
    }
  });
}


async function mostrarFormularioModificar(id) {
  try {
    const response = await fetch(`http://localhost:3000/cursos/${id}`);
    const curso = await response.json();

    document.getElementById("modificar-id").value = curso.id;
    document.getElementById("modificar-nombre").value = curso.nombre;
    document.getElementById("modificar-descripcion").value = curso.descripcion;

    const profesoresResponse = await fetch("http://localhost:3000/profesores");
    const profesores = await profesoresResponse.json();
    const selectProfesorModificar =
      document.getElementById("modificar-profesor");

    selectProfesorModificar.innerHTML = "";

    profesores.forEach((profesor) => {
      const option = document.createElement("option");
      option.value = profesor.id;
      option.text = `${profesor.nombre} ${profesor.apellido}`;
      if (profesor.id === curso.profesor.id) {
        option.selected = true;
      }
      selectProfesorModificar.appendChild(option);
    });


    document.getElementById("modal-modificar").style.display = "block";
  } catch (error) {
    console.error("Error al cargar los datos del curso:", error);
  }
}

document
  .getElementById("form-modificar")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const id = document.getElementById("modificar-id").value;
    const nombre = document.getElementById("modificar-nombre").value;
    const descripcion = document.getElementById("modificar-descripcion").value;
    const profesor_id = document.getElementById("modificar-profesor").value;

    const validacionExitosa = validarCurso(nombre, descripcion, profesor_id);
    if (!validacionExitosa) {
      return;
    } else {
      const cursoModificado = { nombre, descripcion, profesor_id };
      await modificarCurso(id, cursoModificado);
    }
  });

async function modificarCurso(id, cursoModificado) {
  try {
    const response = await fetch(`http://localhost:3000/cursos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cursoModificado),
    });

    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "Curso modificado",
        text: "El curso ha sido modificado exitosamente.",
      });
      document.getElementById("modal-modificar").style.display = "none";
      obtenerCursos();
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al modificar curso",
        text: "No se pudo modificar el curso.",
      });
    }
  } catch (error) {
    console.error("Error al modificar curso:", error);
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