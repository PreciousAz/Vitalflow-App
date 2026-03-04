

function initUserDetails() {
    const user = JSON.parse(localStorage.getItem(stringStore.loginuserkey));
    const profile = JSON.parse(localStorage.getItem('profile'));
    //console.log('profile', profile)
    //console.log('user', user);
    if (user) {
        document.getElementById("doctor-name").textContent = user.name;
        document.querySelector(".specialty").textContent = profile.specialties;
        document.getElementById("address").textContent = user.address;
        document.getElementById("email").textContent = user.email;
        document.getElementById("email").href = `mailto:${user.email}`;
        document.getElementById("phone").textContent = user.phone;
        document.getElementById("phone").href = `tel:${user.phone}`;
        document.getElementById("bio").textContent = profile.bio;
        document.getElementById("experience").textContent = profile.experience;
        document.getElementById("profile-pic").src = profile.purl ? `http://localhost:8000${profile.purl}` : "/Assets/images/user.png";
    }


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
    const profile = JSON.parse(localStorage.getItem('profile'));
    document.getElementById("specialization").value = profile.specialties;
    document.getElementById("mbio").value = profile.bio;
    document.getElementById("mexperience").value = profile.experience;

    document.getElementById("editProfileModal").style.display = "block";
}

document.getElementById('editProfileForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const button = this;
    const photoInput = this.querySelector('input[name="profilePhoto"]');
    const specialization = document.getElementById('specialization').value;
    const user = JSON.parse(localStorage.getItem(stringStore.loginuserkey));
    const profile = JSON.parse(localStorage.getItem('profile'));
    const requiredFields = this.querySelectorAll("[required]");
    let uploadedPhotoUrl = profile.purl;
    const bio = this.bio.value.trim();
    const specialty = this.specialty.value.trim();
    const experience = this.experience.value.trim();

    requiredFields.forEach(field => {
        if ((field.type === "file" && field.files.length === 0) || !field.value.trim()) {
            field.classList.add("error");
            isValid = false;
        } else {
            field.classList.remove("error");
        }

    });

    if (photoInput.files.length > 0) {
        const profilePhoto = photoInput.files[0];
        uploadedPhotoUrl = await uploadFile(profilePhoto);
    }

    if (bio === profile.bio && specialty === profile.specialties && experience === profile.experience && photoInput.files.length === 0) {
        await showDialog("No changes detected.", '', 'Dismiss');
        return;
    }

    try {
        button.classList.add("loading");
        button.disabled = true;
        const response = await fetch(`${globalVariables.apiUrl}pprofile/${user.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                specialties: specialty,
                purl: uploadedPhotoUrl,
                bio: bio,
                experience: experience,
            }),
        });
        const result = await response.json();
        if (result.success) {
            setTimeout(async () => {
                await showDialog(result.message, 'Proceed');
                button.classList.remove("loading");
                button.disabled = false;
                document.querySelector(".specialty").textContent = specialty;
                document.getElementById("bio").textContent = bio;
                document.getElementById("experience").textContent = experience;
                document.getElementById("profile-pic").src = `http://localhost:8000${uploadedPhotoUrl}`;
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