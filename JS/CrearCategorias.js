document.addEventListener("DOMContentLoaded", function() {
    const createCourseForm = document.getElementById('createCourseForm');
    
    if (createCourseForm) {
        createCourseForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

            const nombre = document.getElementById('nombre').value.trim();
            const descripcion = document.getElementById('descripcion').value.trim();

            // Validaciones
            if (!nombre || !descripcion) {
                alert('Todos los campos son obligatorios.');
                return;
            }

            const data = {
                nombre,
                descripcion
            };

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
                // Redirigir o actualizar la página según sea necesario
                window.location.href = 'ListaCategoriasAdmin.html';
            } catch (error) {
                console.error('Error:', error);
                alert('Error en la creación de la categoría. Por favor, intente nuevamente.');
            }
        });
    } else {
        console.error('Formulario no encontrado en el DOM.');
    }
});
