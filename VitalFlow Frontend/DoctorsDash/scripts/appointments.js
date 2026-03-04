
var appiontmentList = [];
var selectedAppointment = null;

function renderAppointments(list) {
    const appointmentBody = document.getElementById("appointmentBody");
    appointmentBody.innerHTML = "";
    console.log('list', list)
    if (list.length === 0) {
        appointmentBody.innerHTML = `
        <tr></tr>
            <td colspan="9" class="text-center">No appointments found</td>
        </tr>
        `;
    } else {
        list.forEach((a, index) => {
            const status = a.status === 'pending';
            const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${a.name}</td>
        <td>${shortenText(a.reason, 7)}</td>
        <td>${formatDate(a.date)}</td>
        <td>${a.time}</td>
        <td>${getGenderName(a.gender)}</td>
        <td>${a.appointment}</td>
        <td>${a.consultation}</td>
        <td class="${a.status === 'accepted' ? 'accept' : a.status === 'rejected' ? 'reject' : 'status'}">${status ? `<button class="${a.status === 'accepted' ? 'accept' : a.status === 'accepted' ? 'reject' : 'actions'}"  data-request='${JSON.stringify(a)}' onclick="openAppointmentModal(this)">Action</button>` : a.status}</td>
       </tr>
    `;
            appointmentBody.insertAdjacentHTML("beforeend", row);
        });
    }

}

document.getElementById("searchInput").addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = appiontmentList.filter(a =>
        a.name.toLowerCase().includes(query) ||
        formatDate(a.date).toLowerCase().includes(query) ||
        getGenderName(a.gender).toLowerCase().includes(query)
    );
    renderAppointments(filtered);
});


function openAppointmentModal(button) {
    const btn = button;
    const requestData = JSON.parse(btn.getAttribute('data-request'));
    selectedAppointment = requestData;
    document.getElementById("modProfileImage").src = requestData.purl ? `http://localhost:8000${requestData.purl}` : "/Assets/images/user.png";
    document.getElementById("modName").innerText = requestData.name || "-";
    document.getElementById("phone").textContent = requestData.phone || "-";
    document.getElementById("email").textContent = requestData.email || "-";
    document.getElementById("reason").innerText = requestData.reason || "-";
    document.getElementById("gender").textContent = getGenderName(requestData.gender);
    document.getElementById("dob").textContent = requestData.dob ? formatDate(requestData.dob) : "-";
    document.getElementById("age").textContent = `${calculateAge(requestData.dob)} Years` || "-";
    document.getElementById("date").textContent = `${formatDate(requestData.date)}, ${requestData.time}`;
    document.getElementById("appoint").textContent = requestData.appointment || "-";
    document.getElementById("consult").textContent = requestData.consultation || "-";
    document.getElementById('appointmentModal').style.display = 'flex';
}

function closeAppointmentModal() {
    document.getElementById('appointmentModal').style.display = 'none';
}

async function acceptRequest(button) {
    const btn = button;
    try {
        btn.textContent = 'Processing';
        const status = 'accepted'
        const response = await fetch(`${globalVariables.apiUrl}appointment/${selectedAppointment.id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ status })
        });
        const result = await response.json();
        if (result.success) {
            const messageSent = await sendMessage(selectedAppointment.user_id,selectedAppointment.reason);
            if (messageSent) {
                setTimeout(async () => {
                    btn.textContent = 'Accepted';
                    await showDialog(result.message, 'Okay', '');
                    appiontmentList = appiontmentList.map(appoint => {
                        if (appoint.id === selectedAppointment.id) {
                            return { ...appoint, status: 'accepted' };
                        }
                        return appoint;
                    });
                    renderAppointments(appiontmentList);
                    //console.log('after rendering', appiontmentList)
                    closeAppointmentModal();
                }, 3000)
            } else {
                btn.textContent = 'Accept';
                await showDialog('Unble to complete request, please try again later', 'Okay', '');
            }

        } else {
            setTimeout(async () => {
                btn.textContent = 'Accept';
                await showDialog(result.message, '', 'Dismiss');
            }, 3000)
        }
    } catch (error) {
        btn.textContent = 'Accept';
        console.error("Error:", error);
        await showDialog(error.message, '', 'Dismiss');
    }
}

async function sendMessage(userId,reason) {
    const user = JSON.parse(localStorage.getItem(stringStore.loginuserkey));
    const response = await fetch(`${globalVariables.apiUrl}chat/create`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            sender_id: user.id,
            receiver_id: userId,
            content: `Your Appointment For: ${reason}, has been accepted. Please review the details.`,
        })
    });
    const result = await response.json();
    return result.success;
}

async function rejectRequest(button) {
    const btn = button;
    try {
        btn.classList.add("loading");
        btn.disabled = true;
        const status = 'rejected'
        const response = await fetch(`${globalVariables.apiUrl}appointment/${selectedAppointment.id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ status })
        });
        const result = await response.json();
        if (result.success) {
            setTimeout(async () => {
                btn.classList.remove("loading");
                btn.disabled = false;
                await showDialog(result.message, 'Okay', '');
                appiontmentList = appiontmentList.map(appoint => {
                    if (appoint.id === selectedAppointment.id) {
                        return { ...appoint, status: 'rejected' };
                    }
                    return appoint;
                });
                renderAppointments(appiontmentList);
                //console.log('after rendering', appiontmentList)
                closeAppointmentModal();
            }, 3000)
        } else {
            setTimeout(async () => {
                btn.classList.remove("loading");
                btn.disabled = false;
                await showDialog(result.message, '', 'Dismiss');
            }, 3000)
        }
    } catch (error) {
        btn.classList.remove("loading");
        btn.disabled = false;
        console.error("Error:", error);
        await showDialog(error.message, '', 'Dismiss');
    }
}

async function fetchAppointmentsByUser() {
    const user = JSON.parse(localStorage.getItem(stringStore.loginuserkey));
    if (user) {
        try {
            const response = await fetch(`${globalVariables.apiUrl}appointment/doctor/${user.id}/user`);
           const appointments = await response.json();
            if (appointments.success) {
                appiontmentList = appointments.data;
                renderAppointments(appiontmentList);
                //console.log('appointments', appiontmentList);
            } else {
                console.error("Failed to fetch appointments:", appointments.message);
            }
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    }
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function getGenderName(gender) {
    if (gender === 'M')
        return 'Male';
    else if (gender === 'F')
        return 'Female';
    else return 'Other';
}

function shortenText(text, maxLength) {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

function calculateAge(birthDate) {
    if (!birthDate) return null; // Handle empty input

    const today = new Date();
    const birth = new Date(birthDate);

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    // Adjust if birthday hasn't happened yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
}

//renderAppointments(appointments);
fetchAppointmentsByUser();
