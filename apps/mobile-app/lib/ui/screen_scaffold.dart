import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/tokens.dart';

/// ScreenScaffold — the paper canvas every screen sits on. Warm-grey background,
/// dark status-bar icons (light/paper UI), safe-area aware.
class ScreenScaffold extends StatelessWidget {
  const ScreenScaffold({super.key, required this.child, this.center = false, this.padding});

  final Widget child;
  final bool center;
  final EdgeInsets? padding;

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.dark.copyWith(statusBarColor: Colors.transparent),
      child: Scaffold(
        backgroundColor: AppColors.paper,
        body: SafeArea(
          child: Padding(
            padding: padding ?? const EdgeInsets.symmetric(horizontal: 22),
            child: center ? Center(child: child) : child,
          ),
        ),
      ),
    );
  }
}
