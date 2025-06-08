import { webext } from "../api/global.mjs";

// Store the current utterance
let currentUtterance = null;

const messageHandlers = {
  speak: speakText,
  stop: stopSpeaking,
  getVoices: getVoices,
};

// Handle messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.target !== 'offscreen') return;

  if (messageHandlers[message.action]) {
    messageHandlers[message.action](message, sender, sendResponse);
  }
  return true;
});

// Function to speak text
function speakText(text, options = {}) {
  // Stop any current speech
  stopSpeaking();

  // Create new utterance
  currentUtterance = new SpeechSynthesisUtterance(text);

  // Apply options
  if (options.voice) {
    currentUtterance.voice = options.voice;
  }
  if (options.rate) {
    currentUtterance.rate = options.rate;
  }
  if (options.pitch) {
    currentUtterance.pitch = options.pitch;
  }

  // Handle speech end
  currentUtterance.onend = () => {
    currentUtterance = null;
    chrome.runtime.sendMessage({ action: 'speechEnded' });
  };

  // Handle speech error
  currentUtterance.onerror = (event) => {
    console.error('Speech synthesis error:', event);
    chrome.runtime.sendMessage({ 
      action: 'speechError',
      error: event.error
    });
  };

  // Start speaking
  speechSynthesis.speak(currentUtterance);
}

// Function to stop speaking
function stopSpeaking() {
  if (currentUtterance) {
    speechSynthesis.cancel();
    currentUtterance = null;
  }
}

function getVoices(sendResponse) {
  sendResponse(speechSynthesis.getVoices());
}


// Initialize voices
let voices = [];
function initVoices() {
  voices = speechSynthesis.getVoices();
  if (voices.length > 0) {
    chrome.runtime.sendMessage({ 
      action: 'voicesReady',
      voices: voices
    });
  }
}

// Listen for voices to be loaded
speechSynthesis.onvoiceschanged = initVoices;
initVoices();
