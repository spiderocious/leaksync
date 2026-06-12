import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// LeakSync e-ink tokens — the Flutter mirror of packages/ui/src/styles.css.
/// Same palette, same type families, same geometry. Stance: an e-reader on a
/// bedside table. Paper, not screen — no glow, no gradient, no pure white/black.
/// One muted moss accent, used at most once per screen.
class AppColors {
  // Paper & ink — greyscale, warm-grey, no pure white/black.
  static const paper = Color(0xFFE8E6E1); // the canvas
  static const paper2 = Color(0xFFE0DDD6); // recessed surface / pressed row
  static const paper3 = Color(0xFFD9D5CC); // deepest recess (thumb wells, skeleton)
  static const sheet = Color(0xFFEDEBE6); // a raised sheet (popup body / cards)

  static const ink = Color(0xFF23211C); // warm near-black — primary text
  static const ink2 = Color(0xFF55524A); // body / secondary
  static const ink3 = Color(0xFF83806F); // meta, labels, tertiary
  static const ink4 = Color(0xFFA8A493); // faintest — placeholders, disabled

  static const hair = Color(0xFFCFCBC0); // the hairline — every separator
  static const hairSoft = Color(0xFFDAD6CC); // an even quieter divider

  // The ONE accent — muted moss. At most once per screen, never a fill.
  static const moss = Color(0xFF7E9466);
  static const mossDeep = Color(0xFF61774A); // pressed/hover step (rare)
  static const mossFaint = Color(0xFFC5CFB6); // copied-row wash (rare)

  // Status — meaning carried by text. No red anywhere.
  static const live = Color(0xFF7E9466); // connected — the one moss use
  static const idle = Color(0xFFA8A493); // offline — hollow grey ring
  static const warn = Color(0xFF9A7B3A); // muted ochre — "couldn't send" only
  static const warnFaint = Color(0xFFE6DEC9);
}

/// Geometry — flat paper, near-square corners.
class AppRadius {
  static const sharp = 1.0;
  static const card = 2.0;
}

/// Font families. Literata = the reading face, Inter = chrome, JetBrains Mono =
/// the record. Loaded from Google Fonts (cached) so the type matches the web DS.
class AppFonts {
  static TextStyle serif({
    double size = 13.5,
    FontWeight weight = FontWeight.w400,
    Color color = AppColors.ink,
    double height = 1.55,
    double letterSpacing = 0,
    FontStyle style = FontStyle.normal,
  }) =>
      GoogleFonts.literata(
        fontSize: size,
        fontWeight: weight,
        color: color,
        height: height,
        letterSpacing: letterSpacing,
        fontStyle: style,
      );

  static TextStyle sans({
    double size = 13,
    FontWeight weight = FontWeight.w400,
    Color color = AppColors.ink2,
    double height = 1.5,
    double letterSpacing = 0,
  }) =>
      GoogleFonts.inter(
        fontSize: size,
        fontWeight: weight,
        color: color,
        height: height,
        letterSpacing: letterSpacing,
      );

  static TextStyle mono({
    double size = 11.5,
    FontWeight weight = FontWeight.w400,
    Color color = AppColors.ink2,
    double height = 1.5,
    double letterSpacing = 0,
  }) =>
      GoogleFonts.jetBrainsMono(
        fontSize: size,
        fontWeight: weight,
        color: color,
        height: height,
        letterSpacing: letterSpacing,
      );
}
