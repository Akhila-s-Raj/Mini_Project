// schedule_remainder_page.dart
import 'package:flutter/material.dart';
import 'prescription_page.dart';
import 'add_medicine_page.dart';

class ScheduleRemainderPage extends StatelessWidget {
  final String patientName;
  final String patientId;

  ScheduleRemainderPage({required this.patientName, required this.patientId});

  @override
  Widget build(BuildContext context) {
    final List<Color> gradientColors = [
      Color(0xFF64A1FF),
      Color(0xFF8BFCFE)
    ];

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
        flexibleSpace: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: gradientColors,
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
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => PrescriptionPage(
                      patientName: patientName,
                      patientId: patientId,
                    ),
                  ),
                );
              },
              child: Container(
                width: 300.0,
                height: 150.0,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: gradientColors,
                  ),
                  borderRadius: BorderRadius.circular(10.0),
                ),
                child: Center(
                  child: Text(
                    'Prescription',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16.0,
                    ),
                  ),
                ),
              ),
            ),
            SizedBox(height: 20.0),
            GestureDetector(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => AddMedicinePage(
                      patientName: patientName,
                      patientId: patientId,
                    ),
                  ),
                );
              },
              child: Container(
                width: 300.0,
                height: 150.0,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: gradientColors,
                  ),
                  borderRadius: BorderRadius.circular(10.0),
                ),
                child: Center(
                  child: Text(
                    'Add Medicine',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16.0,
                    ),
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
