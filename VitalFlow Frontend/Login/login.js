document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const button = this;
  const email = this.email.value.trim();
  const password = this.password.value;


  try {
    button.classList.add("loading");
    button.disabled = true;
    const response = await fetch(`${globalVariables.apiUrl}auth/login`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });
    const result = await response.json();
    if (result.success) {
      const user = result.user;
      if (user.completed == 0) {
        localStorage.setItem('userid', user.id);
        setTimeout(async () => {
          button.classList.remove("loading");
          button.disabled = false;
          if (user.usertype === "doctor") {
            window.location.assign('/ProfileSetup/DoctorSetup/index.html');
          } else {
            window.location.assign('/ProfileSetup/PatientSetup/index.html');
          }
        }, 3000)
      } else {
        this.reset();
        localStorage.removeItem('userid');
        localStorage.removeItem(stringStore.useremailkey);
        localStorage.removeItem(stringStore.token)
        localStorage.removeItem(stringStore.loginuserkey);
        localStorage.setItem(stringStore.token, result.token);
        localStorage.setItem(stringStore.loginuserkey, JSON.stringify(user))
        localStorage.setItem(stringStore.isLoggedInkey, "true");
        localStorage.setItem(stringStore.useremailkey, email);
        setTimeout(() => {
          button.classList.remove("loading");
          button.disabled = false;
          if (user.usertype === 'doctor') {
            window.location.assign('/DoctorsDash/index.html');
          } else {
            window.location.assign('/UserDash/index.html');
          }
        }, 3000);
      }
    } else {
      setTimeout(async () => {
        button.classList.remove("loading");
        button.disabled = false;
        await showDialog(result.message, '', 'Dismiss');
      }, 3000)
    }
  } catch (error) {
    button.classList.remove("loading");
    button.disabled = false;
    console.error("Error:", error);
    await showDialog(error.message, '', 'Dismiss');
  }
});

function InitUserEmail() {
  const userEmail = localStorage.getItem(stringStore.useremailkey);
  if (userEmail) {
    document.getElementById("email").value = userEmail;
  }
}

InitUserEmail();