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

// Reference to the "doctors_details" table in Firebase Realtime Database
const doctorsDetailsRef = database.ref('details_of_doctors');

// Reference to the form fields
const selectHospital = document.getElementById('selectHospital');
const selectDepartment = document.getElementById('selectDepartment');

// Fetch hospitals and populate the hospital dropdown
const hospitalsRef = database.ref('hospitals');
hospitalsRef.once('value', (snapshot) => {
    snapshot.forEach((childSnapshot) => {
        const hospitalData = childSnapshot.val();
        const option = document.createElement('option');
        option.value = childSnapshot.key;
        option.text = hospitalData.clinicName;
        selectHospital.add(option);
    });
});

// Handle hospital selection change to dynamically populate the department dropdown
selectHospital.addEventListener('change', () => {
    const selectedHospitalId = selectHospital.value;

    // Clear existing options
    selectDepartment.innerHTML = '';

    // Fetch departments for the selected hospital and populate the department dropdown
    if (selectedHospitalId) {
        const selectedHospitalRef = hospitalsRef.child(selectedHospitalId);
        selectedHospitalRef.child('departments').once('value', (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const department = childSnapshot.val();
                const option = document.createElement('option');
                option.value = department;
                option.text = department;
                selectDepartment.add(option);
            });
        });
    }
});

// Load doctors based on selected hospital and department
// ... (Previous code)

// Load doctors based on selected hospital and department
function loadDoctors() {
    const selectedHospitalId = selectHospital.value;
    const selectedDepartment = selectDepartment.value;
    const queryParam = `${selectedHospitalId}_${selectedDepartment}`;

    doctorsDetailsRef.orderByChild('hospitalId_department')
        .equalTo(queryParam)
        .once('value', (snapshot) => {
            const doctorsListContainer = document.getElementById('doctorsList');
            doctorsListContainer.innerHTML = ''; // Clear previous content

            snapshot.forEach((childSnapshot) => {
                const doctorData = childSnapshot.val();

                const doctorItem = document.createElement('div');
                doctorItem.innerHTML = `
                    <p>Name: ${doctorData.name}</p>
                    <p>Speciality: ${doctorData.speciality}</p>
                    <button onclick="viewDoctorDetails('${childSnapshot.key}')">View Details</button>
                    <hr>`;
                doctorsListContainer.appendChild(doctorItem);
            });
        });
}

// Function to redirect to doctor_details.html with the selected doctor's key
function viewDoctorDetails(doctorKey) {
    window.location.href = `doctors_profile_view.html?key=${doctorKey}`;
}
