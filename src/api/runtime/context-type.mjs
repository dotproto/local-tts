/**
 * @file Expose all known ContextType values for easier access during
 * development. Uses runtime property lookup to give browsers more insight into
 * when and where these properties are accessed.
 *
 * @author Simeon Vincent <dotproto@gmail.com>
 * @copyright 2025 Simeon Vincent
 */

import { webext } from "../global.mjs";

/// Exports ///////////////////////////////////////////////////////////////////
export const ContextType = {};

/// Implementation ////////////////////////////////////////////////////////////

const DESCRIPTOR_DEFAULTS = {
  configurable: false,
  enumerable: true,
};

const propertyDescriptors = {};

if (webext.runtime.ContextType.BACKGROUND) {
  propertyDescriptors.BACKGROUND = {
    ...DESCRIPTOR_DEFAULTS,
    get: () => webext.runtime.ContextType.BACKGROUND,
  };
}
if (webext.runtime.ContextType.DEVELOPER_TOOLS) {
  propertyDescriptors.DEVELOPER_TOOLS = {
    ...DESCRIPTOR_DEFAULTS,
    get: () => webext.runtime.ContextType.DEVELOPER_TOOLS,
  };
}
if (webext.runtime.ContextType.OFFSCREEN_DOCUMENT) {
  propertyDescriptors.OFFSCREEN_DOCUMENT = {
    ...DESCRIPTOR_DEFAULTS,
    get: () => webext.runtime.ContextType.OFFSCREEN_DOCUMENT,
  };
}
if (webext.runtime.ContextType.POPUP) {
  propertyDescriptors.POPUP = {
    ...DESCRIPTOR_DEFAULTS,
    get: () => webext.runtime.ContextType.POPUP,
  };
}
if (webext.runtime.ContextType.SIDE_PANEL) {
  propertyDescriptors.SIDE_PANEL = {
    ...DESCRIPTOR_DEFAULTS,
    get: () => webext.runtime.ContextType.SIDE_PANEL,
  };
}
if (webext.runtime.ContextType.TAB) {
  propertyDescriptors.TAB = {
    ...DESCRIPTOR_DEFAULTS,
    get: () => webext.runtime.ContextType.TAB,
  };
}

Object.defineProperties(ContextType, propertyDescriptors);
