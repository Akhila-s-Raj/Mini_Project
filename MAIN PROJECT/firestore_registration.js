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
const db = firebase.firestore(); // Use Firestore instead of Realtime Database

const form = document.getElementById("signup-form");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const rePasswordInput = document.getElementById("re_password");
const mobileNumberInput = document.getElementById("mobile_number");
const genderInputs = document.querySelectorAll("input[name='gender']");

nameInput.addEventListener("input", validateName);
emailInput.addEventListener("input", validateEmail);
passwordInput.addEventListener("input", validatePassword);
rePasswordInput.addEventListener("input", validateRetypePassword);
mobileNumberInput.addEventListener("input", validateMobileNumber);
genderInputs.forEach((genderInput) => {
    genderInput.addEventListener("change", validateGender);
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const mobile_number = mobileNumberInput.value.trim();
    const gender = document.querySelector("input[name='gender']:checked");

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Generate a unique ID (starting from "D123") for the doctor
        const uniqueId = await generateUniqueDoctorId();
        // Store additional user data in the "doctors" collection in Firestore
        await db.collection("doctors").doc(user.uid).set({
            id: uniqueId,
            name: name,
            email: email,
            mobile_number: mobile_number,
            gender: gender ? gender.value : "Other",
        });

        // Display a pop-up message with the registration success
        alert("Registration successful!");
        resetForm();
        // You can redirect the user or perform other actions here
    } catch (error) {
        // Handle errors (e.g., display an error message)
        const errorMessage = error.message;
        alert(errorMessage);
    }
});

// Function to generate a unique doctor ID
async function generateUniqueDoctorId() {
    const doctorsRef = db.collection("doctors");
    const querySnapshot = await doctorsRef.orderBy("id", "desc").limit(1).get();

    let latestId = "D122"; // Default starting ID
    if (!querySnapshot.empty) {
        const latestDoctor = querySnapshot.docs[0].data();
        const numericPart = parseInt(latestDoctor.id.slice(1));
        latestId = "D" + (numericPart + 1);
    }

    return latestId;
}

// ... (existing code)

  
  function validateForm() {
    validateName();
    validateEmail();
    validatePassword();
    validateRetypePassword();
    validateMobileNumber();
    validateGender();
  
    const errorMessages = form.querySelectorAll(".error-message");
    return errorMessages.length === 0;
  }
  
  // Your existing validation functions...

  function validateName() {
    const name = nameInput.value.trim();
    const lettersAndSpacesRegex = /^[a-zA-Z\s]+$/; // This regex allows alphabets and spaces
  
    if (name === "") {
      showError(nameInput, "Please enter your name.");
    } else if (!lettersAndSpacesRegex.test(name)) {
      showError(nameInput, "Name should contain only alphabets and spaces.");
    } else {
      clearError(nameInput);
    }
  }
  function validateEmail() {
    const email = emailInput.value.trim();
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  
    if (email === "") {
      showError(emailInput, "Please enter your email.");
    } else if (!emailRegex.test(email)) {
      showError(emailInput, "Please enter a valid email address.");
    } else {
      clearError(emailInput);
    }
  }
  
  
  function validatePassword() {
    // Validation logic for password
    const password = passwordInput.value.trim();
    if (password === "") {
      showError(passwordInput, "Please enter a password.");
    } else if (password.length < 6) {
      showError(passwordInput, "Password must be at least 6 characters.");
    } else {
      clearError(passwordInput);
    }
  }
  
  function validateRetypePassword() {
    // Validation logic for retype password
    const password = passwordInput.value.trim();
    const rePassword = rePasswordInput.value.trim();
  
    if (rePassword === "") {
      showError(rePasswordInput, "Please retype your password.");
    } else if (rePassword !== password) {
      showError(rePasswordInput, "Passwords do not match.");
    } else {
      clearError(rePasswordInput);
    }
  }
  
  
  
  function validateMobileNumber() {
    const mobileNumber = mobileNumberInput.value.trim();
    const mobileNumberRegex = /^[6-9]\d{9}$/;
  
    if (mobileNumber === "") {
      showError(mobileNumberInput, "Please enter your mobile number.");
    } else if (!mobileNumberRegex.test(mobileNumber)) {
      showError(mobileNumberInput, "Please enter a valid Indian mobile number.");
    } else if (hasRepeatedDigits(mobileNumber, 9)) {
      showError(mobileNumberInput, "Please enter a valid Indian mobile number.");
    } else {
      clearError(mobileNumberInput);
    }
  }
  
  function hasRepeatedDigits(mobileNumber, maxRepeatCount) {
    const digitCount = new Map();
  
    for (const digit of mobileNumber) {
      if (digitCount.has(digit)) {
        digitCount.set(digit, digitCount.get(digit) + 1);
        if (digitCount.get(digit) > maxRepeatCount) {
          return true;
        }
      } else {
        digitCount.set(digit, 1);
      }
    }
  
    return false;
  }
  
  
  
  function validateGender() {
    // Validation logic for gender
    if (!Array.from(genderInputs).some((input) => input.checked)) {
        showError(genderInputs[0], "Please select your gender.");
      } else {
        clearError(genderInputs[0]);
      }
  }
  
  function showError(input, message) {
    // Display an error message for the input field
    clearError(input);
    const errorElement = document.createElement("div");
    errorElement.className = "error-message";
    errorElement.innerText = message;
    input.parentNode.appendChild(errorElement);
  }
  
  function clearError(input) {
    // Clear the error message for the input field
    const errorElement = input.parentNode.querySelector(".error-message");
    if (errorElement) {
      errorElement.remove();
    }
  }
  
  function isValidEmail(email) {
    // Validation logic for email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
  
  function isValidMobileNumber(mobileNumber) {
    // Validation logic for mobile number format
    const mobileNumberPattern = /^\d{10}$/;
    return mobileNumberPattern.test(mobileNumber);
  }
  

  function resetForm() {
    nameInput.value = "";
    emailInput.value = "";
    passwordInput.value = "";
    rePasswordInput.value = "";
    mobileNumberInput.value = "";
    genderInputs.forEach((input) => (input.checked = false));
    clearError(nameInput);
    clearError(emailInput);
    clearError(passwordInput);
    clearError(rePasswordInput);
    clearError(mobileNumberInput);
    clearError(genderInputs[0]);
  }
  