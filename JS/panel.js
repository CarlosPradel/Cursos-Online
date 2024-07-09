document.addEventListener('DOMContentLoaded', function() {
    const recentUsersTable = document.getElementById('recentUsersTable');
    const logoutBtn = document.getElementById('logoutBtn');

    async function loadRecentUsers() {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('No se encontró el token de autenticación.');
            window.location.href = 'login.html';
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/usuarios', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener los usuarios.');
            }

            const usuarios = await response.json();
            usuarios.forEach(usuario => {
                const tr = document.createElement('tr');
                const estado = usuario.estado ? usuario.estado.toLowerCase() : 'unknown';
                tr.innerHTML = `
                    <td>
                        <img src="imagenes/people.png.jpeg" alt="Imagen de usuario">
                        <p>${usuario.nombre} ${usuario.apellido}</p>
                    </td>
                    <td><span class="status ${estado}">${usuario.estado || 'Desconocido'}</span></td>
                `;
                recentUsersTable.appendChild(tr);
            });
        } catch (error) {
            console.error('Error al cargar los usuarios:', error);
            alert('Ocurrió un error al cargar los usuarios.');
        }
    }

    function handleLogout(event) {
        event.preventDefault(); // Prevenir comportamiento por defecto del enlace

        // Eliminar el token de autenticación del localStorage
        localStorage.removeItem('token');

        // Redirigir al usuario a la página de inicio de sesión
        window.location.href = 'login.html';
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    } else {
        console.error('Botón de cerrar sesión no encontrado.');
    }

    loadRecentUsers();
});
document.addEventListener('DOMContentLoaded', function() {
    const recentUsersTable = document.getElementById('recentUsersTable');
    const logoutBtn = document.getElementById('logoutBtn');

    async function loadRecentUsers() {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('No se encontró el token de autenticación.');
            window.location.href = 'login.html';
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/usuarios', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener los usuarios.');
            }

            const usuarios = await response.json();
            usuarios.forEach(usuario => {
                const tr = document.createElement('tr');
                const estado = usuario.estado ? usuario.estado.toLowerCase() : 'unknown';
                tr.innerHTML = `
                    <td>
                        <img src="imagenes/people.png.jpeg" alt="Imagen de usuario">
                        <p>${usuario.nombre} ${usuario.apellido}</p>
                    </td>
                    <td><span class="status ${estado}">${usuario.estado || 'Desconocido'}</span></td>
                `;
                recentUsersTable.appendChild(tr);
            });
        } catch (error) {
            console.error('Error al cargar los usuarios:', error);
            alert('Ocurrió un error al cargar los usuarios.');
        }
    }

    function handleLogout(event) {
        event.preventDefault(); // Prevenir comportamiento por defecto del enlace

        // Eliminar el token de autenticación del localStorage
        localStorage.removeItem('token');

        // Redirigir al usuario a la página de inicio de sesión
        window.location.href = 'login.html';
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    } else {
        console.error('Botón de cerrar sesión no encontrado.');
    }

    loadRecentUsers();
});
