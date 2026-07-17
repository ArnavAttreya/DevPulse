const COLOR_MAP = {
  javascript: '#f1e05a',
  typescript: '#3178c6',
  html: '#e34c26',
  css: '#563d7c',
  python: '#3572a5',
  java: '#b07219',
  'c++': '#f34b7d',
  c: '#555555',
  'c#': '#178600',
  ruby: '#701516',
  go: '#00add8',
  php: '#4f5d95',
  shell: '#89e051',
  powershell: '#012456',
  swift: '#f05138',
  rust: '#dea584',
  kotlin: '#a97bff',
  dart: '#00b4ab',
  scala: '#c22d40',
  r: '#198ce7',
  objective_c: '#438eff',
  'objective-c': '#438eff',
  vue: '#41b883',
  angular: '#dd0031',
  svelte: '#ff3e00',
  elixir: '#6e4a7e',
  clojure: '#db5855',
  haskell: '#5e5086',
  lua: '#000080',
  ocaml: '#ef7a08',
  assembly: '#6e4c13',
  typescriptreact: '#3178c6',
  javascriptreact: '#f1e05a',
  jupyter_notebook: '#da5b0b',
  'jupyter notebook': '#da5b0b',
};

export const getLanguageColor = (language) => {
  if (!language) return '#8b949e';

  const normalized = language.toLowerCase().trim();
  if (COLOR_MAP[normalized]) {
    return COLOR_MAP[normalized];
  }

  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    const adjusted = Math.floor(value * 0.7 + 50);
    color += ('00' + adjusted.toString(16)).substr(-2);
  }

  return color;
};
