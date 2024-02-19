import 'package:flutter/material.dart';
import 'package:email_validator/email_validator.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

enum Gender { Male, Female, Others }

class RegistrationPage extends StatefulWidget {
  @override
  _RegistrationPageState createState() => _RegistrationPageState();
}

class _RegistrationPageState extends State<RegistrationPage> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController = TextEditingController();
  final TextEditingController _mobileNumberController = TextEditingController();
  final TextEditingController _addressController = TextEditingController();
  String _selectedUserType = 'Patients';
  Gender? _selectedGender;

  String? _registrationMessage;

  @override
  Widget build(BuildContext context) {
    double textBoxWidth = MediaQuery.of(context).size.width - 32;
    double halfHeight = MediaQuery.of(context).size.height / 20;

    return Scaffold(
      appBar: AppBar(
        title: _registrationMessage != null
            ? Text(
                'Patient ID: $_registrationMessage',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              )
            : Text(
                'MedTracker',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
        flexibleSpace: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [Color(0xFF64A1FF), Color(0xFF8BFCFE)],
            ),
          ),
        ),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal: 16.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SizedBox(height: 16.0),
                _buildTextFieldWithHeading('Name', _nameController, textBoxWidth, halfHeight, _validateName),
                SizedBox(height: 16.0),
                _buildTextFieldWithHeading('Email', _emailController, textBoxWidth, halfHeight, _validateEmail, keyboardType: TextInputType.emailAddress),
                SizedBox(height: 16.0),
                _buildTextFieldWithHeading('Password', _passwordController, textBoxWidth, halfHeight, _validatePassword, obscureText: true),
                SizedBox(height: 16.0),
                _buildTextFieldWithHeading('Confirm Password', _confirmPasswordController, textBoxWidth, halfHeight, _validateConfirmPassword, obscureText: true),
                SizedBox(height: 16.0),
                _buildDropdownWithHeading('Select User Type', _selectedUserType, ['Patients', 'Caregiver'], textBoxWidth, halfHeight, _validateUserType),
                SizedBox(height: 16.0),
                _buildTextFieldWithHeading('Mobile Number', _mobileNumberController, textBoxWidth, halfHeight, _validateMobileNumber, keyboardType: TextInputType.phone),
                SizedBox(height: 16.0),
                _buildTextFieldWithHeading('Address', _addressController, textBoxWidth, halfHeight, _validateAddress),
                SizedBox(height: 16.0),
                _buildRadioButtonsWithHeading('Gender', _selectedGender, ['Male', 'Female', 'Others'], halfHeight, _validateGender),
                SizedBox(height: 16.0),
                Container(
                  width: textBoxWidth,
                  height: halfHeight * 1.5,
                  child: ElevatedButton(
                    onPressed: _register,
                    style: ElevatedButton.styleFrom(
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(0.0)),
                      primary: Colors.transparent,
                      onPrimary: Colors.white,
                      elevation: 0,
                      shadowColor: Colors.transparent,
                      padding: EdgeInsets.all(0),
                    ),
                    child: Ink(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [Color(0xFF64A1FF), Color(0xFF8BFCFE)],
                        ),
                        borderRadius: BorderRadius.circular(0.0),
                      ),
                      child: Container(
                        alignment: Alignment.center,
                        child: Text(
                          'Register',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),

                // Display success/error message
                if (_registrationMessage != null)
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Text(
                      'Registration successful! Unique ID: $_registrationMessage',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: Colors.black,
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTextFieldWithHeading(String heading, TextEditingController controller, double width, double height, String? Function(String?)? validator,
      {bool obscureText = false, TextInputType? keyboardType}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          heading,
          style: TextStyle(color: Colors.grey),
        ),
        SizedBox(height: 8.0),
        Container(
          width: width,
          height: height,
          child: TextFormField(
            controller: controller,
            obscureText: obscureText,
            keyboardType: keyboardType,
            decoration: InputDecoration(
              border: OutlineInputBorder(),
            ),
            onChanged: (value) {
              setState(() {
                validator?.call(value);
              });
            },
            validator: validator,
          ),
        ),
      ],
    );
  }

  Widget _buildDropdownWithHeading(String heading, String value, List<String> items, double width, double height, String? Function(String?)? validator) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          heading,
          style: TextStyle(color: Colors.grey),
        ),
        SizedBox(height: 8.0),
        DropdownButtonFormField<String>(
          value: value,
          onChanged: (String? newValue) {
            setState(() {
              _selectedUserType = newValue ?? '';
            });
            validator?.call(newValue);
          },
          items: items.map((item) {
            return DropdownMenuItem<String>(
              value: item,
              child: Text(
                item,
                style: TextStyle(
                  color: _selectedUserType == item ? const Color.fromARGB(255, 5, 5, 5) : Colors.black,
                ),
              ),
            );
          }).toList(),
          decoration: InputDecoration(
            border: OutlineInputBorder(),
          ),
          validator: validator,
          style: TextStyle(color: Colors.black), // Set default text color
          selectedItemBuilder: (BuildContext context) {
            return items.map<Widget>((String item) {
              return Container(
                height: 50.0, // Adjust the item's height
                color: Colors.grey[200], // Adjust the background color
                child: Center(
                  child: Text(
                    item,
                    style: TextStyle(
                      color: _selectedUserType == item ? const Color.fromARGB(255, 5, 5, 5) : null,
                    ),
                  ),
                ),
              );
            }).toList();
          },
        ),
      ],
    );
  }

  Widget _buildRadioButtonsWithHeading(String heading, Gender? value, List<String> items, double height, String? Function(Gender?)? validator) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          heading,
          style: TextStyle(color: Colors.grey),
        ),
        SizedBox(height: 8.0),
        Container(
          height: height,
          child: Row(
            children: items.map((item) {
              return Row(
                children: [
                  Radio(
                    value: item == 'Male' ? Gender.Male : item == 'Female' ? Gender.Female : Gender.Others,
                    groupValue: value,
                    onChanged: (Gender? newValue) {
                      setState(() {
                        _selectedGender = newValue;
                      });
                      validator?.call(newValue);
                    },
                  ),
                  Text(item),
                ],
              );
            }).toList(),
          ),
        ),
      ],
    );
  }

  String? _validateName(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please enter your name';
    } else if (!RegExp(r'^[a-zA-Z ]+$').hasMatch(value)) {
      return 'Name should only contain alphabets and spaces';
    } else if (value.startsWith(' ')) {
      return 'Name should not begin with a space';
    }
    return null;
  }

  String? _validateEmail(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please enter your email';
    } else if (!EmailValidator.validate(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  }

  String? _validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please enter a password';
    } else if (value.length < 6) {
      return 'Password should be at least 6 characters long';
    } else if (!RegExp(r'^(?=.*?[!@#$%^&*(),.?":{}|<>]).{6,}$').hasMatch(value)) {
      return 'Password should contain at least one special character';
    }
    return null;
  }

  String? _validateConfirmPassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please confirm your password';
    } else if (value != _passwordController.text) {
      return 'Passwords do not match';
    }
    return null;
  }

  String? _validateMobileNumber(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please enter your mobile number';
    } else if (!RegExp(r'^[6-9]\d{9}$').hasMatch(value)) {
      return 'Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9';
    } else if (RegExp(r'(\d)\1{8,}').hasMatch(value)) {
      return 'Mobile number should not have repeated digits more than 9 times';
    }
    return null;
  }

  String? _validateAddress(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please enter your address';
    }
    return null;
  }

  String? _validateUserType(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please select a user type';
    }
    return null;
  }

  String? _validateGender(Gender? value) {
    if (value == null) {
      return 'Please select a gender';
    }
    return null;
  }

  void _register() async {
    if (_formKey.currentState?.validate() ?? false) {
      try {
        UserCredential userCredential = await FirebaseAuth.instance.createUserWithEmailAndPassword(
          email: _emailController.text,
          password: _passwordController.text,
        );

        String uniqueId;

        if (_selectedUserType == 'Patients') {
          uniqueId = await _generateUniquePatientId();
          await FirebaseFirestore.instance.collection('user_patients').doc(userCredential.user!.uid).set({
            'name': _nameController.text,
            'email': _emailController.text,
            'userType': _selectedUserType,
            'mobileNumber': _mobileNumberController.text,
            'gender': _selectedGender.toString(),
            'patientId': uniqueId,
            'address': _addressController.text,
          });
        } else {
          uniqueId = await _generateUniqueCaregiverId();
          await FirebaseFirestore.instance.collection('user_caregivers').doc(userCredential.user!.uid).set({
            'name': _nameController.text,
            'email': _emailController.text,
            'userType': _selectedUserType,
            'mobileNumber': _mobileNumberController.text,
            'gender': _selectedGender.toString(),
            'caregiverId': uniqueId,
            'address': _addressController.text,
          });
        }

        setState(() {
          _registrationMessage = uniqueId;
        });

        print('Registration successful. Unique ID: $uniqueId');
      } on FirebaseAuthException catch (e) {
        setState(() {
          _registrationMessage = 'Registration failed: $e';
        });
        print('Registration failed: $e');
      } catch (e) {
        setState(() {
          _registrationMessage = 'Unexpected error during registration: $e';
        });
        print('Unexpected error during registration: $e');
      }
    }
  }

  Future<String> _generateUniquePatientId() async {
    QuerySnapshot querySnapshot = await FirebaseFirestore.instance.collection('patient_ids').orderBy('timestamp', descending: true).limit(1).get();

    String lastPatientId = 'P123';

    if (querySnapshot.docs.isNotEmpty) {
      String lastPatientIdNumber = querySnapshot.docs.first['patientId'].substring(1);
      int nextPatientIdNumber = int.parse(lastPatientIdNumber) + 1;
      lastPatientId = 'P$nextPatientIdNumber';
    }

    await FirebaseFirestore.instance.collection('patient_ids').add({
      'patientId': lastPatientId,
      'timestamp': FieldValue.serverTimestamp(),
    });

    return lastPatientId;
  }

  Future<String> _generateUniqueCaregiverId() async {
    QuerySnapshot querySnapshot = await FirebaseFirestore.instance.collection('caregiver_ids').orderBy('timestamp', descending: true).limit(1).get();

    String lastCaregiverId = 'C123';

    if (querySnapshot.docs.isNotEmpty) {
      String lastCaregiverIdNumber = querySnapshot.docs.first['caregiverId'].substring(1);
      int nextCaregiverIdNumber = int.parse(lastCaregiverIdNumber) + 1;
      lastCaregiverId = 'C$nextCaregiverIdNumber';
    }

    await FirebaseFirestore.instance.collection('caregiver_ids').add({
      'caregiverId': lastCaregiverId,
      'timestamp': FieldValue.serverTimestamp(),
    });

    return lastCaregiverId;
  }
}
