// Backend + file-service endpoints. The API base is configurable so you can
// point the app at localhost (web/emulator), a LAN IP, or a tunnel (ngrok /
// cloudflared) for a physical device — without rebuilding. Resolution order:
//   1. a runtime override saved in Settings (shared_preferences), if set
//   2. the --dart-define value (LEAKSYNC_API_BASE)
//   3. the localhost default
//
// Pass at build/run time, e.g.:
//   flutter run -d chrome --dart-define=LEAKSYNC_API_BASE=http://localhost:9090/api/v1
//   flutter run --dart-define=LEAKSYNC_API_BASE=https://<your-tunnel>/api/v1

const String kApiBaseDefine = String.fromEnvironment(
  'LEAKSYNC_API_BASE',
  defaultValue: 'https://leaksync.up.railway.app/api/v1',
);

const String kFileServiceDefine = String.fromEnvironment(
  'LEAKSYNC_FILE_SERVICE',
  defaultValue: 'https://go-file-service-production.up.railway.app',
);

class Config {
  Config({required this.apiBase, required this.fileService});

  /// e.g. http://localhost:9090/api/v1
  final String apiBase;

  /// e.g. https://go-file-service-production.up.railway.app
  final String fileService;

  Config copyWith({String? apiBase}) =>
      Config(apiBase: apiBase ?? this.apiBase, fileService: fileService);
}
