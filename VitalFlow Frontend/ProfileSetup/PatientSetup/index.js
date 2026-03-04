document.getElementById("emergencyForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const button = this;
    const form = e.target;
    const photoInput = form.querySelector('input[name="profilePhoto"]');
    const requiredFields = form.querySelectorAll("[required]");
    const userId = localStorage.getItem('userid');
    let isValid = true;

    // Validate required fields
    requiredFields.forEach(field => {
        if ((field.type === "file" && field.files.length === 0) || !field.value.trim()) {
            field.classList.add("error");
            isValid = false;
        } else {
            field.classList.remove("error");
        }

        if (field.type === "file" && field.files.length === 0) {
            alert(`Please upload a file for ${field.name}`);
            isValid = false;
        }
    });

    if (!photoInput.files.length) {
        alert("Please select a profile image");
        return;
    }

    if (!isValid) {
        alert("Please fill all required fields.");
        return;
    }

    const profilePhoto = photoInput.files[0];

    // Simulate photo upload (replace with real cloud upload)
    const uploadedPhotoUrl = await uploadFile(profilePhoto);

    const data = {
        profilePhotoUrl: uploadedPhotoUrl,
        emergencyContact: {
            name: form.emergencyName.value.trim(),
            phone: form.emergencyPhone.value.trim(),
            relationship: form.emergencyRelation.value.trim(),
        },
        preferredDoctorOrSpecialty: form.preferredSpecialty.value.trim(),
    };

    try {
        button.classList.add("loading");
        button.disabled = true;
        const ecd = `${data.emergencyContact.name}, ${data.emergencyContact.relationship}, ${data.emergencyContact.phone}`;
        const response = await fetch(`${globalVariables.apiUrl}profile/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: userId,
                purl: data.profilePhotoUrl,
                ecd: ecd,
                pd: data.preferredDoctorOrSpecialty,
            }),
        });
        const result = await response.json();
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