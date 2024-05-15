document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/users')
        .then(response => response.json())
        .then(users => {
            const table = document.getElementById('myTable');

            users.forEach((user, index) => {
                const row = document.createElement('tr');

                const idCell = document.createElement('td');
                idCell.textContent = index + 1;
                row.appendChild(idCell);

                const nameCell = document.createElement('td');
                nameCell.textContent = user.Name;
                row.appendChild(nameCell);

                const emailCell = document.createElement('td');
                emailCell.textContent = user.Email;
                row.appendChild(emailCell);

                const passwordCell = document.createElement('td');
                passwordCell.textContent = user.Password;
                row.appendChild(passwordCell);

                const updatesCell = document.createElement('td');
                updatesCell.textContent = user.Updates ? '1' : '0';
                row.appendChild(updatesCell);

                const createdAtCell = document.createElement('td');
                createdAtCell.textContent = new Date(user.CreatedAt).toISOString();
                row.appendChild(createdAtCell);

                table.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching users:', error));
});
