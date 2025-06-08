export const iframe = {
  postMessage() {
    return 'postMessage';
  },
  addEventListener() {
    return 'addEventListener';
  },
  removeEventListener() {
    return 'removeEventListener';
  },
  dispatchEvent(event) {
    return event;
  },
};

export const offscreen = {
  createDocument() {},
  closeDocument() {},
  hasDocument() {},
};

export const helpers = {
  maybeCreateDocument() {},
  maybeCloseDocument() {},
};
