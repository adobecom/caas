// Polyfills to stabilize test environment in Node 16 + jsdom

// Web Streams API polyfill for environments lacking ReadableStream, etc.
(() => {
  if (typeof globalThis.ReadableStream === 'undefined') {
    try {
      const streams = require('web-streams-polyfill/ponyfill/es2018');
      const { ReadableStream, WritableStream, TransformStream } = streams;
      globalThis.ReadableStream = ReadableStream;
      if (typeof globalThis.WritableStream === 'undefined') {
        globalThis.WritableStream = WritableStream;
      }
      if (typeof globalThis.TransformStream === 'undefined') {
        globalThis.TransformStream = TransformStream;
      }
    } catch (e) {
      // If the polyfill isn't available, tests that rely on fetch/streams may fail in Node <18.
    }
  }
})();

// Ensure Fetch API globals (including File) are available for libraries using undici
(() => {
  try {
    const u = require('undici');
    if (typeof globalThis.fetch === 'undefined' && typeof u.fetch === 'function') {
      globalThis.fetch = u.fetch;
    }
    if (typeof globalThis.Headers === 'undefined' && typeof u.Headers !== 'undefined') {
      globalThis.Headers = u.Headers;
    }
    if (typeof globalThis.Request === 'undefined' && typeof u.Request !== 'undefined') {
      globalThis.Request = u.Request;
    }
    if (typeof globalThis.Response === 'undefined' && typeof u.Response !== 'undefined') {
      globalThis.Response = u.Response;
    }
    if (typeof globalThis.FormData === 'undefined' && typeof u.FormData !== 'undefined') {
      globalThis.FormData = u.FormData;
    }
    if (typeof globalThis.Blob === 'undefined' && typeof u.Blob !== 'undefined') {
      globalThis.Blob = u.Blob;
    }
    if (typeof globalThis.File === 'undefined' && typeof u.File !== 'undefined') {
      globalThis.File = u.File;
    }
  } catch (e) {
    // undici not available; ignore
  }
})();
