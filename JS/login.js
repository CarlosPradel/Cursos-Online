document.querySelector('form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.querySelector('input[type="email"]').value.trim();
    const password = document.querySelector('input[type="password"]').value.trim();

    if (!email || !password) {
        alert('Todos los campos son obligatorios.');
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert('Por favor, ingrese un email válido.');
        return;
    }

    const data = {
        email,
        password
    };

    try {
        const response = await fetch('http://localhost:3000/api/usuarios/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }

        const result = await response.json();
        alert('Inicio de sesión exitoso!');
        localStorage.setItem('token', result.token);
        window.location.href = 'principal.html';
    } catch (error) {
        console.error('Error:', error);
        alert('Error en el inicio de sesión. Por favor, intente nuevamente.');
    }
});
