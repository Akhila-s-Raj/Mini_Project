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
const database = firebase.database();

const logoutLink = document.getElementById("logoutLink");
if (logoutLink) {
  logoutLink.addEventListener("click", () => {
    // Sign out the user
    firebase.auth().signOut().then(() => {
      // Redirect to the login page after successful logout
      window.location.href = 'login.html';
      // Clear the browser's history to prevent going back
      clearBrowserHistory();
    }).catch((error) => {
      console.error('Error logging out:', error);
    });
  });
}

// Function to clear the browser's history
function clearBrowserHistory() {
  if (typeof window.history.pushState === 'function') {
    window.history.pushState({}, 'Login', 'login.html');
  }
}

const departmentForm = document.getElementById("departmentForm");
const departmentSelect = document.getElementById("departmentSelect");
const departmentNameField = document.getElementById("departmentName");
const deleteButton = document.getElementById("deleteButton");

// Get the clinic ID from the query parameter
const urlParams = new URLSearchParams(window.location.search);
const clinicId = urlParams.get("clinic");

// Reference to the "departments" table in Firebase Realtime Database
const departmentRef = database.ref("departments").child(clinicId);

// Function to populate the department dropdown and set up event listeners
function populateDepartmentDropdown() {
    departmentRef.on("value", (snapshot) => {
        const departments = snapshot.val();

        // Clear previous options
        departmentSelect.innerHTML = "";

        // Populate the department dropdown with available departments
        for (const departmentId in departments) {
            const departmentName = departments[departmentId];

            const option = document.createElement("option");
            option.value = departmentId;
            option.textContent = departmentName;
            departmentSelect.appendChild(option);
        }
    });

    // Handle form submission for updating department
    departmentForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const updatedDepartmentId = departmentSelect.value;
        const updatedDepartmentName = departmentNameField.value;

        // Update the department data in Firebase
        departmentRef.child(updatedDepartmentId).set(updatedDepartmentName, (error) => {
            if (error) {
                console.error("Department data could not be updated: " + error);
            } else {
                console.log("Department data updated successfully.");
                alert("Department updated successfully!");
            }
        });
    });

    // Handle department deletion
    deleteButton.addEventListener("click", function () {
        if (confirm("Are you sure you want to delete this department?")) {
            const departmentId = departmentSelect.value;

            // Delete the department data from Firebase
            departmentRef.child(departmentId).remove((error) => {
                if (error) {
                    console.error("Department could not be deleted: " + error);
                } else {
                    console.log("Department deleted successfully.");

                    // Remove the deleted department from the dropdown
                    departmentSelect.remove(departmentSelect.selectedIndex);

                    alert("Department deleted successfully!");
                }
            });
        }
    });
}

// Call the function to populate the dropdown and set up event listeners
populateDepartmentDropdown();
