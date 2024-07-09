document.addEventListener('DOMContentLoaded', function() {
    const leccionId = new URLSearchParams(window.location.search).get('id');
    const cursoSelect = document.getElementById('cursoId');
    const leccionForm = document.getElementById('editLessonForm');
    const token = localStorage.getItem('token');

    if (!token) {
        alert('No se encontró el token de autenticación.');
        window.location.href = 'login.html';
        return;
    }

    async function loadCursos() {
        try {
            const response = await fetch('http://localhost:3000/api/cursos', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener los cursos.');
            }

            const cursos = await response.json();
            cursos.forEach(curso => {
                const option = document.createElement('option');
                option.value = curso.id;
                option.textContent = curso.nombre;
                cursoSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error al cargar los cursos:', error);
            alert('Ocurrió un error al cargar los cursos.');
        }
    }

    async function loadLeccion() {
        try {
            const response = await fetch(`http://localhost:3000/api/lecciones/${leccionId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener la lección.');
            }

            const leccion = await response.json();
            document.getElementById('leccionId').value = leccion.id;
            document.getElementById('cursoId').value = leccion.cursoId;
            document.getElementById('titulo').value = leccion.titulo;
            document.getElementById('contenido').value = leccion.contenido;
            document.getElementById('duracion').value = leccion.duracion;
            document.getElementById('tipo').value = leccion.tipo;

            if (leccion.tipo === 'video') {
                document.getElementById('urlVideo').value = leccion.urlVideo;
                document.getElementById('urlVideoDiv').style.display = 'block';
            } else {
                document.getElementById('urlVideoDiv').style.display = 'none';
            }
        } catch (error) {
            console.error('Error al cargar la lección:', error);
            alert('Ocurrió un error al cargar la lección.');
        }
    }

    leccionForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

        const cursoId = document.getElementById('cursoId').value.trim();
        const titulo = document.getElementById('titulo').value.trim();
        const contenido = document.getElementById('contenido').value.trim();
        const duracion = document.getElementById('duracion').value.trim();
        const tipo = document.getElementById('tipo').value.trim();
        const urlVideo = document.getElementById('urlVideo').value.trim();

        // Validaciones
        if (!cursoId || !titulo || !contenido || !duracion || !tipo) {
            alert('Todos los campos son obligatorios.');
            return;
        }

        if (tipo === 'video' && !urlVideo) {
            alert('La URL del video es obligatoria para el tipo video.');
            return;
        }

        const data = {
            cursoId: parseInt(cursoId),
            titulo,
            contenido,
            duracion: parseInt(duracion),
            tipo,
            urlVideo: tipo === 'video' ? urlVideo : null
        };

        try {
            const response = await fetch(`http://localhost:3000/api/lecciones/${leccionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Incluir el token de autenticación en los encabezados
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Error en la petición');
            }

            const result = await response.json();
            alert('Lección actualizada exitosamente!');
            console.log('Lección actualizada:', result);
            // Redirigir o actualizar la página según sea necesario
            window.location.href = 'ListaLeccionAdmin.html';
        } catch (error) {
            console.error('Error:', error);
            alert('Error en la actualización de la lección. Por favor, intente nuevamente.');
        }
    });

    // Mostrar u ocultar el campo URL del Video según el tipo seleccionado
    document.getElementById('tipo').addEventListener('change', function() {
        const tipo = document.getElementById('tipo').value;
        const urlVideoDiv = document.getElementById('urlVideoDiv');
        if (tipo === 'video') {
            urlVideoDiv.style.display = 'block';
        } else {
            urlVideoDiv.style.display = 'none';
        }
    });

    loadCursos();
    loadLeccion();
});
