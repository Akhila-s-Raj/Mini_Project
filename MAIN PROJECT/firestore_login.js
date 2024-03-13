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
const firestore = firebase.firestore(); // Use Firestore instead of Realtime Database

const loginForm = document.getElementById("adminLoginForm");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Check if the user is an admin
        if (email === "admin123@gmail.com") {
            window.location.href = "dashboard.html";
            return;
        }

        // Check if the user exists in the "doctors" collection in Firestore
        const doctorsRef = firestore.collection("doctors");
        const doctorDoc = await doctorsRef.doc(user.uid).get();

        if (doctorDoc.exists) {
            window.location.href = "firestore_home.html";
            return;
        }

        // If user is not an admin or a doctor, handle accordingly
        alert("Invalid user");
    } catch (error) {
        // Handle login errors
        const errorMessage = error.message;
        alert(errorMessage);
    } finally {
        // Reset the form
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
    }
});
