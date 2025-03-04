async function loadDonations() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        const response = await fetch('https://blood-donation-awo3.onrender.com/api/donations/', {
            headers: { 'Authorization': `Token ${token}` }
        });

        if (!response.ok) {
            throw new Error('Failed to load donation history');
        }

        const donations = await response.json();

        // Categorize donations
        const pending = donations.filter(d => d.status === 'Pending');
        const completed = donations.filter(d => d.status === 'Completed');
        const cancelled = donations.filter(d => d.status === 'Cancelled');

        // Update UI
        document.getElementById('pendingCount').innerHTML = pending.length > 0 
            ? `<h6>${pending.length} Pending Request(s)</h6>`
            : '<p class="text-muted">No pending requests.</p>';

        document.getElementById('completedCount').innerHTML = completed.length > 0 
            ? `<h6>${completed.length} Completed Request(s)</h6>`
            : '<p class="text-muted">No completed requests.</p>';

        document.getElementById('cancelledCount').innerHTML = cancelled.length > 0 
            ? `<h6>${cancelled.length} Cancelled Request(s)</h6>`
            : '<p class="text-muted">No cancelled requests.</p>';

    } catch (error) {
        alert(error.message);
    }
}

loadDonations();