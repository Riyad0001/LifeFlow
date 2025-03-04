const token = localStorage.getItem('token');

const currentPage = window.location.pathname.split("/").pop();

const navItems = document.getElementById('nav-items');

let additionalLinks = "";
if (currentPage === "index.html") {
  additionalLinks = `
    <li class="nav-item"><a class="nav-link" href="#mission">Mission</a></li>
    <li class="nav-item"><a class="nav-link" href="#vision">Vision</a></li>
    <li class="nav-item"><a class="nav-link" href="#benefits">Benefits</a></li>
    <li class="nav-item"><a class="nav-link" href="#testimonials">Testimonials</a></li>
    <li class="nav-item"><a class="nav-link" href="#faq">FAQ</a></li>
  `;
}

if (token) {
  navItems.innerHTML = `
    <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
    <li class="nav-item"><a class="nav-link" href="profile.html">Profile</a></li>
    <li class="nav-item"><a class="nav-link" href="events.html">Events</a></li>
    <li class="nav-item"><a class="nav-link" href="dashboard.html">Dashboard</a></li>
    <li class="nav-item"><a class="nav-link" href="createE.html">Create Blood Request</a></li>
    <li class="nav-item"><a class="nav-link" href="#" onclick="logout()">Logout</a></li>
    ${additionalLinks} <!-- Ensures additional links are included only if on index.html -->
  `;
} else {
  navItems.innerHTML = `
    <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
    ${additionalLinks} <!-- Ensures additional links are included only if on index.html -->
    <li class="nav-item"><a class="nav-link" href="about.html">About</a></li>
    <li class="nav-item"><a class="nav-link" href="register.html">Sign Up</a></li>
    <li class="nav-item"><a class="nav-link" href="login.html">Login</a></li>
  `;
}


 async function loadEvents() {
   if (!token) {
     document.getElementById('errorMessage').textContent = "Please login to view events.";
     document.getElementById('errorMessage').style.display = 'block';
     return;
   }
   
   document.getElementById('loading').style.display = 'block';
   document.getElementById('eventsContainer').innerHTML = '';
   document.getElementById('errorMessage').style.display = 'none';

   const bloodGroup = document.getElementById('bloodGroupFilter').value;
   const searchUser = document.getElementById('searchUser').value;
   let apiUrl = 'https://blood-donation-awo3.onrender.com/api/events/';
   const params = new URLSearchParams();
   if (bloodGroup) params.append('blood_group_needed', bloodGroup);
   if (searchUser) params.append('creator', searchUser);
   if (params.toString()) apiUrl += '?' + params.toString();

   try {
     const response = await fetch(apiUrl, { headers: { 'Authorization': `Token ${token}` } });
     if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
     const events = await response.json();
     displayEvents(events);
   } catch (error) {
     console.error("Error fetching events:", error);
     document.getElementById('errorMessage').textContent = error.message;
     document.getElementById('errorMessage').style.display = 'block';
   } finally {
     document.getElementById('loading').style.display = 'none';
   }
 }

 function displayEvents(events) {
   const container = document.getElementById('eventsContainer');
   container.innerHTML = '';
   if (events.length === 0) {
     container.innerHTML = `<div class='alert alert-info'>No matching events found</div>`;
     return;
   }
   events.forEach(event => {
     const eventCard = `
       <div class="col-md-6">
         <div class="card event-card">
           <div class="card-body">
             <h5 class="card-title">${event.title}</h5>
             <p class="card-text">${event.description}</p>
             <p><strong>Blood Group Needed:</strong> ${event.blood_group_needed}</p>
             <button class="btn btn-primary" onclick="viewDetails(${event.id})">Details</button>
             <button class="btn btn-danger" onclick="openStatusModal(${event.id})">Accept</button>
           </div>
         </div>
       </div>`;
     container.innerHTML += eventCard;
   });
 }

 function openStatusModal(eventId) {
   document.getElementById('eventId').value = eventId;
   new bootstrap.Modal(document.getElementById('statusModal')).show();
 }

 function viewDetails(eventId) {
   window.location.href = `event-detail.html?eventId=${eventId}`;
 }

 async function updateEventStatus(eventId) {
   const status = document.getElementById('status').value;
   const requestBody = JSON.stringify({ status: status });

   try {
     const response = await fetch(`https://blood-donation-awo3.onrender.com/api/events/${eventId}/accept/`, {
       method: 'POST',
       headers: {
         'Authorization': `Token ${token}`,
         'Content-Type': 'application/json',
       },
       body: requestBody,
     });

     if (response.ok) {
       alert("Event status updated successfully!");
       new bootstrap.Modal(document.getElementById('statusModal')).hide();
       loadEvents();
     } else {
       alert('Error updating event.');
     }
   } catch (error) {
     alert('Failed to update event.');
     console.error(error);
   }
 }

 document.getElementById('statusForm').addEventListener('submit', function(event) {
   event.preventDefault();
   const eventId = document.getElementById('eventId').value;
   updateEventStatus(eventId);
 });

 function logout() {
   fetch('https://blood-donation-awo3.onrender.com/api/auth/logout', {
     method: 'GET',
     headers: {
       'Authorization': `Token ${token}`
     }
   })
   .finally(() => {
     localStorage.removeItem('token');
     window.location.href = 'login.html';
   });
 }

 loadEvents();