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
  
  const doctorTable = document.getElementById("doctorTable").getElementsByTagName('tbody')[0];
  
  // Check if a user is logged in (doctor) and get their email
  const user = auth.currentUser;
  if (user) {
    const doctorEmail = user.email;
  
    // Reference to the "doctors_details" table in Firebase Realtime Database
    const doctorsDetailsRef = database.ref("doctors_details");
  
    // Fetch and display the doctor's details
    doctorsDetailsRef.orderByChild("email").equalTo(doctorEmail).on("value", (snapshot) => {
      doctorTable.innerHTML = ""; // Clear previous rows
  
      snapshot.forEach((doctorSnapshot) => {
        const doctorData = doctorSnapshot.val();
        const row = doctorTable.insertRow();
  
        // Populate the table with doctor's details
        const specialityCell = row.insertCell(0);
        specialityCell.textContent = doctorData.speciality;
  
        const licenseNumberCell = row.insertCell(1);
        licenseNumberCell.textContent = doctorData.licenseNumber;
  
        const clinicCell = row.insertCell(2);
        clinicCell.textContent = doctorData.clinic;
  
        const departmentCell = row.insertCell(3);
        departmentCell.textContent = doctorData.department;
  
        // Add Edit button for each row
        const editCell = row.insertCell(4);
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "btn-edit";
        editButton.addEventListener("click", () => {
          // Handle edit functionality (e.g., open a form to edit and save data)
          // You can create a form and use the doctorData to populate the form fields
        });
        editCell.appendChild(editButton);
      });
    });
  }
  