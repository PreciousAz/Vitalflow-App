// Define your global variables
const globalVariables = {
    apiUrl: "http://localhost:8000/api/",
    appName: "VitalFlow",
};

const stringStore = {
    accepted: 'accepted',
    userkey: 'user',
    loginuserkey: 'logged-user',
    requestkey: 'member-request',
    keyaccess: 'Key Access Member',
    Community: 'Community Member',
    Creative: 'Creative Workspace Member',
    nullType: '',
    Keyaccesskey: 'Keyaccess',
    Communitykey: 'Community',
    Creativekey: 'Creative',
    isLoggedInkey: 'isLoggedIn',
    logout: 'Are you sure you want to logout?',
    signupsuccessfulkey: 'Signup Successful!',
    loginsuccessfullkey: 'Login successful!',
    adminkey: 'admin',
    memberkey: 'member',
    incorrectkey: 'Incorrect login details, please check and try again',
    notfoundkey: 'User not found',
    memberpathkey: '/member/index.html',
    userpathkey: '/user/index.html',
    adminpathkey: '/admin/index.html',
    loginpathkey: '/Login/login.html',
    adminemailkey: 'admin@admin.culture',
    adminpasswordkey: 'Admin@98culture',
    token: 'token',
    useremailkey: 'useremailkey',
    profilekey: 'profile',
    chatListKey: 'chatList',
}

const users = [
    {
        name: "Camillia Brooks",
        avatar: "https://i.pravatar.cc/40?img=1",
        lastMessage: "I hope you are good",
        lastSeen: "10:30am",
        online: true,
        messages: [
            { from: "Camillia", text: "Hello Doctor", time: "10:01am" },
            { from: "Camillia", text: "I have an issue doc", time: "10:02am" },
            { from: "Camillia", text: "Did you see my medical issues", time: "10:03am" },
            { from: "You", text: "Hello Camillia, Yes I saw it", time: "10:03am" },
            { from: "Camillia", text: "Hello Camillia, Yes I saw it", time: "10:03am" },
            { from: "Camillia", text: "Hello Camillia, Yes I saw it", time: "10:03am" },
            { from: "Camillia", text: "Hello Camillia, Yes I saw it", time: "10:03am" },
        ]
    },
    {
        name: "Britney Omar",
        avatar: "https://i.pravatar.cc/40?img=2",
        lastMessage: "Help me doc!!!",
        lastSeen: "Yesterday",
        online: false,
        messages: [
            { from: "Britney", text: "Doctor are you there?", time: "8:00am" },
            { from: "You", text: "Yes, how can I help you?", time: "8:02am" },
        ]
    }
];

const user = {
    name: "Dr Anabel Franis",
    specialty: "Cardiology specialist",
    address: "23 Willowbrook Lane Harrow, London HA3 8PT, United Kingdom",
    email: "anabelfranics89@gmail.com",
    phone: "+44 7911 123456",
    bio: `Dr. Anabel Franis is a highly skilled and compassionate cardiologist dedicated to the prevention, diagnosis, and treatment of heart-related conditions. 
With a deep commitment to patient-centered care, Dr. Franis combines advanced medical expertise with a personalized approach to help patients achieve optimal heart health.`,
    experience: `With over 12 years of experience in cardiology, Dr. Anabel Franis is a leading heart specialist at King Blanket Hospital, London...
She completed her medical training at King's College London and her cardiology fellowship at St Thomas' Hospital, where she developed a strong focus on preventative cardiology, heart failure, and interventional procedures.`
};

