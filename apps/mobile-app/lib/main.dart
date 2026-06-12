import 'dart:async';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:receive_sharing_intent/receive_sharing_intent.dart';

import 'models/item.dart';
import 'screens/about_screen.dart';
import 'screens/compose_screen.dart';
import 'screens/home_screen.dart';
import 'screens/pair_screen.dart';
import 'screens/settings_screen.dart';
import 'screens/share_screen.dart';
import 'state/app_scope.dart';
import 'state/app_state.dart';
import 'theme/tokens.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final state = AppState();
  await state.init(); // load persisted token + API base before first frame
  runApp(LeakSyncApp(state: state));
}

class LeakSyncApp extends StatefulWidget {
  const LeakSyncApp({super.key, required this.state});
  final AppState state;

  @override
  State<LeakSyncApp> createState() => _LeakSyncAppState();
}

class _LeakSyncAppState extends State<LeakSyncApp> {
  late final GoRouter _router;
  StreamSubscription<List<SharedMediaFile>>? _intentSub;

  @override
  void initState() {
    super.initState();
    _router = _buildRouter();
    _wireShareIntent();
  }

  // ----- Share intent: the make-or-break flow -----
  void _wireShareIntent() {
    final instance = ReceiveSharingIntent.instance;

    // Shares that arrive while the app is already running.
    _intentSub = instance.getMediaStream().listen((files) {
      _handleShared(files);
      instance.reset();
    });

    // The share that launched the app cold.
    instance.getInitialMedia().then((files) {
      if (files.isNotEmpty) {
        _handleShared(files);
        instance.reset();
      }
    });
  }

  Future<void> _handleShared(List<SharedMediaFile> files) async {
    if (files.isEmpty) return;
    final state = widget.state;

    // Must be paired to send. If not, bounce to pairing (the share is dropped —
    // the user re-shares once paired).
    if (!state.paired) {
      _router.go('/pair');
      return;
    }

    // Show the "Sending… / Sent ✓" surface while we POST.
    _router.go('/share');

    try {
      for (final f in files) {
        switch (f.type) {
          case SharedMediaType.image:
          case SharedMediaType.video:
            final xfile = XFile(f.path);
            final bytes = await xfile.readAsBytes();
            await state.sendImage(
              bytes,
              filename: f.fileName ?? f.path.split('/').last,
              mime: f.mimeType,
            );
            break;
          case SharedMediaType.text:
          case SharedMediaType.url:
            await state.sendText((f.text ?? f.path).trim());
            break;
          case SharedMediaType.file:
            // A non-media file: send its name as text (v1 scope = text/url/image).
            await state.sendText(f.fileName ?? f.path.split('/').last);
            break;
        }
      }
      ShareScreen.markResult(true);
    } catch (_) {
      ShareScreen.markResult(false);
    }
  }

  GoRouter _buildRouter() {
    return GoRouter(
      initialLocation: '/',
      routes: [
        GoRoute(path: '/', builder: (context, state) => const HomeScreen()),
        GoRoute(path: '/pair', builder: (context, state) => const PairScreen()),
        GoRoute(
          path: '/compose',
          builder: (context, state) =>
              ComposeScreen(autoPick: state.uri.queryParameters['pick'] == '1'),
        ),
        GoRoute(path: '/share', builder: (context, state) => const ShareScreen()),
        GoRoute(path: '/settings', builder: (context, state) => const SettingsScreen()),
        GoRoute(path: '/about', builder: (context, state) => const AboutScreen()),
      ],
    );
  }

  @override
  void dispose() {
    _intentSub?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AppScope(
      state: widget.state,
      child: MaterialApp.router(
        title: 'LeakSync',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          scaffoldBackgroundColor: AppColors.paper,
          colorScheme: ColorScheme.fromSeed(
            seedColor: AppColors.moss,
            surface: AppColors.paper,
            brightness: Brightness.light,
          ),
          textSelectionTheme: const TextSelectionThemeData(
            cursorColor: AppColors.ink,
            selectionColor: AppColors.mossFaint,
            selectionHandleColor: AppColors.moss,
          ),
        ),
        routerConfig: _router,
      ),
    );
  }
}
