import 'dart:convert';

import 'package:http/http.dart' as http;

import '../models/item.dart';

/// A backend error surfaced to the UI (carries the stable `code` + message).
class ApiException implements Exception {
  ApiException(this.code, this.message, this.status);
  final String code;
  final String message;
  final int status;
  @override
  String toString() => message;
}

/// Result of POST /pair/redeem.
class RedeemResult {
  RedeemResult({
    required this.pairId,
    required this.deviceToken,
    required this.macName,
    required this.userName,
  });
  final String pairId;
  final String deviceToken;
  final String macName;
  final String userName;
}

/// HTTP client for the Android device (always the `android` device). The token
/// from /pair/redeem is attached to every authed call.
class ApiClient {
  ApiClient({required this.base, this.token});

  /// e.g. http://localhost:9090/api/v1
  String base;
  String? token;

  Uri _u(String path) => Uri.parse('$base/$path');

  Map<String, String> _headers({bool auth = true}) => {
        'Content-Type': 'application/json',
        if (auth && token != null) 'Authorization': 'Bearer $token',
      };

  // Unwrap the { data } / { error } envelope or throw ApiException.
  Map<String, dynamic> _unwrap(http.Response res) {
    Map<String, dynamic> body;
    try {
      body = jsonDecode(res.body) as Map<String, dynamic>;
    } catch (_) {
      throw ApiException('internal', 'Bad response from server', res.statusCode);
    }
    if (res.statusCode >= 200 && res.statusCode < 300 && body['error'] == null) {
      return (body['data'] as Map<String, dynamic>?) ?? <String, dynamic>{};
    }
    final err = body['error'] as Map<String, dynamic>?;
    throw ApiException(
      (err?['code'] as String?) ?? 'internal',
      (err?['message'] as String?) ?? 'Request failed',
      res.statusCode,
    );
  }

  // ---- Pairing ----

  Future<RedeemResult> redeem(String code, String deviceName) async {
    final res = await http.post(
      _u('pair/redeem'),
      headers: _headers(auth: false),
      body: jsonEncode({'code': code, 'deviceName': deviceName}),
    );
    final data = _unwrap(res);
    return RedeemResult(
      pairId: data['pairId'] as String,
      deviceToken: data['deviceToken'] as String,
      macName: data['macName'] as String,
      userName: data['userName'] as String,
    );
  }

  Future<Map<String, dynamic>> getPair() async {
    final res = await http.get(_u('pair'), headers: _headers());
    return _unwrap(res);
  }

  Future<void> unpair() async {
    final res = await http.post(_u('unpair'), headers: _headers());
    if (res.statusCode != 204) _unwrap(res); // throws on error envelope
  }

  // ---- Items ----

  /// POST /items. text|url carry `text`; image carries `fileKey` (+ mime/filename).
  Future<Item> sendItem({
    required ItemKind kind,
    String? text,
    String? fileKey,
    String? mime,
    String? filename,
  }) async {
    final res = await http.post(
      _u('items'),
      headers: _headers(),
      body: jsonEncode({
        'kind': kind.wire,
        if (text != null) 'text': text,
        if (fileKey != null) 'fileKey': fileKey,
        if (mime != null) 'mime': mime,
        if (filename != null) 'filename': filename,
      }),
    );
    final data = _unwrap(res);
    return Item.fromJson(data['item'] as Map<String, dynamic>);
  }

  Future<List<Item>> recent({int limit = 5}) async {
    final res = await http.get(_u('items/recent?limit=$limit'), headers: _headers());
    final data = _unwrap(res);
    final items = (data['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    return items.map(Item.fromJson).toList();
  }
}
