document.addEventListener('DOMContentLoaded', function() {

    const freeEstimateButton = document.querySelector('#free-bttn');
    if(freeEstimateButton){
        freeEstimateButton.addEventListener('click', function(){
            window.location.href = '../public/appointments.html';
        });
    }

    const mapContainer = document.querySelector('#map');
    if (mapContainer) {
        initMap();
    }

    const form = document.querySelector('#appointmentForm');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const name = document.querySelector('#name').value;
            const email = document.querySelector('#email').value;
            const phone = document.querySelector('#phone').value;
            const date = document.querySelector('#date').value;
            const time = document.querySelector('#time').value;         
            
            form.reset();

            fetch('http://localhost:5555/send-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, phone, date, time })
            })
            .then(response => {
                return response.text().then(text => {
                    console.log('Response text:', text);
                    return { text, response };
                });
            })
            .then(({ text, response }) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return JSON.parse(text); 
            })
            .then(data => {
                if (data.success) {
                    console.log('SMS enviado exitosamente');
                } else {
                    console.error('Error al enviar el SMS:', data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }

    mostrarModales();

    const commentForm = document.querySelector('#commentForm');
    if (commentForm) {
        commentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.querySelector('#name').value;
            const comment = document.querySelector('#comment').value;
            const rating = document.querySelector('input[name="rating"]:checked').value;
            
            const response = await fetch('http://localhost:5555/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name, comment, rating})
            });
        
            const result = await response.json();
            if (result.success) {
                
                loadComments();
                commentForm.reset();
            } else {
                alert('Error al enviar el comentario.');
            }
        });

        loadComments();
    }
});

function mostrarModales() {
    const services = document.querySelectorAll('.servicios');
    services.forEach(servicio => {
        servicio.addEventListener('click', function() {
            const imgSrc = this.getAttribute('data-img');
            const textContent = this.getAttribute('data-text');
            crearModal(imgSrc, textContent);
        });
    });
}

function crearModal(imgSrc, textContent) {
    const imagen = document.createElement('IMG');
    imagen.src = imgSrc;
    imagen.alt = 'detail-service';

    const parrafo = document.createElement('P');
    parrafo.classList.add('parrafo-modal-bodyShop');
    parrafo.textContent = textContent;

    const modal = document.createElement('DIV');
    modal.classList.add('modal');

    const cerrarBtnModal = document.createElement('BUTTON');
    cerrarBtnModal.classList.add('btn-cerrar');
    cerrarBtnModal.textContent = 'X';

    cerrarBtnModal.onclick = cerrarModal;

    modal.appendChild(imagen);
    modal.appendChild(parrafo);
    document.body.appendChild(modal);
    const body = document.querySelector('body');
    body.classList.add('overflow-hidden');
    modal.appendChild(cerrarBtnModal);
}

function cerrarModal() {
    const modal = document.querySelector('.modal');
    modal.classList.add('fade-out');

    setTimeout(() => {
        const body = document.querySelector('body');
        body.classList.remove('overflow-hidden');
        modal?.remove();
    }, 500);
}

function initMap() {
    fetch('http://localhost:5555/api-key')
        .then(response => response.text())
        .then(text => {
            console.log('Respuesta del servidor:', text);
            const data = JSON.parse(text);
            const apiKey = data.apiKey;

            if (!apiKey) {
                throw new Error('API KEY is Missing!!!');
            }

            const script = document.createElement('SCRIPT');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=loadMap&v=weekly&libraries=marker`;
            script.defer = true;
            document.head.appendChild(script);
        })
        .catch (error => {
            console.log('Error fetching API KEY: ', error);
        });
}

function loadMap() {
    try {
        const position = { lat: 37.30510378965549, lng: -121.87813859888445 };

        console.log('Inicializando mapa con la ubicación:', position);

        const map = new google.maps.Map(document.querySelector('#map'), {
            zoom: 15,
            center: position,
            mapId: "DEMO_MAP_ID",
        });

        const marker = new google.maps.marker.AdvancedMarkerElement({
            map,
            position: position,
            title: 'Reyes AutoRepair',
        });

        console.log('Mapa y marcador inicializados correctamente');
    } catch (error) {
        console.error('Error al inicializar el mapa:', error);
    }
}

async function loadComments() {
    const response = await fetch('http://localhost:5555/comments');
    const comments = await response.json();
    console.log(comments);

    const commentsDiv = document.querySelector('#comments');
    commentsDiv.innerHTML = '';
    let totalRating = 0;
    comments.forEach(comment => {
        totalRating += comment.rating;
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');
        commentElement.innerHTML = `
            <h3>${comment.name}</h3>
            <p>${comment.comment}</p>
            <p>Rating: ${'&#9733;'.repeat(comment.rating)}</p>
        `;
        commentsDiv.appendChild(commentElement);
    });
    const averageRating = (totalRating / comments.length).toFixed(1);
    const averageRatingElement = document.createElement('div');
    averageRatingElement.classList.add('average-rating');
    averageRatingElement.innerHTML = `
        <h3>Average Rating</h3>
        <p>${averageRating} out of 5</p>
        <p>${'&#9733;'.repeat(Math.round(averageRating))}</p>
    `;
    commentsDiv.insertBefore(averageRatingElement, commentsDiv.firstChild);
}
