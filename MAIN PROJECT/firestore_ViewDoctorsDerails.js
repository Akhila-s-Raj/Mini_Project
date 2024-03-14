// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCMiRy5r5mbbYCUfw_4fiIThEHHJOtOiHY",
    authDomain: "mainproject-565f9.firebaseapp.com",
    projectId: "mainproject-565f9",
    storageBucket: "mainproject-565f9.appspot.com",
    messagingSenderId: "243845690343",
    appId: "1:243845690343:web:14cae7ce82fb372fd3c342",
    measurementId: "G-SW5VEKRRSD"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Function to go back to the previous page
function goBack() {
    window.history.back();
}

// Fetch the doctorId from the URL parameters
// Fetch the doctorId from the URL parameters
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const doctorId = urlParams.get('doctorId');
console.log('Doctor ID:', doctorId);


// Function to load and display doctor details
// Function to load and display doctor details

async function loadDoctorDetails() {
    console.log('Loading doctor details for ID:', doctorId);

    const doctorsDetailsCollection = firebase.firestore().collection('doctors_details');

    try {
        const doc = await doctorsDetailsCollection.doc(doctorId).get();
        console.log('Firestore document data:', doc.data());

        if (doc.exists) {
            const doctorData = doc.data();
            const doctorDetailsContainer = document.getElementById('doctorDetailsContainer');

            // Display doctor details as needed
            doctorDetailsContainer.innerHTML = `
                <p><strong>Name:</strong> ${doctorData.name}</p>
                <p><strong>Speciality:</strong> ${doctorData.speciality}</p>
                <p><strong>License Number:</strong> ${doctorData.licenseNumber}</p>
                <!-- Add more details as needed -->
            `;
        } else {
            console.error('Doctor not found.');
        }
    } catch (error) {
        console.error('Error loading doctor details:', error);
    }
}

// Call the function to load and display doctor details
loadDoctorDetails();

