import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:razorpay_flutter/razorpay_flutter.dart';
import 'dart:math';
import 'token_page.dart';

class AppointmentSchedulePage extends StatefulWidget {
  final String patientName;
  final String patientId;

  AppointmentSchedulePage({
    required this.patientName,
    required this.patientId,
  });

  @override
  _AppointmentSchedulePageState createState() => _AppointmentSchedulePageState();
}

class _AppointmentSchedulePageState extends State<AppointmentSchedulePage> {
  Razorpay _razorpay = Razorpay();
  String? selectedHospital;
  String? selectedDepartment;
  Map<String, dynamic>? selectedDoctor;
  DateTime? selectedDate;
  TimeOfDay? selectedTime;
  List<String> hospitals = [];
  List<String> departments = [];
  List<Map<String, dynamic>> doctors = [];
  Map<TimeOfDay, bool> timeSlotAvailability = {};

  Map<String, int> doctorTokenCount = {}; // Store token count for each doctor

  List<TimeOfDay> generateTimeSlots() {
    List<TimeOfDay> timeSlots = [];
    for (int hour = 8; hour <= 18; hour++) {
      for (int minute = 0; minute < 60; minute += 15) {
        if (!(hour == 13 && minute >= 0 && minute < 60)) {
          timeSlots.add(TimeOfDay(hour: hour, minute: minute));
        }
      }
    }
    return timeSlots;
  }

  Map<TimeOfDay, bool> generateTimeSlotAvailability() {
    Map<TimeOfDay, bool> availability = {};
    for (TimeOfDay time in generateTimeSlots()) {
      availability[time] = true;
    }
    return availability;
  }

  Future<void> getHospitals() async {
    try {
      QuerySnapshot querySnapshot =
          await FirebaseFirestore.instance.collection('doctors_list').get();
      setState(() {
        hospitals = querySnapshot.docs
            .map((doc) => doc['hospital']['name'].toString())
            .toSet()
            .toList();
      });
      print("Hospitals: $hospitals");
    } catch (error) {
      print("Error fetching hospitals: $error");
    }
  }

  Future<void> getDepartments(String hospitalName) async {
    try {
      QuerySnapshot querySnapshot = await FirebaseFirestore.instance
          .collection('doctors_list')
          .where('hospital.name', isEqualTo: hospitalName)
          .get();

      if (querySnapshot.docs.isNotEmpty) {
        List<dynamic> departmentsList =
            querySnapshot.docs.map((doc) => doc['department']).toSet().toList();
        setState(() {
          departments = departmentsList.map((dynamic item) => item.toString()).toList();
        });

        if (!departments.contains(selectedDepartment)) {
          setState(() {
            selectedDepartment = null;
          });
        }
      } else {
        setState(() {
          departments = [];
        });
      }
    } catch (error) {
      print("Error fetching departments: $error");
    }
  }

  Future<void> getDoctors(String hospitalName, String department) async {
    try {
      QuerySnapshot querySnapshot = await FirebaseFirestore.instance
          .collection('doctors_list')
          .where('hospital.name', isEqualTo: hospitalName)
          .where('department', isEqualTo: department)
          .get();

      setState(() {
        doctors = querySnapshot.docs
    .map((doc) {
      final data = doc.data() as Map<String, dynamic>?;

      if (data != null) {
        // Ensure that 'name' is not null before using it
        final name = data['name'] as String?;
        final safeName = name ?? ''; // Use an empty string if 'name' is null

        final speciality = data['speciality'] as String? ?? '';

        // Ensure that 'photoURL' is not null before using it
        final photoURL = data['photoURL'] as String?;
        final safePhotoURL = photoURL ?? ''; // Use an empty string if 'photoURL' is null

        return {
          'name': safeName,
          'speciality': speciality,
          'photoURL': safePhotoURL,
          // Other properties...
        };
      }

      return null;
    })
    .where((data) => data != null)
    .map((data) => data!)
    .toList();


      });
    } catch (error) {
      print("Error fetching doctors: $error");
    }
  }

  void scheduleAppointment() {
    if (selectedHospital != null &&
        selectedDepartment != null &&
        selectedDoctor != null &&
        selectedDate != null &&
        selectedTime != null) {
      startPayment();
    } else {
      print('Please fill in all fields and select an appointment date and time.');
    }
  }

  Future<void> _selectDate(BuildContext context) async {
  DateTime now = DateTime.now();
  DateTime lastDate = now.add(Duration(days: 7)); // Allow scheduling up to one week in advance

  DateTime? pickedDate = await showDatePicker(
    context: context,
    initialDate: now,
    firstDate: now,
    lastDate: lastDate,
  );

  if (pickedDate != null) {
    setState(() {
      selectedDate = pickedDate;
      resetDoctorTokenCount(); // Reset token count for each day
      updateTimeSlotAvailability();
    });
  }
}


