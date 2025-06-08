const cached = {
  browser: globalThis.browser,
  chrome: globalThis.chrome,
  edge: globalThis.edge,
}

export let webext;
webext = setGlobal();

export function setGlobal(global = webext) {
  if (typeof global !== 'undefined' && global !== webext) {
    webext = global;
  } else {
    webext = cached.browser || cached.edge || cached.chrome;
  }
  return webext;
}
