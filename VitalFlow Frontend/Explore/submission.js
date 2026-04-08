
function initSelections() {
  const step1 = JSON.parse(localStorage.getItem('step1'));
  const step2 = JSON.parse(localStorage.getItem('step2'));
  const step3 = localStorage.getItem('step3');
  const step4 = JSON.parse(localStorage.getItem('step4'));
  if (step1) {
    document.getElementById("service").innerText = step1.specialties;
  }
  if (step2) {
    document.getElementById("consultationtype").innerText = step2.name;
  }
  if (step3) {
    document.getElementById("appointmenttype").innerText = step3;
  }
  if (step4) {
    document.getElementById("datetime").textContent = `${step4.date} at ${step4.time}`;
  }
}

function setReminder() {
  alert("Reminder has been set!");
}

function sendMessage() {
  alert("Opening chat support...");
  window.location.assign('/index.html');
}

async function submitBookingDetails(button) {
  const btn = button;
  const step1 = JSON.parse(localStorage.getItem('step1'));
  const step2 = JSON.parse(localStorage.getItem('step2'));
  const step3 = localStorage.getItem('step3');
  const step4 = JSON.parse(localStorage.getItem('step4'));
  const step5 = localStorage.getItem('step5');
  const user = JSON.parse(localStorage.getItem(stringStore.loginuserkey));
  if (!user) {
    await showDialog('Please login or signup to continue', '', 'Dismiss');
    window.location.assign('/Login/login.html');
    return;
  }
  try {
    btn.classList.add("loading");
    btn.disabled = true;
    const response = await fetch(`${globalVariables.apiUrl}appointment/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: user.id,
        date: step4.date,
        reason: step5,
        doctor_id: step1.userId,
        status: 'pending',
        consultation: step2.name,
        appointment: step3,
        time: step4.time,
      })
    });

    const result = await response.json();
    if (result.success) {
      localStorage.removeItem('step1');
      localStorage.removeItem('step2');
      localStorage.removeItem('step3');
      localStorage.removeItem('step4');
      localStorage.removeItem('step5');
      setTimeout(async () => {
        button.classList.remove("loading");
        button.disabled = false;
        await showDialog(result.message, 'Okay', '');
        window.location.assign('/UserDash/index.html');
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

initSelections();