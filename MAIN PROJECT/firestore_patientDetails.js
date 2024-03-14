document.addEventListener("DOMContentLoaded", () => {
    console.log('DOMContentLoaded event fired on firestore_patientDetails.html');

    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get('patientId');
    console.log('Patient ID:', patientId);

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
            console.log('User is authenticated');
            // User is authenticated, fetch patient details and medication history/allergies
            searchPatientDetails(patientId);
        } else {
            console.error('User is not authenticated');
            // User is not authenticated, redirect to login page
            window.location.href = 'mainlogin.html';
        }
    });

    // Add Prescription button click event
    document.getElementById('addPrescriptionBtn').addEventListener('click', function () {
        // Navigate to the addPrescription page with the patient ID
        window.location.href = 'firestore_addPrescription.html?patientId=' + patientId;
    });
});

function searchPatientDetails(patientId) {
    console.log('Searching patient details for ID:', patientId);
    const db = firebase.firestore();

    // Fetch patient details
    db.collection("user_patients")
        .where("patientId", "==", patientId)
        .get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                const patientData = querySnapshot.docs[0].data();
                displayPatientDetails(patientData);
            } else {
                console.error('Patient data not found for patientId:', patientId);
            }
        })
        .catch((error) => {
            console.error('Error searching patient details from Firestore:', error);
        });

    // Fetch medication history and allergies
    db.collection("medication")
        .doc(patientId)
        .get()
        .then((doc) => {
            if (doc.exists) {
                const medicationData = doc.data();
                displayMedicationHistory(medicationData);
            } else {
                console.error('Medication data not found for patientId:', patientId);
            }
        })
        .catch((error) => {
            console.error('Error fetching medication data from Firestore:', error);
        });
}

function displayPatientDetails(patientData) {
    // Display patient details in the 'patientDetailsContent' div
    const patientDetailsContent = document.getElementById("patientDetailsContent");

    if (patientDetailsContent) {
        patientDetailsContent.innerHTML = `
            <p>Patient ID: ${patientData.patientId}</p>
            <p>Name: ${patientData.name}</p>
            <p>Gender: ${patientData.gender}</p>
            <p>Email: ${patientData.email}</p>
            <p>Mobile Number: ${patientData.mobileNumber}</p>
            <p>Address: ${patientData.address}</p>
            <!-- Add more details as needed -->
        `;
    } else {
        console.error('DOM element with ID "patientDetailsContent" not found.');
    }
}

function displayMedicationHistory(medicationData) {
    // Display medication history in the 'medicationHistoryTable' table
    const medicationHistoryTable = document.getElementById("medicationHistoryTable");

    if (medicationHistoryTable) {
        medicationHistoryTable.innerHTML = `
            <thead>
                <tr>
                    <th>Medication</th>
                </tr>
            </thead>
            <tbody>
                ${medicationData.medications.map((medication) => `
                    <tr>
                        <td>${medication.medication}</td>
                    </tr>
                `).join('')}
                <tr>
                    <td>Allergies: ${medicationData.allergies}</td>
                </tr>
            </tbody>
        `;
    } else {
        console.error('DOM element with ID "medicationHistoryTable" not found.');
    }
}
