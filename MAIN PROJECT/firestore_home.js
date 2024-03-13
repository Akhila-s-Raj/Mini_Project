// Initialize Firebase
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

// Check user authentication status
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in, update the session info
    const currentUserEmail = document.getElementById("currentUserEmail");
    const currentUserNameAndId = document.getElementById("currentUserNameAndId");

    // Fetch doctor details from the "doctors" collection in Firestore
    db.collection("doctors").doc(user.uid).get().then((doc) => {
      if (doc.exists) {
        // Display the doctor's name and ID
        const doctorName = doc.data().name;
        const doctorId = doc.data().id;

        // Access the DOM elements after successfully fetching data
        if (currentUserEmail && currentUserNameAndId) {
          currentUserEmail.textContent = `User: ${doctorName}`;
          currentUserNameAndId.textContent = `Doctor ID: ${doctorId}`;
        } else {
          console.error('DOM elements not found.');
        }
      } else {
        console.error('Doctor data not found.');
      }
    }).catch((error) => {
      console.error('Error fetching doctor details from Firestore:', error);
    });

    // Handle logout when the logout button is clicked
    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', () => {
      firebase.auth().signOut().then(() => {
        // Redirect to the login page after successful logout
        window.location.href = 'firestore_login.html';
      }).catch((error) => {
        console.error('Error logging out:', error);
      });
    });

    // Navigate to firestore_appointment.html when the user clicks "APPOINTMENTS"
    const appointmentsLink = document.getElementById('appointmentsLink');
    appointmentsLink.addEventListener('click', () => {
      window.location.href = 'firestore_appointment.html';
    });

    // Prevent navigating back to the previous page after logout
    window.addEventListener("beforeunload", (event) => {
      if (firebase.auth().currentUser) {
        // If the user is still logged in, show a confirmation message
        event.returnValue = 'You are logged out. Are you sure you want to leave?';
      }
    });
  } else {
    // User is not signed in, handle as needed (e.g., redirect to login page)
    // You can add code here to handle the case when the user is not signed in.
    // For example, you can redirect them to the login page.
    window.location.href = 'firestore_login.html';
  }
});
