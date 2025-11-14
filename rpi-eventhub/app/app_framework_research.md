
# RPI-Eventhub App Research

## Requirements

- Widgets
- RSS feed import
- Notifications (configurable)
- Main screen (scrollable)

## Appraised Platforms w/ description

- Flutter
  - Cross-platform development
  - Uses Dart: new/modern language by google
    - python but typed
  - Will be good if we want an ios install
  - needs a LOT of boilerplate
  - widgets are harder due to cross-platform and instead might be implemented separately
- Jetpack Compose
  - Uses Kotlin, derivative of Java
  - Native to android
  - Widgets are easy to make
  - Uses material theming (easy to make look good)
  - Much more work to port to other platforms
- React native
  - Allows us to use javascript to code (single code ecosystem)
  - Might reuse our current web code
  - Might not look good on mobile devices
  - Enables code sharing across platforms (ios support simpler at least for the main device)
  - Might lead to code/template duplication
  - For widgets, might need to write "native modules" that use less-documented api

## Platform choice decision

Use Jetpack compose. ios support may come later, and even now there are third party extensions
that add ios support for jetpack compose.

## Specific modules to use

- retrofit for internet fetching
- room for local caching
- coil for image displaying
