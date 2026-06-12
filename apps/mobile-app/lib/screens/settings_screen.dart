import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../state/app_scope.dart';
import '../theme/tokens.dart';
import '../ui/app_button.dart';
import '../ui/app_text.dart';
import '../ui/screen_scaffold.dart';

/// Settings — ported from packages/ui SettingsScene. There is exactly one
/// setting (unpair) and a link to the About page. The screen's job is to be
/// honest about how little there is.
class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final state = AppScope.of(context);
    final rows = <(String, String)>[
      ('Paired with', state.macName),
      ('Direction', 'Phone → Mac'),
      ('Version', '0.1.0'),
    ];

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
                  child: const AppText('‹ back', variant: AppTextVariant.body, color: AppColors.ink3),
                ),
                const AppText('Settings', variant: AppTextVariant.overline),
                const SizedBox(width: 40),
              ],
            ),
          ),
          for (var i = 0; i < rows.length; i++)
            Container(
              padding: const EdgeInsets.symmetric(vertical: 14),
              decoration: BoxDecoration(
                border: Border(
                  bottom: BorderSide(color: i == rows.length - 1 ? Colors.transparent : AppColors.hair),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  AppText(rows[i].$1, variant: AppTextVariant.read, fontSize: 13.5),
                  AppText(rows[i].$2, variant: AppTextVariant.mono, fontSize: 11, color: AppColors.ink3),
                ],
              ),
            ),
          const SizedBox(height: 22),
          Container(
            width: double.infinity,
            alignment: Alignment.center,
            padding: const EdgeInsets.only(top: 18),
            decoration: const BoxDecoration(border: Border(top: BorderSide(color: AppColors.hair))),
            child: AppButton('About LeakSync',
                variant: AppButtonVariant.quiet, onPressed: () => context.push('/about')),
          ),
          const Spacer(),
          Center(
            child: AppButton('Unpair this device', variant: AppButtonVariant.danger, onPressed: () {
              state.unpair();
              context.go('/pair');
            }),
          ),
          const SizedBox(height: 8),
        ],
      ),
    );
  }
}
