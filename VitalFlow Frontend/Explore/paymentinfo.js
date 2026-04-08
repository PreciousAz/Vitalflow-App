// Example dynamic data
const doctorData = {
  image: "https://i.ibb.co/3Ckvm4c/doctor.jpg",
  rating: 4.4,
  name: "Dr Anabel Franis",
  speciality: "Cardiology specialist",
  address: "23 Willowbrook Lane Harrow, London HA3 6PT, United Kingdom",
  email: "anabelfrancis89@gmail.com",
  phone: "+44 7911 123456",
};

const bookingData = {
  datetime: "9:00am–11:00am, 11 June 2025",
  type: "Video Call",
  consultationCost: 2000,
  bookingFee: 20,
  tax: 0,
};

function initSelections() {
  const step1 = JSON.parse(localStorage.getItem('step1'));
  const step2 = JSON.parse(localStorage.getItem('step2'));
  const step3 = localStorage.getItem('step3');
  const step4 = JSON.parse(localStorage.getItem('step4'));
  if (step1) {
    document.getElementById("profileImage").src = `http://localhost:8000${step1.purl}`;;
    document.getElementById("name").innerText = step1.name;
    document.getElementById("specialty").innerText = step1.specialties;
    document.getElementById("address").textContent = step1.address || "Address not provided";
    document.getElementById("email").textContent = step1.email || "Email not provided";
    document.getElementById("number").textContent = step1.phone || "Phone number not provided";
    document.getElementById("ratting").innerText = step1.rating || "Rating not available";
  }
  if (step2) {
    document.getElementById("consultType").innerText = step2.name;
  }
  if (step3) {
    document.getElementById("appointmenttype").innerText = step3;
  }
  if (step4) {
    document.getElementById("datetime").textContent = `${step4.date} at ${step4.time}`;
  }

  document.getElementById("consultation-cost").textContent = step2.price;
  document.getElementById("booking-fee").textContent = step2.price;
  document.getElementById("tax").textContent = `£${bookingData.tax}`;
  const total = bookingData.consultationCost + bookingData.bookingFee + bookingData.tax;
  document.getElementById("total").textContent = step2.price;
}

function selectTab(tabName) {
  const tabs = document.querySelectorAll(".tab");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach(tab => tab.classList.remove("active"));
  contents.forEach(content => (content.style.display = "none"));

  document.querySelector(`.tab[onclick="selectTab('${tabName}')"]`).classList.add("active");
  document.getElementById(tabName).style.display = "block";
}

const tabs = document.querySelectorAll(".tab");
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    const method = tab.dataset.method;

    if (method === "card") {
      document.getElementById("cardFields").classList.remove("hidden");
      document.getElementById("paypalMessage").classList.add("hidden");
    } else {
      document.getElementById("cardFields").classList.add("hidden");
      document.getElementById("paypalMessage").classList.remove("hidden");
    }
  });
});


async function payNow(button) {
  const btn = button;
  const method = document.querySelector(".tab.active").dataset.method;
  const step1 = JSON.parse(localStorage.getItem('step1'));
  const step2 = JSON.parse(localStorage.getItem('step2'));
  const step3 = localStorage.getItem('step3');
  const step4 = JSON.parse(localStorage.getItem('step4'));
  const user = JSON.parse(localStorage.getItem(stringStore.loginuserkey));
  if (!user) {
    await showDialog('Please login or signup to continue', '', 'Dismiss');
    window.location.assign('/Login/login.html');
    return;
  }

  try {
    btn.classList.add("loading");
    btn.disabled = true;
    const response = await fetch(`${globalVariables.apiUrl}payment/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: user.id,
        patient_name: user.name,
        doctor_name: step1.name,
        gender: getGenderName(user.gender),
        doctor_id: step1.userId,
        status: 'Paid',
        consultation: step2.name,
        amount: step2.price,
      })
    });

    const result = await response.json();
    console.log('re', result)
    if (result.success) {
      //localStorage.setItem('step6', JSON.stringify({ name, number, exp, cvv }));
      setTimeout(async () => {
        button.classList.remove("loading");
        button.disabled = false;
        await showDialog(result.message, 'Okay', '');
        window.location.assign('./submission.html');
      }, 3000);
    } else {
      setTimeout(async () => {
        button.classList.remove("loading");
        button.disabled = false;
        await showDialog(result.message, '', 'Dismiss');
      }, 3000);
    }
  } catch (error) {
    btn.classList.remove("loading");
    btn.disabled = false;
    console.error("Error:", error);
    await showDialog(error.message, '', 'Dismiss');
  }

}

//'Male', 'Female', 'Other'

function getGenderName(gender) {
  if (gender === 'M')
    return 'Male';
  else if (gender === 'F')
    return 'Female';
  else return 'Other';
}

initSelections();


/*  if (method === "card") {
    const name = document.getElementById("cardName").value.trim();
    const number = document.getElementById("cardNumber").value.trim();
    const exp = document.getElementById("expDate").value.trim();
    const cvv = document.getElementById("cvv").value.trim();

    if (!name || !number || !exp || !cvv) {
      alert("Please fill in all card details.");
      return;
    }

  } else {
    alert("Redirecting to PayPal...");
  } */