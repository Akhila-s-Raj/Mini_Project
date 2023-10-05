// JavaScript code for handling form submissions and data management goes here.
// You would need to implement Firebase or another backend for data storage and management.

// Function to fetch and display data (sample data)
function fetchData(sectionId, dataListId, data) {
    const section = document.getElementById(sectionId);
    const dataList = section.querySelector(dataListId);

    // Clear existing data
    dataList.innerHTML = "";

    // Loop through the data and create list items
    data.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.textContent = item;
        dataList.appendChild(listItem);
    });
}

// Sample data for doctors, patients, caregivers, and feedback
const doctorsData = ["Doctor 1", "Doctor 2", "Doctor 3"];
const patientsData = ["Patient 1", "Patient 2", "Patient 3"];
const caregiversData = ["Caregiver 1", "Caregiver 2", "Caregiver 3"];
const feedbackData = ["Feedback 1", "Feedback 2", "Feedback 3"];

// Call the fetchData function to display data when the page loads
window.addEventListener("load", () => {
    fetchData("view-doctors", "#doctorList", doctorsData);
    fetchData("view-patients", "#patientList", patientsData);
    fetchData("view-caregivers", "#caregiverList", caregiversData);
    fetchData("manage-feedback", "#feedbackList", feedbackData);
});
