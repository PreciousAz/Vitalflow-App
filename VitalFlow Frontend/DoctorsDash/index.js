
async function loadUserProfile(userId) {
    try {
        const response = await fetch(`${globalVariables.apiUrl}pprofile/user/${userId}`);
        const userProfile = await response.json();
        if (userProfile.success) {
            //console.log("User Profile index:", userProfile.data);
            localStorage.setItem(stringStore.profilekey, JSON.stringify(userProfile.data));
            document.getElementById("profession").textContent = userProfile.data.specialties || "--";
        }
        document.getElementById("profileImage").src = userProfile.data.purl ? `http://localhost:8000${userProfile.data.purl}` : "/Assets/images/user.png";
    } catch (error) {
        console.error("Error loading user profile:", error);
    }
}

async function loadUserMessages(userId) {
    try {
        const response = await fetch(`${globalVariables.apiUrl}chat/user/${userId}`);
        const chats = await response.json();
        if (chats.success) {
            const chatList = chats.data;
            localStorage.setItem(stringStore.chatListKey, JSON.stringify(chatList));
        }
    } catch (error) {
        console.error("Error loading user profile:", error);
    }
}

async function loadUserAllMessages(userId) {
    try {
        const response = await fetch(`${globalVariables.apiUrl}chat/all/${userId}`);
        const chats = await response.json();
        if (chats.success) {
            const tmpList = chats.data;
            const chatList = tmpList.filter(x => x.receiver_id === userId && x.is_read == 0);
            document.getElementById("mesCount").textContent = chatList.length > 9 ? `9+` : chatList.length;
        }
    } catch (error) {
        console.error("Error loading user profile:", error);
    }
}


document.addEventListener("DOMContentLoaded", async () => {
    // Check if user is logged in
    socket = io("http://localhost:8000");
    const isLoggedin = localStorage.getItem(stringStore.isLoggedInkey);
    const user = JSON.parse(localStorage.getItem(stringStore.loginuserkey));
    if (isLoggedin == null) {
        window.location.href = "/index.html"; // Redirect if not logged in
    }

    if (user) {
        if (user.usertype !== "doctor") {
            localStorage.removeItem(stringStore.isLoggedInkey);
            localStorage.removeItem(stringStore.token);
            localStorage.removeItem(stringStore.loginuserkey);
            window.location.assign('/Login/login.html');
        } else {
            await loadUserProfile(user.id);
            await loadUserMessages(user.id);
            await loadUserAllMessages(user.id)
            document.getElementById("name").innerText = user.name || "User Name";
        }
        const userId = user.id;
        socket.emit("register", userId);
        socket.on("newMessage", async (msg) => {
            //console.log("📩 New message Home:", msg);
            const response = await fetch(`${globalVariables.apiUrl}chat/all/${userId}`);
            const chats = await response.json();
            if (chats.success) {
                const tmpList = chats.data;
                const chatList = tmpList.filter(x => x.receiver_id === userId && x.is_read == 0);
                document.getElementById("mesCount").textContent = chatList.length > 9 ? `9+` : chatList.length;
            }
        });
    }

    function loadPage(page) {
        // Fetch page content
        fetch(`pages/${page}.html`)
            .then(response => response.text())
            .then(html => {
                document.getElementById("content").innerHTML = html;

                // Remove existing CSS and JS
                removeDynamicFiles();

                // Inject new CSS
                const cssLink = document.createElement("link");
                cssLink.rel = "stylesheet";
                cssLink.href = `styles/${page}.css`;
                cssLink.classList.add("dynamic-css");
                document.head.appendChild(cssLink);

                // Inject new JS
                const script = document.createElement("script");
                script.src = `scripts/${page}.js`;
                script.classList.add("dynamic-js");
                document.body.appendChild(script);
            })
            .catch(error => console.error("Error loading page:", error));
    }

    function removeDynamicFiles() {
        document.querySelectorAll(".dynamic-css, .dynamic-js").forEach(el => el.remove());
    }

    function handleRoute() {
        const hash = location.hash.substring(1) || "home"; // Default to home
        loadPage(hash);

        setTimeout(() => {
            // Hide the loader
            document.getElementById("loading").style.display = "none";

            // Show the content
            let content = document.getElementById("content");
            content.style.display = "block";
            setTimeout(() => content.classList.add("show"), 200);
        }, 1000);
    }

    //LoadNavbar();
    window.addEventListener("hashchange", handleRoute);
    handleRoute(); // Load initial page



    document.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", function (event) {
            if (this.target !== "_blank") { // Ignore links opening in a new tab
                document.getElementById("loading").style.display = "flex"; // Show loader
            }
        });
    });

    window.addEventListener("hashchange", function () {
    });

    window.addEventListener("load", function () {

        setTimeout(() => {
            // Hide the loader
            document.getElementById("loading").style.display = "none";

            // Show the content
            let content = document.getElementById("content");
            content.style.display = "block";
            setTimeout(() => content.classList.add("show"), 200);
        }, 1000);

    });

});

const currentUrl = window.location.href;
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    //Detect current page and active the link
    if (currentUrl.includes(link.querySelector('a').href)) {
        navLinks.forEach(nav => nav.classList.remove('active'));
        link.classList.add('active');
    }
    link.addEventListener('click', () => {
        navLinks.forEach(nav => nav.classList.remove('active')); // Remove active from all
        link.classList.add('active'); // Add active to clicked link
        setTimeout(() => {
            // Hide the loader
            document.getElementById("loading").style.display = "none";

            // Show the content
            let content = document.getElementById("content");
            content.style.display = "block";
            setTimeout(() => content.classList.add("show"), 200);
        }, 1000);
    });
});

const logoutControl = document.getElementById('logout');

logoutControl.addEventListener('click', async function () {
    const result = await showDialog(stringStore.logout, 'Logout', 'Cancel');
    if (result) {
        localStorage.removeItem(stringStore.isLoggedInkey);
        localStorage.removeItem(stringStore.token);
        localStorage.removeItem(stringStore.loginuserkey);
        localStorage.removeItem(stringStore.profilekey);
        window.location.assign("/index.html");
    } else {
        window.location.assign("./index.html");
    }

});


function Navi() {
    window.location.assign("/DoctorsDash/index.html#messages");
    navLinks.forEach(link => {
        //Detect current page and active the link
        if (currentUrl.includes(link.querySelector('a').href)) {
            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');
        }
        link.addEventListener('click', () => {
            navLinks.forEach(nav => nav.classList.remove('active')); // Remove active from all
            link.classList.add('active'); // Add active to clicked link
            setTimeout(() => {
                // Hide the loader
                document.getElementById("loading").style.display = "none";

                // Show the content
                let content = document.getElementById("content");
                content.style.display = "block";
                setTimeout(() => content.classList.add("show"), 200);
            }, 1000);
        });
    });
}