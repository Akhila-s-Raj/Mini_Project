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

// Get references to the form fields
const specialityField = document.getElementById("speciality");
const licenseNumberField = document.getElementById("licenseNumber");
const photoField = document.getElementById("photo");
const updateDoctorButton = document.getElementById("updateDoctorButton");
const editDoctorForm = document.getElementById("editDoctorForm");

// Add an event listener to the "Update" button
updateDoctorButton.addEventListener("click", function (e) {
    e.preventDefault();

    // Check if a user is logged in
    const user = auth.currentUser;
    if (!user) {
        window.alert("Please log in to update doctor details.");
        return;
    }

    // Fetch the current doctor's details from the database
    const doctorRef = database.ref(`doctors_details/${user.uid}`);
    doctorRef.once("value", (snapshot) => {
        const doctorData = snapshot.val();

        if (doctorData) {
            // Update the doctor's details with the new values
            doctorData.speciality = specialityField.value;
            doctorData.licenseNumber = licenseNumberField.value;

            // Save the updated details back to the database
            doctorRef.set(doctorData, (error) => {
                if (error) {
                    console.error("Data could not be updated: " + error);
                } else {
                    console.log("Data updated successfully.");
                    window.alert("Doctor's details updated successfully!");
                    // Optionally, you can reset the form after a successful update
                    editDoctorForm.reset();
                }
            });
        }
    });
});

// Initialize the form fields with the user's current doctor details
auth.onAuthStateChanged((user) => {
    if (user) {
        const doctorRef = database.ref(`doctors_details/${user.uid}`);
        doctorRef.once("value", (snapshot) => {
            const doctorData = snapshot.val();
            if (doctorData) {
                specialityField.value = doctorData.speciality || "";
                licenseNumberField.value = doctorData.licenseNumber || "";
            }
        });
    }
});