  void resetDoctorTokenCount() {
    doctorTokenCount.clear();
  }

  Future<void> updateTimeSlotAvailability() async {
  timeSlotAvailability = generateTimeSlotAvailability();

  if (selectedDoctor != null && selectedDate != null) {
    // Fetch scheduled appointments for the selected doctor on the selected date
    QuerySnapshot appointmentsSnapshot = await FirebaseFirestore.instance
        .collection('appointments')
        .where('doctor.name', isEqualTo: selectedDoctor!['name'])
        .where('appointmentDate', isEqualTo: selectedDate)
        .get();

    appointmentsSnapshot.docs.forEach((appointment) {
      // Get the appointment time
      String appointmentTime = appointment['appointmentTime'];

      // Mark the corresponding time slot as unavailable
      TimeOfDay time = TimeOfDay(
        hour: int.parse(appointmentTime.split(':')[0]),
        minute: int.parse(appointmentTime.split(':')[1]),
      );
      timeSlotAvailability[time] = false;
    });
  }
  setState(() {});
}


  @override
  @override
void initState() {
  super.initState();
  _razorpay = Razorpay();
  _razorpay.on(Razorpay.EVENT_PAYMENT_SUCCESS, _handlePaymentSuccess);
  _razorpay.on(Razorpay.EVENT_PAYMENT_ERROR, _handlePaymentError);
  _razorpay.on(Razorpay.EVENT_EXTERNAL_WALLET, _handleExternalWallet);
  getHospitals();

  // Initialize doctorTokenCount for each doctor
  doctors.forEach((doctor) {
    doctorTokenCount[doctor['name']] = 0;
  });
}


  @override
  void dispose() {
    _razorpay.clear();
    super.dispose();
  }

  void startPayment() {
    const apiKey = 'rzp_test_K7mDxqhZ7xSZ4I';

    var options = {
      'key': apiKey,
      'amount': 20000,
      'name': 'MedTracker',
      'description': 'Appointment Payment',
      'prefill': {'contact': 'user_contact_number', 'email': 'user_email'},
      'external': {'wallets': ['paytm']},
    };

    try {
      _razorpay.open(options);
    } catch (e) {
      print("Error starting Razorpay payment: $e");
    }
  }

  void _handlePaymentSuccess(PaymentSuccessResponse response) {
    print("Payment Successful. Payment ID: ${response.paymentId}");
    storeAppointmentData();
  }

  void _handlePaymentError(PaymentFailureResponse response) {
    print("Payment Error: ${response.message}");
    // Add your error handling logic here
  }

  void _handleExternalWallet(ExternalWalletResponse response) {
    print("External Wallet: ${response.walletName}");
    // Add your external wallet handling logic here
  }

void storeAppointmentData() {
  if (selectedDoctor != null && selectedDate != null && selectedTime != null) {
    // Check if the selected time slot is available
    if (timeSlotAvailability[selectedTime!]!) {
      // Mark the selected time slot as unavailable
      timeSlotAvailability[selectedTime!] = false;

      // Increment token count for the selected doctor, patient, and date combination
      int doctorToken = incrementDoctorTokenCount(selectedDoctor!['name'], widget.patientId, selectedDate!);

      // Generate a unique appointment ID (e.g., A123)
      String appointmentId = 'A' + Random().nextInt(1000).toString();

      // Store appointment details in Firestore
      FirebaseFirestore.instance.collection('appointments').doc(appointmentId).set({
        'appointmentId': appointmentId,
        'patientName': widget.patientName,
        'patientId': widget.patientId,
        'tokenNumber': doctorToken,
        'hospital': selectedHospital,
        'department': selectedDepartment,
        'doctor': selectedDoctor,
        'appointmentDate': selectedDate!.toLocal(),
        'appointmentTime': selectedTime!.format(context),
        'paymentStatus': 'success', // You can add more details based on your requirements
      }).then((value) {
        print('Appointment data stored successfully');
        generateTokenNumberAndNavigate();
      }).catchError((error) {
        print('Error storing appointment data: $error');
        // Handle error accordingly
      });
    } else {
      print('The selected time slot is already booked. Please choose another slot.');
    }
  }
}


int incrementDoctorTokenCount(String doctor, String patientId, DateTime selectedDate) {
  // Increment token count for the selected doctor, patient, and date combination
  doctorTokenCount[doctor] = (doctorTokenCount[doctor] ?? 0) + 1;

  return doctorTokenCount[doctor]!;
}




