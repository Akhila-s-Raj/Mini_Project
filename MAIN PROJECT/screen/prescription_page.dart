import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class PrescriptionPage extends StatelessWidget {
  final String patientName;
  final String patientId;

  PrescriptionPage({required this.patientName, required this.patientId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Prescriptions'),
        flexibleSpace: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [Color(0xFF64A1FF), Color(0xFF8BFCFE)],
            ),
          ),
        ),
        actions: [
          Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                'Welcome, $patientName',
                style: TextStyle(
                  fontSize: 16.0,
                ),
              ),
              Text(
                'Patient ID: $patientId',
                style: TextStyle(
                  fontSize: 14.0,
                ),
              ),
            ],
          ),
          SizedBox(width: 20),
        ],
      ),
      body: StreamBuilder(
        stream: FirebaseFirestore.instance
            .collection('prescription')
            .doc(patientId)
            .collection('prescriptions')
            .snapshots(),
        builder: (context, AsyncSnapshot<QuerySnapshot> snapshot) {
          if (snapshot.hasError) {
            return Text('Error: ${snapshot.error}');
          }

          if (snapshot.connectionState == ConnectionState.waiting) {
            return CircularProgressIndicator();
          }

          final prescriptionDocs = snapshot.data!.docs;

          if (prescriptionDocs.isEmpty) {
            return Text('No prescriptions found.');
          }

          return ListView.builder(
            itemCount: prescriptionDocs.length,
            itemBuilder: (context, index) {
              final prescriptionData =
                  prescriptionDocs[index].data() as Map<String, dynamic>;

              return Container(
                margin: EdgeInsets.all(10),
                padding: EdgeInsets.all(10),
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Doctor Name: ${prescriptionData['doctorName']}',
                      style: TextStyle(
                        fontSize: 18.0,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text('Symptoms: ${prescriptionData['symptoms']}'),
                    Text('Diagnosis: ${prescriptionData['diagnosis']}'),
                    Text(
                      'Timestamp: ${_formatTimestamp(prescriptionData['timestamp'])}',
                    ),
                    Text('Medications:'),
                    ..._buildMedicationsList(prescriptionData['medications']),
                    SizedBox(height: 10),
                    ElevatedButton(
                      onPressed: () {
                        // Add your onPressed function here
                      },
                      child: Text(
                        'Set Reminder',
                        style: TextStyle(fontSize: 16),
                      ),
                      style: ElevatedButton.styleFrom(
                        primary: Color(0xFF64A1FF),
                      ),
                    ),
                  ],
                ),
              );
            },
          );
        },
      ),
    );
  }

  List<Widget> _buildMedicationsList(List<dynamic> medications) {
    List<Widget> medicationWidgets = [];

    for (var medication in medications) {
      medicationWidgets.add(
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Medicine: ${medication['medicine']}'),
            Text('Days: ${medication['days']}'),
            Text('Dose: ${medication['dose']}'),
            Text('Frequency: ${medication['frequency']}'),
            Text('Intake Times:'),
            Text('  First Intake: ${medication['intakeTimes']['firstIntake']}'),
            Text('  Second Intake: ${medication['intakeTimes']['secondIntake']}'),
            Text('  Third Intake: ${medication['intakeTimes']['thirdIntake']}'),
            Text('Manual Days: ${medication['manualDays']}'),
            Text('Unit: ${medication['unit']}'),
          ],
        ),
      );
    }

    return medicationWidgets;
  }

  String _formatTimestamp(Timestamp timestamp) {
    DateTime dateTime = timestamp.toDate();
    return '${dateTime.day}/${dateTime.month}/${dateTime.year} ${dateTime.hour}:${dateTime.minute}';
  }
}
