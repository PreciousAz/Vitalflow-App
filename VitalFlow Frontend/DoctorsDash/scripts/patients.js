
var appointmentList = [];

var entriesSelect = document.getElementById("entries");

var currentPage = 1;
var rowsPerPage = parseInt(entriesSelect.value);

function renderTable(data, page = 1) {
    const tableBody = document.getElementById("patientTableBody");
    tableBody.innerHTML = "";
    const start = (page - 1) * rowsPerPage;
    const paginatedItems = data.slice(start, start + rowsPerPage);

    paginatedItems.forEach((patient) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${patient.name}</td>
      <td>${patient.date}</td>
      <td>${patient.gender}</td>
      <td>${patient.disease}</td>
      <td><button class="actions" data-request='${JSON.stringify(patient)}' onclick="openModal(this)"><i class="bi bi-three-dots-vertical"></i></button></td>
    `;
        tableBody.appendChild(tr);
    });
    /*  <td>${patient.payment}</td> */

    renderPagination(data.length);
}

async function fetchAppointmentsByUser() {
    const user = JSON.parse(localStorage.getItem(stringStore.loginuserkey));
    if (user) {
        try {
            const response = await fetch(`${globalVariables.apiUrl}appointment/doctor/${user.id}/user`);
            const appointments = await response.json();
            if (appointments.success) {
                //console.log('appointments', appointments);
                appointmentList = appointments.data.filter(appointment => appointment.status === "accepted");
                loadAppointments(appointmentList)
                //console.log('patientsList', appointmentList);
            } else {
                console.error("Failed to fetch appointments:", appointments.message);
            }
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    }
}

function renderPagination(totalItems) {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";
    const pageCount = Math.ceil(totalItems / rowsPerPage);
    for (let i = 1; i <= pageCount; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        if (i === currentPage) btn.classList.add("active");
        btn.onclick = () => {
            currentPage = i;
            renderTable(filteredPatients, currentPage);
        };
        pagination.appendChild(btn);
    }
}

var filteredPatients = [...patients];

document.getElementById("searchInput").addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();
    filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.gender.toLowerCase().includes(term) ||
        p.disease.toLowerCase().includes(term)
    );
    currentPage = 1;
    renderTable(filteredPatients, currentPage);
});

document.getElementById("entries").addEventListener("change", () => {
    rowsPerPage = parseInt(entriesSelect.value);
    currentPage = 1;
    renderTable(filteredPatients, currentPage);
});


function openModal(button) {
    const btn = button;
    const requestData = JSON.parse(btn.getAttribute('data-request'));
    document.getElementById('patientModal').style.display = 'flex';
    console.log('data request', requestData);
}

function closeModal() {
    document.getElementById('patientModal').style.display = 'none';
}

function switchTab(event, tabId) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));

    event.currentTarget.classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

function openAddPatientModal() {
    document.getElementById("addPatientModal").style.display = "flex";
}

function closeAddPatientModal() {
    document.getElementById("addPatientModal").style.display = "none";
}

async function loadAppointments(list) {
    const dropdown = document.getElementById('userSelect');
    dropdown.innerHTML = '<option value="" disabled selected>Select a user</option>';

    list.forEach(app => {
        const option = document.createElement('option');
        option.value = app.id;
        option.textContent = `${app.name} - ${getGenderName(app.gender)}`;
        dropdown.appendChild(option);
    });
}

document.getElementById('userSelect').addEventListener('change', function () {
    const error = document.getElementById("error")
    error.style.display = 'none';
});

function submitPatientForm(event) {
    event.preventDefault();

}

document.getElementById('addPatientForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const button = this;
    const fields = [
        { id: 'disease', name: 'Disease' },
        { id: 'reason', name: 'Reason' },
        { id: 'blood', name: 'Blood Group' }
    ];
    const user = JSON.parse(localStorage.getItem(stringStore.loginuserkey));

    const selectedUser = document.getElementById("userSelect").value;
    const disease = document.getElementById("disease").value;
    const bloodGroup = document.getElementById("blood").value;
    const reason = document.getElementById("reason").value

    let valid = true;

    if (!selectedUser) {
        const error = document.getElementById("error")
        error.textContent = `User selection is required`;
        error.style.display = 'block';
        valid = false;
        return;
    }

    fields.forEach(field => {
        const input = document.getElementById(field.id);
        const error = input.nextElementSibling;
        input.classList.remove('invalid');
        error.style.display = 'none';
        error.textContent = '';

        if (!input.value.trim()) {
            error.textContent = `${field.name} is required`;
            error.style.display = 'block';
            input.classList.add('invalid');
            valid = false;
        }
    });

    if (valid) {
        try {
            button.classList.add("loading");
            button.disabled = true;
            const appointmnet = appointmentList.find(x => x.id === selectedUser);
            if (appointmnet) {
                const response = await fetch(`${globalVariables.apiUrl}auth/signup`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        user_id: appointmnet.user_id,
                        date: new Date().toISOString(),
                        reason: reason,
                        doctor_id: user.id,
                        email: appointmnet.email,
                        blood_group: bloodGroup,
                        name: appointmnet.name,
                        disease: disease,
                        gender: getGenderName(appointmnet.gender),
                    })
                });

                const result = await response.json();
                if (result.success) {
                    console.log(`You selected appointment ID: ${appointmnet.name}`, bloodGroup, disease, reason);
                    //closeAddPatientModal();
                    //this.reset();
                }

            }

        } catch (error) {

        }
    }
});

function getGenderName(gender) {
    if (gender === 'M')
        return 'Male';
    else if (gender === 'F')
        return 'Female';
    else return 'Other';
}

renderTable(filteredPatients, currentPage);
fetchAppointmentsByUser();
