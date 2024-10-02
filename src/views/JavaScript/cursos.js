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
  const nombreApellidoVal = /^[a-zA-ZñÑ\s]{3,50}$/;
  const descripcionVal = /^.{5,200}$/;
  const profesor_idVal = /^\d+$/;

  if (!nombreVal.test(nombre) || !descripcionVal.test(descripcion)) {
    mostrarAlerta("Campos incompletos", "Por favor, complete todos los campos.");
    return false;
  }

  if (!nombreVal.test(nombre)) {
    mostrarAlerta("Falta el Nombre", "El nombre debe tener al menos 3 caracteres.");
    return false;
  }

  if (!descripcionVal.test(descripcion)) {
    mostrarAlerta("Falta la Descripción", "La descripción debe tener al menos 10 caracteres.");
    return false;
  }

  if (!profesor_idVal.test(profesor_id)) {
    mostrarAlerta("Profesor no seleccionado", "Debe seleccionar un profesor para el curso.");
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
            <td class="tabla-accion">
              <button class="btn-modificar" onclick="mostrarFormularioModificar(${curso.id})">✏️</button>
              <button class="btn-eliminar" onclick="eliminarCurso(${curso.id})">❌</button>
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
      mostrarAlerta("Curso agregado", "El curso ha sido agregado correctamente.");
      obtenerCursos();
    } else {
      mostrarAlerta("Error al agregar curso", "Hubo un problema al agregar el curso.");
    }
  } catch (error) {
    console.error("Error al agregar curso:", error);
  }
}

async function eliminarCurso(id) {
  if (confirm("¿Está seguro? No podrá revertir esta acción. ¿Desea eliminar el curso?")) {
    try {
      const response = await fetch(`http://localhost:3000/cursos/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        mostrarAlerta("Curso eliminado", "El curso ha sido eliminado exitosamente.");
        obtenerCursos();
      } else {
        mostrarAlerta("Error al eliminar curso", "No se pudo eliminar el curso.");
      }
    } catch (error) {
      console.error("Error al eliminar curso:", error);
    }
  }
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
    const selectProfesorModificar = document.getElementById("modificar-profesor");

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

document.getElementById("form-modificar").addEventListener("submit", async function (event) {
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
      mostrarAlerta("Curso modificado", "El curso ha sido modificado exitosamente.");
      document.getElementById("modal-modificar").style.display = "none";
      obtenerCursos();
    } else {
      mostrarAlerta("Error al modificar curso", "No se pudo modificar el curso.");
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