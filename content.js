let enabled = true;

// 1. Inject CSS immediately (Even before the body exists)
const style = document.createElement('style');
style.textContent = `
  img[src*="ytimg.com"]:not([data-thumbnail-replaced]),
  img[src*="/vi/"]:not([data-thumbnail-replaced]) { 
    opacity: 0 !important; 
  }
  img[data-thumbnail-replaced="true"] { 
    opacity: 1 !important; 
    object-fit: cover;
  }
`;
(document.head || document.documentElement).appendChild(style);

function createColorThumbnail(color) {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='90'%3E%3Crect width='100%25' height='100%25' fill='${encodeURIComponent(color)}'/%3E%3C/svg%3E`;
}

function replaceThumbnail(img) {
  if (!enabled || img.dataset.thumbnailReplaced) return;
  const src = img.src || img.getAttribute('src') || "";
  
  // Safety check for getColorForURL (from colors.js)
  if (typeof getColorForURL !== 'undefined' && (src.includes("ytimg.com") || src.includes("/vi/"))) {
    img.src = createColorThumbnail(getColorForURL(src));
    img.dataset.thumbnailReplaced = "true";
  }
}

const observer = new MutationObserver((mutations) => {
  if (!enabled) return;
  for (let i = 0; i < mutations.length; i++) {
    const m = mutations[i];
    if (m.addedNodes.length) {
      for (let n of m.addedNodes) {
        if (n.nodeType === 1) {
          if (n.tagName === "IMG") replaceThumbnail(n);
          else {
            const imgs = n.getElementsByTagName('img');
            for (let j = 0; j < imgs.length; j++) replaceThumbnail(imgs[j]);
          }
        }
      }
    }
    if (m.type === 'attributes' && m.attributeName === 'src') {
      replaceThumbnail(m.target);
    }
  }
});

function startObserving() {
  // Observe documentElement because it always exists
  observer.observe(document.documentElement, { 
    childList: true, 
    subtree: true, 
    attributes: true, 
    attributeFilter: ['src'] 
  });
  document.querySelectorAll("img").forEach(replaceThumbnail);
}

// Get settings and initialize
chrome.storage.local.get('enabled', (res) => {
  enabled = res.enabled !== false;
  if (enabled) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startObserving);
    } else {
        startObserving();
    }
    
    // Heartbeat to catch SPA transitions and new tab weirdness
    setInterval(() => {
      if (enabled) document.querySelectorAll("img").forEach(replaceThumbnail);
    }, 1000);
  }
});

// Listener for settings changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) {
    enabled = changes.enabled.newValue;
    if (!enabled) location.reload();
  }
});
