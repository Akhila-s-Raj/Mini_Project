import 'package:flutter/material.dart';
import 'package:firebase_database/firebase_database.dart';

class MyForm extends StatefulWidget {
  @override
  _MyFormState createState() => _MyFormState();
}

class _MyFormState extends State<MyForm> {
  DatabaseReference _databaseReference =
      FirebaseDatabase.instance.reference().child('hospitals');

  List<String> clinicNames = [];
  String selectedDoctor = '';

  @override
  void initState() {
    super.initState();
    fetchClinicNames();
  }

  void fetchClinicNames() {
    _databaseReference.once().then((DataSnapshot snapshot) {
      Map<dynamic, dynamic> values = snapshot.value;
      values.forEach((key, value) {
        clinicNames.add(value['clinicName']);
      });
      setState(() {
        // Update the state to trigger a rebuild
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Select Doctor'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              DropdownButtonFormField(
                value: selectedDoctor,
                onChanged: (value) {
                  setState(() {
                    selectedDoctor = value.toString();
                  });
                },
                items: clinicNames
                    .map((clinicName) => DropdownMenuItem(
                          child: Text(clinicName),
                          value: clinicName,
                        ))
                    .toList(),
                decoration: InputDecoration(
                  labelText: 'Select Doctor',
                  border: OutlineInputBorder(),
                ),
              ),
              SizedBox(height: 16.0),
              ElevatedButton(
                onPressed: () {
                  // Handle the form submission
                  print('Selected Doctor: $selectedDoctor');
                },
                child: Text('Submit'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

void main() {
  runApp(MaterialApp(
    home: MyForm(),
  ));
}
