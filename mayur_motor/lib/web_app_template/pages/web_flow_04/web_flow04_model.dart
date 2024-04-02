import '/flutter_flow/flutter_flow_util.dart';
import '/web_app_template/pages/side_nav/side_nav_widget.dart';
import 'web_flow04_widget.dart' show WebFlow04Widget;
import 'package:flutter/material.dart';

class WebFlow04Model extends FlutterFlowModel<WebFlow04Widget> {
  ///  State fields for stateful widgets in this page.

  final unfocusNode = FocusNode();
  // Model for sideNav component.
  late SideNavModel sideNavModel;

  @override
  void initState(BuildContext context) {
    sideNavModel = createModel(context, () => SideNavModel());
  }

  @override
  void dispose() {
    unfocusNode.dispose();
    sideNavModel.dispose();
  }
}
