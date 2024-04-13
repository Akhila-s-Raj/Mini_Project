import 'package:flutter/material.dart';
import 'package:email_validator/email_validator.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:medtracker/screen/home_page.dart';
import 'package:medtracker/screen/forgot_password_page.dart';
import 'caregiver_home_page.dart';

class LoginPage extends StatefulWidget {
  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final GlobalKey<FormState> formKey = GlobalKey<FormState>();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  String? validateEmail(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please enter your email';
    } else if (!EmailValidator.validate(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  }

  String? validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please enter your password';
    }
    return null;
  }

  Future<void> login() async {
    print('Login function called');
    if (formKey.currentState?.validate() ?? false) {
      try {
        UserCredential userCredential = await FirebaseAuth.instance.signInWithEmailAndPassword(
          email: emailController.text,
          password: passwordController.text,
        );

        DocumentSnapshot patientSnapshot = await FirebaseFirestore.instance.collection('user_patients')
            .doc(userCredential.user?.uid)
            .get();

        DocumentSnapshot caregiverSnapshot = await FirebaseFirestore.instance.collection('user_caregivers')
            .doc(userCredential.user?.uid)
            .get();

        if (patientSnapshot.exists) {
          // User is a patient
          String patientName = patientSnapshot['name'];
          String patientId = patientSnapshot['patientId'];

          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (context) => HomePage(patientName: patientName, patientId: patientId),
            ),
          );
        } else if (caregiverSnapshot.exists) {
          // User is a caregiver
          String caregiverName = caregiverSnapshot['name'];
          String caregiverId = caregiverSnapshot['caregiverId'];

          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (context) => CaregiverHomePage(caregiverName: caregiverName, caregiverId: caregiverId),
            ),
          );
        }
      } catch (e) {
        // Handle authentication errors
        print("Error: $e");
        // Show a snackbar or some other UI to indicate login failure
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Login failed. Please check your credentials."),
            duration: Duration(seconds: 3),
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    print('LoginPage build method called');
    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'MedTracker',
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              'LOGIN PAGE',
              style: TextStyle(
                color: Colors.white,
                fontSize: 12.0,
              ),
            ),
          ],
        ),
        flexibleSpace: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [Color(0xFF64A1FF), Color(0xFF8BFCFE)],
            ),
          ),
        ),
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFF64A1FF), Color(0xFF8BFCFE)],
          ),
        ),
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Form(
            key: formKey,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _buildTextField('Email', emailController, validateEmail, keyboardType: TextInputType.emailAddress),
                SizedBox(height: 16.0),
                _buildTextField('Password', passwordController, validatePassword, obscureText: true),
                SizedBox(height: 8.0),
                GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => ForgotPasswordPage()),
                    );
                  },
                  child: Text(
                    'Forgot Password?',
                    style: TextStyle(color: Colors.white),
                  ),
                ),
                SizedBox(height: 32.0),
                ElevatedButton(
                  onPressed: login,
                  style: ElevatedButton.styleFrom(
                    primary: Colors.white,
                    onPrimary: Colors.black,
                    padding: EdgeInsets.symmetric(horizontal: 40.0),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20.0),
                    ),
                  ),
                  child: Text('Login'),
                ),
                SizedBox(height: 16.0),
                GestureDetector(
                  onTap: () {
                    Navigator.pushNamed(context, '/screen/registration');
                  },
                  child: Text(
                    "Don't have an account? Sign up",
                    style: TextStyle(color: Colors.white),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTextField(String label, TextEditingController controller, String? Function(String?) validator, {bool obscureText = false, TextInputType keyboardType = TextInputType.text}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(color: const Color.fromARGB(255, 255, 254, 254)),
        ),
        SizedBox(height: 8.0),
        Container(
          width: double.infinity,
          height: 40.0,
          child: TextFormField(
            controller: controller,
            obscureText: obscureText,
            keyboardType: keyboardType,
            decoration: InputDecoration(
              border: OutlineInputBorder(),
            ),
            validator: validator,
          ),
        ),
      ],
    );
  }
}
