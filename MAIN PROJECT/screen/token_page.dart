import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:mailer/mailer.dart';
import 'package:mailer/smtp_server.dart';

class TokenPage extends StatefulWidget {
  final String patientName;
  final String patientId;
  final int tokenNumber;

  TokenPage({
    required this.patientName,
    required this.patientId,
    required this.tokenNumber,
  });

  @override
  _TokenPageState createState() => _TokenPageState();
}

class _TokenPageState extends State<TokenPage> {
  String patientEmail = '';

  @override
  void initState() {
    super.initState();
    fetchPatientEmail();
    sendTokenNumberByEmail(); // Automatically send token number on page load
  }

  Future<void> fetchPatientEmail() async {
    try {
      // Get the current user
      User? currentUser = FirebaseAuth.instance.currentUser;

      if (currentUser != null) {
        // Fetch user email from user_patients table using UID
        DocumentSnapshot snapshot = await FirebaseFirestore.instance
            .collection('user_patients')
            .doc(currentUser.uid)
            .get();

        if (snapshot.exists) {
          setState(() {
            patientEmail = snapshot['email'] ?? ''; // handle null
          });
        }
      }
    } catch (error) {
      print("Error fetching patient email: $error");
    }
  }

  Future<void> sendTokenNumberByEmail() async {
  final smtpServer = gmail('akhila773666@gmail.com', 'Akhila00@');

  final message = Message()
    ..from = Address('akhila773666@gmail.com', 'MedTracker')
    ..recipients.add(patientEmail)
    ..subject = 'Token Number Notification'
    ..text = 'Your token number is: ${widget.tokenNumber}';

  try {
    await send(message, smtpServer);
    print('Message sent successfully');
  } catch (error, stackTrace) {
    print('Error sending email: $error\n$stackTrace');
  }
}





  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: PreferredSize(
        preferredSize: Size.fromHeight(100.0), // Adjust the height as needed
        child: AppBar(
          flexibleSpace: Container(
            padding: EdgeInsets.only(left: 16.0, right: 16.0, top: 70.0),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  Color(0xFF64A1FF),
                  Color(0xFF8BFCFE),
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('${widget.patientName} - Patient ID: ${widget.patientId}'),
                Text('Email: $patientEmail'),
              ],
            ),
          ),
        ),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('Token Number: ${widget.tokenNumber}'),
            // Add other UI components as needed
          ],
        ),
      ),
    );
  }
}
