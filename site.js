// Loads comics.json and hides comics dated in the future, so you can
// add upcoming comics ahead of time and they appear on their publish day.
const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD, local time

async function loadComics() {
  const res = await fetch('comics.json', { cache: 'no-cache' });
  const all = await res.json();
  return all.filter(c => c.date <= today).sort((a, b) => a.number - b.number);
}

const fmt = d => new Date(d + 'T12:00:00').toLocaleDateString(undefined,
  { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

function el(tag, attrs = {}, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  e.append(...kids);
  return e;
}

function pagerButton(label, comic) {
  return comic
    ? el('a', { class: 'btn', href: `?c=${comic.number}` }, label)
    : el('span', { class: 'btn', 'aria-disabled': 'true' }, label);
}

async function showComic() {
  const root = document.getElementById('comic');
  const comics = await loadComics();
  if (!comics.length) { root.textContent = 'No comics yet. Come back soon!'; return; }
  const want = Number(new URLSearchParams(location.search).get('c'));
  const i = Math.max(0, comics.findIndex(c => c.number === want));
  const idx = want && comics.some(c => c.number === want) ? i : comics.length - 1;
  const c = comics[idx];
  document.title = `${c.title} · Le French Poops`;
  const pager = () => el('div', { class: 'pager' },
    pagerButton('⏮ First', idx > 0 && comics[0]),
    pagerButton('◀ Previous', comics[idx - 1]),
    pagerButton('Next ▶', comics[idx + 1]),
    pagerButton('Latest ⏭', idx < comics.length - 1 && comics[comics.length - 1]));
  root.replaceChildren(el('article', { class: 'card comic' },
    el('h2', {}, `#${c.number}: ${c.title}`),
    el('p', { class: 'date' }, fmt(c.date)),
    pager(),
    el('img', { src: c.image, alt: c.alt || c.title }),
    c.caption ? el('p', {}, c.caption) : '',
    c.buyUrl ? el('p', { class: 'buy' },
      el('a', { class: 'btn buy-btn', href: c.buyUrl, rel: 'noopener' }, '🛒 Buy a high-res copy')) : '',
    pager()));
  document.addEventListener('keydown', e => {
    const t = e.key === 'ArrowLeft' ? comics[idx - 1] : e.key === 'ArrowRight' ? comics[idx + 1] : null;
    if (t) location.search = `?c=${t.number}`;
  });
}

async function showArchive() {
  const root = document.getElementById('archive');
  const comics = (await loadComics()).reverse();
  root.replaceChildren(...comics.map(c => el('li', {},
    el('a', { href: `index.html?c=${c.number}` },
      el('img', { src: c.image, alt: '', loading: 'lazy' }),
      el('div', {}, el('strong', {}, `#${c.number} ${c.title}`), el('br'), el('small', {}, fmt(c.date)))))));
}

const page = document.body.dataset.page;
if (page === 'comic') showComic();
if (page === 'archive') showArchive();
