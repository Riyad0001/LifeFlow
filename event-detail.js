const token = localStorage.getItem('token');
        if (!token) window.location.href = 'login.html';

        async function loadEventDetails() {
            const eventId = new URLSearchParams(window.location.search).get('eventId');
            if (!eventId) {
                document.getElementById('errorMessage').textContent = 'Event ID is missing';
                document.getElementById('errorMessage').style.display = 'block';
                return;
            }

            document.getElementById('loading').style.display = 'block';
            document.getElementById('eventDetails').innerHTML = '';
            document.getElementById('errorMessage').style.display = 'none';

            try {
                const response = await fetch(`https://blood-donation-awo3.onrender.com/api/events/${eventId}/`, {
                    headers: { 'Authorization': `Token ${token}` }
                });
                if (!response.ok) throw new Error(`Event not found: ${response.status}`);
                const event = await response.json();
                displayEventDetails(event);
            } catch (error) {
                document.getElementById('errorMessage').textContent = error.message;
                document.getElementById('errorMessage').style.display = 'block';
            } finally {
                document.getElementById('loading').style.display = 'none';
            }
        }

        function displayEventDetails(event) {
            const eventDetailsCard = `
                <div class="card-body">
                    <h3 class="card-title">${event.title}</h3>
                    <p class="card-text">${event.description}</p>
                    <p><strong>Blood Group Needed:</strong> ${event.blood_group_needed}</p>
                    <p><strong>Created by:</strong> ${event.creator}</p>
                    <p><strong>Status:</strong> ${event.is_active ? 'Active' : 'Inactive'}</p>
                    <p><strong>Date Created:</strong> ${new Date(event.created_at).toLocaleDateString()}</p>
                    <button class="btn btn-danger" onclick="openStatusModal(${event.id})">Accept</button>
                </div>
            `;
            document.getElementById('eventDetails').innerHTML = eventDetailsCard;
        }

        function openStatusModal(eventId) {
            const modal = new bootstrap.Modal(document.getElementById('statusModal'));
            modal.show();
            document.getElementById('statusForm').setAttribute('data-event-id', eventId);
        }

        async function updateEventStatus() {
            const eventId = document.getElementById('statusForm').getAttribute('data-event-id');
            const status = document.getElementById('statusSelect').value;

            try {
                const response = await fetch(`https://blood-donation-awo3.onrender.com/api/events/${eventId}/accept/`, {
                    method: 'POST',  
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ status: status })
                });

                if (!response.ok) throw new Error('Failed to update status');
                alert('Event status updated successfully!');
                location.reload();  
            } catch (error) {
                alert(error.message);
            }
        }

        loadEventDetails();