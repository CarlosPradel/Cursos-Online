document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Validaciones
    if (!nombre || !apellido || !email || !password) {
        alert('Todos los campos son obligatorios.');
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert('Por favor, ingrese un email válido.');
        return;
    }

    if (password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres.');
        return;
    }

    const data = { nombre, apellido, email, password };

    try {
        const response = await fetch('http://localhost:3000/api/usuarios/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error en la petición');
        }

        const result = await response.json();
        alert('Registro exitoso!');
        console.log('Registro exitoso:', result);
    } catch (error) {
        console.error('Error:', error);
        alert('Error en el registro. Por favor, intente nuevamente.');
    }
});