const appointments = [
  {
    name: "Camilla Brooks",
    reason: "I have been...",
    date: "Aug 22,2025",
    time: "11:00am–12:00am",
    gender: "Female",
    type: "Video Call",
    consultation: "Specialized",
    status: "Completed"
  },
  {
    name: "Ezekiel Lovsly",
    reason: "I have been...",
    date: "Aug 22,2025",
    time: "11:00am–12:00am",
    gender: "Female",
    type: "Video Call",
    consultation: "Specialized",
    status: "Completed"
  },
  {
    name: "Chance Brown",
    reason: "I have been...",
    date: "Aug 23,2025",
    time: "11:00am–12:00am",
    gender: "Male",
    type: "Video Call",
    consultation: "Check Up",
    status: "Completed"
  },
  {
    name: "Cook Brown",
    reason: "I have been...",
    date: "Aug 22,2025",
    time: "11:00am–12:00am",
    gender: "Male",
    type: "Video Call",
    consultation: "Check Up",
    status: "Completed"
  },
  {
    name: "Thomas Willa",
    reason: "I have been...",
    date: "Aug 22,2025",
    time: "11:00am–12:00am",
    gender: "Male",
    type: "Video Call",
    consultation: "Check Up",
    status: "Completed"
  },
  {
    name: "Brian Willa",
    reason: "I have been...",
    date: "Aug 22,2025",
    time: "11:00am–12:00am",
    gender: "Male",
    type: "Video Call",
    consultation: "Check Up",
    status: "Completed"
  },
  {
    name: "Kelvin Willy",
    reason: "I have been...",
    date: "Aug 22,2025",
    time: "11:00am–12:00am",
    gender: "Male",
    type: "Video Call",
    consultation: "Check Up",
    status: "Completed"
  },
  {
    name: "Chance Big",
    reason: "Aug 22,2025",
    date: "Aug 22,2025",
    time: "11:00am–12:00am",
    gender: "Male",
    type: "Video Call",
    consultation: "Check Up",
    status: "Completed"
  },
  {
    name: "Kelvin Chance",
    reason: "Aug 22,2025",
    date: "Aug 22,2025",
    time: "11:00am–12:00am",
    gender: "Male",
    type: "Video Call",
    consultation: "Check Up",
    status: "Completed"
  }
];

const patients = [
  { name: "Camilla Brooks", date: "Aug 22,2025", gender: "Woman", disease: "Aortic Disease", payment: "Paypal" },
  { name: "Ezekiel Lovely", date: "Aug 22,2025", gender: "Woman", disease: "Endocarditis", payment: "Paypal" },
  { name: "Chance Brown", date: "Aug 23,2025", gender: "Man", disease: "Cardiomyopathy", payment: "Paypal" },
  { name: "Cook Brown", date: "Aug 22,2025", gender: "Man", disease: "Arrhythmias", payment: "Paypal" },
  { name: "Thomas Willa", date: "Aug 22,2025", gender: "Man", disease: "Aortic Disease", payment: "Paypal" },
  { name: "Helen Smith", date: "Aug 23,2025", gender: "Woman", disease: "Hypertension", payment: "Paypal" },
  { name: "Nora Jones", date: "Aug 24,2025", gender: "Woman", disease: "Myocarditis", payment: "Paypal" },
  { name: "Alex Finn", date: "Aug 25,2025", gender: "Man", disease: "Angina", payment: "Paypal" },
  { name: "Peter Cole", date: "Aug 26,2025", gender: "Man", disease: "Coronary Disease", payment: "Paypal" },
  { name: "Grace Lee", date: "Aug 27,2025", gender: "Woman", disease: "Heart Failure", payment: "Paypal" },
];


let allMemberRequest = [];

const stats = [
  { title: "Appointments", value: "200", change: "+5%", date: "Last 7 Days" },
  { title: "Blood Pressure", value: "89/69", change: "+2%", date: "Last 7 Days" },
  { title: "Heart Rate", value: "86 bpm", change: "+3%", date: "Last 7 Days" },
  { title: "Weight", value: "80kg", change: "+2%", date: "Last 7 Days" }
];

const doctors = [
  { name: "Dr Anabel Franisi", role: "Cardiologist", bookings: "20 Bookings" },
  { name: "Dr Kelly Nickel", role: "Cardiologist", bookings: "20 Bookings" },
  { name: "Dr Barman Bon", role: "Dentist", bookings: "20 Bookings" },
  { name: "Dr Sharman Adam", role: "Dentist", bookings: "20 Bookings" }
];

const prescriptions = [
  { title: "Cardiology Prescription", date: "22 April 2025" },
  { title: "Cardiology Prescription", date: "17 April 2025" },
  { title: "Cardiology Prescription", date: "12 April 2025" },
  { title: "Dental Prescription", date: "02 April 2025" }
];

const prescriptionsList = [
  {
    name: "Cardiovascular",
    date: "2023-10-01",
  },
  {
    name: "Feverios",
    date: "2023-10-01",
  }
];

