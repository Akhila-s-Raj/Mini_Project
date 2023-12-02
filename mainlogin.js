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


const auth = firebase.auth();


const db = firebase.database();


const loginForm = document.getElementById("adminLoginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Check if the user is an admin
    if (email === "admin123@gmail.com") {
      window.location.href = "dashboard.html";
      return;
    }

    // Check if the user is in the "users" table
    const usersRef = db.ref("users");
    usersRef.child(user.uid).once("value", (snapshot) => {
      if (snapshot.exists()) {
        window.location.href = "home.html";
        return;
      }

      // Check if the user is in the "patients" table
      const patientsRef = db.ref("patients");
      patientsRef.child(user.uid).once("value", (snapshot) => {
        if (snapshot.exists()) {
          window.location.href = "patienthome.html";
          return;
        }

        // If user is not in "users" or "patients", handle accordingly
        alert("Invalid user");
      });
    });
  } catch (error) {
    // Handle login errors
    const errorMessage = error.message;
    alert(errorMessage);
  }
});
