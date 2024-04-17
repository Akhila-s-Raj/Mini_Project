import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:timezone/timezone.dart' as tz;
import 'package:timezone/data/latest.dart' as tz;

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

  @override
  void initState() {
    super.initState();
    _initializeNotifications();
    _createNotificationChannel();  
    tz.initializeTimeZones();
  }

  void _initializeNotifications() {
    var initializationSettingsAndroid =
        AndroidInitializationSettings('@mipmap/ic_launcher');
    var initializationSettings =
        InitializationSettings(android: initializationSettingsAndroid);

    flutterLocalNotificationsPlugin.initialize(initializationSettings);
  }

  void _createNotificationChannel() {
    var androidNotificationChannel = AndroidNotificationChannel(
      'channel_ID',
      'channel_name',
      importance: Importance.max,
      playSound: true,
      enableVibration: true,
    );

    flutterLocalNotificationsPlugin
        .resolvePlatformSpecificImplementation<
            AndroidFlutterLocalNotificationsPlugin>()
        ?.createNotificationChannel(androidNotificationChannel);
  }

  void _scheduleNotification(TimeOfDay time, String title, String body) async {
  print('Scheduling notification for $time with title $title and body $body');

  var androidPlatformChannelSpecifics = AndroidNotificationDetails(
    'channel_ID',
    'channel_name',
    importance: Importance.max,
    priority: Priority.high,
    playSound: true,
    enableVibration: true,
    styleInformation: BigTextStyleInformation(''),
  );
  
  var platformChannelSpecifics = NotificationDetails(
    android: androidPlatformChannelSpecifics,
  );

  // Generate a unique id that fits within the range of a 32-bit integer
  int id = DateTime.now().millisecondsSinceEpoch % (1 << 31);

  DateTime now = DateTime.now();
  DateTime scheduledDate = DateTime(
    now.year,
    now.month,
    now.day,
    time.hour,
    time.minute,
  );

  await flutterLocalNotificationsPlugin.zonedSchedule(
    id,
    title,
    body,
    tz.TZDateTime.from(scheduledDate, tz.local),
    platformChannelSpecifics,
    androidAllowWhileIdle: true,
    uiLocalNotificationDateInterpretation:
        UILocalNotificationDateInterpretation.absoluteTime,
    matchDateTimeComponents: DateTimeComponents.time,
  );
}

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
            Row(
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
                  items: [
                    'pills',
                    'applications',
                    'drops',
                    'millilitre',
                    'tablespoon'
                  ].map<DropdownMenuItem<String>>((String value) {
                    return DropdownMenuItem<String>(
                      value: value,
                      child: Text(value),
                    );
                  }).toList(),
                ),
              ],
            ),
            SizedBox(height: 20),
            Row(
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
              Row(
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
                          controller: TextEditingController(
                              text: selectedInterval.toString()),
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
              Row(
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
            Row(
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
              Row(
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
                      backgroundColor: MaterialStateProperty.resolveWith<Color>(
                          (Set<MaterialState> states) {
                        return states.contains(MaterialState.pressed)
                            ? Color(0xFF64A1FF)
                            : Color(0xFF8BFCFE);
                      }),
                      overlayColor: MaterialStateProperty.all<Color>(Colors.transparent),
                      shape: MaterialStateProperty.all<OutlinedBorder>(
                        RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10.0),
                        ),
                      ),
                    ),
                    child: Text(
                      firstIntake != null
                          ? 'Selected Time: ${firstIntake!.format(context)}'
                          : 'Select Time',
                      style: TextStyle(color: Colors.white),
                    ),
                  ),
                ],
              ),
            ],
            if (selectedFrequency == 'Twice daily' ||
                selectedFrequency == 'Thrice daily') ...[
              SizedBox(height: 20),
              Row(
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
                      backgroundColor: MaterialStateProperty.resolveWith<Color>(
                          (Set<MaterialState> states) {
                        return states.contains(MaterialState.pressed)
                            ? Color(0xFF64A1FF)
                            : Color(0xFF8BFCFE);
                      }),
                      overlayColor: MaterialStateProperty.all<Color>(Colors.transparent),
                      shape: MaterialStateProperty.all<OutlinedBorder>(
                        RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10.0),
                        ),
                      ),
                    ),
                    child: Text(
                      firstIntake != null
                          ? 'Selected Time: ${firstIntake!.format(context)}'
                          : 'Select Time',
                      style: TextStyle(color: Colors.white),
                    ),
                  ),
                ],
              ),
              SizedBox(height: 20),
              Row(
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
                      backgroundColor: MaterialStateProperty.resolveWith<Color>(
                          (Set<MaterialState> states) {
                        return states.contains(MaterialState.pressed)
                            ? Color(0xFF64A1FF)
                            : Color(0xFF8BFCFE);
                      }),
                      overlayColor: MaterialStateProperty.all<Color>(Colors.transparent),
                      shape: MaterialStateProperty.all<OutlinedBorder>(
                        RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10.0),
                        ),
                      ),
                    ),
                    child: Text(
                      secondIntake != null
                          ? 'Selected Time: ${secondIntake!.format(context)}'
                          : 'Select Time',
                      style: TextStyle(color: Colors.white),
                    ),
                  ),
                ],
              ),
              if (selectedFrequency == 'Thrice daily') ...[
                SizedBox(height: 20),
                Row(
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
                        backgroundColor: MaterialStateProperty.resolveWith<Color>(
                            (Set<MaterialState> states) {
                          return states.contains(MaterialState.pressed)
                              ? Color(0xFF64A1FF)
                              : Color(0xFF8BFCFE);
                        }),
                        overlayColor: MaterialStateProperty.all<Color>(Colors.transparent),
                        shape: MaterialStateProperty.all<OutlinedBorder>(
                          RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10.0),
                          ),
                        ),
                      ),
                      child: Text(
                        thirdIntake != null
                            ? 'Selected Time: ${thirdIntake!.format(context)}'
                            : 'Select Time',
                        style: TextStyle(color: Colors.white),
                      ),
                    ),
                  ],
                ),
              ],
            ],

            SizedBox(height: 20),
            Row(
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
                  _saveMedication();
                },
                style: ButtonStyle(
                  backgroundColor: MaterialStateProperty.resolveWith<Color>(
                      (Set<MaterialState> states) {
                    return states.contains(MaterialState.pressed)
                        ? Color(0xFF64A1FF)
                        : Color(0xFF8BFCFE);
                  }),
                  overlayColor:
                      MaterialStateProperty.all<Color>(Colors.transparent),
                  shape: MaterialStateProperty.all<OutlinedBorder>(
                    RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10.0),
                    ),
                  ),
                ),
                child: Padding(
                  padding: EdgeInsets.symmetric(vertical: 15),
                  child: Text(
                    'Save Medication',
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

  void _saveMedication() async {
    String medicineName = medicineNameController.text;
    String dose = doseController.text;

    var patientDocRef = FirebaseFirestore.instance.collection('reminder').doc(widget.patientId);

    var newMedicineDocRef = patientDocRef.collection('reminder').doc();
    String medicineId = newMedicineDocRef.id; 

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

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Medication saved successfully'),
        duration: Duration(seconds: 2),
      ),
    );

    if (firstIntake != null) {
      _scheduleNotification(
          firstIntake!,
          'Medication Reminder',
          'Time to take your $medicineName');
    }
    if (secondIntake != null) {
      _scheduleNotification(
          secondIntake!,
          'Medication Reminder',
          'Time to take your $medicineName');
    }
    if (thirdIntake != null) {
      _scheduleNotification(
          thirdIntake!,
          'Medication Reminder',
          'Time to take your $medicineName,$dose');
    }
  }
}
