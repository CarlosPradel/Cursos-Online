document.getElementById('adminLoginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
        alert('Todos los campos son obligatorios.');
        return;
    }

    const data = { email, password };

    try {
        const response = await fetch('http://localhost:3000/api/usuarios/login', {
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
        alert('Inicio de sesión exitoso!');
        console.log('Inicio de sesión exitoso:', result);

        // Guardar la información del usuario y el token en localStorage
        localStorage.setItem('usuario', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);

        // Redirigir a admin.html
        window.location.href = 'admin.html';
    } catch (error) {
        console.error('Error:', error);
        alert('Error en el inicio de sesión. Por favor, intente nuevamente.');
    }
});
