

function renderAppointments(list) {
    const appointmentBody = document.getElementById("appointmentBody");
    appointmentBody.innerHTML = "";
    const status = true;
    list.forEach((a, index) => {
        const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${a.name}</td>
        <td>${a.reason}</td>
        <td>${a.date}</td>
        <td>${a.time}</td>
        <td>${a.gender}</td>
        <td>${a.type}</td>
        <td>${a.consultation}</td>
        <td class="status">${status ? `<button class="actions"  data-request='${JSON.stringify(a)}' onclick="openAppointmentModal(this)">Action</button>` : a.status}</td>
       </tr>
    `;
        appointmentBody.insertAdjacentHTML("beforeend", row);
    });
}

document.getElementById("searchInput").addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = appointments.filter(a =>
        a.name.toLowerCase().includes(query) ||
        a.date.toLowerCase().includes(query) ||
        a.gender.toLowerCase().includes(query)
    );
    renderAppointments(filtered);
});


function openAppointmentModal(button) {
    const btn = button;
    const requestData = JSON.parse(btn.getAttribute('data-request'));
    document.getElementById('appointmentModal').style.display = 'flex';
    console.log('data request', requestData);
}

function closeAppointmentModal() {
    document.getElementById('appointmentModal').style.display = 'none';
}

function acceptRequest() {
    alert('Appointment Accepted!');
    closeAppointmentModal();
}

function rejectRequest() {
    alert('Appointment Rejected!');
    closeAppointmentModal();
}

renderAppointments(appointments);
