/* ============================================================
 * Wavelength Radio · Application logic
 * ============================================================ */

(() => {
  'use strict';

  // ----- Persistent state -----
  const LS = {
    favs: 'wl.favorites',
    recent: 'wl.recent',
    volume: 'wl.volume',
    theme: 'wl.theme',
    lastStation: 'wl.last'
  };

  const State = {
    view: 'discover',          // discover | favorites | recent
    genre: null,               // active genre filter
    query: '',                 // search query
    favorites: load(LS.favs, []),
    recent: load(LS.recent, []),
    volume: load(LS.volume, 70),
    muted: false,
    prevVolume: 70,
    currentId: null,
    isPlaying: false,
    isLoading: false
  };

  // ----- DOM refs -----
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  const audio       = $('#audio');
  const grid        = $('#stationGrid');
  const sectionTitle= $('#sectionTitle');
  const resultCount = $('#resultCount');
  const emptyState  = $('#emptyState');
  const emptyMsg    = $('#emptyMsg');
  const genreList   = $('#genreList');
  const searchInput = $('#searchInput');
  const favCount    = $('#favCount');
  const sidebar     = $('#sidebar');
  const menuBtn     = $('#menuBtn');
  const themeBtn    = $('#themeBtn');

  // Player elements
  const playerName  = $('#playerName');
  const playerSub   = $('#playerSub');
  const playerCover = $('#playerCover');
  const coverInitial= $('#coverInitial');
  const playBtn     = $('#playBtn');
  const playIcon    = $('#playIcon');
  const pauseIcon   = $('#pauseIcon');
  const loadIcon    = $('#loadIcon');
  const prevBtn     = $('#prevBtn');
  const nextBtn     = $('#nextBtn');
  const favBtn      = $('#favBtn');
  const muteBtn     = $('#muteBtn');
  const volIcon     = $('#volIcon');
  const muteIcon    = $('#muteIcon');
  const volume      = $('#volume');
  const volValue    = $('#volValue');
  const toast       = $('#toast');
  const vizCanvas   = $('#vizCanvas');

  // ----- Helpers -----
  function load(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }

  function findStation(id) {
    return STATIONS.find(s => s.id === id);
  }

  function showToast(message, ms = 2200) {
    toast.textContent = message;
    toast.hidden = false;
    requestAnimationFrame(() => toast.classList.add('show'));
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => { toast.hidden = true; }, 300);
    }, ms);
  }

  // ----- Render: Genres list -----
  function renderGenres() {
    const counts = {};
    STATIONS.forEach(s => { counts[s.genre] = (counts[s.genre] || 0) + 1; });
    const genres = Object.keys(counts).sort();

    const allActive = State.genre === null && State.view === 'discover';
    let html = `
      <div class="genre-item ${allActive ? 'active' : ''}" data-genre="">
        <span>All Stations</span>
        <span class="count">${STATIONS.length}</span>
      </div>
    `;
    genres.forEach(g => {
      const active = State.genre === g && State.view === 'discover';
      html += `
        <div class="genre-item ${active ? 'active' : ''}" data-genre="${g}">
          <span>${g}</span>
          <span class="count">${counts[g]}</span>
        </div>
      `;
    });
    genreList.innerHTML = html;

    genreList.querySelectorAll('.genre-item').forEach(el => {
      el.addEventListener('click', () => {
        const g = el.dataset.genre;
        State.genre = g || null;
        State.view = 'discover';
        State.query = '';
        searchInput.value = '';
        $$('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.view === 'discover'));
        renderGenres();
        renderGrid();
        if (window.innerWidth < 900) sidebar.classList.remove('open');
      });
    });
  }

  // ----- Render: Cards grid -----
  function getVisibleStations() {
    let list;
    if (State.view === 'favorites') {
      list = State.favorites.map(findStation).filter(Boolean);
    } else if (State.view === 'recent') {
      list = State.recent.map(findStation).filter(Boolean);
    } else {
      list = STATIONS.slice();
      if (State.genre) list = list.filter(s => s.genre === State.genre);
    }

    if (State.query) {
      const q = State.query.toLowerCase();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.genre.toLowerCase().includes(q) ||
        s.country.toLowerCase().includes(q) ||
        (s.description || '').toLowerCase().includes(q)
      );
    }
    return list;
  }

  function renderGrid() {
    const list = getVisibleStations();

    // Section title
    if (State.view === 'favorites') sectionTitle.textContent = 'Your Favorites';
    else if (State.view === 'recent') sectionTitle.textContent = 'Recently Played';
    else if (State.genre) sectionTitle.textContent = State.genre;
    else sectionTitle.textContent = 'Discover Stations';

    resultCount.textContent = list.length
      ? `${list.length} station${list.length === 1 ? '' : 's'}`
      : '';

    favCount.textContent = State.favorites.length;

    if (!list.length) {
      grid.innerHTML = '';
      emptyState.hidden = false;
      if (State.view === 'favorites') {
        emptyMsg.textContent = 'Tap the heart on any station to add it here.';
      } else if (State.view === 'recent') {
        emptyMsg.textContent = 'Stations you play will show up here.';
      } else {
        emptyMsg.textContent = 'Try a different search or browse another genre.';
      }
      return;
    }
    emptyState.hidden = true;

    grid.innerHTML = list.map(s => {
      const isPlaying = s.id === State.currentId && State.isPlaying;
      const isFav = State.favorites.includes(s.id);
      const initial = s.name.charAt(0).toUpperCase();
      return `
        <div class="card ${isPlaying ? 'playing' : ''}" data-id="${s.id}" style="--card-grad: ${s.grad}">
          <button class="card-fav ${isFav ? 'active' : ''}" data-fav="${s.id}" aria-label="Favorite">
            <svg viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 5.5 5.5 5.5 0 0 1 21.5 12C19 16.5 12 21 12 21Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
          </button>
          <div class="card-cover" style="background: ${s.grad}">
            <span class="initial">${initial}</span>
            <div class="play-overlay">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              <div class="now-playing-bars">
                <span></span><span></span><span></span><span></span>
              </div>
            </div>
          </div>
          <div class="card-info">
            <div class="card-title">${escapeHtml(s.name)}</div>
            <div class="card-meta">
              <span>${escapeHtml(s.genre)}</span>
              <span class="dot"></span>
              <span>${escapeHtml(s.country)}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Card listeners
    grid.querySelectorAll('.card').forEach(el => {
      el.addEventListener('click', (ev) => {
        if (ev.target.closest('[data-fav]')) return;
        const id = el.dataset.id;
        if (id === State.currentId && State.isPlaying) {
          pause();
        } else {
          loadAndPlay(id);
        }
      });
    });

    grid.querySelectorAll('[data-fav]').forEach(el => {
      el.addEventListener('click', (ev) => {
        ev.stopPropagation();
        toggleFavorite(el.dataset.fav);
      });
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));
  }

  // ----- Favorites & recent -----
  function toggleFavorite(id) {
    const idx = State.favorites.indexOf(id);
    if (idx >= 0) {
      State.favorites.splice(idx, 1);
      showToast('Removed from favorites');
    } else {
      State.favorites.unshift(id);
      showToast('Added to favorites ♥');
    }
    save(LS.favs, State.favorites);
    renderGrid();
    updatePlayerFav();
  }

  function pushRecent(id) {
    const idx = State.recent.indexOf(id);
    if (idx >= 0) State.recent.splice(idx, 1);
    State.recent.unshift(id);
    if (State.recent.length > 24) State.recent.length = 24;
    save(LS.recent, State.recent);
  }

  function updatePlayerFav() {
    if (!State.currentId) {
      favBtn.classList.remove('active');
      return;
    }
    favBtn.classList.toggle('active', State.favorites.includes(State.currentId));
  }

  // ----- Audio playback -----
  function loadAndPlay(id) {
    const s = findStation(id);
    if (!s) return;

    State.currentId = id;
    State.isLoading = true;
    State.isPlaying = false;
    save(LS.lastStation, id);

    // Update player UI
    playerName.textContent = s.name;
    playerSub.textContent = `${s.genre} · ${s.country}`;
    coverInitial.textContent = s.name.charAt(0).toUpperCase();
    playerCover.style.background = s.grad;
    playerCover.classList.remove('active');

    setPlayIcon('loading');
    updatePlayerFav();

    audio.src = s.url;
    audio.load();
    const promise = audio.play();
    if (promise && typeof promise.then === 'function') {
      promise.catch(err => {
        console.error('Playback error', err);
        State.isLoading = false;
        State.isPlaying = false;
        setPlayIcon('play');
        showToast('Could not play this stream. Try another one.');
      });
    }

    pushRecent(id);
    renderGrid();
  }

  function play() {
    if (!State.currentId) {
      // start with first station if nothing selected
      loadAndPlay(STATIONS[0].id);
      return;
    }
    audio.play().catch(err => {
      console.error(err);
      showToast('Playback failed. Try another station.');
    });
  }

  function pause() {
    audio.pause();
  }

  function setPlayIcon(state) {
    playIcon.hidden  = state !== 'play';
    pauseIcon.hidden = state !== 'pause';
    loadIcon.hidden  = state !== 'loading';
  }

  function nextStation() {
    const list = getVisibleStations().length ? getVisibleStations() : STATIONS;
    if (!State.currentId) { loadAndPlay(list[0].id); return; }
    const idx = list.findIndex(s => s.id === State.currentId);
    const next = list[(idx + 1 + list.length) % list.length];
    loadAndPlay(next.id);
  }

  function prevStation() {
    const list = getVisibleStations().length ? getVisibleStations() : STATIONS;
    if (!State.currentId) { loadAndPlay(list[list.length - 1].id); return; }
    const idx = list.findIndex(s => s.id === State.currentId);
    const prev = list[(idx - 1 + list.length) % list.length];
    loadAndPlay(prev.id);
  }

  // ----- Audio event listeners -----
  audio.addEventListener('playing', () => {
    State.isPlaying = true;
    State.isLoading = false;
    setPlayIcon('pause');
    playerCover.classList.add('active');
    renderGrid();
    startVisualizer();
  });

  audio.addEventListener('pause', () => {
    State.isPlaying = false;
    setPlayIcon('play');
    playerCover.classList.remove('active');
    renderGrid();
    stopVisualizer();
  });

  audio.addEventListener('waiting', () => {
    State.isLoading = true;
    setPlayIcon('loading');
  });

  audio.addEventListener('error', () => {
    State.isLoading = false;
    State.isPlaying = false;
    setPlayIcon('play');
    showToast('Stream error. Try another station.');
  });

  // ----- Player controls -----
  playBtn.addEventListener('click', () => {
    if (State.isPlaying) pause(); else play();
  });
  prevBtn.addEventListener('click', prevStation);
  nextBtn.addEventListener('click', nextStation);
  favBtn.addEventListener('click', () => {
    if (State.currentId) toggleFavorite(State.currentId);
  });

  volume.addEventListener('input', () => {
    const v = +volume.value;
    State.volume = v;
    audio.volume = v / 100;
    volValue.textContent = v;
    save(LS.volume, v);
    if (v === 0) {
      State.muted = true;
      volIcon.hidden = true; muteIcon.hidden = false;
    } else {
      State.muted = false;
      volIcon.hidden = false; muteIcon.hidden = true;
    }
  });

  muteBtn.addEventListener('click', () => {
    if (State.muted || +volume.value === 0) {
      const v = State.prevVolume || 70;
      volume.value = v; volume.dispatchEvent(new Event('input'));
    } else {
      State.prevVolume = +volume.value;
      volume.value = 0; volume.dispatchEvent(new Event('input'));
    }
  });

  // ----- Search -----
  let searchTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      State.query = searchInput.value.trim();
      renderGrid();
    }, 120);
  });

  // ----- Sidebar nav -----
  $$('.nav-item').forEach(n => {
    n.addEventListener('click', () => {
      $$('.nav-item').forEach(x => x.classList.remove('active'));
      n.classList.add('active');
      State.view = n.dataset.view;
      State.genre = null;
      State.query = '';
      searchInput.value = '';
      renderGenres();
      renderGrid();
      if (window.innerWidth < 900) sidebar.classList.remove('open');
    });
  });

  menuBtn.addEventListener('click', () => sidebar.classList.toggle('open'));

  // ----- Theme -----
  const initTheme = load(LS.theme, 'dark');
  if (initTheme === 'light') document.documentElement.setAttribute('data-theme', 'light');
  themeBtn.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = cur === 'light' ? 'dark' : 'light';
    if (next === 'light') document.documentElement.setAttribute('data-theme', 'light');
    else document.documentElement.removeAttribute('data-theme');
    save(LS.theme, next);
  });

  // ----- Keyboard shortcuts -----
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    if (e.code === 'Space') { e.preventDefault(); State.isPlaying ? pause() : play(); }
    if (e.code === 'ArrowRight') nextStation();
    if (e.code === 'ArrowLeft') prevStation();
    if (e.key === '/') { e.preventDefault(); searchInput.focus(); }
  });

  // ----- Visualizer (synthetic, not bound to stream to avoid CORS issues) -----
  const ctx = vizCanvas.getContext('2d');
  let vizFrame, vizT = 0;
  function resizeViz() {
    const dpr = window.devicePixelRatio || 1;
    vizCanvas.width = vizCanvas.clientWidth * dpr;
    vizCanvas.height = vizCanvas.clientHeight * dpr;
  }
  window.addEventListener('resize', resizeViz);

  function drawViz() {
    if (!State.isPlaying) return;
    const w = vizCanvas.width, h = vizCanvas.height;
    ctx.clearRect(0, 0, w, h);
    const bars = 48;
    const gap = 2;
    const bw = (w - gap * (bars - 1)) / bars;
    vizT += 0.06;
    for (let i = 0; i < bars; i++) {
      const noise = Math.sin(vizT + i * 0.4) * 0.3 + Math.sin(vizT * 1.3 + i * 0.7) * 0.4 + 0.5;
      const bh = Math.max(2, noise * h * 0.95);
      const x = i * (bw + gap);
      const y = (h - bh) / 2;
      const grad = ctx.createLinearGradient(x, y, x, y + bh);
      grad.addColorStop(0, '#7c5cff');
      grad.addColorStop(1, '#4cc9f0');
      ctx.fillStyle = grad;
      ctx.fillRect(x, y, bw, bh);
    }
    vizFrame = requestAnimationFrame(drawViz);
  }
  function startVisualizer() {
    resizeViz();
    cancelAnimationFrame(vizFrame);
    drawViz();
  }
  function stopVisualizer() {
    cancelAnimationFrame(vizFrame);
    ctx.clearRect(0, 0, vizCanvas.width, vizCanvas.height);
  }

  // ----- Init -----
  function init() {
    audio.volume = State.volume / 100;
    volume.value = State.volume;
    volValue.textContent = State.volume;

    renderGenres();
    renderGrid();

    // restore last station (don't auto-play, just preload meta)
    const lastId = load(LS.lastStation, null);
    if (lastId) {
      const s = findStation(lastId);
      if (s) {
        State.currentId = lastId;
        playerName.textContent = s.name;
        playerSub.textContent  = `${s.genre} · ${s.country}`;
        coverInitial.textContent = s.name.charAt(0).toUpperCase();
        playerCover.style.background = s.grad;
        updatePlayerFav();
      }
    }
  }

  init();
})();
