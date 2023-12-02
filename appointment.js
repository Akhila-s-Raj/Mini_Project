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




const doctorsDetailsRef = database.ref('details_of_doctors');
const usersRef = database.ref('users');
const selectHospital = document.getElementById('selectHospital');
const selectDepartment = document.getElementById('selectDepartment');
const selectDoctor = document.getElementById('selectDoctor');
const scheduleDayInput = document.getElementById('scheduleDay');
const appointmentTimesContainer = document.getElementById('appointmentTimesContainer');

const hospitalsRef = database.ref('hospitals');
hospitalsRef.once('value', (snapshot) => {
    snapshot.forEach((childSnapshot) => {
        const hospitalData = childSnapshot.val();
        const option = document.createElement('option');
        option.value = childSnapshot.key;
        option.text = hospitalData.clinicName;
        selectHospital.add(option);
    });
});

selectHospital.addEventListener('change', () => {
    const selectedHospitalId = selectHospital.value;

    selectDepartment.innerHTML = '<option value="" disabled selected>Select Department</option>';
    selectDoctor.innerHTML = '<option value="" disabled selected>Select Doctor</option>';

    if (selectedHospitalId) {
        const selectedHospitalRef = hospitalsRef.child(selectedHospitalId);
        selectedHospitalRef.child('departments').once('value', (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const department = childSnapshot.val();
                const option = document.createElement('option');
                option.value = department;
                option.text = department;
                selectDepartment.add(option);
            });
        });
    }
});

selectDepartment.addEventListener('change', () => {
    const selectedHospitalId = selectHospital.value;
    const selectedDepartment = selectDepartment.value;

    selectDoctor.innerHTML = '<option value="" disabled selected>Select Doctor</option>';

    if (selectedHospitalId && selectedDepartment) {
        const queryParam = `${selectedHospitalId}_${selectedDepartment}`;

        doctorsDetailsRef.orderByChild('hospitalId_department')
            .equalTo(queryParam)
            .once('value', (snapshot) => {
                snapshot.forEach((childSnapshot) => {
                    const doctorData = childSnapshot.val();
                    const option = document.createElement('option');
                    option.value = childSnapshot.key;
                    option.text = doctorData.name;
                    selectDoctor.add(option);
                });
            });
    }
});
// Your existing code here...
selectDoctor.addEventListener('change', () => {
    populateAppointmentTimes();
});

scheduleDayInput.addEventListener('input', () => {
    populateAppointmentTimes();
});
function populateAppointmentTimes() {
    appointmentTimesContainer.innerHTML = '';

    const startTime = 8;
    const endTime = 18;
    const breakStartTime = 13;
    const breakEndTime = 14;

    const selectedDoctorId = selectDoctor.value;
    const selectedDay = scheduleDayInput.value;

    const bookedSlotsRef = database.ref('booked_slots');
    bookedSlotsRef.child(selectedDoctorId).child(selectedDay).once('value', (snapshot) => {
        const bookedSlots = snapshot.val() || {};

        for (let hour = startTime; hour < endTime; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {
                const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

                if (hour === breakStartTime && minute === 0) {
                    continue;
                }

                const button = document.createElement('button');
                button.textContent = timeString;
                button.value = timeString;

                if (bookedSlots[timeString]) {
                    button.disabled = true;
                } else {
                    button.addEventListener('click', () => selectAppointmentTime(button));
                }

                appointmentTimesContainer.appendChild(button);
            }
        }
    });
}

function selectAppointmentTime(selectedButton) {
    const selectedButtons = appointmentTimesContainer.querySelectorAll('button');
    selectedButtons.forEach((button) => button.classList.remove('selected'));

    selectedButton.classList.add('selected');
}

window.onload = function () {
    populateAppointmentTimes();
};

const appointmentForm = document.getElementById('appointmentForm');
appointmentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const selectedDoctorId = selectDoctor.value;
    const selectedTimeButton = appointmentTimesContainer.querySelector('button.selected');
    const scheduleDay = scheduleDayInput.value;

    if (!selectedDoctorId || !selectedTimeButton || !scheduleDay) {
        alert('Please fill in all fields before submitting.');
        return;
    }

    const selectedTime = selectedTimeButton.value;

    try {
        const currentPatientId = auth.currentUser.uid;
        const patientSnapshot = await database.ref(`patients/${currentPatientId}`).once('value');
        const patientData = patientSnapshot.val();

        if (!patientData) {
            throw new Error('Patient data not found.');
        }

        const currentPatientName = patientData.name;

        const appointmentId = `A${Math.floor(Math.random() * 100)}`;
        const appointmentRef = database.ref(`appointments/${appointmentId}`);
        appointmentRef.set({
            patientId: currentPatientId,
            patientName: currentPatientName,
            doctorId: selectedDoctorId,
            scheduleTime: selectedTime,
            scheduleDay: scheduleDay
        });

        const bookedSlotsRef = database.ref('booked_slots');
        bookedSlotsRef.child(selectedDoctorId).child(scheduleDay).child(selectedTime).set(true);

        const tokenNumber = Math.floor(Math.random() * 1000) + 1;
        alert(`Appointment scheduled successfully! Token Number: ${tokenNumber}`);

        window.location.href = 'payment.html';
    } catch (error) {
        console.error('Error submitting appointment:', error.message);
        alert('Error submitting appointment. Please try again.');
    }
});
