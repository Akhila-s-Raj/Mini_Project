// hospital_view.js

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
const clinicTableBody = document.querySelector('#clinic-table tbody');

clinicsRef.on('value', (snapshot) => {
    clinicTableBody.innerHTML = '';

    snapshot.forEach((childSnapshot) => {
        const clinicData = childSnapshot.val();
        const departments = clinicData.departments;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${clinicData.clinicName}</td>
            <td>${clinicData.licenseNumber}</td>
            <td>${clinicData.place}</td>
            <td>${generateDepartmentList(departments)}</td>
            <td><button onclick="editClinic('${childSnapshot.key}')">Edit</button></td>
        `;

        clinicTableBody.appendChild(row);
    });
});

function generateDepartmentList(departments) {
    let departmentList = '<ol>';

    departments.forEach((department, index) => {
        departmentList += `<li>${index + 1}. ${department}</li>`;
    });

    departmentList += '</ol>';

    return departmentList;
}

function editClinic(clinicId) {
    // Redirect to the edit_hospital.html page with the clinicId as a query parameter
    window.location.href = `edit_hospital.html?id=${clinicId}`;
}
