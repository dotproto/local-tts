import { webext } from "../api/global.mjs";

// Store the offscreen iframe reference
let offscreenIframe = null;

/**
 * Creates an offscreen iframe with the specified URL
 * @param {string} url - The URL to load in the iframe
 * @param {string} callbackId - The callback ID for the creation promise
 * @returns {Promise<void>}
 */
async function createOffscreenIframe(url, callbackId) {
  // Remove existing iframe if it exists
  if (offscreenIframe) {
    offscreenIframe.remove();
  }

  // Create new iframe
  offscreenIframe = document.createElement('iframe');
  offscreenIframe.style.cssText = `
    position: fixed;
    top: -9999px;
    left: -9999px;
    width: 1px;
    height: 1px;
    border: none;
    visibility: hidden;
  `;

  // Add callback ID to URL
  const iframeUrl = new URL(url, webext.runtime.getURL(''));
  iframeUrl.searchParams.set('callbackId', callbackId);

  // Set iframe source
  offscreenIframe.src = iframeUrl.toString();

  // Add iframe to document
  document.body.appendChild(offscreenIframe);

  // Return a promise that resolves when the iframe is ready
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Offscreen iframe creation timed out'));
    }, 5000);

    // Listen for ready message from iframe
    window.addEventListener('message', function onMessage(event) {
      if (event.source === offscreenIframe.contentWindow) {
        const { action, callbackId: msgCallbackId } = event.data;
        if (action === 'offscreenReady' && msgCallbackId === callbackId) {
          clearTimeout(timeout);
          window.removeEventListener('message', onMessage);
          resolve();
        }
      }
    });
  });
}

/**
 * Removes the offscreen iframe
 */
function closeOffscreenIframe() {
  if (offscreenIframe) {
    offscreenIframe.remove();
    offscreenIframe = null;
  }
}

/**
 * Checks if the offscreen iframe exists
 * @returns {boolean}
 */
function hasOffscreenIframe() {
  return offscreenIframe !== null;
}

// Listen for messages from the offscreen polyfill
webext.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'createOffscreenIframe':
      createOffscreenIframe(message.options.url, message.callbackId)
        .then(() => sendResponse(true))
        .catch((error) => sendResponse({ error: error.message }));
      return true;

    case 'closeOffscreenIframe':
      closeOffscreenIframe();
      sendResponse(true);
      return true;

    case 'hasOffscreenIframe':
      sendResponse(hasOffscreenIframe());
      return true;
  }
});

export {
  createOffscreenIframe,
  closeOffscreenIframe,
  hasOffscreenIframe
};
