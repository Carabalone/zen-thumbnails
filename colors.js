const COLORS = [
  '#9d7a7a', // muted mauve
  '#a68d7a', // muted rust
  '#9a9d6d', // muted olive
  '#7a9d6f', // muted green
  '#6f9d8f', // muted teal
  '#6f8fa3', // muted blue
  '#7a7a9d', // muted periwinkle
  '#8a7a9d', // muted purple
  '#9d7a8f', // muted dusty-rose
  '#9d8a7a', // muted terracotta
  '#a39d7a', // muted tan
  '#9d9d7a', // muted khaki
  '#909d7a', // muted pistachio
  '#7a9a8f', // muted seafoam
  '#7a8f9a', // muted slate
  '#8a8f9d'  // muted cool-gray
];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function getColorForURL(url) {
  return COLORS[hashString(url) % COLORS.length];
}
