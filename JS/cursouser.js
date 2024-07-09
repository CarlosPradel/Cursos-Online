document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    loadCourses();

    function checkAuthentication() {
        const token = localStorage.getItem('token');
        const authLinks = document.querySelector('.auth-links');
        const userInfoDiv = document.querySelector('.user-info');
        const userNameSpan = document.getElementById('user-name');

        if (token) {
            fetch('http://localhost:3000/api/usuarios/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(user => {
                if (user) {
                    userNameSpan.textContent = `Bienvenido, ${user.nombre}`;
                    authLinks.style.display = 'none';
                    userInfoDiv.style.display = 'block';
                } else {
                    authLinks.style.display = 'block';
                    userInfoDiv.style.display = 'none';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                authLinks.style.display = 'block';
                userInfoDiv.style.display = 'none';
            });
        } else {
            authLinks.style.display = 'block';
            userInfoDiv.style.display = 'none';
        }
    }

    function loadCourses() {
        fetch('http://localhost:3000/api/cursos', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => response.json())
        .then(courses => {
            const courseList = document.getElementById('course-list');
            courseList.innerHTML = ''; // Limpiar la lista antes de añadir cursos
            courses.forEach(course => {
                const courseElement = document.createElement('li');
                courseElement.classList.add('contenidoPrincipal-cursos-link');
                courseElement.innerHTML = `<a href="detalle.html?id=${course.id}">${course.titulo}</a>`;
                courseList.appendChild(courseElement);
            });
        })
        .catch(error => {
            console.error('Error al cargar los cursos:', error);
        });
    }

    window.logout = function() {
        localStorage.removeItem('token');
        window.location.reload();
    };
});
