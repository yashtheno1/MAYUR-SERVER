import 'dart:convert';
import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:timeago/timeago.dart' as timeago;
import 'lat_lng.dart';
import 'place.dart';
import 'uploaded_file.dart';
import '/backend/schema/structs/index.dart';

String? timeCalculator(DateTime? dateTime) {
  // take datetime and calculate time spent uptil now in total hour and mins
  if (dateTime == null) return null;

  final now = DateTime.now();
  final duration = now.difference(dateTime);

  final hours = duration.inHours;
  final minutes = duration.inMinutes.remainder(60);

  return '$hours hours and $minutes minutes';
}

DateTime currentDate() {
  // current day, and time at morning 00 in Datetime format
  DateTime now = DateTime.now();
  DateTime today = DateTime(now.year, now.month, now.day);
  return today;
}

String? dateClipper(DateTime? inputDate) {
  // take Datetime input and return only day and month , or today , yestterday accordingly in string
  if (inputDate == null) {
    return null;
  }

  final now = DateTime.now();
  final today = DateTime(now.year, now.month, now.day);
  final yesterday = DateTime(now.year, now.month, now.day - 1);

  if (inputDate.isAtSameMomentAs(today)) {
    return 'Today';
  } else if (inputDate.isAtSameMomentAs(yesterday)) {
    return 'Yesterday';
  } else {
    final formatter = DateFormat('MMM d');
    return formatter.format(inputDate);
  }
}
