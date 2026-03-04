


function initSelections() {
    const step1 = JSON.parse(localStorage.getItem('step1'));
    const step2 = JSON.parse(localStorage.getItem('step2'));
    const step3 = localStorage.getItem('step3');
    const step4 = JSON.parse(localStorage.getItem('step4'));
    if (step1) {
        document.getElementById("profileImage").src = `http://localhost:8000${step1.purl}`;
        document.getElementById("name").innerText = step1.name;
        document.getElementById("specialty").innerText = step1.specialties;
        document.getElementById("service").innerText = step1.specialties;
        document.getElementById("address").textContent = step1.address || "Address not provided";
        document.getElementById("email").textContent = step1.email || "Email not provided";
        document.getElementById("number").textContent = step1.phone || "Phone number not provided";
    }
    if (step2) {
        document.getElementById("consultationtype").innerText = step2.name;
    }
    if (step3) {
        document.getElementById("appointmenttype").innerText = step3;
    }
    if (step4) {
        document.getElementById("time").innerText = step4.time;
        document.getElementById("datt").innerText = step4.date;
    }
}

function handleBack() {
    window.location.assign('./timetype.html');
}

document.getElementById('bookingForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const data = new FormData(this);
    const userData = Object.fromEntries(data.entries());
    /*  const firstName = this.firstName.value.trim();
     const lastName = this.lastName.value.trim();
     const email = this.email.value.trim();
     const phoneCode = this.querySelector('select').value;
     const phone = this.phone.value.trim(); */
    const reason = this.reason.value.trim();

    let errors = [];

    /*  if (!firstName || !lastName) {
         errors.push('Full name is required.');
     }
 
     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
         errors.push('Invalid email address.');
     }
 
     const fullPhone = phoneCode + phone.replace(/\D/g, '');
     if (!/^\+\d{1,4}\d{6,15}$/.test(fullPhone)) {
         errors.push('Invalid phone number.');
     } */

    /*  const phoneLengthByCode = {
         '+44': 10,  
         '+1': 10,  
         '+234': 10  
     };
 
     const expectedLength = phoneLengthByCode[phoneCode];
     if (phone.replace(/\D/g, '').length !== expectedLength) {
         errors.push(`Phone number must be exactly ${expectedLength} digits for ${phoneCode}`);
     } */

    // Reason
    if (reason.length < 10) {
        errors.push('Reason must be at least 10 characters long.');
    }

    if (reason.length < 10) {
        errors.push('Please provide a valid reason (at least 10 characters).');
    }

    if (errors.length > 0) {
        alert(errors.join('\n'));
        return;
    }

    localStorage.setItem('step5', reason);
    window.location.assign('./paymentinfo.html');
});

initSelections();