// Async function to fetch estudiantes from the backend
// Función para obtener estudiantes
async function obtenerEstudiantes() {
  try {
    const response = await fetch("http://localhost:3000/estudiantes");
    if (!response.ok) throw new Error('Error en la red');

    const estudiantes = await response.json();
    const estudianteSelect = document.getElementById("estudiante");

    estudiantes.forEach((estudiante) => {
      const option = document.createElement("option");
      option.value = estudiante.id;
      option.textContent = `${estudiante.nombre} ${estudiante.apellido}`;
      estudianteSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error al obtener estudiantes:", error);
  }
}

// Función para obtener cursos
async function obtenerCursos() {
  try {
    const response = await fetch("http://localhost:3000/cursos");
    if (!response.ok) throw new Error('Error en la red');

    const cursos = await response.json();
    const cursoSelect = document.getElementById("curso");

    cursos.forEach((curso) => {
      const option = document.createElement("option");
      option.value = curso.id;
      option.textContent = curso.nombre;
      cursoSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error al obtener cursos:", error);
  }
}

// Evento que se ejecuta cuando el DOM está completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  obtenerEstudiantes();
  obtenerCursos();
});

// Función para inscribir estudiante
document.getElementById("form-inscripcion").addEventListener("submit", async function (event) {
  event.preventDefault();
  const estudiante = document.getElementById("estudiante").value;
  const curso = document.getElementById("curso").value;
  const nota = document.getElementById("nota").value || 0; // Usa 0 si no se especifica nota

  // Aquí deberías enviar la inscripción al backend
  try {
    const response = await fetch("http://localhost:3000/inscripciones", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ estudiante, curso, nota })
    });

    if (response.ok) {
      Swal.fire(`Inscrito ${estudiante} en ${curso} con nota ${nota}`);
      this.reset(); // Reiniciar el formulario
    } else {
      Swal.fire("Error al inscribir al estudiante");
    }
  } catch (error) {
    console.error("Error al inscribir al estudiante:", error);
    Swal.fire("Error en la conexión");
  }
});

// Función para consultar inscripciones por curso
document.getElementById("consultar-curso-btn").addEventListener("click", async function () {
  const cursoSeleccionado = document.getElementById("curso-consulta").value; // Asegúrate de que el ID coincida
  if (!cursoSeleccionado) {
    Swal.fire("Por favor, selecciona un curso.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/curso/${cursoSeleccionado}`);
    if (!response.ok) throw new Error('Error al consultar inscripciones por curso');
    
    const inscripciones = await response.json();
    mostrarInscripciones(inscripciones);
  } catch (error) {
    console.error("Error al consultar inscripciones por curso:", error);
  }
});

// Función para consultar cursos por estudiante
document.getElementById("consultar-estudiante-btn").addEventListener("click", async function () {
  const estudianteSeleccionado = document.getElementById("estudiante-consulta").value; // Asegúrate de que el ID coincida
  if (!estudianteSeleccionado) {
    Swal.fire("Por favor, selecciona un estudiante.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/estudiante/${estudianteSeleccionado}`);
    if (!response.ok) throw new Error('Error al consultar cursos por estudiante');
    
    const cursos = await response.json();
    mostrarCursos(cursos);
  } catch (error) {
    console.error("Error al consultar cursos por estudiante:", error);
  }
});

// Función para mostrar inscripciones en la tabla
function mostrarInscripciones(inscripciones) {
  const tablaInscripciones = document.getElementById("tabla-inscripciones");
  tablaInscripciones.innerHTML = ""; // Limpiar tabla
  inscripciones.forEach((inscripcion) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${inscripcion.curso}</td>
      <td>${inscripcion.estudiante}</td>
      <td>${inscripcion.nota}</td>
    `;
    tablaInscripciones.appendChild(row);
  });
}

// Función para mostrar cursos en la tabla
function mostrarCursos(cursos) {
  const tablaCursos = document.getElementById("tabla-cursos");
  tablaCursos.innerHTML = ""; // Limpiar tabla
  cursos.forEach((curso) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${curso.nombre}</td>
      <td>${curso.nota}</td>
    `;
    tablaCursos.appendChild(row);
  });
}

// Llamar a las funciones al cargar la página
obtenerEstudiantes();
obtenerCursos();
