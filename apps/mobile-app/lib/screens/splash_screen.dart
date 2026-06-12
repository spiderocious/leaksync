import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../state/app_scope.dart';
import '../theme/tokens.dart';
import '../ui/app_logo.dart';
import '../ui/app_text.dart';

/// Splash — a brief branded moment on launch. The native splash covers the cold
/// start; this hands off to it (same paper background) and then routes to the
/// right place once we know whether we're paired. A gentle fade-in on the mark.
class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl;
  late final Animation<double> _fade;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 600))..forward();
    _fade = CurvedAnimation(parent: _ctrl, curve: Curves.easeOut);

    // AppState.init() already ran in main(); just give the mark a beat, then go.
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      await Future.delayed(const Duration(milliseconds: 850));
      if (!mounted) return;
      final paired = AppScope.of(context).paired;
      context.go(paired ? '/' : '/pair');
    });
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.paper,
      body: Center(
        child: FadeTransition(
          opacity: _fade,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: const [
              AppIcon(size: 64),
              SizedBox(height: 20),
              AppText('LeakSync', variant: AppTextVariant.display, fontSize: 26),
              SizedBox(height: 8),
              AppText('phone to Mac, instantly',
                  variant: AppTextVariant.read, italic: true, fontSize: 12.5, color: AppColors.ink3),
            ],
          ),
        ),
      ),
    );
  }
}
