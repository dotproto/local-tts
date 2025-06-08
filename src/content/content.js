// Create and inject the control panel
function createControlPanel() {
  const panel = document.createElement('div');
  panel.id = 'tts-control-panel';
  panel.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    z-index: 10000;
    display: none;
    font-family: system-ui, -apple-system, sans-serif;
  `;

  const controls = `
    <div style="margin-bottom: 10px;">
      <label>Voice: </label>
      <select id="tts-voice-select" style="margin-left: 5px; width: 200px;"></select>
    </div>
    <div style="margin-bottom: 10px;">
      <label>Rate: </label>
      <input type="range" id="tts-rate" min="0.5" max="2" step="0.1" value="1" style="width: 100px;">
      <span id="tts-rate-value">1</span>
    </div>
    <div style="margin-bottom: 10px;">
      <label>Pitch: </label>
      <input type="range" id="tts-pitch" min="0.5" max="2" step="0.1" value="1" style="width: 100px;">
      <span id="tts-pitch-value">1</span>
    </div>
    <div style="display: flex; gap: 10px;">
      <button id="tts-play" style="padding: 5px 10px;">Play</button>
      <button id="tts-stop" style="padding: 5px 10px;">Stop</button>
      <button id="tts-close" style="padding: 5px 10px;">Close</button>
    </div>
  `;

  panel.innerHTML = controls;
  document.body.appendChild(panel);
  return panel;
}

// Initialize text-to-speech with controls
function initTTS(text) {
  let panel = document.getElementById('tts-control-panel');
  if (!panel) {
    panel = createControlPanel();
  }
  panel.style.display = 'block';

  const voiceSelect = document.getElementById('tts-voice-select');
  const rateInput = document.getElementById('tts-rate');
  const rateValue = document.getElementById('tts-rate-value');
  const pitchInput = document.getElementById('tts-pitch');
  const pitchValue = document.getElementById('tts-pitch-value');
  const playButton = document.getElementById('tts-play');
  const stopButton = document.getElementById('tts-stop');
  const closeButton = document.getElementById('tts-close');

  // Get available voices
  chrome.runtime.sendMessage({ action: 'getVoices' }, (voices) => {
    voiceSelect.innerHTML = voices
      .map((voice, index) => `<option value="${index}">${voice.name}</option>`)
      .join('');
  });

  // Update rate display
  rateInput.addEventListener('input', (e) => {
    rateValue.textContent = e.target.value;
  });

  // Update pitch display
  pitchInput.addEventListener('input', (e) => {
    pitchValue.textContent = e.target.value;
  });

  // Play button
  playButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({
      action: 'speak',
      text: text,
      options: {
        voice: voiceSelect.selectedIndex,
        rate: parseFloat(rateInput.value),
        pitch: parseFloat(pitchInput.value)
      }
    });
  });

  // Stop button
  stopButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'stop' });
  });

  // Close button
  closeButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'stop' });
    panel.style.display = 'none';
  });

  // Auto-play when initialized
  chrome.runtime.sendMessage({
    action: 'speak',
    text: text,
    options: {
      rate: parseFloat(rateInput.value),
      pitch: parseFloat(pitchInput.value)
    }
  });
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'showControls') {
    initTTS(request.text);
  }
});
