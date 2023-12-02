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

// Reference to the Firebase database
const auth = firebase.auth();
const database = firebase.database();
const clinicsRef = database.ref('hospitals');

// Function to add a new department input field
function addDepartment() {
    const container = document.getElementById('departments-container');
    const newDepartment = document.createElement('div');
    newDepartment.innerHTML = `
        <label for="department">Department:</label>
        <input type="text" class="department-input" name="department" required>
        <button type="button" onclick="addDepartment()">Add Department</button>
    `;
    container.appendChild(newDepartment);
}

// Handle form submission
document.getElementById('clinic-form').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const clinicName = document.getElementById('clinicName').value;
    const licenseNumber = document.getElementById('licenseNumber').value;
    const place = document.getElementById('place').value;

    // Get department values
    const departmentInputs = document.querySelectorAll('.department-input');
    const departments = [];
    departmentInputs.forEach(input => {
        departments.push(input.value);
    });

    // Push clinic data to the Firebase database
    clinicsRef.push({
        clinicName: clinicName,
        licenseNumber: licenseNumber,
        place: place,
        departments: departments
    });

    // Reset the form
    document.getElementById('clinicName').value = '';
    document.getElementById('licenseNumber').value = '';
    document.getElementById('place').value = '';
    document.getElementById('departments-container').innerHTML = `
        <div class="department">
            <label for="department">Department:</label>
            <input type="text" class="department-input" name="department" required>
            <button type="button" onclick="addDepartment()">Add Department</button>
        </div>
    `;
});
