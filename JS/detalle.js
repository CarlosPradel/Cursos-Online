document.addEventListener('DOMContentLoaded', function() {
    const courseId = new URLSearchParams(window.location.search).get('id');
    const token = localStorage.getItem('token');
    const lessonsList = document.getElementById('lessons-list');
    const lessonDetail = document.getElementById('lesson-detail');
    const lessonTitle = document.getElementById('lesson-title');
    const lessonContent = document.getElementById('lesson-content');
    const lessonVideo = document.getElementById('lesson-video');
    const enrollButton = document.getElementById('enroll-button');
    const userInfo = document.querySelector('.user-info');
    const authLinks = document.querySelector('.auth-links');
    const userNameElement = document.getElementById('user-name');
    const logoutButton = document.getElementById('logout-button');

    if (!token) {
        authLinks.style.display = 'block';
        userInfo.style.display = 'none';
    } else {
        authLinks.style.display = 'none';
        userInfo.style.display = 'block';
        userNameElement.textContent = localStorage.getItem('username');
    }

    async function loadLessons() {
        if (!token) {
            alert('No se encontró el token de autenticación.');
            window.location.href = 'login.html';
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/lecciones?cursoId=${courseId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener las lecciones del curso.');
            }

            const lecciones = await response.json();
            lecciones.forEach(lesson => {
                const li = document.createElement('li');
                li.textContent = lesson.titulo;
                li.addEventListener('click', () => loadLessonDetails(lesson.id));
                lessonsList.appendChild(li);
            });

            // Verificar si el usuario está inscrito
            const inscritoResponse = await fetch(`http://localhost:3000/api/cursos/${courseId}/detalle`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (inscritoResponse.ok) {
                const { inscrito } = await inscritoResponse.json();
                if (!inscrito) {
                    enrollButton.style.display = 'block';
                }
            }
        } catch (error) {
            console.error('Error al cargar las lecciones del curso:', error);
            alert('Ocurrió un error al cargar las lecciones del curso.');
        }
    }

    async function loadLessonDetails(lessonId) {
        try {
            const response = await fetch(`http://localhost:3000/api/lecciones/${lessonId}/detalle`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener los detalles de la lección.');
            }

            const lesson = await response.json();
            lessonDetail.style.display = 'block';
            lessonTitle.textContent = lesson.titulo;
            lessonContent.textContent = lesson.contenido;
            if (lesson.tipo === 'video' && lesson.urlVideo) {
                const videoId = lesson.urlVideo.split('v=')[1];
                lessonVideo.src = `https://www.youtube.com/embed/${videoId}`;
                lessonVideo.style.display = 'block';
            } else {
                lessonVideo.style.display = 'none';
            }
        } catch (error) {
            console.error('Error al cargar los detalles de la lección:', error);
            alert('Ocurrió un error al cargar los detalles de la lección.');
        }
    }

    async function handleEnroll() {
        try {
            const response = await fetch(`http://localhost:3000/api/cursos/${courseId}/matricular`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al inscribirse en el curso.');
            }

            alert('Inscripción exitosa!');
            enrollButton.style.display = 'none';
            loadLessons(); // Recargar las lecciones del curso después de la inscripción
        } catch (error) {
            console.error('Error al inscribirse en el curso:', error);
            alert('Ocurrió un error al inscribirse en el curso.');
        }
    }

    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = 'login.html';
    }

    logoutButton.addEventListener('click', handleLogout);
    enrollButton.addEventListener('click', handleEnroll);

    loadLessons();
});

function goBack() {
    window.history.back();
}
