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

            // Populate Patient ID from URL
            const urlParams = new URLSearchParams(window.location.search);
            const patientIdFromUrl = urlParams.get('patientId');

            // Set default value for the Patient ID field
            const patientIdField = document.getElementById('patientId');
            if (patientIdField) {
                patientIdField.value = patientIdFromUrl || '';
            } else {
                console.error('Patient ID field not found.');
            }
            const previousPrescriptionLink = document.getElementById('previousPrescriptionLink');
            if (previousPrescriptionLink && patientIdFromUrl) {
                previousPrescriptionLink.href = `firestore_previousPrescription.html?patientId=${patientIdFromUrl}`;
            }
        } else {
            // User is not authenticated, redirect to login page
            window.location.href = 'mainlogin.html';
        }
    });

    // Add medicine button event listener
    document.getElementById('addMedicineButton').addEventListener('click', function () {
        addMedicineEntry();
    });

    // Form submission event listener
   // Form submission event listener
document.getElementById('prescriptionForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Get form values
    const patientId = document.getElementById('patientId').value;
    const symptoms = document.getElementById('symptoms').value;
    const diagnosis = document.getElementById('diagnosis').value;
    const medications = getMedications();

    // Validate form data
    if (!patientId || !symptoms || !diagnosis || medications.length === 0) {
        alert('Please fill in all the fields.');
        return;
    }

    // Get a reference to the Firestore database
    const db = firebase.firestore();

    // Generate a unique ID for the prescription
    getPrescriptionCount(patientId).then(count => {
        const prescriptionId = 'P' + (count + 1);

        // Create a document in the 'prescription' collection under the current 'patientId' with the generated ID
        const prescriptionRef = db.collection('prescription').doc(patientId).collection('prescriptions').doc(prescriptionId);

        // Set the fields with the form data
        const prescriptionData = {
            patientId: patientId,
            symptoms: symptoms,
            diagnosis: diagnosis,
            medications: medications,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(), // Current date and time
            doctorName: currentUserName,
            doctorID: currentUserID
        };

        // Save the document to Firestore
        prescriptionRef.set(prescriptionData)
            .then(() => {
                // Display success message
                alert('Prescription added successfully.');
                const patientId = document.getElementById('patientId').value;

                // Navigate to firestore_patientDetails.html with patientId in the URL
                window.location.href = `firestore_patientDetails.html?patientId=${patientId}`;

                console.log('Prescription saved successfully.');
                // You can perform further actions here if needed
            })
            .catch(error => {
                console.error('Error saving prescription: ', error);
            });
    }).catch(error => {
        console.error('Error getting prescription count: ', error);
    });
});

    // Add event listener for plus and minus buttons in the "Every X Days" input field
    document.querySelectorAll('.btn-number').forEach(button => {
        button.addEventListener('click', function () {
            const field = this.getAttribute('data-field');
            const input = document.querySelector(`input[name="${field}"]`);
            const currentVal = parseInt(input.value);

            let newVal;
            if (this.getAttribute('data-type') === 'minus') {
                if (currentVal > input.min) {
                    newVal = currentVal - 1;
                }
            } else if (this.getAttribute('data-type') === 'plus') {
                if (currentVal < input.max) {
                    newVal = currentVal + 1;
                }
            }
            input.value = newVal || input.value;
        });
    });
});

function displayUserInfo(user) {
    // Display user information in the 'currentUserEmail' and 'currentUserNameAndId' elements
    const currentUserEmail = document.getElementById("currentUserEmail");
    const currentUserNameAndId = document.getElementById("currentUserNameAndId");

    if (currentUserEmail && currentUserNameAndId) {
        currentUserEmail.textContent = 'Email: ' + user.email;
        // Fetch doctor's name and ID from Firestore and display
        const db = firebase.firestore();
        db.collection("doctors").where("email", "==", user.email).get()
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    const doctorData = querySnapshot.docs[0].data();
                    currentUserNameAndId.textContent = `Doctor: ${doctorData.name} (ID: ${doctorData.id})`;
                    // Set global variables for current user's name and ID
                    currentUserID = doctorData.id;
                    currentUserName = doctorData.name;
                } else {
                    console.error('Doctor data not found for email:', user.email);
                }
            })
            .catch((error) => {
                console.error('Error searching doctor details from Firestore:', error);
            });
    } else {
        console.error('DOM elements not found.');
    }
}

