// doctors_details.js

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

// Reference to the "hospitals" table in Firebase Realtime Database
const hospitalsRef = database.ref('hospitals');

// Reference to the form fields
const specialityField = document.getElementById("speciality");
const licenseNumberField = document.getElementById("licenseNumber");
const photoField = document.getElementById("photo");
const hospitalDropdown = document.getElementById('hospital');
const departmentDropdown = document.getElementById('department');
const prevHospitalField = document.getElementById("prevHospital");
const certificateField = document.getElementById("certificate");
const experienceField = document.getElementById("experience");
const doctorForm = document.getElementById("doctorForm");

// Reference to the "details_of_doctors" table in Firebase Realtime Database
const detailsOfDoctorsRef = database.ref('details_of_doctors');

// Fetch hospitals and populate the hospital dropdown
hospitalsRef.once('value', (snapshot) => {
  snapshot.forEach((childSnapshot) => {
    const hospitalData = childSnapshot.val();
    const option = document.createElement('option');
    option.value = childSnapshot.key;
    option.text = hospitalData.clinicName;
    hospitalDropdown.add(option);
  });
});

// Handle hospital selection change to dynamically populate the department dropdown
hospitalDropdown.addEventListener('change', () => {
  const selectedHospitalId = hospitalDropdown.value;

  // Clear existing options
  departmentDropdown.innerHTML = '';

  // Fetch departments for the selected hospital and populate the department dropdown
  if (selectedHospitalId) {
    const selectedHospitalRef = hospitalsRef.child(selectedHospitalId);
    selectedHospitalRef.child('departments').once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const department = childSnapshot.val();
        const option = document.createElement('option');
        option.value = department;
        option.text = department;
        departmentDropdown.add(option);
      });
    });
  }
});

// Handle form submission
doctorForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  // Check if a user is logged in
  const user = auth.currentUser;
  if (!user) {
    window.alert("Please log in to add doctor details.");
    return;
  }

  // Fetch the currently logged-in user's name and doctor_id
  const userName = await getUserName(user.uid);
  const doctorId = await getDoctorId(user.uid);

  const speciality = specialityField.value;
  const licenseNumber = licenseNumberField.value;
  const photo = photoField.files[0]; // Get the selected file
  const selectedHospitalId = hospitalDropdown.value;
  const selectedDepartment = departmentDropdown.value;
  const prevHospital = prevHospitalField.value;
  const certificate = certificateField.files[0]; // Get the selected PDF file
  const experience = experienceField.value;

  if (!speciality || !licenseNumber || !photo || !selectedHospitalId || !selectedDepartment || !prevHospital || !certificate || !experience) {
    window.alert("Please fill in all required fields.");
    return;
  }

  // Create a data object
  const data = {
    speciality: speciality,
    licenseNumber: licenseNumber,
    email: user.email, // Add the user's email to the data
    name: userName, // Add the user's name to the data
    hospitalId: selectedHospitalId,
    department: selectedDepartment,
    hospitalId_department: `${selectedHospitalId}_${selectedDepartment}`,
    doctorId: doctorId, // Add the doctor_id to the data
    prevHospital: prevHospital,
    experience: experience,
  };

  // Push the data to the "details_of_doctors" table
  const newDoctorRef = detailsOfDoctorsRef.push(data, (error) => {
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
  const photoStorageRef = storage.ref(`doctor_photos/${user.uid}/${newDoctorRef.key}`);
  photoStorageRef.put(photo).then((snapshot) => {
    console.log("Photo uploaded successfully");
  });

  // Upload the certificate to Firebase Storage (you need to configure Firebase Storage for this)
  const certificateStorageRef = storage.ref(`doctor_certificates/${user.uid}/${newDoctorRef.key}`);
  certificateStorageRef.put(certificate).then((snapshot) => {
    console.log("Certificate uploaded successfully");
  });
});

// Function to get the user's name from the "users" table
async function getUserName(userId) {
  const usersRef = database.ref('users');
  const snapshot = await usersRef.child(userId).once('value');
  const userData = snapshot.val();
  return userData ? userData.name : '';
}

// Function to get the doctor_id from the "users" table
async function getDoctorId(userId) {
  const usersRef = database.ref('users');
  const snapshot = await usersRef.child(userId).once('value');
  const userData = snapshot.val();
  return userData ? userData.doctor_id : '';
}
