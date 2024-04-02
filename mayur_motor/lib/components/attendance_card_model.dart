import '/components/timepicker_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/form_field_controller.dart';
import 'attendance_card_widget.dart' show AttendanceCardWidget;
import 'package:flutter/material.dart';

class AttendanceCardModel extends FlutterFlowModel<AttendanceCardWidget> {
  ///  State fields for stateful widgets in this component.

  // State field(s) for TextField widget.
  final textFieldKey = GlobalKey();
  FocusNode? textFieldFocusNode;
  TextEditingController? textController;
  String? textFieldSelectedOption;
  String? Function(BuildContext, String?)? textControllerValidator;
  // Model for timepicker component.
  late TimepickerModel timepickerModel;
  // State field(s) for DropDown widget.
  String? dropDownValue;
  FormFieldController<String>? dropDownValueController;

  @override
  void initState(BuildContext context) {
    timepickerModel = createModel(context, () => TimepickerModel());
  }

  @override
  void dispose() {
    textFieldFocusNode?.dispose();

    timepickerModel.dispose();
  }
}
