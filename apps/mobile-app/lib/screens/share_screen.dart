import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../state/app_scope.dart';
import '../theme/tokens.dart';
import '../ui/app_status_dot.dart';
import '../ui/app_text.dart';

/// Share confirmation — the 95% case, and the whole point of the product. The
/// user tapped "LeakSync" in another app's share sheet; the shared payload was
/// already recorded into AppState by main.dart. This shows a quiet "Sent to your
/// Mac ✓" and dismisses. No API yet — recording is local.
class ShareScreen extends StatefulWidget {
  const ShareScreen({super.key});

  @override
  State<ShareScreen> createState() => _ShareScreenState();
}

class _ShareScreenState extends State<ShareScreen> {
  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(milliseconds: 1400), () {
      if (mounted) context.go('/');
    });
  }

  @override
  Widget build(BuildContext context) {
    // Whether anything actually arrived (main.dart records it before routing).
    final hadItem = AppScope.of(context).sent.isNotEmpty;
    return Scaffold(
      backgroundColor: const Color(0x2E23211C),
      body: Center(
        child: Container(
          margin: const EdgeInsets.symmetric(horizontal: 40),
          padding: const EdgeInsets.symmetric(vertical: 30, horizontal: 22),
          decoration: BoxDecoration(
            color: AppColors.sheet,
            borderRadius: BorderRadius.circular(4),
            border: Border.all(color: AppColors.hair),
            boxShadow: const [
              BoxShadow(color: Color(0x3823211C), blurRadius: 28, offset: Offset(0, 18)),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: hadItem
                ? const [
                    AppStatusDot(status: AppStatusKind.live, size: 11),
                    SizedBox(height: 14),
                    AppText('Sent to your Mac', variant: AppTextVariant.read, fontSize: 18),
                    SizedBox(height: 2),
                    AppText('it’s already there',
                        variant: AppTextVariant.read, italic: true, fontSize: 12, color: AppColors.ink3),
                  ]
                : const [
                    AppText('Nothing to send.',
                        variant: AppTextVariant.read, italic: true, fontSize: 12, color: AppColors.ink3),
                  ],
          ),
        ),
      ),
    );
  }
}
