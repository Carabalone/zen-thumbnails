const el = document.getElementById('enabled');
chrome.storage.local.get('enabled', (res) => {
  el.checked = res.enabled !== false;
});
el.addEventListener('change', () => {
  chrome.storage.local.set({ enabled: el.checked });
});
