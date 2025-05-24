(async function() {
  const scripts = document.querySelectorAll('script[src]');
  const inlineScripts = Array.from(document.scripts).filter(s => !s.src);

  const payload = [];

  for (const script of scripts) {
    try {
      const res = await fetch(script.src);
      const code = await res.text();
      payload.push({ source: script.src, code });
    } catch (e) {
      payload.push({ source: script.src, code: 'FAILED TO FETCH' });
    }
  }

  for (const inline of inlineScripts) {
    payload.push({ source: 'INLINE SCRIPT', code: inline.innerText });
  }

  chrome.storage.local.set({ payload });
})();