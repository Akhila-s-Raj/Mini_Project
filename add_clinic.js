
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
  // Get a reference to the Firebase Realtime Database
  //var database = firebase.database();
  
  // Listen for the form submission
  document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the default form submission
  
    // Get values from the form
    var clinicID = document.getElementById("clinicID").value;
    var clinicName = document.getElementById("clinicName").value;
    var departmentID = document.getElementById("departmentID").value;
    var departmentName = document.getElementById("departmentName").value;
  
    // Create a data object
    var data = {
      clinicID: clinicID,
      clinicName: clinicName,
      departmentID: departmentID,
      departmentName: departmentName,
    };
  
    // Reference to the "clinic_details" table in Firebase Realtime Database
    var clinicDetailsRef = database.ref("clinic_details");
  
    // Push the data to the "clinic_details" table
    clinicDetailsRef.push(data, function (error) {
      if (error) {
        console.error("Data could not be saved." + error);
      } else {
        console.log("Data saved successfully.");
        window.alert("Clinic added successfully!");
        // Optionally, you can reset the form after successful submission
        document.querySelector("form").reset();
      }
    });
  });
  