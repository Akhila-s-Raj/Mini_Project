// Get a reference to the logout link or button
const logoutButton = document.getElementById("logout");

// Add a click event listener to handle logout
logoutButton.addEventListener("click", async () => {
    try {
        // Sign out the currently logged-in user
        await firebase.auth().signOut();
        
        // Redirect the user to the login page
        window.location.href = "login.html";
        alert("Logged out successfully.");
    } catch (error) {
        console.error("Error logging out:", error);
    }
});
