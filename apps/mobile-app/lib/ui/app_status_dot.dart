import 'package:flutter/widgets.dart';

import '../theme/tokens.dart';

/// AppStatusDot — ported from packages/ui app-status-dot.tsx. One dot tells the
/// whole truth: is the Mac reachable now? `live` is the system's single use of
/// moss. `idle` is a hollow grey ring (nothing's wrong, just resting).
enum AppStatusKind { live, idle, reconnecting }

class AppStatusDot extends StatelessWidget {
  const AppStatusDot({super.key, this.status = AppStatusKind.live, this.size = 7});

  final AppStatusKind status;
  final double size;

  @override
  Widget build(BuildContext context) {
    switch (status) {
      case AppStatusKind.live:
        return Container(
          width: size,
          height: size,
          decoration: const BoxDecoration(color: AppColors.moss, shape: BoxShape.circle),
        );
      case AppStatusKind.reconnecting:
        return Opacity(
          opacity: 0.5,
          child: Container(
            width: size,
            height: size,
            decoration: const BoxDecoration(color: AppColors.idle, shape: BoxShape.circle),
          ),
        );
      case AppStatusKind.idle:
        return Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            color: const Color(0x00000000),
            shape: BoxShape.circle,
            border: Border.all(color: AppColors.idle, width: 1),
          ),
        );
    }
  }
}
