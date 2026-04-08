document.getElementById("profileForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const button = this;
    const form = e.target;
    const formData = new FormData(form);
    const requiredFields = form.querySelectorAll("[required]");
    const userId = localStorage.getItem('userid');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = "red";
            isValid = false;
        } else {
            field.style.borderColor = "#ccc";
        }

        // File validation
        if (field.type === "file" && field.files.length === 0) {
            alert(`Please upload a file for ${field.name}`);
            isValid = false;
        }
    });

    if (!isValid) {
        alert("Please fill all required fields correctly.");
        return;
    }

    // Step 1: Extract file inputs
    const supportingDocs = form.querySelector('input[name="certificates"]').files[0];
    const govID = form.querySelector('input[name="govID"]').files[0];
    const profilePhoto = form.querySelector('input[name="profilePhoto"]').files[0];

    // Step 2: Upload files first (example uses fakeUploadFile function)
    const uploadedDocsUrl = supportingDocs ? await uploadFile(supportingDocs) : null;
    const uploadedGovIDUrl = govID ? await uploadFile(govID) : null;
    const uploadedPhotoUrl = profilePhoto ? await uploadFile(profilePhoto) : null;

    // Step 3: Collect all other form values
    const data = {
        licenseNumber: form.querySelector('input[name="license"]').value,
        specialties: form.querySelector('input[name="specialty"]').value,
        qualifications: form.querySelector('input[name="qualifications"]').value,
        yoe: form.querySelector('input[name="yoe"]').value,
        affiliatedHospitals: form.querySelector('input[name="affiliations"]').value,
        consultationRoutine: form.querySelector('input[name="routine"]').value,
        consultationFollowUp: form.querySelector('input[name="followup"]').value,
        consultationEmergency: form.querySelector('input[name="emergency"]').value,
        bio: form.querySelector('textarea[name="bio"]').value,
        experience: form.querySelector('textarea[name="experience"]').value,
        supportingDocumentsUrl: uploadedDocsUrl,
        governmentIdUrl: uploadedGovIDUrl,
        profilePhotoUrl: uploadedPhotoUrl
    };

    try {
        button.classList.add("loading");
        button.disabled = true;
        //(£)
        const ctp = `Consultation: ${data.consultationRoutine}, Follow-Up: ${data.consultationFollowUp}, Check-Up: ${data.consultationEmergency}`;
        const response = await fetch(`${globalVariables.apiUrl}pprofile/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: userId,
                medicallic: data.licenseNumber,
                specialties: data.specialties,
                qualifications: data.qualifications,
                ahs: data.affiliatedHospitals,
                ctp,
                usd: data.supportingDocumentsUrl,
                ugovId: data.governmentIdUrl,
                yoe: data.yoe,
                purl: data.profilePhotoUrl,
                bio: data.bio,
                experience: data.experience,
            }),
        });

        const result = await response.json();
        console.log('result',result);
        if (result.success) {
            const resp = await fetch(`${globalVariables.apiUrl}auth/profile-completed/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
            });

            const result = await resp.json();
            this.reset();
            setTimeout(async () => {
                await showDialog(result.message, 'Proceed');
                button.classList.remove("loading");
                button.disabled = false;
                window.location.assign('/Login/login.html');
            }, 3000);
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

async function uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch(`${globalVariables.apiUrl}upload`, {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            await showDialog(`Upload failed: ${result.message}`, '', 'Dismiss');
        }

        return result.filePath;
    } catch (error) {
        await showDialog(`Upload error: ${error.message}`, '', 'Dismiss');
        throw error;
    }
}


document.getElementById("profilePhoto").addEventListener("change", function () {
    const file = this.files[0];
    const preview = document.getElementById("previewImage");
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = "block";
            document.querySelector("#photoHolder span").style.display = "none";
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById("photoHolder").addEventListener("click", () => {
    document.getElementById("profilePhoto").click();
});
