import 'package:flutter/material.dart';
import 'package:medtracker/screen/login_page.dart';

class CaregiverHomePage extends StatelessWidget {
  final String caregiverName;
  final String caregiverId;

  CaregiverHomePage({required this.caregiverName, required this.caregiverId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Welcome, $caregiverName',
              style: TextStyle(
                color: Colors.white,
                fontSize: 18.0,
              ),
            ),
            Text(
              'Caregiver ID: $caregiverId',
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
              // Handle menu item selection
              if (value == 'logout') {
                // Navigate to the login page when logout is selected
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (context) => LoginPage()),
                );
                // You can add your logout logic here
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
        child: Text(
          'Caregiver Home Page',
          style: TextStyle(
            fontSize: 24.0,
          ),
        ),
      ),
    );
  }
}
