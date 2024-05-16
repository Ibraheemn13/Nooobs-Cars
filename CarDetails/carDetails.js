document.addEventListener('DOMContentLoaded', () => {
    const carId = getCarIdFromURL(); // Assume you have a function to get the car ID from the URL

    fetch(`/api/cars/${carId}`)
        .then(response => response.json())
        .then(car => {
            if (car) {
                updateCarDetails(car);
            } else {
                console.error('Car details not found');
            }
        })
        .catch(error => console.error('Error fetching car details:', error));
});

function getCarIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id'); // Adjust according to how your URL is structured
}

function updateCarDetails(car) {
    // Update main image
    const mainImage = document.querySelector('.main-image');
    mainImage.src = `data:${car.Image1.contentType};base64,${arrayBufferToBase64(car.Image1.data.data)}`;
    
    // Update side images
    const sideImages = document.querySelectorAll('.small-image');
    if (car.Image2) {
        sideImages[0].src = `data:${car.Image2.contentType};base64,${arrayBufferToBase64(car.Image2.data.data)}`;
    }
    if (car.Image3) {
        sideImages[1].src = `data:${car.Image3.contentType};base64,${arrayBufferToBase64(car.Image3.data.data)}`;
    }
    if (car.Image4) {
        sideImages[2].src = `data:${car.Image4.contentType};base64,${arrayBufferToBase64(car.Image4.data.data)}`;
    }
    if (car.Image5) {
        sideImages[3].src = `data:${car.Image5.contentType};base64,${arrayBufferToBase64(car.Image5.data.data)}`;
    }

    // Update description
    const descriptionElement = document.querySelector('.description-container p');
    descriptionElement.textContent = car.Description;

    // Update other car details
    document.querySelector('h3').textContent = car.CarName;
    document.querySelector('h5').textContent = car.ModelYear;
}

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}
