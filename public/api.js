// api.js — only talks to the worker. No display code here.

async function getJSON(path) {
  const response = await fetch(path);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || data.error || `Error ${response.status}`);
  }
  return data;
}

// Calls worker.js -> /api/clan
function fetchClan() {
  return getJSON('/api/clan');
}
