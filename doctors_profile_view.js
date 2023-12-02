// Initialize Firebase with your configuration
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

const auth = firebase.auth();
const database = firebase.database();
const storage = firebase.storage();

// Reference to the "details_of_doctors" table in Firebase Realtime Database
const detailsOfDoctorsRef = database.ref('details_of_doctors');

// Function to get the doctor details based on the key from the query parameter
function getDoctorDetails() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const doctorKey = urlParams.get('key');

    if (doctorKey) {
        detailsOfDoctorsRef.child(doctorKey).once('value', (snapshot) => {
            const doctorData = snapshot.val();
            displayDoctorDetails(doctorData);
        });
    } else {
        console.error('Doctor key not found in the query parameter.');
    }
}

// Function to display the doctor details
function displayDoctorDetails(doctorData) {
    const doctorDetailsContainer = document.getElementById('doctorDetailsContainer');

    if (doctorData) {
        doctorDetailsContainer.innerHTML = `
            <table>
                <tr>
                    <th>Name</th>
                    <td>${doctorData.name}</td>
                </tr>
                <tr>
                    <th>Speciality</th>
                    <td>${doctorData.speciality}</td>
                </tr>
                <tr>
                    <th>License Number</th>
                    <td>${doctorData.licenseNumber}</td>
                </tr>
                <tr>
                    <th>Hospital</th>
                    <td>${doctorData.hospital}</td>
                </tr>
                <tr>
                    <th>Department</th>
                    <td>${doctorData.department}</td>
                </tr>
                <tr>
                    <th>Previous Hospital</th>
                    <td>${doctorData.prevHospital}</td>
                </tr>
                <tr>
                    <th>Experience</th>
                    <td>${doctorData.experience}</td>
                </tr>
            </table>
        `;
    } else {
        doctorDetailsContainer.innerHTML = 'Doctor details not found.';
    }
}

// Download button functionality
document.getElementById('downloadButton').addEventListener('click', function() {
    // Target the element whose content you want to convert to PDF
    const element = document.getElementById('doctorDetailsContainer'); // Replace with your element ID

    // Use html2pdf library to generate PDF
    html2pdf(element);
});

// Call the function to get and display doctor details when the page loads
window.onload = function () {
    getDoctorDetails();
};
