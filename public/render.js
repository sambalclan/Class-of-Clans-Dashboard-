// render.js — only builds the screen. Data comes from api.js.

// Makes text safe before putting it into HTML
function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

const num = value => Number(value ?? 0).toLocaleString();

const ROLES = {
  leader: 'Leader',
  coLeader: 'Co-leader',
  admin: 'Elder',
  member: 'Member'
};

function stat(label, value) {
  return `
    <div class="stat">
      <dt>${esc(label)}</dt>
      <dd>${esc(value)}</dd>
    </div>`;
}

function renderClan(clan) {
  const labels = (clan.labels || [])
    .map(label => `<li>${esc(label.name)}</li>`)
    .join('');

  const members = (clan.memberList || [])
    .map(m => `
      <tr>
        <td>${esc(m.clanRank)}</td>
        <td>${esc(m.name)}</td>
        <td>${esc(ROLES[m.role] || m.role)}</td>
        <td>TH${esc(m.townHallLevel)}</td>
        <td>${num(m.trophies)}</td>
        <td>${num(m.donations)}</td>
      </tr>`)
    .join('');

  document.getElementById('app').innerHTML = `
    <header class="clan-head">
      <img src="${esc(clan.badgeUrls?.medium)}" alt="" width="96" height="96">
      <div>
        <h1>${esc(clan.name)}</h1>
        <p class="tag">${esc(clan.tag)}</p>
        <ul class="labels">${labels}</ul>
      </div>
    </header>

    <p class="description">${esc(clan.description || 'No description.')}</p>

    <dl class="stats">
      ${stat('Level', clan.clanLevel)}
      ${stat('Members', `${clan.members}/50`)}
      ${stat('Clan points', num(clan.clanPoints))}
      ${stat('War wins', num(clan.warWins))}
      ${stat('War losses', num(clan.warLosses))}
      ${stat('Win streak', num(clan.warWinStreak))}
      ${stat('War league', clan.warLeague?.name || '-')}
      ${stat('Capital league', clan.capitalLeague?.name || '-')}
      ${stat('Location', clan.location?.name || '-')}
      ${stat('Language', clan.chatLanguage?.name || '-')}
      ${stat('Required trophies', num(clan.requiredTrophies))}
      ${stat('Type', clan.type || '-')}
    </dl>

    <section>
      <h2>Members</h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>#</th><th>Name</th><th>Role</th><th>TH</th><th>Trophies</th><th>Donated</th></tr>
          </thead>
          <tbody>${members}</tbody>
        </table>
      </div>
    </section>`;
}

function renderError(error) {
  document.getElementById('app').innerHTML =
    `<p class="status error">Could not load the clan: ${esc(error.message)}</p>`;
}

// Start: get data (api.js), then show it
fetchClan().then(renderClan).catch(renderError);
