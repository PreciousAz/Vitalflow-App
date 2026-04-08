
function iniTDoctorDetails() {
  const doctorDetails = JSON.parse(localStorage.getItem('step1'));
  console.log('details', doctorDetails);
  if (doctorDetails) {
    document.getElementById("profileImage").src = `http://localhost:8000${doctorDetails.purl}`;
    document.getElementById("name").innerText = doctorDetails.name;
    document.getElementById("speciality").innerText = doctorDetails.specialties;
    document.getElementById("address").textContent = doctorDetails.address || "Address not provided";
    document.getElementById("email").textContent = doctorDetails.email || "Email not provided";
    document.getElementById("number").textContent = doctorDetails.phone || "Phone number not provided";
    document.getElementById("bio").innerText = doctorDetails.bio || "Bio not provided";
    document.getElementById("experince").innerText = doctorDetails.experience || "Experience not provided";
    document.getElementById("ratting").innerText = doctorDetails.rating || "Rating not available";
    const result = doctorDetails.ctp.split(",").map(item => {
      const [key, value] = item.split(":").map(s => s.trim());
      return { name: key, count: Number(value) };
    });

    document.getElementById("follow").textContent = `£${result[1].count}`;
    document.getElementById("checkup").textContent = `£${result[2].count}`;
    document.getElementById("consult").textContent = `£${result[0].count}`;
  }
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
  const selectedText = selected.innerText.split('\n')[0];
  const selectedOption = selected.getAttribute('data-id');
  const strongValue = selected.querySelector('strong').textContent.trim();
  const data = {
    name: selectedOption,
    price: strongValue
  }
  localStorage.setItem('step2', JSON.stringify(data));
  window.location.assign('./appointtype.html');
}

iniTDoctorDetails();