function addMedicineEntry() {
    const medicationsContainer = document.getElementById('medicationsContainer');

    const medicationEntry = document.createElement('div');
    medicationEntry.classList.add('medication-entry');

    medicationEntry.innerHTML = `
        <hr> <!-- Add a horizontal line for better visual separation -->
        <label for="medicine">Medicine:</label>
        <input type="text" class="medicine" name="medicine" placeholder="Enter medicine">

        <label for="days">Days:</label>
        <select class="days" name="days">
            <option value="everyDay">Every day</option>
            <option value="everyXDays">Every X Days</option>
            <option value="weekDays">Week day</option>
        </select>

        <div id="manualDaysContainer" style="display: none;">
            <label for="manualDays">Enter Days:</label>
            <div class="input-group">
                <input type="number" class="form-control input-number manualDays" name="manualDays" placeholder="Enter days" value="1" min="1">
                
            </div>
        </div>

        <div id="weekDaysContainer" style="display: none;">
            <label for="selectedWeekDays">Select Week Days:</label>
            <select class="selectedWeekDays js-example-basic-single" name="selectedWeekDays" multiple>
                <option value="monday">Monday</option>
                <option value="tuesday">Tuesday</option>
                <option value="wednesday">Wednesday</option>
                <option value="thursday">Thursday</option>
                <option value="friday">Friday</option>
                <option value="saturday">Saturday</option>
                <option value="sunday">Sunday</option>
            </select>
        </div>

        <label for="frequency">Frequency:</label>
        <select class="frequency" name="frequency">
            <option value="onceDaily">Once Daily</option>
            <option value="twiceDaily">Twice Daily</option>
            <option value="thriceDaily">Thrice Daily</option>
        </select>

        <div class="intakeTimesContainer">
           
        <label for="firstIntake">First Intake:</label>
        <input type="time" class="firstIntake" name="firstIntake">

        <label for="secondIntake" style="display: none;">Second Intake:</label>
        <input type="time" class="secondIntake" name="secondIntake" style="display: none;">

        <label for="thirdIntake" style="display: none;">Third Intake:</label>
        <input type="time" class="thirdIntake" name="thirdIntake" style="display: none;">
    </div>

    <label for="unit">Select Unit:</label>
    <select class="unit" name="unit">
        <option value="pills">Pills</option>
        <option value="drops">Drops</option>
        <option value="tablespoon">Tablespoon</option>
        <option value="ml">Milliliters (ml)</option>
        <option value="applications">Applications</option>
    </select>

    <label for="dose">Enter Dose:</label>
    <input type="text" class="dose" name="dose" placeholder="Enter dose">
`;

    medicationsContainer.appendChild(medicationEntry);

    // Initialize Select2 for the "Week Days" dropdown
    $(document).ready(function () {
        $('.js-example-basic-single').select2();
    });

    // Update the visibility of the "Enter Days" field based on the selected "Days"
    medicationEntry.querySelector('.days').addEventListener('change', function () {
        const manualDaysContainer = medicationEntry.querySelector('#manualDaysContainer');
        const weekDaysContainer = medicationEntry.querySelector('#weekDaysContainer');
        if (this.value === 'weekDays') {
            weekDaysContainer.style.display = 'block';
            manualDaysContainer.style.display = 'none';
        } else if (this.value === 'everyXDays') {
            manualDaysContainer.style.display = 'block';
            weekDaysContainer.style.display = 'none';
        } else {
            weekDaysContainer.style.display = 'none';
            manualDaysContainer.style.display = 'none';
        }
    });

    // Update the visibility of intake time fields based on selected frequency
    medicationEntry.querySelector('.frequency').addEventListener('change', function () {
        const intakeTimesContainer = medicationEntry.querySelector('.intakeTimesContainer');
        const firstIntake = medicationEntry.querySelector('.firstIntake');
        const secondIntakeLabel = medicationEntry.querySelector('label[for=secondIntake]');
        const secondIntake = medicationEntry.querySelector('.secondIntake');
        const thirdIntakeLabel = medicationEntry.querySelector('label[for=thirdIntake]');
        const thirdIntake = medicationEntry.querySelector('.thirdIntake');

        if (this.value === 'onceDaily') {
            firstIntake.style.display = 'block';
            secondIntake.style.display = 'none';
            secondIntakeLabel.style.display = 'none';
            thirdIntake.style.display = 'none';
            thirdIntakeLabel.style.display = 'none';
        } else if (this.value === 'twiceDaily') {
            firstIntake.style.display = 'block';
            secondIntakeLabel.style.display = 'block';
            secondIntake.style.display = 'block';
            thirdIntake.style.display = 'none';
            thirdIntakeLabel.style.display = 'none';
        } else if (this.value === 'thriceDaily') {
            firstIntake.style.display = 'block';
            secondIntakeLabel.style.display = 'block';
            secondIntake.style.display = 'block';
            thirdIntakeLabel.style.display = 'block';
            thirdIntake.style.display = 'block';
        } else {
            firstIntake.style.display = 'none';
            secondIntake.style.display = 'none';
            secondIntakeLabel.style.display = 'none';
            thirdIntake.style.display = 'none';
            thirdIntakeLabel.style.display = 'none';
        }
    });
}

function getMedications() {
    const medications = [];
    const medicationEntries = document.querySelectorAll('.medication-entry');

    medicationEntries.forEach(entry => {
        const medicine = entry.querySelector('.medicine').value;
        const days = entry.querySelector('.days').value;
        const manualDays = entry.querySelector('.manualDays').value;
        const frequency = entry.querySelector('.frequency').value;
        const firstIntake = entry.querySelector('.firstIntake').value;
        const secondIntake = entry.querySelector('.secondIntake').value;
        const thirdIntake = entry.querySelector('.thirdIntake').value;
        const unit = entry.querySelector('.unit').value;
        const dose = entry.querySelector('.dose').value;

        // Construct medication object
        const medication = {
            medicine: medicine,
            days: days,
            manualDays: manualDays,
            frequency: frequency,
            intakeTimes: {
                firstIntake: firstIntake,
                secondIntake: secondIntake,
                thirdIntake: thirdIntake
            },
            unit: unit,
            dose: dose
        };

        medications.push(medication);
    });

    return medications;
}

async function getPrescriptionCount(patientId) {
    const db = firebase.firestore();
    const prescriptionRef = db.collection('prescription').doc(patientId).collection('prescriptions');
    const snapshot = await prescriptionRef.get();
    return snapshot.docs.length;
}