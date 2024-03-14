// Initialize Firebase
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

const firestore = firebase.firestore();

const hospitalDropdown = document.getElementById('hospital');
const departmentDropdown = document.getElementById('department');
const doctorsListContainer = document.querySelector('.doctors-list');

// Fetch hospitals from Firestore and populate the hospital dropdown
const hospitalsCollection = firestore.collection('hospitals');

hospitalsCollection.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        const hospitalData = doc.data();
        const option = document.createElement('option');
        option.value = doc.id; // Use doc.id as the value
        option.text = hospitalData.hospitalName;
        hospitalDropdown.add(option);
    });
});

// Function to load departments based on the selected hospital
function loadDepartments() {
    const selectedHospitalId = hospitalDropdown.value;

    // Clear existing options and add a default option
    departmentDropdown.innerHTML = '<option value="" disabled selected>Select Department</option>';

    // Fetch departments for the selected hospital and populate the department dropdown
    if (selectedHospitalId) {
        const selectedHospitalRef = hospitalsCollection.doc(selectedHospitalId);
        selectedHospitalRef.get().then((doc) => {
            const departments = doc.data().departments;

            if (departments) {
                departments.forEach((department) => {
                    const option = document.createElement('option');
                    option.value = department;
                    option.text = department;
                    departmentDropdown.add(option);
                });
            }
        });
    }
}

// Function to load doctors based on the selected hospital and department
// Function to load doctors based on the selected hospital and department
function loadDoctors() {
    const selectedHospitalId = hospitalDropdown.value;
    const selectedDepartment = departmentDropdown.value;

    // Clear existing doctors list
    doctorsListContainer.innerHTML = '';

    // Fetch doctors from Firestore based on the selected hospital and department
    if (selectedHospitalId && selectedDepartment) {
        const doctorsCollection = firestore.collection('doctors_list');

        doctorsCollection
            .where('hospital.id', '==', selectedHospitalId)
            .where('department', '==', selectedDepartment)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const doctorData = doc.data();
                    const doctorItem = document.createElement('div');
                    doctorItem.classList.add('doctor-item');

                    // Create a button to view details
                    const viewDetailsButton = document.createElement('button');
                    viewDetailsButton.textContent = 'View Details';
                    viewDetailsButton.addEventListener('click', () => {
                        // Navigate to firestore_ViewDoctorsDerails.html with doctor's details
                        window.location.href = `firestore_ViewDoctorsDerails.html?doctorId=${doc.id}`;
                    });

                    // Display doctor's information
                    doctorItem.innerHTML = `<strong>${doctorData.name}</strong> (ID: ${doctorData.doctorId})`;
                    doctorItem.appendChild(viewDetailsButton);

                    doctorsListContainer.appendChild(doctorItem);
                });
            })
            .catch((error) => {
                console.error('Error loading doctors:', error);
            });
    }
}
