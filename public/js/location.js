

// --.--- next code

// async function getApiKey() {
//     const response = await fetch('/api-key');
//     const data = await response.json();
//     return data.apiKey;
// }

// async function initMap() {
//     const apiKey = await getApiKey();
//     const script = document.createElement('script');
//     script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMapCallback`;
//     script.async = true;
//     document.head.appendChild(script);
// }

// function initMapCallback() {
//     const negocio = { lat: 40.712776, lng: -74.005974 };
//     const map = new google.maps.Map(document.getElementById('map'), {
//         zoom: 15,
//         center: negocio,
//     });
//     const marker = new google.maps.Marker({
//         position: negocio,
//         map: map,
//     });
// }

// document.addEventListener('DOMContentLoaded', initMap);
