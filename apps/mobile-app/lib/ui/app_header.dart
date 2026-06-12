import 'package:flutter/widgets.dart';

import 'app_logo.dart';
import 'app_status_dot.dart';
import 'app_text.dart';

/// AppHeader — the wordmark row: the mark + "LeakSync" on the left, a status dot
/// + label on the right. Mirrors the header in packages/ui AndroidHome.
class AppHeader extends StatelessWidget {
  const AppHeader({super.key, this.status = AppStatusKind.live});
  final AppStatusKind status;

  @override
  Widget build(BuildContext context) {
    final label = status == AppStatusKind.live
        ? 'LIVE'
        : status == AppStatusKind.reconnecting
            ? 'SYNCING'
            : 'OFFLINE';
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          children: [
            const AppIcon(size: 26),
            const SizedBox(width: 8),
            const AppText('LeakSync', variant: AppTextVariant.wordmark),
          ],
        ),
        Row(
          children: [
            AppStatusDot(status: status),
            const SizedBox(width: 6),
            AppText(label, variant: AppTextVariant.meta),
          ],
        ),
      ],
    );
  }
}
