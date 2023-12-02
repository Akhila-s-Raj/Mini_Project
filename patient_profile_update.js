const firebaseConfig = {
    apiKey: "AIzaSyCMiRy5r5mbbYCUfw_4fiIThEHHJOtOiHY",
    authDomain: "mainproject-565f9.firebaseapp.com",
    databaseURL: "https://mainproject-565f9-default-rtdb.firebaseio.com",
    projectId: "mainproject-565f9",
    storageBucket: "mainproject-565f9.appspot.com",
    messagingSenderId: "243845690343",
    appId: "1:243845690343:web:14cae7ce82fb372fd3c342",
    measurementId: "G-SW5VEKRRSD"
}

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const database = firebase.database();
const storage = firebase.storage();

// DOM elements
const editNameInput = document.getElementById('edit-name');
const editMobileNumberInput = document.getElementById('edit-mobile_number');
const editGenderInput = document.getElementById('edit-gender');
const updateButton = document.getElementById('update-button');

// Function to update patient profile data
function updatePatientProfile(userId, updatedData) {
    const patientRef = database.ref('patients/' + userId);

    // Update patient data in the database
    return patientRef.update(updatedData);
}

// Check authentication state
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in (get the user ID)
        const userId = user.uid;

        // Load the existing patient profile data
        loadPatientProfile(userId);

        // Handle update button click
        updateButton.addEventListener('click', () => {
            // Get the updated data from the form
            const updatedData = {
                name: editNameInput.value.trim(),
                mobile_number: editMobileNumberInput.value.trim(),
                gender: editGenderInput.value,
            };

            // Update patient profile in the database
            updatePatientProfile(userId, updatedData)
                .then(() => {
                    alert('Patient profile updated successfully!');
                    // You can redirect or perform other actions here
                })
                .catch((error) => {
                    console.error('Error updating patient profile:', error);
                });
        });
    } else {
        // User is signed out
        // Redirect or handle as needed
        console.log("User is signed out");
    }
});

// Function to load and display existing patient profile data
function loadPatientProfile(userId) {
    const patientRef = database.ref('patients/' + userId);

    // Retrieve patient data and update the form fields
    patientRef.once('value').then((snapshot) => {
        const patientData = snapshot.val();
        editNameInput.value = patientData.name;
        editMobileNumberInput.value = patientData.mobile_number;
        editGenderInput.value = patientData.gender;
    }).catch((error) => {
        console.error('Error loading patient profile:', error);
    });
}