 void generateTokenNumberAndNavigate() {
  // Placeholder logic for generating token number
  // You can customize this based on your specific requirements
  int tokenNumber = doctorTokenCount[selectedDoctor!['name']] ?? 0;

  // Pass selected doctor name, appointment date, and time to TokenPage
  Navigator.push(
    context,
    MaterialPageRoute(
      builder: (context) => TokenPage(
        patientName: widget.patientName,
        patientId: widget.patientId,
        tokenNumber: tokenNumber,
        selectedDoctorName: selectedDoctor!['name'],
        selectedAppointmentDate: selectedDate!,
        selectedAppointmentTime: selectedTime!,
      ),
    ),
  );
}


  List<TimeOfDay> generateTimeSlotsList() {
    List<TimeOfDay> timeSlots = [];
    for (int hour = 8; hour <= 18; hour++) {
      for (int minute = 0; minute < 60; minute += 15) {
        if (!(hour == 13 && minute >= 0 && minute < 60)) {
          timeSlots.add(TimeOfDay(hour: hour, minute: minute));
        }
      }
    }
    return timeSlots;
  }

 Widget generateTimeSlotsWidgets() {
  return Wrap(
    spacing: 8.0,
    runSpacing: 8.0,
    children: generateTimeSlots().map((time) {
      return ElevatedButton(
        onPressed: timeSlotAvailability.containsKey(time) && timeSlotAvailability[time]!
            ? () {
                setState(() {
                  selectedTime = time;
                });
              }
            : null,
        style: ButtonStyle(
          backgroundColor: MaterialStateProperty.resolveWith<Color?>(
            (Set<MaterialState> states) {
              if (states.contains(MaterialState.disabled)) {
                return Colors.red; // Use red for disabled slots
              }
              return selectedTime == time ? Colors.blue : null;
            },
          ),
        ),
        child: Text('${time.format(context)}'),
      );
    }).toList(),
  );
}

  Widget generateDoctorsList() {
  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: doctors.map((doctor) {
      bool isSelected = selectedDoctor == doctor;

      return ListTile(
        tileColor: isSelected ? Colors.grey : null,
        leading: CircleAvatar(
          backgroundImage: NetworkImage(doctor['photoURL']),
        ),
        title: Text(doctor['name']),
        subtitle: Text(doctor['speciality']),
        onTap: () {
          setState(() {
            selectedDoctor = isSelected ? null : doctor;
          });
        },
      );
    }).toList(),
  );
}


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Welcome, ${widget.patientName}',
                style: TextStyle(
                color: Colors.white,
                fontSize: 18.0,
              ),),
            Text('Patient ID: ${widget.patientId}',
            style: TextStyle(
                color: Colors.white,
                fontSize: 18.0,
              ),),
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
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                'Schedule Appointment',
                style: TextStyle(
                  fontSize: 24.0,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 16.0),
              DropdownButton<String>(
                value: selectedHospital,
                hint: Text('Select Hospital'),
                onChanged: (value) {
                  setState(() {
                    selectedHospital = value;
                    selectedDepartment = null;
                    selectedDoctor = null;
                    getDepartments(selectedHospital!);
                  });
                },
                items: hospitals.isNotEmpty
                    ? hospitals.map((hospital) {
                        return DropdownMenuItem<String>(
                          value: hospital,
                          child: Text(hospital),
                        );
                      }).toList()
                    : [],
              ),
              SizedBox(height: 16.0),
              DropdownButton<String>(
                value: selectedDepartment,
                hint: Text('Select Department'),
                onChanged: (value) {
                  setState(() {
                    selectedDepartment = value;
                    selectedDoctor = null;
                    getDoctors(selectedHospital!, selectedDepartment!);
                  });
                },
                items: departments.isNotEmpty
                    ? departments.map((department) {
                        return DropdownMenuItem<String>(
                          value: department,
                          child: Text(department),
                        );
                      }).toList()
                    : [],
              ),
              SizedBox(height: 16.0),
              if (doctors.isNotEmpty)
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Select Doctor:',
                      style: TextStyle(fontSize: 16),
                    ),
                    SizedBox(height: 8.0),
                    generateDoctorsList(),
                  ],
                ),
              SizedBox(height: 16.0),
              ElevatedButton(
                onPressed: () => _selectDate(context),
                child: Text('Select Appointment Date'),
              ),
              SizedBox(height: 16.0),
              if (selectedDate != null)
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Selected Appointment Date: ${selectedDate!.toLocal()}',
                      style: TextStyle(fontSize: 16),
                    ),
                    SizedBox(height: 16.0),
                    Text(
                      'Select Appointment Time:',
                      style: TextStyle(fontSize: 16),
                    ),
                    SizedBox(height: 8.0),
                    generateTimeSlotsWidgets(),
                  ],
                ),
              SizedBox(height: 16.0),
              ElevatedButton(
                onPressed: () {
                  scheduleAppointment();
                },
                child: Text('Schedule Appointment'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
