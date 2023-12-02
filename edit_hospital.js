// Initialize Firebase with your project configuration
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
const database = firebase.database();
const clinicsRef = database.ref('hospitals');

const urlParams = new URLSearchParams(window.location.search);
const clinicId = urlParams.get('id');

const editClinicForm = document.getElementById('edit-clinic-form');
const editDepartmentsContainer = document.getElementById('editDepartmentsContainer');

clinicsRef.child(clinicId).once('value', (snapshot) => {
    const clinicData = snapshot.val();
    const editClinicNameInput = document.getElementById('editClinicName');
    const editLicenseNumberInput = document.getElementById('editLicenseNumber');
    const editPlaceInput = document.getElementById('editPlace');

    editClinicNameInput.value = clinicData.clinicName;
    editLicenseNumberInput.value = clinicData.licenseNumber;
    editPlaceInput.value = clinicData.place;

    // Populate existing departments
    clinicData.departments.forEach((department) => {
        addEditDepartment(department);
    });
});

function addEditDepartment(value = '') {
    const newDepartment = document.createElement('div');
    newDepartment.innerHTML = `
        <label for="editDepartment">Department:</label>
        <input type="text" class="department-input" name="department" value="${value}" required>
        <button type="button" onclick="removeEditDepartment(this)">Remove Department</button>
    `;
    editDepartmentsContainer.appendChild(newDepartment);
}

function removeEditDepartment(button) {
    // Remove the department input field
    const departmentDiv = button.parentNode;
    editDepartmentsContainer.removeChild(departmentDiv);
}

editClinicForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const editClinicName = document.getElementById('editClinicName').value;
    const editLicenseNumber = document.getElementById('editLicenseNumber').value;
    const editPlace = document.getElementById('editPlace').value;

    // Get department values
    const editDepartmentInputs = document.querySelectorAll('#editDepartmentsContainer .department-input');
    const editDepartments = Array.from(editDepartmentInputs).map((input) => input.value);

    // Update clinic data in the Firebase database
    clinicsRef.child(clinicId).update({
        clinicName: editClinicName,
        licenseNumber: editLicenseNumber,
        place: editPlace,
        departments: editDepartments,
    });

    // Redirect to the view page after updating
    window.location.href = 'hospital_view.html';
});
