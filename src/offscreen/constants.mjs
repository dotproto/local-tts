import { webext } from "../api/global.mjs";

export const OFFSCREEN_PATH = 'offscreen.html';
export const OFFSCREEN_URL = webext.runtime.getURL(OFFSCREEN_PATH);
export const OFFSCREEN_JUSTIFICATION = 'Our text to speech engine runs in the background.';
