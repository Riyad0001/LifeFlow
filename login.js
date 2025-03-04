document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const credentials = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
    };

    try {
        const response = await fetch('https://blood-donation-awo3.onrender.com/api/auth/login/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(credentials)
        });

        if (!response.ok) throw new Error("Invalid username or password!");

        const data = await response.json();
        localStorage.setItem('token', data.token);

        // Show the alert
        if (confirm('Login successful! Please complete your profile.')) {
            window.location.href = 'profile.html'; // Redirect to profile page
        }
    } catch (error) {
        document.getElementById('error').textContent = error.message;
        document.getElementById('error').classList.remove('d-none');
    }
});