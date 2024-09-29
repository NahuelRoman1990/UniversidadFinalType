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

document.addEventListener("DOMContentLoaded", () => {
  obtenerEstudiantes();
  obtenerCursos();
});

document.getElementById("form-inscripcion").addEventListener("submit", async function (event) {
  event.preventDefault();
  const estudiante = document.getElementById("estudiante").value;
  const curso = document.getElementById("curso").value;
  const nota = document.getElementById("nota").value || 0; // Usa 0 si no se especifica nota

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
      this.reset();
    } else {
      Swal.fire("Error al inscribir al estudiante");
    }
  } catch (error) {
    console.error("Error al inscribir al estudiante:", error);
    Swal.fire("Error en la conexión");
  }
});

document.getElementById("consultar-curso-btn").addEventListener("click", async function () {
  const cursoSeleccionado = document.getElementById("curso-consulta").value; 
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


function mostrarInscripciones(inscripciones) {
  const tablaInscripciones = document.getElementById("tabla-inscripciones");
  tablaInscripciones.innerHTML = "";
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


function mostrarCursos(cursos) {
  const tablaCursos = document.getElementById("tabla-cursos");
  tablaCursos.innerHTML = ""; 
  cursos.forEach((curso) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${curso.nombre}</td>
      <td>${curso.nota}</td>
    `;
    tablaCursos.appendChild(row);
  });
}

obtenerEstudiantes();
obtenerCursos();
