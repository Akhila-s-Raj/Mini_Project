import 'package:flutter/material.dart';
import 'refund_page.dart'; // Import the refund_page.dart file

class OtherPage extends StatelessWidget {
  final String patientName;
  final String patientId;

  OtherPage({required this.patientName, required this.patientId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Other Page'),
      ),
      body: Center(
        child: ElevatedButton(
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => RefundPage(patientName: patientName, patientId: patientId),
              ),
            );
          },
          child: Text('Go to Refund Page'),
        ),
      ),
    );
  }
}
