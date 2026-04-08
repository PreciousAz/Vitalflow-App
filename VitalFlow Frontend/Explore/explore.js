var doctorList = [];

document.querySelector('.filter-btn').addEventListener('click', () => {
    alert('Search clicked! You can integrate filtering logic here.');
});


async function GetProfiles() {
    const response = await fetch(`${globalVariables.apiUrl}pprofile/all`, { method: "GET", });
    const result = await response.json();
    if (!result.success) {
        console.error('Error fetching profiles:', result.message);
        return [];
    } else {
        doctorList = result.data.filter(x => x.completed === 1);
        if (doctorList.length === 0) return [];
        else return doctorList;
    }
}

function generateRandomRating(min = 1, max = 5, decimalPlaces = 1) {
    const random = Math.random() * (max - min) + min;
    return parseFloat(random.toFixed(decimalPlaces));
}

const labelCounter = document.getElementById("counter-lab");
const renderDoctors = (list) => {
    const container = document.getElementById("doctorList");
    container.innerHTML = ""; // Clear previous results
    list.forEach(doctor => {
        doctor = { ...doctor, rating: generateRandomRating() };
        const card = document.createElement("div");
        card.className = "doctor-card";
        card.innerHTML = `
      <img class="doctor-avatar" src="http://localhost:8000${doctor.purl}" alt="${doctor.name}">
      <div class="doctor-name">${doctor.name}</div>
      <div class="doctor-specialty"><span>${doctor.specialties}</span> <span class="avial-status">Availaible</span> </div>
      <div class="doctor-rating">⭐ ${doctor.rating} / 5</div>
      <button class="appointment-btn" data-request='${JSON.stringify(doctor)}' onclick="naviageToDetailsPage(this)">Book Appointment</button>
    `;
        container.appendChild(card);
    });
    labelCounter.innerText = `${list.length}`;
    if (list.length === 0) {
        document.getElementById("doctorList").innerHTML = "<p>No doctors found.</p>";
    }
};

//<div class="doctor-location">${doctor.location}</div>

const filterDoctors = () => {
    let nameQuery = document.getElementById("searchInput").value.toLowerCase();
    let selectedSpecs = Array.from(document.querySelectorAll('.speciality:checked')).map(e => e.value);
    let selectedGender = Array.from(document.querySelectorAll('.gender:checked')).map(e => e.value);
    let selectedAvail = Array.from(document.querySelectorAll('.availability:checked')).map(e => e.value);
    let maxPrice = document.getElementById("priceRange").value;

    const filtered = doctorList.filter(doc =>
        doc.name.toLowerCase().includes(nameQuery) &&
        (selectedSpecs.length === 0 || selectedSpecs.includes(doc.specialties)) &&
        (selectedGender.length === 0 || selectedGender.includes(getGenderName(doc.gender))) /* &&
        (selectedAvail.length === 0 || selectedAvail.includes(doc.profession)) &&
        doc.price <= maxPrice */
    );

    renderDoctors(filtered);
};


document.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", () => {
        if (input.id === "priceRange") {
            document.getElementById("priceDisplay").innerText = `Up to £${input.value}`;
        }
        filterDoctors();
    });
});

document.getElementById("clearFilters").addEventListener("click", e => {
    e.preventDefault();
    document.querySelectorAll("input").forEach(input => {
        if (input.type === "checkbox") input.checked = false;
        if (input.type === "text") input.value = "";
        if (input.type === "range") input.value = 2000;
    });
    document.getElementById("priceDisplay").innerText = "Up to £2000";
    renderDoctors(doctorList);
});

function naviageToDetailsPage(button) {
    const btn = button;
    const doctorDetails = JSON.parse(btn.getAttribute('data-request'));
    localStorage.setItem('step1', JSON.stringify(doctorDetails));
    window.location.assign('./details.html');
}

document.querySelectorAll('.option').forEach(opt => {
    opt.addEventListener('click', function () {
        document.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
        this.classList.add('selected');
    });
});

function handleContinue() {
    const selected = document.querySelector('.option.selected');
    if (!selected) {
        alert("Please select a speciality.");
        return;
    }
    alert(`You selected: ${selected.innerText.split('\n')[0]}`);
}

async function InitaProfileFetch() {
    const doctors = await GetProfiles();
    renderDoctors(doctors);
}

function getGenderName(gender) {
    if (gender === 'M')
        return 'Male';
    else if (gender === 'F')
        return 'Female';
    else return 'Other';
}

InitaProfileFetch();

