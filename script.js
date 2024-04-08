const form = document.getElementById('consultaForm');
const resultadoDiv = document.getElementById('resultado');

form.addEventListener('submit', async function(event) {
  event.preventDefault();
  
  const documento = form.documento.value.trim();

  if (documento === '') {
    mostrarMensajeError('Por favor ingresa un número de documento.');
    return;
  }

  // Validación adicional para verificar que el documento sea un número
  if (isNaN(documento)) {
    mostrarMensajeError('El número de documento debe ser un valor numérico.');
    return;
  }

  try {
    const response = await fetch(`https://api.talentotech.cymetria.com/api/v1/blockchain/obtener-estudiantes-aprobados?documento=${documento}`);
    const data = await response.json();

    if (response.ok) {
      if (data.ok && data.estudiantes_aprobados.length > 0) {
        mostrarResultado(data.estudiantes_aprobados);
      } else {
        mostrarMensajeError('No se encontraron estudiantes aprobados con ese número de documento.');
      }
    } else {
      mostrarMensajeError('Hubo un problema al obtener la información. Por favor, inténtalo de nuevo más tarde.');
    }
  } catch (error) {
    mostrarMensajeError('Hubo un problema al conectarse con el servidor. Por favor, inténtalo de nuevo más tarde.');
  }
});

function mostrarResultado(estudiantes) {
    resultadoDiv.innerHTML = '';
    const documentoBuscado = form.documento.value.trim();
  
    const estudianteEncontrado = estudiantes.find(estudiante => {
      return estudiante.estudiante.num_documento === documentoBuscado;
    });
  
    if (estudianteEncontrado) {
      const { estudiante: { nombres, apellidos, num_documento, email }, curso: { nombreCurso } } = estudianteEncontrado;
      const resultadoHTML = `
        <p><strong>Nombre:</strong> ${nombres} ${apellidos}</p>
        <p><strong>Número de documento:</strong> ${num_documento}</p>
        <p><strong>Correo electrónico:</strong> ${email}</p>
        <p><strong>Curso aprobado:</strong> ${nombreCurso}</p>
        <hr>
      `;
      resultadoDiv.innerHTML = resultadoHTML;
    } else {
      mostrarMensajeError('No se encontró ningún estudiante aprobado con ese número de documento.');
    }
  
    resultadoDiv.style.display = 'block';
  }
  

function mostrarMensajeError(mensaje) {
  resultadoDiv.innerHTML = `<p class="error">${mensaje}</p>`;
  resultadoDiv.style.display = 'block';
}
