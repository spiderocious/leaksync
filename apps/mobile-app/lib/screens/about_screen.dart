import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../state/app_scope.dart';
import '../theme/tokens.dart';
import '../ui/app_text.dart';
import '../ui/screen_scaffold.dart';

/// About — ported from packages/ui AboutScene. The one place the gift speaks:
/// a personal note on a paper card. The note text is the gift layer (Phase 8
/// will make it configurable); a warm placeholder lives here for now.
class AboutScreen extends StatelessWidget {
  const AboutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final state = AppScope.of(context);
    return ScreenScaffold(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.only(top: 12, bottom: 18),
            decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: AppColors.hair))),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                GestureDetector(
                  onTap: () => context.pop(),
                  child: const AppText('‹ settings', variant: AppTextVariant.body, color: AppColors.ink3),
                ),
                const AppText('About', variant: AppTextVariant.overline),
                const SizedBox(width: 40),
              ],
            ),
          ),
          const SizedBox(height: 26),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 22),
            decoration: BoxDecoration(
              color: AppColors.paper,
              borderRadius: BorderRadius.circular(AppRadius.card),
              border: Border.all(color: AppColors.hair),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                AppText(
                  '${state.userName.isNotEmpty ? '${state.userName}, ' : ''}I built this so the little things you find on your phone land on your Mac without the email-yourself dance. Share to LeakSync from anywhere — it’s already there.',
                  variant: AppTextVariant.read,
                  fontSize: 13.5,
                ),
                const SizedBox(height: 16),
                const AppText('— made for you',
                    variant: AppTextVariant.read,
                    italic: true,
                    fontSize: 13,
                    color: AppColors.ink3,
                    textAlign: TextAlign.right),
              ],
            ),
          ),
          const SizedBox(height: 18),
          const Center(child: AppText('LEAKSYNC · 0.1.0', variant: AppTextVariant.mono, fontSize: 10, color: AppColors.ink4)),
        ],
      ),
    );
  }
}
