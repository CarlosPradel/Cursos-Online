document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'http://localhost:3000/api/cursos';
    const urlParams = new URLSearchParams(window.location.search);
    const cursoId = urlParams.get('id');
    const editCourseForm = document.getElementById('editCourseForm');

    function loadCourse() {
        const token = localStorage.getItem('token'); // Obtener el token del localStorage

        if (!token) {
            console.error('Token no encontrado. Redirigiendo al inicio de sesión.');
            window.location.href = 'login.html'; // Redirigir a la página de inicio de sesión si no hay token
            return;
        }

        fetch(`${apiUrl}/${cursoId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Incluir el token en los encabezados
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Course data fetched:', data);  // Añadir esto para depuración
            populateForm(data);
        })
        .catch(error => console.error('Error fetching course data:', error));
    }

    function populateForm(course) {
        document.getElementById('titulo').value = course.titulo;
        document.getElementById('descripcion').value = course.descripcion;
        document.getElementById('duracion').value = course.duracion;
        document.getElementById('imagen').value = course.imagen;
    }

    editCourseForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const token = localStorage.getItem('token'); // Obtener el token del localStorage

        const titulo = document.getElementById('titulo').value.trim();
        const descripcion = document.getElementById('descripcion').value.trim();
        const duracion = document.getElementById('duracion').value;
        const imagen = document.getElementById('imagen').value.trim();

        const data = { titulo, descripcion, duracion, imagen };

        fetch(`${apiUrl}/${cursoId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`, // Incluir el token en los encabezados
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            alert('Curso actualizado exitosamente');
            window.location.href = 'ListaCursosAdmin.html'; // Redirigir a la lista de cursos
        })
        .catch(error => console.error('Error updating course:', error));
    });

    loadCourse();
});
