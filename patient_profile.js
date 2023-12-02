// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCMiRy5r5mbbYCUfw_4fiIThEHHJOtOiHY",
    authDomain: "mainproject-565f9.firebaseapp.com",
    databaseURL: "https://mainproject-565f9-default-rtdb.firebaseio.com",
    projectId: "mainproject-565f9",
    storageBucket: "mainproject-565f9.appspot.com",
    messagingSenderId: "243845690343",
    appId: "1:243845690343:web:14cae7ce82fb372fd3c342",
    measurementId: "G-SW5VEKRRSD"
};

 
firebase.initializeApp(firebaseConfig);

// Get a reference to the Firebase database
const database = firebase.database();

// DOM elements
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const mobileNumberInput = document.getElementById('mobile_number');
const genderInput = document.getElementById('gender');
const patientIdInput = document.getElementById('patient_id');
const userTypeInput = document.getElementById('user_type');

// Function to load and display patient profile data
function loadPatientProfile(userId) {
    const patientRef = database.ref('patients/' + userId);

    // Retrieve patient data and update form fields
    patientRef.once('value').then((snapshot) => {
        const patientData = snapshot.val();
        nameInput.value = patientData.name;
        emailInput.value = patientData.email;
        mobileNumberInput.value = patientData.mobile_number;
        genderInput.value = patientData.gender;
        patientIdInput.value = patientData.patient_id;
        userTypeInput.value = patientData.user_type;
    }).catch((error) => {
        console.error('Error loading patient profile:', error);
    });
}
// ... (existing code)

// Check authentication state
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in (get the user ID)
        const userId = user.uid;

        // Load the patient profile using the user ID
        loadPatientProfile(userId);

        // Handle "Edit Profile" button click
        const editProfileButton = document.getElementById('edit-profile-button');
        editProfileButton.addEventListener('click', () => {
            // Redirect to patient_profile_update.html
            window.location.href = 'patient_profile_update.html';
        });
    } else {
        // User is signed out
        // Redirect or handle as needed
        console.log("User is signed out");
    }
});
