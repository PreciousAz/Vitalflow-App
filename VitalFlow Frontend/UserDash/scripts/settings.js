

function initUserDetails() {
    const user = JSON.parse(localStorage.getItem(stringStore.loginuserkey));
    const profile = JSON.parse(localStorage.getItem('profile'));
    document.getElementById("settingsName").innerText = user.name;
    document.getElementById("address").textContent = user.address;
    document.getElementById("email").textContent = user.email;
    document.getElementById("email").href = `mailto:${user.email}`;
    document.getElementById("phone").textContent = user.phone;
    document.getElementById("phone").href = `tel:${user.phone}`;
    document.getElementById("profileSettingsImage").src = profile.purl ? `http://localhost:8000${profile.purl}` : "/Assets/images/user.png";

    const ecdSplit = profile.ecd.split(",");
    document.getElementById("ecdName").textContent = ecdSplit[0] || "N/A";
    document.getElementById("ecdRel").textContent = ecdSplit[1] || "N/A";
    document.getElementById("ecdPhone").textContent = ecdSplit[2] || "N/A";
    document.getElementById("ecdDoc").textContent = profile.pd || "N/A";

    const tabs = document.querySelectorAll(".tab");
    const contents = document.querySelectorAll(".tab-content");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            contents.forEach(content => {
                content.classList.add("hidden");
            });

            document.getElementById(tab.dataset.tab).classList.remove("hidden");
        });
    });
};

/* function openEditModal() {
  document.getElementById('editProfileModal').style.display = 'block';
} */

function closeEditModal() {
    document.getElementById('editProfileModal').style.display = 'none';
}

function openEditModal() {
    const user = JSON.parse(localStorage.getItem(stringStore.loginuserkey));
    const profile = JSON.parse(localStorage.getItem('profile'));
    const ecdSplit = profile.ecd.split(",");
    document.getElementById("emergencyName").value = ecdSplit[0];
    document.getElementById("emergencyPhone").value = ecdSplit[2];
    document.getElementById("emergencyRelation").value = ecdSplit[1];
    document.getElementById("preferredSpecialty").value = profile.pd;

    document.getElementById("editProfileModal").style.display = "block";
}

document.getElementById('editProfileForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const button = this;
    const form = e.target;
    const photoInput = form.querySelector('input[name="profilePhoto"]');
    const requiredFields = form.querySelectorAll("[required]");
    const user = JSON.parse(localStorage.getItem(stringStore.loginuserkey));
    const profile = JSON.parse(localStorage.getItem('profile'));
    let isValid = true;
    let uploadedPhotoUrl = profile.purl;
    const ecdSplit = profile.ecd.split(",");
    const name = ecdSplit[0];
    const phone = ecdSplit[2];
    const relationship = ecdSplit[1];
    const preferred = profile.pd;

    requiredFields.forEach(field => {
        if ((field.type === "file" && field.files.length === 0) || !field.value.trim()) {
            field.classList.add("error");
            isValid = false;
        } else {
            field.classList.remove("error");
        }

    });

    if (!isValid) {
        alert("Please fill all required fields.");
        return;
    }

    if (photoInput.files.length > 0) {
        const profilePhoto = photoInput.files[0];
        uploadedPhotoUrl = await uploadFile(profilePhoto);
    }

    if (name.trim() === form.emergencyName.value.trim() && phone.trim() === form.emergencyPhone.value.trim() && relationship.trim() === form.emergencyRelation.value.trim() && preferred.trim() === form.preferredSpecialty.value.trim() && photoInput.files.length === 0) {
        await showDialog("No changes detected.", '', 'Dismiss');
        return;
    }

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
        const response = await fetch(`${globalVariables.apiUrl}profile/${user.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                purl: data.profilePhotoUrl,
                ecd: ecd,
                pd: data.preferredDoctorOrSpecialty,
            }),
        });
        const result = await response.json();
        if (result.success) {
            setTimeout(async () => {
                await showDialog(result.message, 'Proceed');
                button.classList.remove("loading");
                button.disabled = false;
                document.getElementById("ecdName").textContent = data.emergencyContact.name;
                document.getElementById("ecdRel").textContent = data.emergencyContact.relationship;
                document.getElementById("ecdPhone").textContent = data.emergencyContact.phone;
                document.getElementById("ecdDoc").textContent = data.preferredDoctorOrSpecialty;
                document.getElementById("profileSettingsImage").src = `http://localhost:8000${data.profilePhotoUrl}`;
                this.reset();
                closeEditModal();
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


initUserDetails();