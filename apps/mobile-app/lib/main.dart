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

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(LeakSyncApp(state: AppState()));
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

  void _handleShared(List<SharedMediaFile> files) {
    if (files.isEmpty) return;
    final state = widget.state;

    for (final f in files) {
      switch (f.type) {
        case SharedMediaType.image:
        case SharedMediaType.video:
          final name = f.path.split('/').last;
          state.addSent(kind: ItemKind.image, content: name, uri: f.path);
          break;
        case SharedMediaType.text:
        case SharedMediaType.url:
          final value = f.path.trim();
          final isUrl = RegExp(r'^https?://\S+$', caseSensitive: false).hasMatch(value);
          state.addSent(kind: isUrl ? ItemKind.url : ItemKind.text, content: value);
          break;
        case SharedMediaType.file:
          state.addSent(kind: ItemKind.text, content: f.path.split('/').last);
          break;
      }
    }

    if (state.paired) {
      _router.go('/share');
    } else {
      _router.go('/pair');
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
