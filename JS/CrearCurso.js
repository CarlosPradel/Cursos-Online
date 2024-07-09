document.addEventListener("DOMContentLoaded", function() {
    const createCourseForm = document.getElementById('createCourseForm');
    const categoriaSelect = document.getElementById('categoria');

    // Función para obtener y poblar las categorías en el campo de selección
    async function fetchAndPopulateCategories() {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:3000/api/categorias', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}` // Incluir el token de autenticación en los encabezados
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Error en la petición');
            }

            const categories = await response.json();

            if (!Array.isArray(categories)) {
                throw new Error('La respuesta no es un arreglo');
            }

            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.nombre;
                categoriaSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error al obtener las categorías:', error);
        }
    }

    // Llamar a la función para poblar las categorías al cargar la página
    fetchAndPopulateCategories();

    if (createCourseForm) {
        createCourseForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

            const titulo = document.getElementById('titulo').value.trim();
            const descripcion = document.getElementById('descripcion').value.trim();
            const duracion = document.getElementById('duracion').value.trim();
            const imagen = document.getElementById('imagen').value.trim();
            const categoriaId = document.getElementById('categoria').value;

            // Validaciones
            if (!titulo || !descripcion || !duracion || !imagen || !categoriaId) {
                alert('Todos los campos son obligatorios.');
                return;
            }

            const data = {
                titulo,
                descripcion,
                duracion,
                imagen,
                categoriaId
            };

            // Obtener el token de autenticación desde localStorage
            const token = localStorage.getItem('token');

            try {
                const response = await fetch('http://localhost:3000/api/cursos', {
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
                alert('Curso creado exitosamente!');
                console.log('Curso creado:', result);
                // Redirigir o actualizar la página según sea necesario
                window.location.href = 'ListaCursosAdmin.html';
            } catch (error) {
                console.error('Error:', error);
                alert('Error en la creación del curso. Por favor, intente nuevamente.');
            }
        });
    } else {
        console.error('Formulario no encontrado en el DOM.');
    }
});
