import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'login_page.dart';
import 'appointment_schedule_page.dart';

class HomePage extends StatelessWidget {
  final String patientName;
  final String patientId;

  HomePage({required this.patientName, required this.patientId});

  Future<void> _logout(BuildContext context) async {
    try {
      await FirebaseAuth.instance.signOut();
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => LoginPage()),
      );
    } catch (e) {
      print("Error during logout: $e");
      // Handle errors during logout
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Welcome, $patientName',
              style: TextStyle(
                color: Colors.white,
                fontSize: 18.0,
              ),
            ),
            Text(
              'Patient ID: $patientId',
              style: TextStyle(
                color: Colors.white,
                fontSize: 14.0,
              ),
            ),
          ],
        ),
        actions: [
          PopupMenuButton<String>(
            onSelected: (value) {
              if (value == 'logout') {
                _logout(context); // Call logout function
              } else if (value == 'editProfile') {
                // Navigate to the Edit Profile page
                // You can add your navigation logic here
              }
            },
            itemBuilder: (BuildContext context) {
              return [
                PopupMenuItem<String>(
                  value: 'logout',
                  child: Text('Logout'),
                ),
                PopupMenuItem<String>(
                  value: 'editProfile',
                  child: Text('Edit Profile'),
                ),
              ];
            },
          ),
        ],
        flexibleSpace: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [Color(0xFF64A1FF), Color(0xFF8BFCFE)],
            ),
          ),
        ),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            GestureDetector(
              onTap: () {
                // Navigate to the Appointment Schedule page
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => AppointmentSchedulePage(
                      patientName: patientName,
                      patientId: patientId,
                    ),
                  ),
                );
              },
              child: Container(
                width: 300.0,
                height: 150.0, // Reduce the height to fit within the available space
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Color(0xFF64A1FF), Color(0xFF8BFCFE)],
                  ),
                  borderRadius: BorderRadius.circular(10.0),
                ),
                child: Center(
                  child: Text(
                    'APPOINTMENT SCHEDULE',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16.0,
                    ),
                  ),
                ),
              ),
            ),
            SizedBox(height: 20.0), // Adjust the spacing as needed
            Container(
              width: 300.0,
              height: 150.0, // Reduce the height to fit within the available space
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xFF64A1FF), Color(0xFF8BFCFE)],
                ),
                borderRadius: BorderRadius.circular(10.0),
              ),
              child: Center(
                child: Text(
                  'SCHEDULE REMAINDER',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 16.0,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
