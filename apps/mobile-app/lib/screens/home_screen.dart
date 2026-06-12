import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../models/item.dart';
import '../state/app_scope.dart';
import '../state/app_state.dart';
import '../theme/tokens.dart';
import '../ui/app_header.dart';
import '../ui/app_item_row.dart';
import '../ui/app_status_dot.dart';
import '../ui/app_text.dart';
import '../ui/screen_scaffold.dart';

/// Home — the 5% surface. The product is the share sheet; this screen exists
/// only to reassure: who you're paired with, what you've sent, and the two ways
/// to send something without leaving the app.
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    // Refresh the recent list whenever the home screen mounts.
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) AppScope.of(context).loadRecent();
    });
  }

  RowItem _toRow(Item s) => RowItem(
        id: s.id,
        kind: switch (s.kind) {
          ItemKind.url => RowKind.link,
          ItemKind.image => RowKind.image,
          ItemKind.text => RowKind.text,
        },
        content: s.display.isEmpty ? 'Image' : s.display,
        when: formatRelative(s.createdAt),
      );

  @override
  Widget build(BuildContext context) {
    final state = AppScope.of(context);
    if (!state.paired) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (context.mounted) context.go('/pair');
      });
      return const ScreenScaffold(child: SizedBox.shrink());
    }

    final items = state.sent.map(_toRow).toList();

    return ScreenScaffold(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Expanded(child: AppHeader(status: AppStatusKind.live)),
              GestureDetector(
                onTap: () => context.push('/settings'),
                child: const Padding(
                  padding: EdgeInsets.all(6),
                  child: Icon(Icons.more_horiz, size: 20, color: AppColors.ink3),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          AppText('Paired with ${state.macName}',
              variant: AppTextVariant.read, italic: true, fontSize: 12.5, color: AppColors.ink3),
          const SizedBox(height: 22),
          Row(
            children: [
              Expanded(
                child: _ActionCard(
                  icon: Icons.edit_outlined,
                  label: 'Write text',
                  hint: 'Type something to send',
                  onTap: () => context.push('/compose'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _ActionCard(
                  icon: Icons.image_outlined,
                  label: 'Send a photo',
                  hint: 'Pick from your library',
                  onTap: () => context.push('/compose?pick=1'),
                ),
              ),
            ],
          ),
          const SizedBox(height: 28),
          const AppText('Recently sent', variant: AppTextVariant.overline),
          const SizedBox(height: 4),
          Expanded(
            child: items.isEmpty
                ? Padding(
                    padding: const EdgeInsets.symmetric(vertical: 18),
                    child: AppText(
                      'Nothing yet. Share to LeakSync from any app, or write something above.',
                      variant: AppTextVariant.read,
                      italic: true,
                      color: AppColors.ink3,
                    ),
                  )
                : RefreshIndicator(
                    color: AppColors.moss,
                    onRefresh: () => AppScope.of(context).loadRecent(),
                    child: ListView(
                      padding: EdgeInsets.zero,
                      physics: const AlwaysScrollableScrollPhysics(),
                      children: [for (final item in items) AppItemRow(item: item)],
                    ),
                  ),
          ),
        ],
      ),
    );
  }
}

class _ActionCard extends StatelessWidget {
  const _ActionCard({required this.icon, required this.label, required this.hint, required this.onTap});
  final IconData icon;
  final String label;
  final String hint;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: AppColors.sheet,
          borderRadius: BorderRadius.circular(AppRadius.card),
          border: Border.all(color: AppColors.hair),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, size: 20, color: AppColors.ink2),
            const SizedBox(height: 8),
            AppText(label, variant: AppTextVariant.read, fontSize: 13),
            const SizedBox(height: 2),
            AppText(hint, variant: AppTextVariant.meta),
          ],
        ),
      ),
    );
  }
}
