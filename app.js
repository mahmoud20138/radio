/* ============================================================
 * Wavelength · Application logic
 * Radio stations + podcasts with RSS feed streaming.
 * ============================================================ */

(() => {
  'use strict';

  // ----- Persistent state -----
  const LS = {
    favs: 'wl.favorites',          // station favorites
    podFavs: 'wl.podFavorites',    // podcast favorites
    recent: 'wl.recent',           // station recent
    podRecent: 'wl.podRecent',     // podcast recent (episode refs)
    volume: 'wl.volume',
    theme: 'wl.theme',
    lastStation: 'wl.last',
    lastEpisode: 'wl.lastEpisode'
  };

  // mode: 'radio' | 'podcast'
  // view: 'discover' | 'podcasts' | 'favorites' | 'recent'
  const State = {
    view: 'discover',
    mode: 'radio',
    genre: null,
    category: null,
    query: '',
    favorites: load(LS.favs, []),
    podFavorites: load(LS.podFavs, []),
    recent: load(LS.recent, []),
    podRecent: load(LS.podRecent, []),
    volume: load(LS.volume, 70),
    muted: false,
    prevVolume: 70,
    currentId: null,        // station id (when mode=radio) or podcast id (when mode=podcast)
    currentEpisode: null,   // { podcastId, guid, title, url, pubDate, duration }
    episodes: [],           // currently loaded episodes for the open podcast
    isPlaying: false,
    isLoading: false
  };

  // CORS proxy for RSS feeds. allorigins is public & reliable for static XML.
  const RSS_PROXIES = [
    (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
    (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`
  ];

  // ----- DOM refs -----
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  const audio        = $('#audio');
  const grid         = $('#stationGrid');
  const sectionTitle = $('#sectionTitle');
  const resultCount  = $('#resultCount');
  const emptyState   = $('#emptyState');
  const emptyMsg     = $('#emptyMsg');
  const genreList    = $('#genreList');
  const genresHeading= $('#genresHeading');
  const searchInput  = $('#searchInput');
  const favCount     = $('#favCount');
  const sidebar      = $('#sidebar');
  const menuBtn      = $('#menuBtn');
  const themeBtn     = $('#themeBtn');
  const heroEyebrow  = $('#heroEyebrow');
  const heroTitle    = $('#heroTitle');
  const heroLead     = $('#heroLead');

  // Player
  const playerName   = $('#playerName');
  const playerSub    = $('#playerSub');
  const playerCover  = $('#playerCover');
  const coverInitial = $('#coverInitial');
  const playBtn      = $('#playBtn');
  const playIcon     = $('#playIcon');
  const pauseIcon    = $('#pauseIcon');
  const loadIcon     = $('#loadIcon');
  const prevBtn      = $('#prevBtn');
  const nextBtn      = $('#nextBtn');
  const favBtn       = $('#favBtn');
  const muteBtn      = $('#muteBtn');
  const volIcon      = $('#volIcon');
  const muteIcon     = $('#muteIcon');
  const volume       = $('#volume');
  const volValue     = $('#volValue');
  const toast        = $('#toast');
  const vizCanvas    = $('#vizCanvas');

  // Episode drawer
  const drawer       = $('#episodeDrawer');
  const drawerBackdrop = $('#drawerBackdrop');
  const drawerClose  = $('#drawerClose');
  const drawerTitle  = $('#drawerTitle');
  const drawerPublisher = $('#drawerPublisher');
  const drawerDesc   = $('#drawerDesc');
  const drawerCover  = $('#drawerCover');
  const drawerInitial= $('#drawerInitial');
  const episodeList  = $('#episodeList');
  const episodeLoading = $('#episodeLoading');
  const episodeError = $('#episodeError');
  const episodeErrorMsg = $('#episodeErrorMsg');
  const episodeRetry = $('#episodeRetry');

  // Reference to which podcast is open in drawer
  let openPodcast = null;

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

  function findStation(id) { return STATIONS.find(s => s.id === id); }
  function findPodcast(id) { return PODCASTS.find(p => p.id === id); }

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));
  }

  function stripHtml(s) {
    if (!s) return '';
    const div = document.createElement('div');
    div.innerHTML = s;
    return (div.textContent || div.innerText || '').trim();
  }

  function truncate(s, n) {
    if (!s) return '';
    return s.length > n ? s.slice(0, n - 1) + '…' : s;
  }

  function formatDate(d) {
    if (!d) return '';
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return '';
    const now = new Date();
    const days = Math.floor((now - dt) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return dt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function formatDuration(s) {
    if (!s) return '';
    // iTunes duration can be seconds, or "HH:MM:SS", or "MM:SS"
    let sec;
    if (/^\d+$/.test(s)) {
      sec = parseInt(s, 10);
    } else if (/:/.test(s)) {
      const parts = s.split(':').map(Number);
      if (parts.some(isNaN)) return '';
      sec = parts.length === 3
        ? parts[0] * 3600 + parts[1] * 60 + parts[2]
        : parts[0] * 60 + parts[1];
    } else {
      return '';
    }
    if (!sec || sec < 0) return '';
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    return h ? `${h}h ${m}m` : `${m} min`;
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

  // ============================================================
  // Sidebar filter list: renders genres (radio) or categories (podcasts)
  // ============================================================
  function renderGenres() {
    if (State.view === 'podcasts') {
      genresHeading.textContent = 'Categories';
      const counts = {};
      PODCASTS.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
      const cats = Object.keys(counts).sort();

      const allActive = State.category === null && State.view === 'podcasts';
      let html = `
        <div class="genre-item ${allActive ? 'active' : ''}" data-cat="">
          <span>All Podcasts</span>
          <span class="count">${PODCASTS.length}</span>
        </div>
      `;
      cats.forEach(c => {
        const active = State.category === c;
        html += `
          <div class="genre-item ${active ? 'active' : ''}" data-cat="${escapeHtml(c)}">
            <span>${escapeHtml(c)}</span>
            <span class="count">${counts[c]}</span>
          </div>
        `;
      });
      genreList.innerHTML = html;

      genreList.querySelectorAll('.genre-item').forEach(el => {
        el.addEventListener('click', () => {
          State.category = el.dataset.cat || null;
          State.query = '';
          searchInput.value = '';
          renderGenres();
          renderGrid();
          if (window.innerWidth < 900) sidebar.classList.remove('open');
        });
      });
      return;
    }

    // Radio genres
    genresHeading.textContent = 'Genres';
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
        <div class="genre-item ${active ? 'active' : ''}" data-genre="${escapeHtml(g)}">
          <span>${escapeHtml(g)}</span>
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

  // ============================================================
  // Hero/header copy per view
  // ============================================================
  function updateHero() {
    if (State.view === 'podcasts') {
      heroEyebrow.textContent = 'Podcasts · Live feeds';
      heroTitle.textContent = 'Your favorite shows, always fresh.';
      heroLead.textContent = 'Tap any podcast to browse its latest episodes — streamed live from the source, no account required.';
      searchInput.placeholder = 'Search podcasts, publishers, topics…';
    } else if (State.view === 'favorites') {
      heroEyebrow.textContent = 'Saved';
      heroTitle.textContent = 'Your favorites.';
      heroLead.textContent = 'Everything you\'ve starred, in one place.';
      searchInput.placeholder = 'Search favorites…';
    } else if (State.view === 'recent') {
      heroEyebrow.textContent = 'History';
      heroTitle.textContent = 'Recently played.';
      heroLead.textContent = 'Your last 24 listens across radio and podcasts.';
      searchInput.placeholder = 'Search recent…';
    } else {
      heroEyebrow.textContent = 'Live · Worldwide';
      heroTitle.textContent = 'Tune in to the world.';
      heroLead.textContent = 'Thousands of streams. Zero buffering. Find your wave — from lo-fi beats in Tokyo to jazz in New Orleans.';
      searchInput.placeholder = 'Search stations, genres, countries…';
    }
  }

  // ============================================================
  // Grid rendering
  // ============================================================
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

  function getVisiblePodcasts() {
    let list = PODCASTS.slice();
    if (State.view === 'favorites') {
      list = State.podFavorites.map(findPodcast).filter(Boolean);
    } else if (State.category) {
      list = list.filter(p => p.category === State.category);
    }
    if (State.query) {
      const q = State.query.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.publisher.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q)
      );
    }
    return list;
  }

  function renderGrid() {
    updateHero();

    if (State.view === 'podcasts') {
      renderPodcastGrid();
      return;
    }
    if (State.view === 'favorites') {
      renderMixedFavorites();
      return;
    }
    if (State.view === 'recent') {
      renderMixedRecent();
      return;
    }
    renderStationGrid();
  }

  function renderStationGrid() {
    const list = getVisibleStations();

    if (State.genre) sectionTitle.textContent = State.genre;
    else sectionTitle.textContent = 'Discover Stations';

    resultCount.textContent = list.length
      ? `${list.length} station${list.length === 1 ? '' : 's'}`
      : '';

    favCount.textContent = State.favorites.length + State.podFavorites.length;

    if (!list.length) {
      grid.innerHTML = '';
      emptyState.hidden = false;
      emptyMsg.textContent = 'Try a different search or browse another genre.';
      return;
    }
    emptyState.hidden = true;

    grid.innerHTML = list.map(s => stationCard(s)).join('');
    bindStationCards();
  }

  function renderPodcastGrid() {
    const list = getVisiblePodcasts();
    sectionTitle.textContent = State.category ? State.category : 'Discover Podcasts';
    resultCount.textContent = list.length
      ? `${list.length} podcast${list.length === 1 ? '' : 's'}`
      : '';

    favCount.textContent = State.favorites.length + State.podFavorites.length;

    if (!list.length) {
      grid.innerHTML = '';
      emptyState.hidden = false;
      emptyMsg.textContent = 'Try a different search or category.';
      return;
    }
    emptyState.hidden = true;

    grid.innerHTML = list.map(p => podcastCard(p)).join('');
    bindPodcastCards();
  }

  function renderMixedFavorites() {
    sectionTitle.textContent = 'Your Favorites';
    favCount.textContent = State.favorites.length + State.podFavorites.length;

    const stations = State.favorites.map(findStation).filter(Boolean);
    const podcasts = State.podFavorites.map(findPodcast).filter(Boolean);

    const q = State.query.toLowerCase();
    const filteredS = q
      ? stations.filter(s => [s.name, s.genre, s.country, s.description].some(x => (x||'').toLowerCase().includes(q)))
      : stations;
    const filteredP = q
      ? podcasts.filter(p => [p.name, p.publisher, p.category, p.description].some(x => (x||'').toLowerCase().includes(q)))
      : podcasts;

    const total = filteredS.length + filteredP.length;
    resultCount.textContent = total ? `${total} saved` : '';

    if (!total) {
      grid.innerHTML = '';
      emptyState.hidden = false;
      emptyMsg.textContent = 'Tap the heart on any station or podcast to save it here.';
      return;
    }
    emptyState.hidden = true;

    grid.innerHTML = [
      ...filteredS.map(s => stationCard(s)),
      ...filteredP.map(p => podcastCard(p))
    ].join('');
    bindStationCards();
    bindPodcastCards();
  }

  function renderMixedRecent() {
    sectionTitle.textContent = 'Recently Played';
    favCount.textContent = State.favorites.length + State.podFavorites.length;

    const stations = State.recent.map(findStation).filter(Boolean);

    // podRecent = [{ podcastId, episode }]
    const epItems = State.podRecent
      .map(r => ({ podcast: findPodcast(r.podcastId), episode: r.episode }))
      .filter(x => x.podcast && x.episode);

    const q = State.query.toLowerCase();
    const filteredS = q
      ? stations.filter(s => [s.name, s.genre, s.country, s.description].some(x => (x||'').toLowerCase().includes(q)))
      : stations;
    const filteredE = q
      ? epItems.filter(x => [x.podcast.name, x.podcast.publisher, x.episode.title].some(v => (v||'').toLowerCase().includes(q)))
      : epItems;

    const total = filteredS.length + filteredE.length;
    resultCount.textContent = total ? `${total} recent` : '';

    if (!total) {
      grid.innerHTML = '';
      emptyState.hidden = false;
      emptyMsg.textContent = 'Stations and episodes you play will show up here.';
      return;
    }
    emptyState.hidden = true;

    grid.innerHTML = [
      ...filteredS.map(s => stationCard(s)),
      ...filteredE.map(x => recentEpisodeCard(x.podcast, x.episode))
    ].join('');
    bindStationCards();
    bindPodcastCards();
    bindRecentEpisodeCards();
  }

  // ----- Card templates -----
  function stationCard(s) {
    const isPlaying = State.mode === 'radio' && s.id === State.currentId && State.isPlaying;
    const isFav = State.favorites.includes(s.id);
    const initial = s.name.charAt(0).toUpperCase();
    return `
      <div class="card ${isPlaying ? 'playing' : ''}" data-kind="station" data-id="${escapeHtml(s.id)}" style="--card-grad: ${s.grad}">
        <button class="card-fav ${isFav ? 'active' : ''}" data-fav-