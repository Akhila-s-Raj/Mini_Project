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
clinicForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const clinicName = clinicNameField.value;

  // Check if a clinic with the same name already exists
  const clinicRef = database.ref("clinic");
  const snapshot = await clinicRef.orderByChild("clinicName").equalTo(clinicName).once("value");

  if (snapshot.exists()) {
    window.alert("A clinic with the same name already exists. Please choose a different name.");
    return;
  }

  // Create a unique clinic ID (e.g., using a timestamp)
  const clinicId = Date.now().toString();

  // Create a data object
  const data = {
    clinicName: clinicName,
  };

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

// Add an event listener to the "Logout" button
const logoutButton = document.getElementById("logoutButton");
if (logoutButton) {
  logoutButton.addEventListener("click", () => {
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
