document.addEventListener("DOMContentLoaded", function() {
    const createCategoryBtn = document.querySelector('.create-category-btn');
    const categoryTableBody = document.getElementById('categorias-table').querySelector('tbody');

    // Función para obtener y mostrar las categorías
    async function fetchAndDisplayCategories() {
        try {
            const response = await fetch('http://localhost:3000/api/categorias');
            const categories = await response.json();
            categoryTableBody.innerHTML = ''; // Limpiar la tabla antes de actualizar
            categories.forEach(category => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${category.nombre}</td>
                    <td>${category.descripcion}</td>
                    <td>
                        <button class="edit-btn" data-id="${category.id}">Editar</button>
                        <button class="delete-btn" data-id="${category.id}">Eliminar</button>
                    </td>
                `;
                categoryTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error al obtener las categorías:', error);
        }
    }

    // Llamar a la función para mostrar las categorías al cargar la página
    fetchAndDisplayCategories();

    // Event listener para el botón de crear categoría
    createCategoryBtn.addEventListener('click', function() {
        const nombre = prompt("Ingrese el nombre de la categoría:");
        const descripcion = prompt("Ingrese la descripción de la categoría:");

        if (nombre && descripcion) {
            createCategory({ nombre, descripcion });
        } else {
            alert('Todos los campos son obligatorios.');
        }
    });

    // Función para crear una nueva categoría
    async function createCategory(data) {
        // Obtener el token de autenticación desde localStorage
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:3000/api/categorias', {
                method: 'POST',
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
            alert('Categoría creada exitosamente!');
            console.log('Categoría creada:', result);
            // Actualizar la lista de categorías después de crear una nueva
            fetchAndDisplayCategories();
        } catch (error) {
            console.error('Error:', error);
            alert('Error en la creación de la categoría. Por favor, intente nuevamente.');
        }
    }

    // Event listener para los botones de editar y eliminar (delegación de eventos)
    categoryTableBody.addEventListener('click', async function(event) {
        const target = event.target;
        const id = target.getAttribute('data-id');

        if (target.classList.contains('edit-btn')) {
            const nombre = prompt("Ingrese el nuevo nombre de la categoría:");
            const descripcion = prompt("Ingrese la nueva descripción de la categoría:");
            if (nombre && descripcion) {
                updateCategory(id, { nombre, descripcion });
            } else {
                alert('Todos los campos son obligatorios.');
            }
        } else if (target.classList.contains('delete-btn')) {
            if (confirm('¿Está seguro de que desea eliminar esta categoría?')) {
                deleteCategory(id);
            }
        }
    });

    // Función para actualizar una categoría
    async function updateCategory(id, data) {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:3000/api/categorias/${id}`, {
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

            alert('Categoría actualizada exitosamente!');
            fetchAndDisplayCategories();
        } catch (error) {
            console.error('Error:', error);
            alert('Error en la actualización de la categoría. Por favor, intente nuevamente.');
        }
    }

    // Función para eliminar una categoría
    async function deleteCategory(id) {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:3000/api/categorias/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}` // Incluir el token de autenticación en los encabezados
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Error en la petición');
            }

            alert('Categoría eliminada exitosamente!');
            fetchAndDisplayCategories();
        } catch (error) {
            console.error('Error:', error);
            alert('Error en la eliminación de la categoría. Por favor, intente nuevamente.');
        }
    }
});
