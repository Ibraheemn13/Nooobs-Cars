document.addEventListener('DOMContentLoaded', () => {
    console.log("here g")
    fetch('/api/cars')
        .then(response => response.json())
        .then(cars => {
            const table = document.getElementById('myTable').getElementsByTagName('tbody')[0];

            cars.forEach((car, index) => {
                const row = document.createElement('tr');

                const idCell = document.createElement('td');
                idCell.textContent = index + 1;
                row.appendChild(idCell);

                const nameCell = document.createElement('td');
                nameCell.textContent = car.CarName;
                row.appendChild(nameCell);

                const modelYearCell = document.createElement('td');
                modelYearCell.textContent = car.ModelYear;
                row.appendChild(modelYearCell);

                const descriptionCell = document.createElement('td');
                descriptionCell.textContent = car.Description;
                row.appendChild(descriptionCell);

                const deleteCell = document.createElement('td');
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => {
                    deleteCar(car._id, row);
                });
                deleteCell.appendChild(deleteButton);
                row.appendChild(deleteCell);

                table.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching cars:', error));
});

function deleteCar(carId, row) {
    fetch(`/api/cars/${carId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                row.remove();
                alert('Car deleted successfully');
            } else {
                console.error('Failed to delete car');
                alert('Failed to delete car');
            }
        })
        .catch(error => console.error('Error deleting car:', error));
}
