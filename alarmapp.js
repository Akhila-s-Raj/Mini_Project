// alarmapp.js

const firebaseConfig = {
    apiKey: "AIzaSyCMiRy5r5mbbYCUfw_4fiIThEHHJOtOiHY",
    authDomain: "mainproject-565f9.firebaseapp.com",
    projectId: "mainproject-565f9",
    storageBucket: "mainproject-565f9.appspot.com",
    messagingSenderId: "243845690343",
    appId: "1:243845690343:web:14cae7ce82fb372fd3c342",
    measurementId: "G-SW5VEKRRSD"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();

// alarmapp.js

const alarmForm = document.getElementById("alarmForm");

alarmForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const message = document.getElementById("message").value;
    const alarmTime = document.getElementById("alarmTime").value;

    // Get the current logged-in user
    const user = auth.currentUser;

    if (user) {
        // User is logged in, proceed to store alarm data in the database
        const alarmData = {
            email: user.email,
            message: message,  // Capture the user-specific message
            time: alarmTime
        };

        // Store the data in the "time" table in the Firebase Realtime Database
        const timeRef = db.ref("time");
        timeRef.push(alarmData);

        alert("Alarm set successfully!");
    } else {
        // User is not logged in
        alert("User not logged in. Please log in to set an alarm.");
    }
});
