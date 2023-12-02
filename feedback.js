// Firebase Configuration
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

// Feedback Form JavaScript

const feedbackForm = document.getElementById("feedbackForm");

feedbackForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const feedbackMessage = document.getElementById("feedbackMessage").value;

    // Get the currently logged-in user's email
    const userEmail = auth.currentUser ? auth.currentUser.email : "Anonymous";

    try {
        // Store feedback data in the "feedback" table in Firebase Realtime Database
        const feedbackRef = db.ref("feedback").push({
            feedbackMessage: feedbackMessage,
            userEmail: userEmail,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });

        // Feedback stored successfully
        alert("Feedback submitted successfully!");

        // You can redirect to a thank you page or perform other actions if needed
        window.location.href = "thankyou.html";
    } catch (error) {
        // Handle feedback submission errors
        const errorMessage = error.message;
        alert(errorMessage);
    }
});
