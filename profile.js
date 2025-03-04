document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('https://blood-donation-awo3.onrender.com/api/auth/profile/', {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error(await response.text());

        const profileData = await response.json();

        document.getElementById('userData').innerHTML = `
            <p>Welcome, ${profileData.first_name} ${profileData.last_name}</p>
            <p>Email: ${profileData.email}</p>
            <p>Blood Group: ${profileData.blood_group || 'Not provided'}</p>
            <p>Age: ${profileData.age || 'Not provided'}</p>
        `;
        document.getElementById('editProfileBtn').addEventListener('click', () => {
            document.getElementById('welcomeSection').style.display = 'none';
            document.getElementById('profileSection').style.display = 'block';

            document.getElementById('username').value = profileData.email;
            document.getElementById('firstName').value = profileData.first_name || '';
            document.getElementById('lastName').value = profileData.last_name || '';
            document.getElementById('address').value = profileData.address || '';
            document.getElementById('age').value = profileData.age || '';
            document.getElementById('bloodGroup').value = profileData.blood_group || '';
            document.getElementById('lastDonationDate').value = profileData.last_donation_date || '';
            document.getElementById('isAvailable').checked = profileData.is_available || false;
        });
    } catch (error) {
        document.getElementById('error').textContent = error.message;
        document.getElementById('error').classList.remove('d-none');
    }
});

// Handle profile update
document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        first_name: document.getElementById('firstName').value,
        last_name: document.getElementById('lastName').value,
        email: document.getElementById('username').value,
        age: document.getElementById('age').value,
        address: document.getElementById('address').value,
        blood_group: document.getElementById('bloodGroup').value,
        last_donation_date: document.getElementById('lastDonationDate').value,
        is_available: document.getElementById('isAvailable').checked,
    };

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://blood-donation-awo3.onrender.com/api/auth/profile/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error(await response.text());

        window.location.href = 'dashboard.html';
    } catch (error) {
        document.getElementById('error').textContent = error.message;
        document.getElementById('error').classList.remove('d-none');
    }
});