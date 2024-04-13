import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:timezone/data/latest.dart' as tz;
import 'package:timezone/timezone.dart' as tz;
import 'package:permission_handler/permission_handler.dart';


class AddMedicinePage extends StatefulWidget {
  final String patientName;
  final String patientId;

  AddMedicinePage({required this.patientName, required this.patientId});

  @override
  _AddMedicinePageState createState() => _AddMedicinePageState();
}

class _AddMedicinePageState extends State<AddMedicinePage> {
  String selectedUnit = 'pills';
  String selectedDays = 'Every day';
  String selectedWeekday = 'Monday';
  int selectedInterval = 1;
  String selectedFrequency = 'Once daily';
  TimeOfDay? firstIntake;
  TimeOfDay? secondIntake;
  TimeOfDay? thirdIntake;
  TextEditingController medicineNameController = TextEditingController();
  TextEditingController doseController = TextEditingController();

  FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin =
      FlutterLocalNotificationsPlugin();

  int notificationId = 0; // Unique ID for notifications

  @override
  @override
void initState() {
  super.initState();
  var initializationSettingsAndroid =
      AndroidInitializationSettings('app_icon');
  var initializationSettings = InitializationSettings(
      android: initializationSettingsAndroid);
  flutterLocalNotificationsPlugin.initialize(initializationSettings);

  // Initialize timezone data
  tz.initializeTimeZones();


}


void _scheduleNotifications(String medicineName, String dose) async {
  // Request permissions
  await _requestPermissions();

  var androidPlatformChannelSpecifics = AndroidNotificationDetails(
    'medtracker_channel', 
    'MedTracker Channel', 
    importance: Importance.max,
    priority: Priority.high,
    ticker: 'ticker',
  );
  var platformChannelSpecifics = NotificationDetails(
    android: androidPlatformChannelSpecifics,
  );

  String payload = '$medicineName|$dose';  // Payload containing medicineName and dose

  tz.TZDateTime? firstIntakeDate = _nextInstanceOfFirstIntake();
  tz.TZDateTime? secondIntakeDate = _nextInstanceOfSecondIntake();
  tz.TZDateTime? thirdIntakeDate = _nextInstanceOfThirdIntake();

  if (selectedFrequency == 'Once daily' && firstIntakeDate != null) {
    await flutterLocalNotificationsPlugin.zonedSchedule(
      notificationId++,
      'Medicine Reminder',
      'Take $dose $selectedUnit of $medicineName now',
      firstIntakeDate,
      platformChannelSpecifics,
      androidAllowWhileIdle: true,
      uiLocalNotificationDateInterpretation: UILocalNotificationDateInterpretation.absoluteTime,
      payload: payload,
    );
  } else if (selectedFrequency == 'Twice daily' && firstIntakeDate != null && secondIntakeDate != null) {
    await flutterLocalNotificationsPlugin.zonedSchedule(
      notificationId++,
      'Medicine Reminder',
      'Take $dose $selectedUnit of $medicineName now',
      firstIntakeDate,
      platformChannelSpecifics,
      androidAllowWhileIdle: true,
      uiLocalNotificationDateInterpretation: UILocalNotificationDateInterpretation.absoluteTime,
      payload: payload,
    );
    await flutterLocalNotificationsPlugin.zonedSchedule(
      notificationId++,
      'Medicine Reminder',
      'Take $dose $selectedUnit of $medicineName now',
      secondIntakeDate,
      platformChannelSpecifics,
      androidAllowWhileIdle: true,
      uiLocalNotificationDateInterpretation: UILocalNotificationDateInterpretation.absoluteTime,
      payload: payload,
    );
  } else if (selectedFrequency == 'Thrice daily' && firstIntakeDate != null && secondIntakeDate != null && thirdIntakeDate != null) {
    await flutterLocalNotificationsPlugin.zonedSchedule(
      notificationId++,
      'Medicine Reminder',
      'Take $dose $selectedUnit of $medicineName now',
      firstIntakeDate,
      platformChannelSpecifics,
      androidAllowWhileIdle: true,
      uiLocalNotificationDateInterpretation: UILocalNotificationDateInterpretation.absoluteTime,
      payload: payload,
    );
    await flutterLocalNotificationsPlugin.zonedSchedule(
      notificationId++,
      'Medicine Reminder',
      'Take $dose $selectedUnit of $medicineName now',
      secondIntakeDate,
      platformChannelSpecifics,
      androidAllowWhileIdle: true,
      uiLocalNotificationDateInterpretation: UILocalNotificationDateInterpretation.absoluteTime,
      payload: payload,
    );
    await flutterLocalNotificationsPlugin.zonedSchedule(
      notificationId++,
      'Medicine Reminder',
      'Take $dose $selectedUnit of $medicineName now',
      thirdIntakeDate,
      platformChannelSpecifics,
      androidAllowWhileIdle: true,
      uiLocalNotificationDateInterpretation: UILocalNotificationDateInterpretation.absoluteTime,
      payload: payload,
    );
  }
}

Future<void> _requestPermissions() async {
  await Permission.notification.request();
  await Permission.ignoreBatteryOptimizations.request();
}

tz.TZDateTime? _nextInstanceOfFirstIntake() {
  if (firstIntake == null) return null;
  final now = tz.TZDateTime.now(tz.local);
  var scheduledDate = tz.TZDateTime(tz.local, now.year, now.month, now.day,
      firstIntake!.hour, firstIntake!.minute);
  if (scheduledDate.isBefore(now)) {
    scheduledDate = scheduledDate.add(const Duration(days: 1));
  }
  return scheduledDate;
}

tz.TZDateTime? _nextInstanceOfSecondIntake() {
  if (secondIntake == null) return null;
  final now = tz.TZDateTime.now(tz.local);
  var scheduledDate = tz.TZDateTime(tz.local, now.year, now.month, now.day,
      secondIntake!.hour, secondIntake!.minute);
  if (scheduledDate.isBefore(now)) {
    scheduledDate = scheduledDate.add(const Duration(days: 1));
  }
  return scheduledDate;
}

tz.TZDateTime? _nextInstanceOfThirdIntake() {
  if (thirdIntake == null) return null;
  final now = tz.TZDateTime.now(tz.local);
  var scheduledDate = tz.TZDateTime(tz.local, now.year, now.month, now.day,
      thirdIntake!.hour, thirdIntake!.minute);
  if (scheduledDate.isBefore(now)) {
    scheduledDate = scheduledDate.add(const Duration(days: 1));
  }
  return scheduledDate;
}

Gradient buttonGradient = LinearGradient(
  colors: [Color(0xFF64A1FF), Color(0xFF8BFCFE)],
);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Text(
                  'Welcome, ${widget.patientName}',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 16.0,
                  ),
                ),
                SizedBox(width: 8),
                Text(
                  'Patient ID: ${widget.patientId}',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 14.0,
                  ),
                ),
              ],
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
        padding: EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Medicine Name:',
              style: TextStyle(fontSize: 16),
            ),
            TextField(
              controller: medicineNameController,
              decoration: InputDecoration(
                hintText: 'Enter medicine name',
              ),
            ),
            SizedBox(height: 20),
            Row( // Unit
              children: [
                Text(
                  'Unit:',
                  style: TextStyle(fontSize: 16),
                ),
                SizedBox(width: 20),
                DropdownButton<String>(
                  value: selectedUnit,
                  onChanged: (value) {
                    setState(() {
                      selectedUnit = value!;
                    });
                  },
                  items: ['pills', 'applications', 'drops', 'millilitre', 'tablespoon']
                      .map<DropdownMenuItem<String>>((String value) {
                    return DropdownMenuItem<String>(
                      value: value,
                      child: Text(value),
                    );
                  }).toList(),
                ),
              ],
            ),
            SizedBox(height: 20),
            Row( // Days
              children: [
                Text(
                  'Days:',
                  style: TextStyle(fontSize: 16),
                ),
                SizedBox(width: 20),
                DropdownButton<String>(
                  value: selectedDays,
                  onChanged: (value) {
                    setState(() {
                      selectedDays = value!;
                    });
                  },
                  items: ['Every day', 'Every X days', 'Weekday']
                      .map<DropdownMenuItem<String>>((String value) {
                    return DropdownMenuItem<String>(
                      value: value,
                      child: Text(value),
                    );
                  }).toList(),
                ),
              ],
            ),
            if (selectedDays == 'Every X days') ...[
              SizedBox(height: 20),
              Row( // Interval
                children: [
                  Text(
                    'Enter interval:',
                    style: TextStyle(fontSize: 16),
                  ),
                  SizedBox(width: 20),
                  Row(
                    children: [
                      IconButton(
                        icon: Icon(Icons.arrow_drop_up),
                        onPressed: () {
                          setState(() {
                            selectedInterval++;
                          });
                        },
                      ),
                      SizedBox(
                        width: 20,
                        child: TextField(
                          readOnly: true,
                          textAlign: TextAlign.center,
                          controller: TextEditingController(text: selectedInterval.toString()),
                        ),
                      ),
                      IconButton(
                        icon: Icon(Icons.arrow_drop_down),
                        onPressed: () {
                          setState(() {
                            if (selectedInterval > 1) selectedInterval--;
                          });
                        },
                      ),
                    ],
                  ),
                ],
              ),
            ],
            if (selectedDays == 'Weekday') ...[
              SizedBox(height: 20),
              Row( // Weekdays
                children: [
                  Text(
                    'Weekdays:',
                    style: TextStyle(fontSize: 16),
                  ),
                  SizedBox(width: 20),
                  DropdownButton<String>(
                    value: selectedWeekday,
                    onChanged: (value) {
                      setState(() {
                        selectedWeekday = value!;
                      });
                    },
                    items: [
                      'Monday',
                      'Tuesday',
                      'Wednesday',
                      'Thursday',
                      'Friday',
                      'Saturday',
                      'Sunday'
                    ].map<DropdownMenuItem<String>>((String value) {
                      return DropdownMenuItem<String>(
                        value: value,
                        child: Text(value),
                      );
                    }).toList(),
                  ),
                ],
              ),
            ],
            SizedBox(height: 20),
            Row( // Frequency
              children: [
                Text(
                  'Frequency:',
                  style: TextStyle(fontSize: 16),
                ),
                SizedBox(width: 20),
                DropdownButton<String>(
                  value: selectedFrequency,
                  onChanged: (value) {
                    setState(() {
                      selectedFrequency = value!;
                    });
                  },
                  items: ['Once daily', 'Twice daily', 'Thrice daily']
                      .map<DropdownMenuItem<String>>((String value) {
                    return DropdownMenuItem<String>(
                      value: value,
                      child: Text(value),
                    );
                  }).toList(),
                ),
              ],
            ),
            if (selectedFrequency == 'Once daily') ...[
              SizedBox(height: 20),
              Row( // First Intake
                children: [
                  Text(
                    'First Intake:',
                    style: TextStyle(fontSize: 16),
                  ),
                  SizedBox(width: 20),
                  ElevatedButton(
                    onPressed: () async {
                      final TimeOfDay? pickedTime = await _selectTime(context);
                      if (pickedTime != null) {
                        setState(() {
                          firstIntake = pickedTime;
                        });
                      }
                    },
                    style: ButtonStyle(
                      backgroundColor: MaterialStateProperty.resolveWith<Color>((Set<MaterialState> states) {
                        return states.contains(MaterialState.pressed) ? Color(0xFF64A1FF) : Color(0xFF8BFCFE);
                      }),
                      overlayColor: MaterialStateProperty.all<Color>(Colors.transparent),
                      shape: MaterialStateProperty.all<OutlinedBorder>(
                        RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10.0),
                        ),
                      ),
                    ),
                    child: Text(
                      firstIntake != null ? 'Selected Time: ${firstIntake!.format(context)}' : 'Select Time',
                      style: TextStyle(color: Colors.white),
                    ),
                  ),
                ],
              ),
            ],
            if (selectedFrequency == 'Twice daily' || selectedFrequency == 'Thrice daily') ...[
              SizedBox(height: 20),
              Row( // Second Intake
                children: [
                  Text(
                    'Second Intake:',
                    style: TextStyle(fontSize: 16),
                  ),
                  SizedBox(width: 20),
                  ElevatedButton(
                    onPressed: () async {
                      final TimeOfDay? pickedTime = await _selectTime(context);
                      if (pickedTime != null) {
                        setState(() {
                          secondIntake = pickedTime;
                        });
                      }
                    },
                    style: ButtonStyle(
                      backgroundColor: MaterialStateProperty.resolveWith<Color>((Set<MaterialState> states) {
                        return states.contains(MaterialState.pressed) ? Color(0xFF64A1FF) : Color(0xFF8BFCFE);
                      }),
                      overlayColor: MaterialStateProperty.all<Color>(Colors.transparent),
                      shape: MaterialStateProperty.all<OutlinedBorder>(
                        RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10.0),
                        ),
                      ),
                    ),
                    child: Text(
                      secondIntake != null ? 'Selected Time: ${secondIntake!.format(context)}' : 'Select Time',
                      style: TextStyle(color: Colors.white),
                    ),
                  ),
                ],
              ),
            ],
            if (selectedFrequency == 'Thrice daily') ...[
              SizedBox(height: 20),
              Row( // Third Intake
                children: [
                  Text(
                    'Third Intake:',
                    style: TextStyle(fontSize: 16),
                  ),
                  SizedBox(width: 20),
                  ElevatedButton(
                    onPressed: () async {
                      final TimeOfDay? pickedTime = await _selectTime(context);
                      if (pickedTime != null) {
                        setState(() {
                          thirdIntake = pickedTime;
                        });
                      }
                    },
                    style: ButtonStyle(
                      backgroundColor: MaterialStateProperty.resolveWith<Color>((Set<MaterialState> states) {
                        return states.contains(MaterialState.pressed) ? Color(0xFF64A1FF) : Color(0xFF8BFCFE);
                      }),
                      overlayColor: MaterialStateProperty.all<Color>(Colors.transparent),
                      shape: MaterialStateProperty.all<OutlinedBorder>(
                        RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10.0),
                        ),
                      ),
                    ),
                    child: Text(
                      thirdIntake != null ? 'Selected Time: ${thirdIntake!.format(context)}' : 'Select Time',
                      style: TextStyle(color: Colors.white),
                    ),
                  ),
                ],
              ),
            ],
            SizedBox(height: 20),
            Row( // Enter Dose
              children: [
                Text(
                  'Enter Dose:',
                  style: TextStyle(fontSize: 16),
                ),
                SizedBox(width: 20),
                Expanded(
                  child: TextField(
                    controller: doseController,
                    keyboardType: TextInputType.number,
                    decoration: InputDecoration(
                      hintText: 'Enter dose',
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  _setReminder();
                },
                style: ButtonStyle(
                  backgroundColor: MaterialStateProperty.resolveWith<Color>((Set<MaterialState> states) {
                    return states.contains(MaterialState.pressed) ? Color(0xFF64A1FF) : Color(0xFF8BFCFE);
                  }),
                  overlayColor: MaterialStateProperty.all<Color>(Colors.transparent),
                  shape: MaterialStateProperty.all<OutlinedBorder>(
                    RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10.0),
                    ),
                  ),
                ),
                child: Padding(
                  padding: EdgeInsets.symmetric(vertical: 15),
                  child: Text(
                    'Set Reminder',
                    style: TextStyle(fontSize: 16),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<TimeOfDay?> _selectTime(BuildContext context) async {
    return await showTimePicker(
      context: context,
      initialTime: TimeOfDay.now(),
    );
  }

  void _setReminder() async {
    // Save reminder to Firestore
    String medicineName = medicineNameController.text;
    String dose = doseController.text;
    String reminderMessage = 'Reminder set successfully';

    // Generate a new document reference for the patient
    var patientDocRef = FirebaseFirestore.instance.collection('reminder').doc(widget.patientId);

    // Generate a new document reference for the medication
    var newMedicineDocRef = patientDocRef.collection('medications').doc();
    String medicineId = newMedicineDocRef.id; // Get the autogenerated ID

    // Store reminder details under the patient's ID with the unique medicine ID
    await newMedicineDocRef.set({
      'medicineId': medicineId,
      'medicineName': medicineName,
      'dose': dose,
      'selectedUnit': selectedUnit,
      'selectedDays': selectedDays,
      'selectedWeekday': selectedWeekday,
      'selectedInterval': selectedInterval,
      'selectedFrequency': selectedFrequency,
      'firstIntake': firstIntake != null ? '${firstIntake!.hour}:${firstIntake!.minute}' : null,
      'secondIntake': secondIntake != null ? '${secondIntake!.hour}:${secondIntake!.minute}' : null,
      'thirdIntake': thirdIntake != null ? '${thirdIntake!.hour}:${thirdIntake!.minute}' : null,
    });

    // Show a snackbar to indicate that reminder was set successfully
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(reminderMessage),
        duration: Duration(seconds: 2),
      ),
    );

    // Schedule notifications
    _scheduleNotifications(medicineName, dose);
  }
  

 Future<void> _showNotification(int id, String title, String body, String payload) async {
    var androidPlatformChannelSpecifics = AndroidNotificationDetails(
      'medtracker_channel', 
      'MedTracker Channel', 
      importance: Importance.max,
      priority: Priority.high,
      ticker: 'ticker',
    );

    var platformChannelSpecifics = NotificationDetails(
      android: androidPlatformChannelSpecifics,
    );

    await flutterLocalNotificationsPlugin.show(
      id,
      title,
      body,
      platformChannelSpecifics,
      payload: payload,  // Set the payload here
    );
}




}





