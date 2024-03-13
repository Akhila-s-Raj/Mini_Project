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
const firestore = firebase.firestore();
const storage = firebase.storage();

// Reference to the "hospitals" collection in Firestore
const hospitalsCollection = firestore.collection('hospitals');

// Reference to the form fields
const specialityField = document.getElementById("speciality");
const licenseNumberField = document.getElementById("licenseNumber");
const photoField = document.getElementById("photo");
const hospitalDropdown = document.getElementById('hospital');
const departmentDropdown = document.getElementById('department');
const prevHospitalField = document.getElementById("prevHospital");
const certificateField = document.getElementById("certificate");
const experienceField = document.getElementById("experience");
const doctorForm = document.getElementById("doctorForm");
const startTimeField = document.getElementById("startTime");
const endTimeField = document.getElementById("endTime");
const appointmentDaysCheckboxes = document.getElementsByName("appointmentDays");

// Reference to the "details_of_doctors" collection in Firestore
const detailsOfDoctorsCollection = firestore.collection('doctors_details');

// Reference to the "doctors_list" collection in Firestore
const doctorsListCollection = firestore.collection('doctors_list');

// Fetch hospitals from Firestore and populate the hospital dropdown
hospitalsCollection.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        const hospitalData = doc.data();
        const option = document.createElement('option');
        option.value = doc.id;  // Use doc.id as the value
        option.text = hospitalData.hospitalName;
        hospitalDropdown.add(option);
    });
});

// Handle hospital selection change to dynamically populate the department dropdown
hospitalDropdown.addEventListener('change', () => {
    const selectedHospitalId = hospitalDropdown.value;

    // Clear existing options and add a default option
    departmentDropdown.innerHTML = '<option value="" disabled selected>Select Department</option>';

    // Fetch departments for the selected hospital and populate the department dropdown
    if (selectedHospitalId) {
        const selectedHospitalRef = hospitalsCollection.doc(selectedHospitalId);
        selectedHospitalRef.get().then((doc) => {
            const departments = doc.data().departments;

            if (departments) {
                departments.forEach((department) => {
                    const option = document.createElement('option');
                    option.value = department;
                    option.text = department;
                    departmentDropdown.add(option);
                });
            }
        });
    }
});

// Handle form submission
doctorForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const user = auth.currentUser;

    // Check if a user is logged in
    if (!user) {
        window.alert("Please log in to add doctor details.");
        return;
    }

    // Fetch additional details from the "doctors" collection
    const doctorDetails = await getDoctorDetails(user.uid);

    const speciality = specialityField.value;
    const licenseNumber = licenseNumberField.value;
    const photo = photoField.files[0]; // Get the selected file
    const selectedHospitalId = hospitalDropdown.value;
    const selectedHospitalName = hospitalDropdown.options[hospitalDropdown.selectedIndex].text;
    const selectedDepartment = departmentDropdown.value;
    const prevHospital = prevHospitalField.value;
    const certificate = certificateField.files[0]; // Get the selected PDF file
    const experience = experienceField.value;
    const startTime = startTimeField.value;
    const endTime = endTimeField.value;

    // Get selected appointment days
    // Get selected appointment days
    const appointmentDays = Array.from(document.querySelectorAll('input[name="appointmentDays"]:checked'))
    .map(checkbox => checkbox.value);

if (!speciality || !licenseNumber || !photo || !selectedHospitalId || !selectedDepartment || !prevHospital || !certificate || !experience || appointmentDays.length === 0 || !startTime || !endTime) {
    window.alert("Please fill in all required fields.");
    return;
}



    try {
        // Create a data object for doctors_details collection
        const data = {
            speciality: speciality,
            licenseNumber: licenseNumber,
            email: user.email,
            name: doctorDetails.name,
            hospital: {
                id: selectedHospitalId,
                name: selectedHospitalName
            },
            department: selectedDepartment,
            hospitalId_department: `${selectedHospitalId}_${selectedDepartment}`,
            doctorId: doctorDetails.id,
            prevHospital: prevHospital,
            experience: experience,
            appointment: {
                days: appointmentDays,
                startTime: startTime,
                endTime: endTime,
            },
        };

        // Push the data to the "doctors_details" collection in Firestore
        const newDoctorRef = await detailsOfDoctorsCollection.add(data);

        // Create a data object for doctors_list collection
        const doctorListData = {
            doctorId: doctorDetails.id,
            name: doctorDetails.name,
            hospital: {
                id: selectedHospitalId,
                name: selectedHospitalName
            },
            department: selectedDepartment,
        };

        // Add the data to the "doctors_list" collection in Firestore
        const doctorListRef = await doctorsListCollection.add(doctorListData);

        // Upload the photo to Firebase Storage
        const photoStorageRef = storage.ref(`doctor_photos/${user.uid}/${newDoctorRef.id}`);
        await photoStorageRef.put(photo);

        // Upload the certificate to Firebase Storage
        const certificateStorageRef = storage.ref(`doctor_certificates/${user.uid}/${newDoctorRef.id}`);
        await certificateStorageRef.put(certificate);

        window.alert("Doctor's details added successfully!");

        // Optionally, you can reset the form after successful submission
        doctorForm.reset();
    } catch (error) {
        console.error("Error adding doctor details:", error);
        window.alert("An error occurred. Please try again.");
    }
});

// Function to get the doctor's details from the "doctors" collection in Firestore
async function getDoctorDetails(userId) {
    const doctorsCollection = firestore.collection('doctors');
    const doc = await doctorsCollection.doc(userId).get();
    return doc.exists ? doc.data() : null;
}