function showDialog(message, btnOkText = '', btnCanText = '') {
    return new Promise((resolve) => {
        const dialog = document.getElementById("popupDialog");
        const dialogText = document.getElementById("dialogText");
        const closeButton = document.getElementById("closeButton");
        const okButton = document.getElementById("okButton");

        dialogText.textContent = message;
        dialog.showModal();

        // Remove previous event listeners to avoid duplication
        closeButton.replaceWith(closeButton.cloneNode(true));
        okButton.replaceWith(okButton.cloneNode(true));

        // Get new buttons after cloning
        const newCloseButton = document.getElementById("closeButton");
        const newOkButton = document.getElementById("okButton");

        // Show OK button only if condition is true
        if (btnOkText) {
            newOkButton.textContent = btnOkText;
            newOkButton.style.display = "inline-block";
            newOkButton.addEventListener("click", () => {
                closeDialog();
                resolve(true); // ✅ User clicked OK
            });
        } else {
            newOkButton.style.display = "none";
        }

        if (btnCanText) {
            newCloseButton.textContent = btnCanText;
            newCloseButton.style.display = "inline-block";
            // Cancel button event
            newCloseButton.addEventListener("click", () => {
                closeDialog();
                resolve(false); // ❌ User clicked Cancel
            });
        } else {
            newCloseButton.style.display = "none";
        }


        // Fade-in effect
        setTimeout(() => {
            dialog.style.opacity = "1";
        }, 10);

        if (!btnOkText) {
            dialog.addEventListener("click", (event) => {
                if (event.target === dialog) {
                    closeDialog();
                    resolve(false);
                }
            });
        }
    });
}

function closeDialog() {
    const dialog = document.getElementById("popupDialog");

    // Fade-out effect
    dialog.style.opacity = "0";

    setTimeout(() => {
        dialog.close();
    }, 300);
}

function navigateToPath(path) {
    const dialog = document.getElementById("popupDialog");

    // Fade-out effect
    dialog.style.opacity = "0";

    setTimeout(() => {
        dialog.close();
        window.location.assign(path);
    }, 300);
}

const payments = [
  {
    name: "Camilla Brooks",
    date: "Aug 22,2025",
    gender: "Female",
    consultation: "Specialized",
    status: "Paid",
    amount: "€ 2,000",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    name: "Ezekiel Lovely",
    date: "Aug 22,2025",
    gender: "Female",
    consultation: "Specialized",
    status: "Pending",
    amount: "€ 2,000",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    name: "Chance Brown",
    date: "Aug 23,2025",
    gender: "Male",
    consultation: "Check Up",
    status: "Pending",
    amount: "€ 2,000",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    name: "Cook Brown",
    date: "Aug 23,2025",
    gender: "Male",
    consultation: "Check Up",
    status: "Paid",
    amount: "€ 2,000",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    name: "Thomas Willa",
    date: "Aug 23,2025",
    gender: "Male",
    consultation: "Check Up",
    status: "Cancelled",
    amount: "€ 2,000",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    name: "Brian Willa",
    date: "Aug 23,2025",
    gender: "Male",
    consultation: "Check Up",
    status: "Cancelled",
    amount: "€ 2,000",
    avatar: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    name: "Kelvin Willy",
    date: "Aug 23,2025",
    gender: "Male",
    consultation: "Check Up",
    status: "Cancelled",
    amount: "€ 2,000",
    avatar: "https://randomuser.me/api/portraits/men/7.jpg",
  },
  {
    name: "Chance Big",
    date: "Aug 23,2025",
    gender: "Male",
    consultation: "Check Up",
    status: "Cancelled",
    amount: "€ 2,000",
    avatar: "https://randomuser.me/api/portraits/men/8.jpg",
  },
  {
    name: "Kelvin Chance",
    date: "Aug 23,2025",
    gender: "Male",
    consultation: "Check Up",
    status: "Cancelled",
    amount: "€ 2,000",
    avatar: "https://randomuser.me/api/portraits/men/9.jpg",
  },
  {
    name: "Manuel Chimaco",
    date: "Aug 23,2025",
    gender: "Male",
    consultation: "Check Up",
    status: "Cancelled",
    amount: "€ 2,000",
    avatar: "https://randomuser.me/api/portraits/men/10.jpg",
  },
];

let socket;

let currentUserIndex = 0;
// Make them accessible globally
window.globalVariables = globalVariables;
//window.user = user;
window.users = users;
window.stringStore = stringStore;
window.appointments = appointments;
window.patients = patients;
window.currentUserIndex = currentUserIndex;
window.showDialog = showDialog;
window.stats = stats;
window.doctors = doctors;
window.prescriptions = prescriptions;
window.payments = payments;
window.prescriptionsList = prescriptionsList;
window.socket = socket;