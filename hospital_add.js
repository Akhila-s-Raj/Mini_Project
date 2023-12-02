// Initialize Firebase with your project configuration
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

// Reference to the Firebase database
const database = firebase.database();
const hospitalsRef = database.ref('hospitals');

// JavaScript to generate hospital ID
let nextHospitalId = 1;

// Function to format the hospital ID with leading zeros (e.g., HS001)
function formatHospitalId(id) {
    const paddedId = String(id).padStart(3, '0');
    return `HS${paddedId}`;
}

// Function to update the hospital ID input field
function updateHospitalIdField() {
    document.getElementById('hospitalId').value = formatHospitalId(nextHospitalId);
}

// Handle form submission
document.getElementById('hospital-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const location = document.getElementById('location').value;
    const hospitalId = formatHospitalId(nextHospitalId);

    // Push hospital data to the Firebase database
    hospitalsRef.push({
        hospitalId: hospitalId,
        name: name,
        location: location,
    });

    // Increment the hospital ID for the next entry
    nextHospitalId++;
    updateHospitalIdField();

    // Reset the form
    document.getElementById('name').value = '';
    document.getElementById('location').value = '';
});

// Initialize the hospital ID field
updateHospitalIdField();
