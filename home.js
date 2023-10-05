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

var db = firebase.database();

// Check user authentication status
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in, update the session info
        const currentUserEmail = document.getElementById("currentUserEmail");
        currentUserEmail.textContent = `User: ${user.email}`;
    } else {
        // User is not signed in, handle as needed (e.g., redirect to login page)
    }
});



// Add your code to interact with the station form and perform other functionalities as needed
// ...
// Add this code at the end of your script
window.addEventListener("popstate", function (e) {
    // This prevents navigating back
    history.pushState(null, document.title, window.location.href);
    
    // This prevents navigating forward
    history.forward();
  });