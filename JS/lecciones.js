document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'http://localhost:3000/api/lecciones';
    const tableBody = document.querySelector('#lecciones-table tbody');
    const createLessonBtn = document.querySelector('.create-lesson-btn');

    createLessonBtn.addEventListener('click', function() {
        window.location.href = 'CrearLeccion.html'; // Redirigir a CrearLeccion.html al hacer clic en el botón
    });

    function loadLecciones() {
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

    function populateTable(lecciones) {
        tableBody.innerHTML = '';
        if (lecciones.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="6">No se encontraron lecciones.</td>';
            tableBody.appendChild(row);
            return;
        }
        lecciones.forEach(leccion => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${leccion.titulo}</td>
                <td>${leccion.contenido}</td>
                <td>${leccion.duracion} min</td>
                <td>${leccion.tipo}</td>
                <td><a href="${leccion.urlVideo}" target="_blank">Ver Video</a></td>
                <td>
                    <a href="#" class="btn-edit" data-id="${leccion.id}">Editar</a>
                    <a href="#" class="btn-delete" data-id="${leccion.id}">Eliminar</a>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Agregar eventos a los botones de editar y eliminar
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', editLeccion);
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', deleteLeccion);
        });
    }

    function editLeccion(event) {
        const leccionId = event.target.getAttribute('data-id');
        window.location.href = `editarleccion.html?id=${leccionId}`;
    }

    function deleteLeccion(event) {
        const leccionId = event.target.getAttribute('data-id');
        const token = localStorage.getItem('token'); // Obtener el token del localStorage

        if (confirm('¿Estás seguro de que deseas eliminar esta lección?')) {
            fetch(`${apiUrl}/${leccionId}`, {
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
                alert('Lección eliminada exitosamente');
                loadLecciones(); // Recargar la lista de lecciones
            })
            .catch(error => console.error('Error eliminando la lección:', error));
        }
    }

    loadLecciones();
});
