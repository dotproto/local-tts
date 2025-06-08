import { webext } from '../global.mjs';

// Check if we're in a context that supports the Offscreen API
const hasOffscreenAPI = typeof webext !== 'undefined' && webext.offscreen;

// Store the offscreen document reference
let offscreenDocument = null;

// Store the iframe reference for non-Offscreen API environments
let offscreenIframe = null;

// Store callbacks for document creation
const createCallbacks = new Map();

/**
 * Creates an offscreen document with the specified URL and reason
 * @param {Object} options - The options for creating the offscreen document
 * @param {string} options.url - The URL of the document to create
 * @param {string[]} options.reasons - The reasons for creating the document
 * @param {string} options.justification - The justification for creating the document
 * @returns {Promise<void>}
 */
export async function createDocument(options) {
  if (hasOffscreenAPI) {
    // Use the native Offscreen API
    return webext.offscreen.createDocument(options);
  }

  // Create a promise that will be resolved when the iframe is ready
  return new Promise((resolve, reject) => {
    const callbackId = Date.now().toString();
    createCallbacks.set(callbackId, { resolve, reject });

    // Send message to background script to create iframe
    webext.runtime.sendMessage({
      action: 'createOffscreenIframe',
      callbackId,
      options
    });
  });
}

/**
 * Closes the offscreen document
 * @returns {Promise<void>}
 */
export async function closeDocument() {
  if (hasOffscreenAPI) {
    // Use the native Offscreen API
    return webext.offscreen.closeDocument();
  }

  // Send message to background script to remove iframe
  return webext.runtime.sendMessage({
    action: 'closeOffscreenIframe'
  });
}

/**
 * Checks if an offscreen document exists
 * @returns {Promise<boolean>}
 */
export async function hasDocument() {
  if (hasOffscreenAPI) {
    // Use the native Offscreen API
    return webext.offscreen.hasDocument();
  }

  // Check if our iframe exists
  return webext.runtime.sendMessage({
    action: 'hasOffscreenIframe'
  });
}

/**
 * Gets the offscreen document
 * @returns {Document|null}
 */
export function getDocument() {
  if (hasOffscreenAPI) {
    // Use the native Offscreen API
    return webext.offscreen.getDocument();
  }

  // Return the iframe's contentDocument
  return offscreenIframe?.contentDocument || null;
}

/**
 * Sets up the offscreen document in the current context
 * @param {Document} doc - The document to set up
 */
export function setupOffscreenDocument(doc) {
  if (hasOffscreenAPI) {
    // Nothing to do in native Offscreen API environment
    return;
  }

  offscreenDocument = doc;

  // Listen for messages from the parent window
  window.addEventListener('message', (event) => {
    if (event.source === window.parent) {
      const { action, callbackId, data } = event.data;

      if (action === 'offscreenReady') {
        const callback = createCallbacks.get(callbackId);
        if (callback) {
          callback.resolve();
          createCallbacks.delete(callbackId);
        }
      }
    }
  });

  // Notify parent that we're ready
  window.parent.postMessage({
    action: 'offscreenReady',
    callbackId: new URLSearchParams(window.location.search).get('callbackId')
  }, '*');
}

// Initialize the polyfill
if (typeof window !== 'undefined') {
  // Check if we're in an iframe
  if (window !== window.parent) {
    setupOffscreenDocument(document);
  }
}

// Export the polyfill
export default {
  createDocument,
  closeDocument,
  hasDocument,
  getDocument,
  setupOffscreenDocument
};


