document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('updateAdForm');
    form.addEventListener('submit', event => {
        event.preventDefault();
        
        const carId = document.getElementById('carId').value;
        const carName = document.getElementById('carName').value;
        const modelYear = document.getElementById('modelYear').value;
        const description = document.getElementById('description').value;

        fetch(`/api/cars/${carId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ CarName: carName, ModelYear: modelYear, Description: description }),
        })
        .then(response => response.json())
        .then(data => {
            if (data) {
                // Refresh the page or update the table row with new data
                location.reload(); // Simple approach to refresh the page
            } else {
                console.error('Error updating car:', data.message);
            }
        })
        .catch(error => console.error('Error updating car:', error));
    });
});
