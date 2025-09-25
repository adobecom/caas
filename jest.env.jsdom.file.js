// Custom Jest environment that ensures global File is defined before jsdom/undici loads
let JsdomEnvironment;

// Define critical Web APIs before requiring jest-environment-jsdom (which pulls in jsdom/undici)
(() => {
  try {
    // File polyfill
    if (typeof globalThis.File === 'undefined') {
      const { File } = require('fetch-blob/file.js');
      globalThis.File = File;
    }
  } catch (e) {
    // ignore
  }

  try {
    // Blob fallback
    if (typeof globalThis.Blob === 'undefined') {
      const { Blob } = require('buffer');
      if (Blob) globalThis.Blob = Blob;
    }
  } catch (e) {
    // ignore
  }

  try {
    // Web Streams: prefer Node's built-in implementation
    if (typeof globalThis.ReadableStream === 'undefined') {
      const ws = require('node:stream/web');
      if (ws && ws.ReadableStream) {
        globalThis.ReadableStream = ws.ReadableStream;
        if (typeof globalThis.WritableStream === 'undefined' && ws.WritableStream) {
          globalThis.WritableStream = ws.WritableStream;
        }
        if (typeof globalThis.TransformStream === 'undefined' && ws.TransformStream) {
          globalThis.TransformStream = ws.TransformStream;
        }
      }
    }
  } catch (e) {
    // ignore
  }

  // Defer requiring environment until after polyfills
  // eslint-disable-next-line global-require
  const EnvMod = require('jest-environment-jsdom');
  JsdomEnvironment = EnvMod && (EnvMod.default || EnvMod.TestEnvironment || EnvMod);
})();

class JSDOMWithFileEnv extends JsdomEnvironment {
  constructor(config, context) {
    super(config, context);
  }
}

module.exports = JSDOMWithFileEnv;
