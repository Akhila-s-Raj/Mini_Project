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
const clinicNameField = document.getElementById("clinicName");
const clinicForm = document.getElementById("clinicForm");

// Handle form submission
clinicForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const clinicName = clinicNameField.value;

    // Create a unique clinic ID (e.g., using a timestamp)
    const clinicId = Date.now().toString();

    // Create a data object
    const data = {
        clinicName: clinicName,
    };

    // Reference to the "clinic" table in Firebase Realtime Database
    const clinicRef = database.ref("clinic");

    // Push the data to the "clinic" table with the generated clinic ID
    clinicRef.child(clinicId).set(data, (error) => {
        if (error) {
            console.error("Data could not be saved: " + error);
        } else {
            console.log("Clinic added successfully.");
            window.alert("Clinic added successfully!");
            // Optionally, you can reset the form after successful submission
            clinicNameField.value = "";
        }
    });
});
