import 'package:flutter/material.dart';

class FFAppState extends ChangeNotifier {
  static FFAppState _instance = FFAppState._internal();

  factory FFAppState() {
    return _instance;
  }

  FFAppState._internal();

  static void reset() {
    _instance = FFAppState._internal();
  }

  Future initializePersistedState() async {}

  void update(VoidCallback callback) {
    callback();
    notifyListeners();
  }

  String _SchoolSelection = 'Other';
  String get SchoolSelection => _SchoolSelection;
  set SchoolSelection(String value) {
    _SchoolSelection = value;
  }

  int _sid = 0;
  int get sid => _sid;
  set sid(int value) {
    _sid = value;
  }
}
