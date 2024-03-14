document.addEventListener("DOMContentLoaded", () => {
    // Your Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyCMiRy5r5mbbYCUfw_4fiIThEHHJOtOiHY",
        authDomain: "mainproject-565f9.firebaseapp.com",
        projectId: "mainproject-565f9",
        storageBucket: "mainproject-565f9.appspot.com",
        messagingSenderId: "243845690343",
        appId: "1:243845690343:web:14cae7ce82fb372fd3c342",
        measurementId: "G-SW5VEKRRSD"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // Check authentication state
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is authenticated
            // Fetch and display current user information
            displayUserInfo(user);

            // Fetch and display prescription details for the current patient
            const urlParams = new URLSearchParams(window.location.search);
            const patientId = urlParams.get('patientId');
            if (patientId) {
                fetchPrescriptionDetails(patientId);
            } else {
                console.error('Patient ID not found in URL.');
            }
        } else {
            // User is not authenticated, redirect to login page
            window.location.href = 'mainlogin.html';
        }
    });
});

// Function to fetch and display prescription details for the given patient ID
function fetchPrescriptionDetails(patientId) {
    const db = firebase.firestore();
    const prescriptionRef = db.collection('prescription').doc(patientId).collection('prescriptions');

    prescriptionRef.get().then(querySnapshot => {
        const prescriptionTableBody = document.getElementById('prescriptionTableBody');
        prescriptionTableBody.innerHTML = ''; // Clear previous data

        querySnapshot.forEach(doc => {
            const prescriptionData = doc.data();
            const prescriptionId = doc.id;

            // Extract prescription details
            const {
                diagnosis,
                medications,
                symptoms,
                timestamp
            } = prescriptionData;

            // Format timestamp
            const formattedTimestamp = formatTimestamp(timestamp.toDate());

            // Format medications
            const formattedMedications = medications.map(med => {
                return `${med.medicine}: ${med.dose} ${med.unit} (${med.days} - ${med.frequency})`;
            }).join('<br>');

            // Generate table row for each prescription
            let newRow = '<tr>';
            newRow += `<td>${prescriptionId}</td>`;
            newRow += `<td>${diagnosis}</td>`;
            newRow += `<td>${formattedMedications}</td>`;
            newRow += `<td>${symptoms}</td>`;
            newRow += `<td>${formattedTimestamp}</td>`;
            newRow += '</tr>';

            prescriptionTableBody.innerHTML += newRow;
        });
    }).catch(error => {
        console.error('Error fetching prescription details:', error);
    });

    // Add patient ID heading
    const patientIdHeading = document.getElementById('patientIdHeading');
    if (patientIdHeading) {
        patientIdHeading.textContent = `Prescription Details of Patient ID: ${patientId}`;
    } else {
        console.error('Patient ID heading element not found.');
    }
}

// Function to display user information in the menu bar
function displayUserInfo(user) {
    // Display user information in the 'currentUserEmail' and 'currentUserNameAndId' elements
    const currentUserEmail = document.getElementById("currentUserEmail");
    const currentUserNameAndId = document.getElementById("currentUserNameAndId");

    if (currentUserEmail && currentUserNameAndId) {
        currentUserEmail.textContent = 'Email: ' + user.email;
        currentUserNameAndId.textContent = 'User: ' + user.displayName + ' (ID: ' + user.uid + ')';
    } else {
        console.error('DOM elements not found.');
    }
}

// Function to format the timestamp to display date and time
function formatTimestamp(timestamp) {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(timestamp);
}
