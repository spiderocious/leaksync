import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/tokens.dart';

/// AppPairingCodeEntry — the 6-digit code the phone enters once.
///
/// One VISIBLE TextField per cell (the digit shows in the cell itself).
/// Handles the three things a naive per-cell OTP gets wrong:
///   • typing a digit advances to the next cell;
///   • Backspace on an empty cell steps back AND clears the previous (via a key
///     listener, since deleting nothing fires no onChanged);
///   • pasting/typing several digits at once distributes across the cells.
class AppPairingCodeEntry extends StatefulWidget {
  const AppPairingCodeEntry({
    super.key,
    this.length = 6,
    this.onChanged,
    this.onCompleted,
    this.autofocus = false,
  });

  final int length;
  final ValueChanged<String>? onChanged;
  final ValueChanged<String>? onCompleted;
  final bool autofocus;

  @override
  State<AppPairingCodeEntry> createState() => _AppPairingCodeEntryState();
}

class _AppPairingCodeEntryState extends State<AppPairingCodeEntry> {
  late final List<TextEditingController> _controllers;
  late final List<FocusNode> _focusNodes;

  @override
  void initState() {
    super.initState();
    _controllers = List.generate(widget.length, (_) => TextEditingController());
    _focusNodes = List.generate(widget.length, (_) => FocusNode());
    if (widget.autofocus) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) _focusNodes.first.requestFocus();
      });
    }
  }

  @override
  void dispose() {
    for (final c in _controllers) {
      c.dispose();
    }
    for (final f in _focusNodes) {
      f.dispose();
    }
    super.dispose();
  }

  String get _value => _controllers.map((c) => c.text).join();

  void _emit() {
    final full = _value;
    widget.onChanged?.call(full);
    if (full.length == widget.length) {
      _focusNodes[widget.length - 1].unfocus();
      widget.onCompleted?.call(full);
    }
  }

  /// Handle text arriving at [index] — one digit advances; many digits (paste
  /// or fast typing) spill into the following cells.
  void _onChanged(int index, String raw) {
    final digits = raw.replaceAll(RegExp(r'\D'), '');

    if (digits.isEmpty) {
      // The field was cleared (e.g. selecting + deleting). Leave focus here.
      _controllers[index].text = '';
      _emit();
      return;
    }

    if (digits.length == 1) {
      _setCell(index, digits);
      _focusNext(index);
      _emit();
      return;
    }

    // Multiple digits → distribute from this cell onward.
    var cursor = index;
    for (final d in digits.split('')) {
      if (cursor >= widget.length) break;
      _setCell(cursor, d);
      cursor++;
    }
    final landing = (cursor).clamp(0, widget.length - 1);
    _focusNodes[landing].requestFocus();
    _controllers[landing].selection =
        TextSelection.collapsed(offset: _controllers[landing].text.length);
    _emit();
  }

  /// Backspace pressed while a cell is EMPTY → clear + move to the previous one.
  void _onBackspaceOnEmpty(int index) {
    if (index > 0) {
      _controllers[index - 1].text = '';
      _focusNodes[index - 1].requestFocus();
      _controllers[index - 1].selection = const TextSelection.collapsed(offset: 0);
      _emit();
    }
  }

  void _setCell(int index, String digit) {
    _controllers[index].text = digit;
    _controllers[index].selection = const TextSelection.collapsed(offset: 1);
  }

  void _focusNext(int index) {
    if (index < widget.length - 1) {
      _focusNodes[index + 1].requestFocus();
    } else {
      _focusNodes[index].unfocus();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      mainAxisSize: MainAxisSize.min,
      children: List.generate(widget.length, (i) {
        return Padding(
          padding: EdgeInsets.only(right: i < widget.length - 1 ? 10 : 0),
          child: _Cell(
            controller: _controllers[i],
            focusNode: _focusNodes[i],
            length: widget.length,
            onChanged: (v) => _onChanged(i, v),
            onBackspaceOnEmpty: () => _onBackspaceOnEmpty(i),
          ),
        );
      }),
    );
  }
}

class _Cell extends StatelessWidget {
  const _Cell({
    required this.controller,
    required this.focusNode,
    required this.length,
    required this.onChanged,
    required this.onBackspaceOnEmpty,
  });

  final TextEditingController controller;
  final FocusNode focusNode;
  final int length;
  final ValueChanged<String> onChanged;
  final VoidCallback onBackspaceOnEmpty;

  @override
  Widget build(BuildContext context) {
    final filled = controller.text.isNotEmpty;
    return SizedBox(
      width: 44,
      height: 58,
      // Peek at key events to catch Backspace on an already-empty cell (which
      // fires no onChanged). We return `ignored` so the TextField still handles
      // everything normally.
      child: Focus(
        canRequestFocus: false,
        onKeyEvent: (node, event) {
          if (event is KeyDownEvent &&
              event.logicalKey == LogicalKeyboardKey.backspace &&
              controller.text.isEmpty) {
            onBackspaceOnEmpty();
          }
          return KeyEventResult.ignored;
        },
        child: TextField(
          controller: controller,
          focusNode: focusNode,
          keyboardType: TextInputType.number,
          textAlign: TextAlign.center,
          // Allow more than 1 char so a paste/fast-type lands here and we can
          // distribute it; we trim to one per cell in _onChanged.
          maxLength: length,
          cursorColor: AppColors.moss,
          cursorWidth: 1.5,
          inputFormatters: [FilteringTextInputFormatter.digitsOnly],
          style: AppFonts.serif(
            size: 30,
            weight: FontWeight.w500,
            color: AppColors.ink,
            height: 1.0,
          ),
          onChanged: onChanged,
          decoration: InputDecoration(
            counterText: '',
            contentPadding: EdgeInsets.zero,
            filled: true,
            fillColor: AppColors.sheet,
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppRadius.card),
              borderSide: BorderSide(color: filled ? AppColors.ink : AppColors.hair),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppRadius.card),
              borderSide: const BorderSide(color: AppColors.moss, width: 2),
            ),
          ),
        ),
      ),
    );
  }
}
