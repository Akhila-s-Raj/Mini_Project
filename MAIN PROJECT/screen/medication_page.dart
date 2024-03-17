import 'package:flutter/material.dart';
import 'package:csv/csv.dart' as csv;
import 'package:flutter/services.dart' show rootBundle;
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

class MedicationPage extends StatefulWidget {
  final String patientName;
  final String patientId;

  MedicationPage({required this.patientName, required this.patientId});

  @override
  _MedicationPageState createState() => _MedicationPageState();
}

class _MedicationPageState extends State<MedicationPage> {
  List<TextEditingController> _medicationControllers = [TextEditingController()];
  TextEditingController _allergiesController = TextEditingController();

  // Add a reference to the Firestore collection
  final CollectionReference medicationCollection = FirebaseFirestore.instance.collection('medication');

  Future<List<String>> _fetchMedicationSuggestions(String query) async {
    try {
      // Read data from the local CSV file
      final String data = await rootBundle.loadString('assets/medicine.csv');
      final List<List<dynamic>> csvTable = csv.CsvToListConverter().convert(data);

      List<String> suggestions = csvTable
          .skip(1) // Skip header row
          .map<String>((List<dynamic> row) => row[0].toString())
          .where((medication) => medication.toLowerCase().startsWith(query.toLowerCase()))
          .toList();

      return suggestions;
    } catch (e) {
      throw Exception('Error fetching medication suggestions: $e');
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
              'Welcome, ${widget.patientName}',
              style: TextStyle(
                color: Colors.white,
                fontSize: 18.0,
              ),
            ),
            Text(
              'Patient ID: ${widget.patientId}',
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
              colors: [Color(0xFF64A1FF), Color(0xFF8BFCFE)],
            ),
          ),
        ),
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(height: 16.0),
            ..._buildMedicationFields(),
            SizedBox(height: 16.0),
            _buildTextFieldWithHeading('Allergies', _allergiesController),
            SizedBox(height: 16.0),
            ElevatedButton(
              onPressed: () {
                // Add your logic to save medication and allergies data
                _saveMedicationData();
              },
              child: Text('Save'),
            ),
          ],
        ),
      ),
    );
  }

  List<Widget> _buildMedicationFields() {
    List<Widget> medicationFields = [];

    for (int i = 0; i < _medicationControllers.length; i++) {
      TextEditingController controller = _medicationControllers[i];
      medicationFields.add(
        Row(
          children: [
            Expanded(
              child: _buildAutocompleteTextFieldWithHeading('Medication', controller),
            ),
            if (i > 0)
              IconButton(
                icon: Icon(Icons.remove, color: Colors.red),
                onPressed: () {
                  _removeMedicationField(i);
                },
              ),
            if (i == _medicationControllers.length - 1)
              IconButton(
                icon: Icon(Icons.add, color: Colors.blue),
                onPressed: () {
                  _addMedicationField();
                },
              ),
          ],
        ),
      );
    }

    return medicationFields;
  }

  void _addMedicationField() {
    setState(() {
      _medicationControllers.add(TextEditingController());
    });
  }

  void _removeMedicationField(int index) {
    setState(() {
      _medicationControllers.removeAt(index);
    });
  }

  Future<void> _saveMedicationData() async {
    try {
      // Save logic for medication and allergies data
      List<Map<String, dynamic>> medicationsData = [];

      for (var controller in _medicationControllers) {
        print('Medication: ${controller.text}');

        // Add medication data to the list
        medicationsData.add({
          'medication': controller.text,
        });
      }

      print('Allergies: ${_allergiesController.text}');
      // Add allergies data to the list
      medicationsData.add({
        'allergies': _allergiesController.text,
      });

      // Store all data under a single document with patientId as the document ID
      await medicationCollection.doc(widget.patientId).set({
        'patientId': widget.patientId,
        'patientName': widget.patientName,
        'medications': medicationsData,
      });

      // Show pop-up message
      _showSuccessDialog();

      // Refresh the page by rebuilding the widget tree
      setState(() {
        _medicationControllers.clear();
        _medicationControllers.add(TextEditingController());
        _allergiesController.clear();
      });
    } catch (e) {
      print('Error saving medication data: $e');
      // Optional: Display an error message
    }
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text("Success"),
          content: Text("Medication added successfully."),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text("OK"),
            ),
          ],
        );
      },
    );
  }

  Widget _buildTextFieldWithHeading(String heading, TextEditingController controller) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          heading,
          style: TextStyle(color: Colors.grey),
        ),
        SizedBox(height: 8.0),
        Container(
          width: double.infinity,
          height: 50.0,
          child: TextFormField(
            controller: controller,
            decoration: InputDecoration(
              border: OutlineInputBorder(),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildAutocompleteTextFieldWithHeading(String heading, TextEditingController controller) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          heading,
          style: TextStyle(color: Colors.grey),
        ),
        SizedBox(height: 8.0),
        Autocomplete<String>(
          optionsBuilder: (TextEditingValue textEditingValue) async {
            final List<String> suggestions = await _fetchMedicationSuggestions(textEditingValue.text);
            return suggestions;
          },
          onSelected: (String selectedValue) {
            controller.text = selectedValue;
          },
          fieldViewBuilder: (BuildContext context, TextEditingController textEditingController, FocusNode focusNode, VoidCallback onFieldSubmitted) {
            return TextFormField(
              controller: textEditingController,
              focusNode: focusNode,
              onFieldSubmitted: (String value) {
                onFieldSubmitted();
              },
              decoration: InputDecoration(
                border: OutlineInputBorder(),
              ),
            );
          },
          optionsViewBuilder: (BuildContext context, AutocompleteOnSelected<String> onSelected, Iterable<String> options) {
            return Align(
              alignment: Alignment.topLeft,
              child: Material(
                elevation: 4.0,
                child: SizedBox(
                  height: 200.0,
                  child: ListView.builder(
                    padding: EdgeInsets.all(8.0),
                    itemCount: options.length,
                    itemBuilder: (BuildContext context, int index) {
                      final String option = options.elementAt(index);
                      return ListTile(
                        title: Text(option),
                        onTap: () {
                          onSelected(option);
                        },
                      );
                    },
                  ),
                ),
              ),
            );
          },
        ),
      ],
    );
  }
}

void main() {
  runApp(MaterialApp(
    home: MedicationPage(patientName: 'Patient Name', patientId: 'Patient ID'), // Provide default values or retrieve them from authentication
  ));
}
