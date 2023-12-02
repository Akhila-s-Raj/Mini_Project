// Firebase configuration
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
const storage = firebase.storage();



function submitForm() {
    const medicineName = document.getElementById('medicineName').value;
    const frequency = document.getElementById('frequency').value;
    const scheduleData = collectScheduleData();

    // Get currently logged-in user (patient) details
    const user = auth.currentUser;

    if (!user) {
        console.error("User not logged in.");
        return;
    }

    // Get patient details from the 'patients' table
    const patientsRef = database.ref('patients');
    patientsRef.child(user.uid).once('value', (snapshot) => {
        const patientData = snapshot.val();

        if (patientData) {
            // Create a new medication object with patient details
            const newMedication = {
                medicineName: medicineName,
                frequency: frequency,
                scheduleData: scheduleData,
                patient_id: patientData.patient_id,
                patient_name: patientData.name
            };

            // Push data to the 'medications' node in the database
            const newMedicationRef = database.ref('medications').push(newMedication);

            console.log('Data submitted with key: ' + newMedicationRef.key);
        } else {
            console.error("Patient details not found.");
        }
    });
}

function updateSchedule() {
    const frequency = document.getElementById('frequency').value;
    const scheduleContainer = document.getElementById('scheduleContainer');

    // Clear previous schedule options
    scheduleContainer.innerHTML = '';

    if (frequency === 'everyday' || frequency === 'everyXday') {
        addTimePicker(scheduleContainer);
        showUnitDoseFields();
    } else {
        hideUnitDoseFields();
    }

    if (frequency === 'dayOfWeek') {
        addDaysOfWeekCheckboxes(scheduleContainer);
    } else if (frequency === 'dayOfMonth') {
        addDayOfMonthDropdown(scheduleContainer);
    }
    
    // Add scheduling details
    addTimeUnitDoseFields(scheduleContainer);
}



function showUnitDoseFields() {
    document.getElementById('unit').style.display = 'block';
    document.getElementById('dose').style.display = 'block';
}

function hideUnitDoseFields() {
    document.getElementById('unit').style.display = 'none';
    document.getElementById('dose').style.display = 'none';
}

function addTimePicker(container) {
    const timeLabel = document.createElement('label');
    timeLabel.textContent = 'Schedule Time:';
    
    const timeInput = document.createElement('input');
    timeInput.type = 'time';
    timeInput.required = true;
    
    container.appendChild(timeLabel);
    container.appendChild(timeInput);
}

function addDayInput(container) {
    const dayLabel = document.createElement('label');
    dayLabel.textContent = 'Select Every X days:';
    
    const dayInput = document.createElement('input');
    dayInput.type = 'number';
    dayInput.min = 1;
    dayInput.max = 365;
    dayInput.required = true;
    
    container.appendChild(dayLabel);
    container.appendChild(dayInput);
}

function addDaysOfWeekCheckboxes(container) {
    const daysOfWeekLabel = document.createElement('label');
    daysOfWeekLabel.textContent = 'Select Days of the Week:';
    
    const daysOfWeekContainer = document.createElement('div');
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    daysOfWeek.forEach(day => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'daysOfWeek';
        checkbox.value = day;
        checkbox.id = day;
        const label = document.createElement('label');
        label.textContent = day;
        daysOfWeekContainer.appendChild(checkbox);
        daysOfWeekContainer.appendChild(label);
    });

    container.appendChild(daysOfWeekLabel);
    container.appendChild(daysOfWeekContainer);
}

function addDayOfMonthDropdown(container) {
    const dayOfMonthLabel = document.createElement('label');
    dayOfMonthLabel.textContent = 'Select Day of the Month:';
    
    const dayOfMonthDropdown = document.createElement('select');
    dayOfMonthDropdown.name = 'dayOfMonth';
    dayOfMonthDropdown.required = true;

    for (let i = 1; i <= 31; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.text = i;
        dayOfMonthDropdown.appendChild(option);
    }

    container.appendChild(dayOfMonthLabel);
    container.appendChild(dayOfMonthDropdown);
}

function addTimeUnitDoseFields(container) {
    // Time unit and dose fields
    const timeUnitLabel = document.createElement('label');
    timeUnitLabel.textContent = 'Select Unit:';

    const timeUnitDropdown = document.createElement('select');
    timeUnitDropdown.id = 'unit';
    timeUnitDropdown.name = 'unit';
    timeUnitDropdown.addEventListener('change', updateDoseInput);

    const units = ['pill(s)', 'drop(s)', 'syrup(s)', 'application(s)'];

    units.forEach(unit => {
        const option = document.createElement('option');
        option.value = unit;
        option.text = unit;
        timeUnitDropdown.appendChild(option);
    });

    const doseLabel = document.createElement('label');
    doseLabel.textContent = 'Enter Dose:';

    const doseInput = document.createElement('input');
    doseInput.type = 'text';
    doseInput.id = 'dose';
    doseInput.name = 'dose';
    doseInput.required = true;

    container.appendChild(timeUnitLabel);
    container.appendChild(timeUnitDropdown);
    container.appendChild(doseLabel);
    container.appendChild(doseInput);
}

function updateDoseInput() {
    const unit = document.getElementById('unit').value;
    const doseInput = document.getElementById('dose');

    // Clear previous input value
    doseInput.value = '';

    // Update dose input based on the selected unit
    if (unit === 'pill(s)' || unit === 'drop(s)') {
        doseInput.type = 'number';
        doseInput.placeholder = 'Enter amount';
    } else if (unit === 'syrup(s)') {
        doseInput.type = 'text';
        doseInput.placeholder = 'Enter amount (ml)';
    } else if (unit === 'application(s)') {
        doseInput.type = 'text';
        doseInput.placeholder = 'Enter number';
    }
}

// Add an event listener to the form
document.getElementById('medicationForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Call the submitForm function when the form is submitted
    submitForm();
});

// Rest of your code...

function submitForm() {
    const medicineName = document.getElementById('medicineName').value;
    const frequency = document.getElementById('frequency').value;
    const scheduleData = collectScheduleData();

    // Push data to the 'medications' node in the database
    const newMedicationRef = database.ref('medications').push({
        medicineName: medicineName,
        frequency: frequency,
        scheduleData: scheduleData
    });

    console.log('Data submitted with key: ' + newMedicationRef.key);
}

function collectScheduleData() {
    const frequency = document.getElementById('frequency').value;
    const scheduleData = {};

    if (frequency === 'everyday') {
        scheduleData.time = document.getElementById('scheduleContainer').querySelector('input[type="time"]').value;
    } else if (frequency === 'everyXday') {
        scheduleData.days = document.getElementById('scheduleContainer').querySelector('input[type="number"]').value;
    } else if (frequency === 'dayOfWeek') {
        const selectedDays = Array.from(document.getElementById('scheduleContainer').querySelectorAll('input[type="checkbox"]:checked'))
            .map(checkbox => checkbox.value);
        scheduleData.daysOfWeek = selectedDays;
    } else if (frequency === 'dayOfMonth') {
        scheduleData.dayOfMonth = document.getElementById('scheduleContainer').querySelector('select').value;
    }

    scheduleData.unit = document.getElementById('unit').value;
    scheduleData.dose = document.getElementById('dose').value;

    return scheduleData;
}

