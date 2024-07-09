document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'http://localhost:3000/api/usuarios';
    const tableBody = document.querySelector('#usuarios-table tbody');

    function loadUsuarios() {
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

    function populateTable(usuarios) {
        tableBody.innerHTML = '';
        if (usuarios.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="3">No se encontraron usuarios.</td>';
            tableBody.appendChild(row);
            return;
        }
        usuarios.forEach(usuario => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${usuario.nombre}</td>
                <td>${usuario.email}</td>
                <td>
                    <a href="#" class="btn-delete" data-id="${usuario.id}">Eliminar</a>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Agregar eventos a los botones de eliminar
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', deleteUsuario);
        });
    }

    function deleteUsuario(event) {
        const usuarioId = event.target.getAttribute('data-id');
        const token = localStorage.getItem('token'); // Obtener el token del localStorage

        if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            fetch(`${apiUrl}/${usuarioId}`, {
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
                alert('Usuario eliminado exitosamente');
                loadUsuarios(); // Recargar la lista de usuarios
            })
            .catch(error => console.error('Error eliminando el usuario:', error));
        }
    }

    loadUsuarios();
});
