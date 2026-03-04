
function renderPatientCards(data) {
    const container = document.getElementById("patientsToday");
    container.innerHTML = "";
    if (data.length === 0) {

        container.innerHTML = `
        <h3>Your Patients Today</h3>
        <p>No data available</p>` ;
    } else {
        data.forEach((item, index) => {
            const patCard = document.createElement("div");
            patCard.classList.add("patient");
            if (index === 0) patCard.classList.add("selected");
            patCard.innerHTML = `
                 <img src="http://localhost:8000${item.purl}" alt="Patient" />
                    <div>
                        <p class="name">${item.name}</p>
                        <small>Diagnosis: Aortic Dissec</small>
                        <p class="status ongoing">Ongoing</p>
                    </div>
            `;
            container.appendChild(patCard);
        });
    }
}

async function loadUserAllMessages(userId) {
    try {
        const response = await fetch(`${globalVariables.apiUrl}chat/all/${userId}`);
        const chats = await response.json();
        if (chats.success) {
            const tmpList = chats.data;
            const chatList = tmpList.filter(x => x.receiver_id === userId && x.is_read == 0);
            document.getElementById("messCount").textContent = chatList ? chatList.length : 0;
        }
    } catch (error) {
        console.error("Error loading user profile:", error);
    }
}

async function loadUserProfile() {
    const user = JSON.parse(localStorage.getItem(stringStore.loginuserkey));
    const chatList = JSON.parse(localStorage.getItem(stringStore.chatListKey));
    const splitName = user.name.split(" ");
    document.getElementById("dashName").textContent = splitName[0] + " " + splitName[1];
    //document.getElementById("messCount").textContent = chatList ? chatList.length : 0;
    await loadUserAllMessages(user.id)

}

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
                console.log("Appointments home:", appointments);
                document.getElementById("appoint").textContent = appointments.length;
            }

        } catch (error) {
            console.error("Error loading user profile:", error);
        }
    }
}

async function fetchAppointmentsByUser() {
    const user = JSON.parse(localStorage.getItem(stringStore.loginuserkey));
    if (user) {
        try {
            const response = await fetch(`${globalVariables.apiUrl}appointment/doctor/${user.id}/user`);
            const appointments = await response.json();
            if (appointments.success) {
                console.log('appointments', appointments);
                const patientsList = appointments.data.filter(appointment => appointment.status === "accepted");
                document.getElementById("patientCount").textContent = patientsList.length || 0;
                renderPatientCards(patientsList);
            } else {
                console.error("Failed to fetch appointments:", appointments.message);
            }
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    }
}


function initLineChart() {
    const ctx1 = document.getElementById('lineChart').getContext('2d');
    new Chart(ctx1, {
        type: 'line',
        data: {
            labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
            datasets: [
                {
                    label: 'Incomes',
                    data: [10, 12, 14, 15, 17, 18, 20, 22, 23, 25, 27, 26],
                    borderColor: 'green',
                    fill: false
                },
                {
                    label: 'Expenses',
                    data: [20, 19, 18, 17, 16, 15, 15, 15, 14, 13, 12, 11],
                    borderColor: 'red',
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            plugins: { legend: { position: 'top' } }
        }
    });
}


// Donut Chart
function initDonutChart() {
    const ctx2 = document.getElementById('donutChart').getContext('2d');
    new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: ['Diabetes', 'Aortic Dissection', 'Arrhythmia'],
            datasets: [{
                label: 'Diagnosis',
                data: [40, 30, 30],
                backgroundColor: ['#2c7cf4', '#28a745', '#ffc107'],
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            cutout: '70%'
        }
    });
}

function initSocketListner() {
    socket.on("newMessage", async (msg) => {
        //console.log("📩 New message:", msg);
        // Show notification in app
        try {
            const response = await fetch(`${globalVariables.apiUrl}chat/all/${userId}`);
            const chats = await response.json();
            if (chats.success) {
                const tmpList = chats.data;
                const chatList = tmpList.filter(x => x.receiver_id === userId && x.is_read == 0);
                document.getElementById("messCount").textContent = chatList ? chatList.length : 0;
            }
        } catch (error) {
            console.error("Error loading user profile:", error);
        }
    });
}

//initLineChart();
//initDonutChart();
loadUserProfile();
loadUserAppointment();
fetchAppointmentsByUser();
initSocketListner();
