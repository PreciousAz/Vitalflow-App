const errorMsg = document.getElementById("error-msg");
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("passwordInput");

togglePassword.addEventListener("click", () => {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    togglePassword.textContent = type === "password" ? "👁️" : "🙈";
});

document.getElementById("accountType").addEventListener("change", function () {
    const titleGroup = document.getElementById("titleGroup");
    if (this.value === "doctor") {
        titleGroup.style.display = "block";
    } else {
        titleGroup.style.display = "none";
        document.getElementById("title").value = "";
    }
});

document.getElementById("signupForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    errorMsg.innerText = ""; // Reset
    let title = "";
    const button = this;
    const fullName = this.fullname.value.trim();
    const email = this.email.value.trim();
    const phone = this.phone.value.trim();
    const dob = this.dob.value;
    const address = this.address.value.trim();
    const password = this.password.value;
    const countryCode = this.countryCode.value;
    const accountType = this.accountType.value;
    const gender = document.querySelector('input[name="gender"]:checked');
    if (accountType === "doctor") {
        title = this.title.value.trim();
    }

    //const termsChecked = form.terms.checked;

    if (accountType === "") {
        e.preventDefault();
        errorMsg.innerText = "Please select an account type.";
        return;
    }

    if (accountType === "doctor" && title === "") {
        e.preventDefault();
        errorMsg.innerText = "Please select a title.";
        return;
    }


    if (!gender) {
        e.preventDefault();
        errorMsg.innerText = "Please select your gender.";
        return;
    }

    const phoneRegex = /^[0-9]{7,15}$/;
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[A-Za-z\d!@#\$%\^&\*]{8,}$/;

    const nameParts = fullName.split(/\s+/);
    const nameRegex = /^[a-zA-Z]+$/;

    if (
        nameParts.length < 2 ||
        !nameParts.every(part => nameRegex.test(part))
    ) {
        e.preventDefault();
        errorMsg.innerText = "Please enter your full name (first and last) using only letters.";
        return;
    }

    if (email === "" || phone === "" || dob === "" || address === "" || password === "") {
        e.preventDefault();
        errorMsg.innerText = "All fields are required.";
        return;
    }

    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    const isUnder18 = age < 18 || (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)));


    if (isNaN(birthDate.getTime()) || isUnder18) {
        e.preventDefault();
        errorMsg.innerText = "You must be at least 18 years old.";
        return;
    }


    let validPhone = false;
    const sanitizedPhone = phone.replace(/[^0-9]/g, "").replace(/^0+/, "");
    if (countryCode === "+234" && sanitizedPhone.length === 10) {
        validPhone = true;
    } else if (countryCode === "+44" && sanitizedPhone.length >= 10 && sanitizedPhone.length <= 11) {
        validPhone = true;
    } else if (countryCode === "+1" && sanitizedPhone.length === 10) {
        validPhone = true;
    }

    if (!validPhone) {
        e.preventDefault();
        errorMsg.innerText = `Invalid phone number for country code ${countryCode}.`;
        return;
    }

    if (!phoneRegex.test(phone)) {
        e.preventDefault();
        errorMsg.innerText = "Phone number must be digits and between 7 to 15 characters.";
        return;
    }

    if (!passwordRegex.test(password)) {
        e.preventDefault();
        errorMsg.innerText = "Password must contain 8+ characters, uppercase, lowercase, number, and special character.";
        return;
    }

    try {
        const genderValue = gender.value;
        const phoneNumber = countryCode + sanitizedPhone;
        const name = title ? `${title} ${fullName}` : fullName;
        const profession = accountType === "doctor" ? "Doctor" : "Patient";
        button.classList.add("loading");
        button.disabled = true;
        const response = await fetch(`${globalVariables.apiUrl}auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name, email, password, phone: phoneNumber,
                gender: genderValue, address, dob, usertype: accountType, profession
            })
        });

        const result = await response.json();
        if (result.success) {
            this.reset();
            const user = result.user;
            setTimeout(async () => {
                await showDialog(result.message, 'Proceed');
                button.classList.remove("loading");
                button.disabled = false;
                localStorage.setItem(stringStore.useremailkey, email);
                localStorage.setItem('userid', user.id);
                if (accountType === "doctor") {
                    window.location.assign('/ProfileSetup/DoctorSetup/index.html');
                } else {
                    window.location.assign('/ProfileSetup/PatientSetup/index.html');
                }
            }, 3000);
        } else {
            setTimeout(async () => {
                button.classList.remove("loading");
                button.disabled = false;
                await showDialog(result.message, '', 'Dismiss');
                //errorMessage.textContent = ;
            }, 3000)
        }
    } catch (error) {
        button.classList.remove("loading");
        button.disabled = false;
        console.error("Error:", error);
        await showDialog(error.message, '', 'Dismiss');
    }

    //alert("Form submitted successfully!");
    /* if (!termsChecked) {
      e.preventDefault();
      errorMsg.innerText = "You must agree to the terms and conditions.";
      return;
    } */
});

/* Experience
Over 10 years of dedicated experience in providing high-quality patient care, with a strong focus on accurate diagnosis, effective treatment planning, and compassionate communication. Skilled in working with diverse patient needs, collaborating with multidisciplinary teams, and staying updated with the latest medical advancements to deliver the best possible outcomes.

Bio
A passionate and detail-oriented medical professional committed to improving the health and well-being of patients through personalized, evidence-based care. Dedicated to building trust, fostering a comfortable environment, and ensuring each patient receives the attention and treatment they deserve. */