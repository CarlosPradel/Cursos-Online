document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'http://localhost:3000/api/cursos';
    const tableBody = document.querySelector('#cursos-table tbody');
    const createCourseBtn = document.querySelector('.create-course-btn');

    function loadCursos() {
        const token = localStorage.getItem('token'); // Obtener el token del localStorage

        if (!token) {
            console.error('Token no encontrado. Redirigiendo al inicio de sesión.');
            window.location.href = 'login.html'; // Redirigir a la página de inicio de sesión si no hay token
            return;
        }

        fetch(apiUrl, {
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
            console.log('Data fetched:', data);  // Añadir esto para depuración
            populateTable(data);
        })
        .catch(error => console.error('Error fetching data:', error));
    }

    function populateTable(cursos) {
        tableBody.innerHTML = '';
        if (cursos.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="3">No se encontraron cursos.</td>';
            tableBody.appendChild(row);
            return;
        }
        cursos.forEach(curso => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${curso.titulo}</td>
                <td>${curso.descripcion}</td>
                <td>
                    <a href="#" class="btn-edit" data-id="${curso.id}">Editar</a>
                    <a href="#" class="btn-delete" data-id="${curso.id}">Eliminar</a>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Agregar eventos a los botones de editar y eliminar
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', editCurso);
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', deleteCurso);
        });
    }

    function editCurso(event) {
        const cursoId = event.target.getAttribute('data-id');
        window.location.href = `editarcurso.html?id=${cursoId}`;
    }

    function deleteCurso(event) {
        const cursoId = event.target.getAttribute('data-id');
        const token = localStorage.getItem('token'); // Obtener el token del localStorage

        if (confirm('¿Estás seguro de que deseas eliminar este curso?')) {
            fetch(`${apiUrl}/${cursoId}`, {
                method: 'DELETE',
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
                alert('Curso eliminado exitosamente');
                loadCursos(); // Recargar la lista de cursos
            })
            .catch(error => console.error('Error eliminando el curso:', error));
        }
    }

    createCourseBtn.addEventListener('click', () => {
        window.location.href = 'CrearCursos.html'; // Redirigir a crearcurso.html al hacer clic en el botón
    });

    loadCursos();
});
