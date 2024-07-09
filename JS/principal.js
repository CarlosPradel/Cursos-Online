document.addEventListener('DOMContentLoaded', function() {
    // Carrusel de imágenes
    let slideIndex = 0;
    const slides = document.querySelectorAll('.carousel-image');
    const totalSlides = slides.length;

    function showSlide(index) {
        if (index >= totalSlides) slideIndex = 0;
        if (index < 0) slideIndex = totalSlides - 1;

        // Ocultar todas las imágenes
        slides.forEach(slide => {
            slide.style.display = 'none';
        });

        // Mostrar la imagen actual
        slides[slideIndex].style.display = 'block';
    }

    // Cambiar slide
    function moveSlide(step) {
        slideIndex += step;
        showSlide(slideIndex);
    }

    // Eventos para botones de control del carrusel
    document.querySelector('.next').addEventListener('click', () => moveSlide(1));
    document.querySelector('.prev').addEventListener('click', () => moveSlide(-1));

    // Cambio automático de slides
    setInterval(() => moveSlide(1), 5000);  // Cambia cada 5 segundos

    // Inicializar el primer slide
    showSlide(slideIndex);

    checkAuthentication();
    loadCourses();

    // Manejar clics en botones de 'Más Información' de cursos
    const infoButtons = document.querySelectorAll('.btn');

    infoButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            alert("Más información sobre el curso: " + this.parentNode.querySelector('h3').innerText);
        });
    });
});

function checkAuthentication() {
    const token = localStorage.getItem('token');
    const userInfoDiv = document.getElementById('usuarioInfo');
    const authButtons = document.querySelector('.auth-buttons');

    if (token) {
        fetch('http://localhost:3000/api/usuarios/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(user => {
            if (user) {
                userInfoDiv.innerHTML = `<p>Bienvenido, ${user.nombre}</p>`;
                authButtons.style.display = 'none';
            } else {
                userInfoDiv.innerHTML = '';
                authButtons.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            userInfoDiv.innerHTML = '';
            authButtons.style.display = 'block';
        });
    } else {
        userInfoDiv.innerHTML = '';
        authButtons.style.display = 'block';
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
        const courseList = document.querySelector('.course-list');
        courseList.innerHTML = ''; // Limpiar la lista antes de añadir cursos
        courses.forEach(course => {
            const courseElement = document.createElement('div');
            courseElement.classList.add('course');
            courseElement.innerHTML = `
                <img src="${course.imagen}" alt="Imagen del curso">
                <h3>${course.titulo}</h3>
                <p>${course.descripcion}</p>
                <a href="#" class="btn">Más Información</a>
            `;
            courseList.appendChild(courseElement);
        });
    })
    .catch(error => {
        console.error('Error al cargar los cursos:', error);
    });
}
