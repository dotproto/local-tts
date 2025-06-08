# Text to Speech WebExtension

A browser extension that converts selected text to speech with advanced controls using the Web Speech API.

## Features

- Right-click on any selected text to convert it to speech
- Control panel with the following options:
  - Voice selection (uses system voices)
  - Speech rate adjustment (0.5x to 2x)
  - Pitch adjustment (0.5x to 2x)
  - Play/Stop controls
  - Close button to dismiss the control panel
- Works on any webpage
- Modern, floating control panel UI

## Installation

1. Clone or download this repository
2. Install dependencies and generate icons:
   ```bash
   npm install
   npm run generate-icons
   ```
3. Open your browser and navigate to the extensions page:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
4. Enable "Developer mode" in the top right
5. Click "Load unpacked" and select the extension directory

## Usage

1. Select any text on a webpage
2. Right-click on the selected text
3. Click "Speak selected text" from the context menu
4. A control panel will appear in the bottom-right corner of the page
5. Use the controls to:
   - Select a different voice
   - Adjust the speech rate
   - Adjust the pitch
   - Play/Stop the speech
   - Close the control panel

## Note

This extension requires the following permissions:
- `contextMenus`: To create the right-click menu item
- `activeTab`: To access the current tab's content
- `scripting`: To execute the text-to-speech functionality

## Development

To modify the extension:
1. Make your changes to the source files
2. If you modify the icon generation script, run `npm run generate-icons` to update the icons
3. Reload the extension in your browser's extension page 