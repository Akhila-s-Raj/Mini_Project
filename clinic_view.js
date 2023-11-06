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

const clinicTable = document.getElementById("clinicTable");

// Reference to the "clinic" table in Firebase Realtime Database
const clinicRef = database.ref("clinic");

// Reference to the "departments" table in Firebase Realtime Database
const departmentRef = database.ref("departments");

// Function to render clinics and their departments in a table
function renderClinicsAndDepartments() {
    clinicRef.on("value", (snapshot) => {
        clinicTable.innerHTML = ""; // Clear previous data
        const clinics = snapshot.val();

        for (const clinicId in clinics) {
            const clinicName = clinics[clinicId].clinicName;

            // Create a row for the clinic in the table
            const row = clinicTable.insertRow();
            const cellClinicName = row.insertCell(0);
            const cellDepartments = row.insertCell(1);
            const cellEdit = row.insertCell(2);

            cellClinicName.textContent = clinicName;

            // Create a container for the departments
            const departmentContainer = document.createElement("ul");
            departmentContainer.className = "department-list";

            // Retrieve and display departments for this clinic
            departmentRef.child(clinicId).on("value", (departmentSnapshot) => {
                const departments = departmentSnapshot.val();
                const departmentNames = [];
                for (const departmentId in departments) {
                    departmentNames.push(departments[departmentId].departmentName);
                }
                cellDepartments.textContent = departmentNames.join(", ");
            });

            // Create an Edit button
            const editButton = document.createElement("button");
            editButton.textContent = "Edit";

            // Set the data-clinic-id attribute to the clinicId for identifying the clinic
            editButton.setAttribute("data-clinic-id", clinicId);

            editButton.addEventListener("click", (e) => {
                // Handle the edit action here, e.g., navigate to the edit_department.html page
                const clickedClinicId = e.target.getAttribute("data-clinic-id");
                window.location.href = `clinic_update.html?clinic=${clickedClinicId}`;
            });
            cellEdit.appendChild(editButton);
        }
    });
}

// Call the function to render clinics and departments when the page loads
renderClinicsAndDepartments();
