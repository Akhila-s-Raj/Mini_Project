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
const clinicField = document.getElementById("clinic");
const departmentField = document.getElementById("department");
const photoField = document.getElementById("photo");
const doctorForm = document.getElementById("doctorForm");

// Populate clinic options from Firebase
const clinicRef = database.ref("clinic");
clinicRef.on("value", (snapshot) => {
  clinicField.innerHTML = ""; // Clear previous options
  const clinics = snapshot.val();
  // Create a default "SELECT" option
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "SELECT";
  clinicField.appendChild(defaultOption);
  for (const key in clinics) {
    const clinicName = clinics[key].clinicName;
    const option = document.createElement("option");
    option.value = key;
    option.textContent = clinicName;
    clinicField.appendChild(option);
  }
});

// Populate department options from Firebase
const departmentRef = database.ref("departments"); // Change "department" to "departments"
departmentRef.on("value", (snapshot) => {
  departmentField.innerHTML = ""; // Clear previous options
  const departments = snapshot.val();
  // Create a default "SELECT" option
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "SELECT";
  departmentField.appendChild(defaultOption);
  for (const key in departments) {
    const departmentName = departments[key].departmentName;
    const option = document.createElement("option");
    option.value = key;
    option.textContent = departmentName;
    departmentField.appendChild(option);
  }
});

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
  const clinic = clinicField.value;
  const department = departmentField.value;
  const photo = photoField.files[0]; // Get the selected file

  if (!clinic || !department) {
    window.alert("Please select a clinic and a department.");
    return;
  }

  // Create a data object
  const data = {
    speciality: speciality,
    licenseNumber: licenseNumber,
    clinic: clinic,
    department: department,
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
