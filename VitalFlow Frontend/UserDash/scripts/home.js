



/* function createDoctorCard(doc) {
  return `
    <div class="card">
      <h4>${doc.name}</h4>
      <p>${doc.role}</p>
      <button>${doc.bookings}</button>
    </div>
  `;
}

function createPrescriptionCard(prescription) {
  return `
    <div class="card">
      <h4>${prescription.title}</h4>
      <p>${prescription.date}</p>
      <button>Download</button>
    </div>
  `;
} */

function loadUserProfile() {
  const user = JSON.parse(localStorage.getItem(stringStore.loginuserkey));
  const splitName = user.name.split(" ");
  document.getElementById("dashName").textContent = getUserNameTitle(user.gender) + " " + splitName[0];
}

function navigateToBookingPage() {
  window.location.assign("/Explore/explore.html");
}

//document.getElementById("doctorsList").innerHTML = doctors.map(createDoctorCard).join("");
//document.getElementById("prescriptionsList").innerHTML = prescriptions.map(createPrescriptionCard).join("");
/* document.getElementById("bottomDoctors").innerHTML = createDoctorCard({ name: "Dr Anabel Franisi", role: "Cardiologist", bookings: "20 Bookings" }); */

async function loadUserAppointment() {
  const user = JSON.parse(localStorage.getItem(stringStore.loginuserkey));
  if (user) {
    try {
      const response = await fetch(`${globalVariables.apiUrl}appointment/user/${user.id}`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      if (result.success) {
        const appointments = result.data;
        document.getElementById("appoint").textContent = appointments.length;
      }

    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  }
}

// Function to render cards
function renderCards(data, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  if (data.length === 0) {
    container.innerHTML = "<p>No data available</p>";
  } else {
    data.forEach(item => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
      <div class="card-content">
       <img src="http://localhost:8000${item.profile_image_url}" alt="${item.profession}">
        <div>
        <h3>${item.doctor_name}</h3>
        <p>${item.doctor_specialties}</p>
        </div>
        <span class="badge-home">${item.total_appointments} Bookings</span>
      </div>
    `;
      container.appendChild(card);
    });
  }
}

function renderPrescriptionCards(data, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  data.forEach(item => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="card-content">
       <div class="icon-div-home"><i class="bi bi-file-earmark"></i></div>
        <div>
        <h3>${item.name}</h3>
        <p>${item.date}</p>
        </div>
       <button class="actions-home"  data-request='${JSON.stringify(item)}' onclick="downloadPrescription(this)">
        <i class="bi bi-download"></i>
       </button>
       </div>
    `;
    container.appendChild(card);
  });
}

function downloadPrescription(button) {
  const btn = button;
  const requestData = JSON.parse(btn.getAttribute('data-request'));
  alert("Download Prescription for " + requestData.name);
  // Here you can implement the logic to download the prescription
}

async function fetchAppointmentsByDoctors() {
  const user = JSON.parse(localStorage.getItem(stringStore.loginuserkey));
  if (user) {
    try {
      const response = await fetch(`${globalVariables.apiUrl}appointment/user/${user.id}/doctor`);
      const appointments = await response.json();
      if (appointments.success) {
        renderCards(appointments.data, "doctorsList");
      } else {
        console.error("Failed to fetch appointments:", appointments.message);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  }
}

function getUserNameTitle(gender) {
  if (gender === 'M')
    return 'Mr.';
  else if (gender === 'F')
    return "Miss."
  else return '';
}

// Render data
loadUserProfile();
loadUserAppointment();
renderPrescriptionCards(prescriptionsList, "prescriptionsList");
fetchAppointmentsByDoctors();