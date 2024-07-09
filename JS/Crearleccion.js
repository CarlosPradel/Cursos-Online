document.addEventListener('DOMContentLoaded', function() {
    const createLessonForm = document.getElementById('createLessonForm');
    const cursoSelect = document.getElementById('cursoId');
    const urlVideoDiv = document.getElementById('urlVideoDiv');
    const tipoSelect = document.getElementById('tipo');
    const token = localStorage.getItem('token');

    async function loadCourses() {
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
                option.textContent = curso.titulo;
                cursoSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error al cargar los cursos:', error);
            alert('Ocurrió un error al cargar los cursos.');
        }
    }

    async function createLesson(event) {
        event.preventDefault();

        const cursoId = cursoSelect.value;
        const titulo = document.getElementById('titulo').value.trim();
        const contenido = document.getElementById('contenido').value.trim();
        const duracion = document.getElementById('duracion').value.trim();
        const tipo = tipoSelect.value;
        const urlVideo = tipo === 'video' ? document.getElementById('urlVideo').value.trim() : null;

        if (!cursoId || !titulo || !contenido || !duracion || (tipo === 'video' && !urlVideo)) {
            alert('Todos los campos son obligatorios.');
            return;
        }

        const data = {
            cursoId,
            titulo,
            contenido,
            duracion,
            tipo,
            urlVideo
        };

        try {
            const response = await fetch('http://localhost:3000/api/lecciones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Error en la creación de la lección.');
            }

            alert('Lección creada exitosamente!');
            createLessonForm.reset();
        } catch (error) {
            console.error('Error al crear la lección:', error);
            alert('Ocurrió un error al crear la lección. Por favor, intente nuevamente.');
        }
    }

    tipoSelect.addEventListener('change', function() {
        if (tipoSelect.value === 'video') {
            urlVideoDiv.style.display = 'block';
        } else {
            urlVideoDiv.style.display = 'none';
        }
    });

    createLessonForm.addEventListener('submit', createLesson);
    loadCourses();
});
