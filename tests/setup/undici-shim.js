// Ensure File and Blob are defined before importing undici
(() => {
  try {
    if (typeof globalThis.File === 'undefined') {
      const { File } = require('fetch-blob/file.js');
      globalThis.File = File;
    }
    if (typeof globalThis.Blob === 'undefined') {
      const { Blob } = require('buffer');
      if (Blob) globalThis.Blob = globalThis.Blob || Blob;
    }
  } catch (e) {
    // ignore; undici may still fail if File truly absent
  }
})();

module.exports = require('undici');

