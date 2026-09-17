'use strict';

const username = 'v3ndettaaa';
const githubUrl = `https://github.com/${username}`;
const snapshotDate = '2026-09-17';
const snapshotProfile = { public_repos: 10, followers: 5, following: 8 };
const snapshotRepos = [
  { name: 'veditor', description: 'a simple extention for pdf annotation!', language: 'JavaScript', stargazers_count: 9, pushed_at: '2026-09-16' },
  { name: 'HaveAll', description: 'have it all!', language: 'Python', stargazers_count: 19, pushed_at: '2026-06-20' },
  { name: 'GetRidOfThem', description: 'a simple way to have your mental health', language: 'JavaScript', stargazers_count: 2, pushed_at: '2026-08-02' },
  { name: 'Konkur-Helper', description: 'a simple maze planner for education', language: 'Kotlin', stargazers_count: 0, pushed_at: '2026-07-20' },
  { name: 'ServerFlow', description: 'An all-in-one Telegram bot for automated VPS management, remote SSH deployments, and resolving DNS/VPN configurations.', language: null, stargazers_count: 0, pushed_at: '2026-06-09' },
  { name: 'IranNetScanner', description: "All-in-one terminal network scanning and diagnostic tool for Iran's Internet environment.", language: 'Python', stargazers_count: 0, pushed_at: '2026-05-19' },
  { name: 'whoisaround', description: 'who is around you?', language: null, stargazers_count: 0, pushed_at: '2026-07-30' },
  { name: 'TgProxBot', description: null, language: 'Python', stargazers_count: 0, pushed_at: '2025-08-03' },
];

// Summaries are based on each project's public README, not inferred from its name.
const summaries = {
  veditor: 'Read, edit, and annotate PDFs. An offline-first tool for your browser and desktop.',
  HaveAll: 'A connectivity toolkit with a Telegram bot and an Android client. Built for access.',
  GetRidOfThem: 'A quieter Twitter / X timeline. A browser extension that filters unwanted posts.',
  'Konkur-Helper': 'An Android study planner with calendars, daily tasks, and exam tracking.',
};
const featured = ['veditor', 'HaveAll', 'GetRidOfThem', 'Konkur-Helper'];
const grid = document.querySelector('#project-grid');
const status = document.querySelector('#data-status');

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderProfile(profile) {
  for (const [key, id] of Object.entries({ public_repos: 'repo-stat', followers: 'follower-stat', following: 'following-stat' })) {
    document.getElementById(id).textContent = profile[key].toLocaleString('en');
  }
}

function renderRepos(repos) {
  const visible = repos.filter(repo => !repo.fork && repo.name !== username);
  visible.sort((a, b) => {
    const rank = name => featured.includes(name) ? featured.indexOf(name) : featured.length;
    return rank(a.name) - rank(b.name) || b.pushed_at.localeCompare(a.pushed_at);
  });
  const fragment = document.createDocumentFragment();
  for (const repo of visible) {
    const card = element('article', 'project-card');
    const heading = element('div', 'card-heading');
    const folder = element('span', 'folder', '▱');
    folder.setAttribute('aria-hidden', 'true');
    const title = element('h3');
    const link = element('a', 'project-link', repo.name);
    link.href = `${githubUrl}/${encodeURIComponent(repo.name)}`;
    link.setAttribute('aria-label', `${repo.name} on GitHub`);
    title.append(link);
    const arrow = element('span', 'card-arrow', '↗');
    arrow.setAttribute('aria-hidden', 'true');
    heading.append(folder, title, arrow);
    const description = element('p', 'project-description', summaries[repo.name] || repo.description || 'Explore the code and project details on GitHub.');
    const meta = element('div', 'card-meta');
    const stats = element('span', 'card-stats');
    const stars = element('span', '', `☆ ${repo.stargazers_count}`);
    stars.setAttribute('aria-label', `${repo.stargazers_count} stars`);
    const date = new Date(repo.pushed_at);
    const updated = element('time', '', date.toLocaleDateString('en', { month: 'short', year: 'numeric', timeZone: 'UTC' }));
    updated.dateTime = repo.pushed_at;
    updated.title = 'Last pushed to GitHub';
    stats.append(stars, updated);
    meta.append(element('span', 'language', repo.language || 'Repository'), stats);
    card.append(heading, description, meta);
    fragment.append(card);
  }
  if (!visible.length) fragment.append(element('p', 'project-empty', 'No public projects to show yet. Visit GitHub for the latest updates.'));
  grid.replaceChildren(fragment);
  document.querySelector('#project-count').textContent = `${visible.length} ${visible.length === 1 ? 'repository' : 'repositories'}`;
}

function validProfile(profile) {
  return profile && ['public_repos', 'followers', 'following'].every(key => Number.isInteger(profile[key]) && profile[key] >= 0);
}

function validRepos(repos) {
  return Array.isArray(repos) && repos.every(repo => repo && typeof repo.name === 'string' && typeof repo.pushed_at === 'string' && Number.isFinite(Date.parse(repo.pushed_at)) && Number.isInteger(repo.stargazers_count) && repo.stargazers_count >= 0 && (repo.description === null || typeof repo.description === 'string') && (repo.language === null || typeof repo.language === 'string'));
}

async function refreshGitHub() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const get = async path => {
      const response = await fetch(`https://api.github.com/${path}`, { signal: controller.signal, headers: { Accept: 'application/vnd.github+json' } });
      if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
      return response.json();
    };
    const [profile, repos] = await Promise.all([
      get(`users/${username}`),
      get(`users/${username}/repos?per_page=100&sort=updated`),
    ]);
    if (!validProfile(profile) || !validRepos(repos)) throw new Error('Unexpected GitHub response');
    renderProfile(profile);
    renderRepos(repos);
    status.textContent = 'Synced with GitHub';
    status.dataset.source = 'live';
  } catch {
    // Keep profile counts and repository data from the same snapshot.
    renderProfile(snapshotProfile);
    renderRepos(snapshotRepos);
    status.textContent = `GitHub unavailable · saved data from ${snapshotDate}`;
    status.dataset.source = 'snapshot';
  } finally {
    clearTimeout(timeout);
    controller.abort();
  }
}

renderProfile(snapshotProfile);
renderRepos(snapshotRepos);
status.textContent = `Saved ${snapshotDate} · checking GitHub…`;
refreshGitHub();
