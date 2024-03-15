// Firestore configuration and initialization
const firebaseConfig = {
  apiKey: "AIzaSyCMiRy5r5mbbYCUfw_4fiIThEHHJOtOiHY",
  authDomain: "mainproject-565f9.firebaseapp.com",
  projectId: "mainproject-565f9",
  storageBucket: "mainproject-565f9.appspot.com",
  messagingSenderId: "243845690343",
  appId: "1:243845690343:web:14cae7ce82fb372fd3c342",
  measurementId: "G-SW5VEKRRSD"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

function populateAppointments() {
  const appointmentTable = document.getElementById("appointmentTable");

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      db.collection("doctors").doc(user.uid).get().then((doc) => {
        if (doc.exists) {
          const doctorName = doc.data().name;
          const doctorId = doc.data().id;

          const currentUserEmail = document.getElementById("currentUserEmail");
          const currentUserNameAndId = document.getElementById("currentUserNameAndId");

          if (currentUserEmail && currentUserNameAndId) {
            currentUserEmail.textContent = `User: ${doctorName}`;
            currentUserNameAndId.textContent = `Doctor ID: ${doctorId}`;
          } else {
            console.error('DOM elements not found.');
          }

          db.collection("appointments")
            .where("doctor.name", "==", doctorName)
            .get().then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const appointmentData = doc.data();
                const row = appointmentTable.insertRow(-1);

                row.insertCell(0).textContent = appointmentData.appointmentId;
                row.insertCell(1).textContent = appointmentData.patientId;
                row.insertCell(2).textContent = appointmentData.patientName;
                row.insertCell(3).textContent = appointmentData.appointmentDate.toDate().toLocaleDateString();
                row.insertCell(4).textContent = appointmentData.appointmentTime;

                const viewDetailsButton = document.createElement("button");
                viewDetailsButton.textContent = "View Details";
                viewDetailsButton.addEventListener("click", () => {
                  navigateToPatientDetails(appointmentData.patientId);
                });
                row.insertCell(5).appendChild(viewDetailsButton);
              });
            });
        } else {
          console.error('Doctor data not found.');
        }
      }).catch((error) => {
        console.error('Error fetching doctor details from Firestore:', error);
      });
    } else {
      window.location.href = 'firestore_login.html';
    }
  });
}

function searchAppointments() {
  const appointmentTable = document.getElementById("appointmentTable");
  const searchInput = document.getElementById("searchInput").value.trim().toUpperCase();

  appointmentTable.innerHTML = "<thead><tr><th>Appointment ID</th><th>Patient ID</th><th>Patient Name</th><th>Appointment Date</th><th>Appointment Time</th><th>Action</th></tr></thead><tbody></tbody>";

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      db.collection("doctors").doc(user.uid).get().then((doc) => {
        if (doc.exists) {
          const doctorName = doc.data().name;

          db.collection("appointments")
            .where("doctor.name", "==", doctorName)
            .where("patientId", "==", searchInput)
            .get().then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const appointmentData = doc.data();
                const row = appointmentTable.insertRow(-1);

                row.insertCell(0).textContent = appointmentData.appointmentId;
                row.insertCell(1).textContent = appointmentData.patientId;
                row.insertCell(2).textContent = appointmentData.patientName;
                row.insertCell(3).textContent = appointmentData.appointmentDate.toDate().toLocaleDateString();
                row.insertCell(4).textContent = appointmentData.appointmentTime;

                const viewDetailsButton = document.createElement("button");
                viewDetailsButton.textContent = "View Details";
                viewDetailsButton.addEventListener("click", () => {
                  navigateToPatientDetails(appointmentData.patientId);
                });
                row.insertCell(5).appendChild(viewDetailsButton);
              });
            });
        } else {
          console.error('Doctor data not found.');
        }
      }).catch((error) => {
        console.error('Error fetching doctor details from Firestore:', error);
      });
    } else {
      window.location.href = 'firestore_login.html';
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  populateAppointments();
});

function navigateToPatientDetails(patientId) {
  window.location.href = `firestore_patientDetails.html?patientId=${patientId}`;
}
