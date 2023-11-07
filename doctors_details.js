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

// Get references to the form fields
const specialityField = document.getElementById("speciality");
const licenseNumberField = document.getElementById("licenseNumber");
const photoField = document.getElementById("photo");
const doctorForm = document.getElementById("doctorForm");

// Handle form submission
doctorForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Check if a user is logged in
  const user = auth.currentUser;
  if (!user) {
    window.alert("Please log in to add doctor details.");
    return;
  }

  const speciality = specialityField.value;
  const licenseNumber = licenseNumberField.value;
  const photo = photoField.files[0]; // Get the selected file

  if (!speciality || !licenseNumber || !photo) {
    window.alert("Please fill in all required fields.");
    return;
  }

  // Create a data object
  const data = {
    speciality: speciality,
    licenseNumber: licenseNumber,
    email: user.email, // Add the user's email to the data
  };

  // Reference to the "doctors_details" table in Firebase Realtime Database
  const doctorsDetailsRef = database.ref(`doctors_details/${user.uid}`); // Store under user's UID

  // Push the data to the "doctors_details" table
  const newDoctorRef = doctorsDetailsRef.push(data, (error) => {
    if (error) {
      console.error("Data could not be saved: " + error);
    } else {
      console.log("Data saved successfully.");
      window.alert("Doctor's details added successfully!");
      // Optionally, you can reset the form after successful submission
      doctorForm.reset();
    }
  });

  // Upload the photo to Firebase Storage (you need to configure Firebase Storage for this)
  const storageRef = storage.ref(`doctor_photos/${user.uid}/${newDoctorRef.key}`);
  storageRef.put(photo).then((snapshot) => {
    console.log("Photo uploaded successfully");
  });
});
