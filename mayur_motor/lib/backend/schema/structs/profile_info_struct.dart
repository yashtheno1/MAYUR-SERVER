// ignore_for_file: unnecessary_getters_setters

import '/backend/schema/util/schema_util.dart';

import 'index.dart';
import '/flutter_flow/flutter_flow_util.dart';

class ProfileInfoStruct extends BaseStruct {
  ProfileInfoStruct({
    String? name,
    int? phone,
    bool? isActive,
    DateTime? dateCreated,
  })  : _name = name,
        _phone = phone,
        _isActive = isActive,
        _dateCreated = dateCreated;

  // "Name" field.
  String? _name;
  String get name => _name ?? '';
  set name(String? val) => _name = val;
  bool hasName() => _name != null;

  // "Phone" field.
  int? _phone;
  int get phone => _phone ?? 0;
  set phone(int? val) => _phone = val;
  void incrementPhone(int amount) => _phone = phone + amount;
  bool hasPhone() => _phone != null;

  // "isActive" field.
  bool? _isActive;
  bool get isActive => _isActive ?? true;
  set isActive(bool? val) => _isActive = val;
  bool hasIsActive() => _isActive != null;

  // "DateCreated" field.
  DateTime? _dateCreated;
  DateTime? get dateCreated => _dateCreated;
  set dateCreated(DateTime? val) => _dateCreated = val;
  bool hasDateCreated() => _dateCreated != null;

  static ProfileInfoStruct fromMap(Map<String, dynamic> data) =>
      ProfileInfoStruct(
        name: data['Name'] as String?,
        phone: castToType<int>(data['Phone']),
        isActive: data['isActive'] as bool?,
        dateCreated: data['DateCreated'] as DateTime?,
      );

  static ProfileInfoStruct? maybeFromMap(dynamic data) => data is Map
      ? ProfileInfoStruct.fromMap(data.cast<String, dynamic>())
      : null;

  Map<String, dynamic> toMap() => {
        'Name': _name,
        'Phone': _phone,
        'isActive': _isActive,
        'DateCreated': _dateCreated,
      }.withoutNulls;

  @override
  Map<String, dynamic> toSerializableMap() => {
        'Name': serializeParam(
          _name,
          ParamType.String,
        ),
        'Phone': serializeParam(
          _phone,
          ParamType.int,
        ),
        'isActive': serializeParam(
          _isActive,
          ParamType.bool,
        ),
        'DateCreated': serializeParam(
          _dateCreated,
          ParamType.DateTime,
        ),
      }.withoutNulls;

  static ProfileInfoStruct fromSerializableMap(Map<String, dynamic> data) =>
      ProfileInfoStruct(
        name: deserializeParam(
          data['Name'],
          ParamType.String,
          false,
        ),
        phone: deserializeParam(
          data['Phone'],
          ParamType.int,
          false,
        ),
        isActive: deserializeParam(
          data['isActive'],
          ParamType.bool,
          false,
        ),
        dateCreated: deserializeParam(
          data['DateCreated'],
          ParamType.DateTime,
          false,
        ),
      );

  @override
  String toString() => 'ProfileInfoStruct(${toMap()})';

  @override
  bool operator ==(Object other) {
    return other is ProfileInfoStruct &&
        name == other.name &&
        phone == other.phone &&
        isActive == other.isActive &&
        dateCreated == other.dateCreated;
  }

  @override
  int get hashCode =>
      const ListEquality().hash([name, phone, isActive, dateCreated]);
}

ProfileInfoStruct createProfileInfoStruct({
  String? name,
  int? phone,
  bool? isActive,
  DateTime? dateCreated,
}) =>
    ProfileInfoStruct(
      name: name,
      phone: phone,
      isActive: isActive,
      dateCreated: dateCreated,
    );
