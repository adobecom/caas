/*
Polyfills for modern browsers (post-IE 11)

Browser support (conservative, recommended):
- Chrome 109+ (December 2022 and newer)
- Safari 14.1+ (September 2020 and newer)
- Firefox 115+ (July 2023 and newer)
- Edge 109+ (January 2023 and newer)
- iOS Safari 15.6+
- Last 2 versions of major browsers

IE 11 support has been removed, saving ~90 KB of polyfills.

Most ES6+ features are now native in these browsers:
✅ Array.includes, Array.find, Array.from - native
✅ Object.assign, Object.entries, Object.values - native
✅ String.startsWith, String.padStart, String.padEnd - native
✅ Promise.finally - native
✅ URL and URLSearchParams - native (removed url-polyfill)
✅ fetch API - native (removed whatwg-fetch)

The only polyfill we keep is for IntersectionObserver, which provides
broad compatibility for Safari < 12.1 and ensures it works everywhere.
*/

// IntersectionObserver polyfill for broader Safari compatibility
// Native in Safari 12.1+ but we support Safari 14.1+, so this is a safety net
import 'intersection-observer';

// All other polyfills removed - they're native in our supported browsers! 🚀
