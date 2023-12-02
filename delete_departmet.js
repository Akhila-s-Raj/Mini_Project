// Initialize Firebase with your configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

const clinicDepartmentForm = document.getElementById("clinicDepartmentForm");
const clinicField = document.getElementById("clinic");
const clinicDepartmentTable = document.getElementById("clinicDepartmentTable");

// Populate clinic options from Firebase
const clinicRef = database.ref("clinic");
clinicRef.on("value", (snapshot) => {
    clinicField.innerHTML = ""; // Clear previous options
    const clinics = snapshot.val();
    for (const clinicId in clinics) {
        const clinicName = clinics[clinicId].clinicName;
        const option = document.createElement("option");
        option.value = clinicId;
        option.textContent = clinicName;
        clinicField.appendChild(option);
    }
});

clinicDepartmentForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const clinicId = clinicField.value;
    const departmentRef = database.ref("departments/" + clinicId);

    departmentRef.on("value", (snapshot) => {
        clinicDepartmentTable.innerHTML = ""; // Clear previous data
        const departments = snapshot.val();
        if (departments) {
            for (const departmentId in departments) {
                const departmentName = departments[departmentId].departmentName;
                const row = clinicDepartmentTable.insertRow();
                const cellClinicName = row.insertCell(0);
                const cellDepartmentName = row.insertCell(1);
                const cellDeleteButton = row.insertCell(2);

                cellClinicName.textContent = clinicField.options[clinicField.selectedIndex].textContent;
                cellDepartmentName.textContent = departmentName;

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.addEventListener("click", () => {
                    // Handle the delete department action here
                    departmentRef.child(departmentId).remove()
                        .then(() => {
                            console.log("Department deleted successfully.");
                            window.alert("Department deleted successfully!");
                        })
                        .catch((error) => {
                            console.error("Error deleting department: " + error);
                        });
                });

                cellDeleteButton.appendChild(deleteButton);
            }
        }
    });
});
