import { webext } from "../api/global.mjs";
import { ContextType } from "../api/runtime/context-type.mjs";
import { OFFSCREEN_URL, OFFSCREEN_JUSTIFICATION } from "../offscreen/constants.mjs";

// Store available voices
let availableVoices = [];

// Create context menu item when extension is installed
chrome.runtime.onInstalled.addListener(async () => {
  // Create context menu
  chrome.contextMenus.create({
    id: "speakSelection",
    title: "Speak selected text",
    contexts: ["selection"]
  });
});

async function buildOrGetTTSEngine() {
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: [ContextType.OFFSCREEN_DOCUMENT],
    documentUrls: [OFFSCREEN_URL]
  });

  if (existingContexts.length > 0) {
    return existingContexts.at(0);
  }

  // No offscreen document found, create one
  return buildTTSEngine();
}

async function buildTTSEngine() {
  const reasons = [
    // Ideally we'd use a more specific reason (like the following line). Since
    // we can't, fall back to the closest option we have (AUDIO_PLAYBACK).
    // chrome.offscreen.Reason.TEXT_TO_SPEECH,
    chrome.offscreen.Reason.AUDIO_PLAYBACK,
  ];
  const createOSD = await chrome.offscreen.createDocument({
    url: OFFSCREEN_URL,
    justification: OFFSCREEN_JUSTIFICATION,
    reasons,
  });

  return createOSD;
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "speakSelection") {
    // Send message to content script to show control panel
    chrome.tabs.sendMessage(tab.id, {
      action: 'showControls',
      text: info.selectionText
    });
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'speak') {
    // Forward speak request to offscreen document
    chrome.runtime.sendMessage({
      target: 'offscreen',
      action: 'speak',
      text: message.text,
      options: message.options
    });
  } else if (message.action === 'stop') {
    // Forward stop request to offscreen document
    chrome.runtime.sendMessage({
      target: 'offscreen',
      action: 'stop'
    });
  } else if (message.action === 'getVoices') {
    // Return available voices
    sendResponse(availableVoices);
  }
  return true;
});

// Listen for messages from offscreen document
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'voicesReady') {
    availableVoices = message.voices;
  }
});

// Function to be injected into the page
function speakSelectedText(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
}
