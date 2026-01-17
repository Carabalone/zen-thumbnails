let enabled = true;

// CSS: Target broad ytimg patterns including sidebar and lazy-load placeholders
const style = document.createElement('style');
style.textContent = `
  img[src*="ytimg.com"]:not([data-thumbnail-replaced]),
  img[src*="/vi/"]:not([data-thumbnail-replaced]),
  img[src*="i.ytimg.com"]:not([data-thumbnail-replaced]) { 
    opacity: 0 !important; 
  }
  img[data-thumbnail-replaced="true"] { 
    opacity: 1 !important; 
    object-fit: cover;
  }
`;
document.head.appendChild(style);

function createColorThumbnail(color) {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='90'%3E%3Crect width='100%25' height='100%25' fill='${encodeURIComponent(color)}'/%3E%3C/svg%3E`;
}

function replaceThumbnail(img) {
  if (!enabled || img.dataset.thumbnailReplaced) return;
  
  const src = img.src || img.getAttribute('src') || "";
  
  // Broaden the search to catch thumbnails everywhere (sidebar, grid, search)
  if (src.includes("ytimg.com") || src.includes("/vi/") || src.includes("youtube.com/vi")) {
    img.src = createColorThumbnail(getColorForURL(src));
    img.dataset.thumbnailReplaced = "true";
  }
}

const observer = new MutationObserver((mutations) => {
  if (!enabled) return;
  for (let i = 0; i < mutations.length; i++) {
    const m = mutations[i];
    
    // Catch elements added to the DOM
    if (m.addedNodes.length) {
      m.addedNodes.forEach(n => {
        if (n.nodeType === 1) {
          if (n.tagName === "IMG") replaceThumbnail(n);
          else {
            const imgs = n.getElementsByTagName('img');
            for (let j = 0; j < imgs.length; j++) replaceThumbnail(imgs[j]);
          }
        }
      });
    }
    
    // IMPORTANT: Catch when YouTube changes the 'src' of an existing img (Lazy Loading)
    if (m.type === 'attributes' && m.attributeName === 'src') {
      replaceThumbnail(m.target);
    }
  }
});

function init() {
  chrome.storage.local.get('enabled', (res) => {
    enabled = res.enabled !== false;
    if (enabled) {
      // We MUST watch attributes because sidebar/recs swap 'src' on scroll
      observer.observe(document.body, { 
        childList: true, 
        subtree: true, 
        attributes: true, 
        attributeFilter: ['src'] 
      });
      document.querySelectorAll("img").forEach(replaceThumbnail);
    }
  });
}

chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) {
    enabled = changes.enabled.newValue;
    if (!enabled) location.reload();
    else document.querySelectorAll("img").forEach(replaceThumbnail);
  }
});

init();
