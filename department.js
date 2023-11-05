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
const clinicField = document.getElementById("clinic");
const departmentNameField = document.getElementById("departmentName");
const departmentForm = document.getElementById("departmentForm");

// Populate clinic options from Firebase
const clinicRef = database.ref("clinic");
clinicRef.on("value", (snapshot) => {
    clinicField.innerHTML = ""; // Clear previous options
    const clinics = snapshot.val();
    for (const clinicId in clinics) {
        const clinicName = clinics[clinicId].clinicName;
        const option = document.createElement("option");
        option.value = clinicId;
        option.textContent = clinicName;
        clinicField.appendChild(option);
    }
});

// Handle form submission
departmentForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const clinicId = clinicField.value;
    const departmentName = departmentNameField.value;

    // Generate a unique department ID (e.g., using a timestamp)
    const departmentId = Date.now().toString();

    // Create a data object
    const data = {
        departmentName: departmentName,
    };

    // Reference to the "departments" table in Firebase Realtime Database
    const departmentRef = database.ref("departments");

    // Push the data to the "departments" table with the generated department ID
    departmentRef.child(clinicId).child(departmentId).set(data, (error) => {
        if (error) {
            console.error("Data could not be saved: " + error);
        } else {
            console.log("Department added successfully.");
            window.alert("Department added successfully!");
            // Optionally, you can reset the form after successful submission
            departmentNameField.value = "";
        }
    });
});
