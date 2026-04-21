const RADIO_BROWSER_SEARCH = "https://de1.api.radio-browser.info/json/stations/search";
const STORAGE_KEYS = {
  favorites: "mahmoud-radio:favorites",
  customStations: "mahmoud-radio:custom-stations",
  volume: "mahmoud-radio:volume",
};

const curatedStations = [
  {
    id: "somafm-groove-salad",
    name: "SomaFM Groove Salad",
    country: "United States",
    city: "San Francisco",
    genre: "Chill",
    tags: ["ambient", "downtempo", "lounge"],
    streamUrl: "https://ice5.somafm.com/groovesalad-128-mp3",
    artwork: "https://somafm.com/img3/groovesalad-400.jpg",
    codec: "MP3",
    bitrate: "128",
  },
  {
    id: "oldie-antenne",
    name: "OLDIE ANTENNE",
    country: "Germany",
    city: "Munich",
    genre: "Oldies",
    tags: ["60s", "70s", "80s"],
    streamUrl: "https://s1-webradio.oldie-antenne.de/oldie-antenne?aw_0_1st.playerid=MahmoudRadio",
    artwork: "https://www.oldie-antenne.de/logos/oldie-antenne/apple-touch-icon.png",
    codec: "MP3",
    bitrate: "128",
  },
  {
    id: "bbc-world-service",
    name: "BBC World Service",
    country: "United Kingdom",
    city: "London",
    genre: "News",
    tags: ["world", "talk", "public radio"],
    streamUrl: "https://stream.live.vc.bbcmedia.co.uk/bbc_world_service_east_asia",
    artwork: "",
    codec: "MP3",
    bitrate: "56",
  },
  {
    id: "kexp",
    name: "KEXP 90.3 FM",
    country: "United States",
    city: "Seattle",
    genre: "Alternative",
    tags: ["indie", "rock", "live"],
    streamUrl: "https://kexp-mp3-128.streamguys1.com/kexp128.mp3",
    artwork: "https://www.kexp.org/static/assets/img/favicon-196x196.png",
    codec: "MP3",
    bitrate: "128",
  },
  {
    id: "deutschlandfunk",
    name: "Deutschlandfunk",
    country: "Germany",
    city: "Cologne",
    genre: "News",
    tags: ["culture", "public radio", "information"],
    streamUrl: "https://st01.sslstream.dlf.de/dlf/01/128/mp3/stream.mp3?aggregator=web",
    artwork: "https://www.deutschlandfunk.de/static/img/deutschlandfunk/icons/apple-touch-icon-128x128.png",
    codec: "MP3",
    bitrate: "128",
  },
  {
    id: "swr3",
    name: "SWR3",
    country: "Germany",
    city: "Baden-Baden",
    genre: "Pop",
    tags: ["pop", "rock", "news"],
    streamUrl: "https://liveradio.swr.de/sw282p3/swr3/play.mp3",
    artwork: "https://swr3.de/assets/swr3/icons/apple-touch-icon.png",
    codec: "MP3",
    bitrate: "128",
  },
  {
    id: "dance-wave",
    name: "Dance Wave!",
    country: "Hungary",
    city: "Budapest",
    genre: "Dance",
    tags: ["electronic", "house", "trance"],
    streamUrl: "https://dancewave.online/dance.mp3",
    artwork: "https://dancewave.online/dw_logo.png",
    codec: "MP3",
    bitrate: "128",
  },
  {
    id: "chilltrax",
    name: "Chilltrax",
    country: "United States",
    city: "Miami",
    genre: "Chill",
    tags: ["electronic", "chillout", "lounge"],
    streamUrl: "https://streamssl.chilltrax.com/",
    artwork: "",
    codec: "MP3",
    bitrate: "128",
  },
  {
    id: "qmusic",
    name: "Qmusic",
    country: "Netherlands",
    city: "Amsterdam",
    genre: "Pop",
    tags: ["hits", "top 40", "morning"],
    streamUrl: "https://icecast-qmusicnl-cdp.triple-it.nl/Qmusic_nl_live_96.mp3",
    artwork: "https://qmusic.nl/favicon.ico",
    codec: "MP3",
    bitrate: "96",
  },
  {
    id: "mangoradio",
    name: "MANGORADIO",
    country: "Germany",
    city: "Berlin",
    genre: "Variety",
    tags: ["music", "variety", "pop"],
    streamUrl: "https://mangoradio.stream.laut.fm/mangoradio",
    artwork: "https://mangoradio.de/wp-content/uploads/cropped-Logo-192x192.webp",
    codec: "MP3",
    bitrate: "128",
  },
];

const state = {
  stations: [],
  filteredStations: [],
  currentStationId: "somafm-groove-salad",
  favorites: new Set(readJson(STORAGE_KEYS.favorites, [])),
  customStations: readJson(STORAGE_KEYS.customStations, []),
  favoritesOnly: false,
  isPlaying: false,
  isMuted: false,
  isDiscovering: false,
};

const elements = {};

document.addEventListener("DOMContentLoaded", init);

function init() {
  cacheElements();
  state.stations = normalizeStations([...curatedStations, ...state.customStations]);
  restoreVolume();
  bindEvents();
  renderFilters();
  renderStations();
  setCurrentStation(state.currentStationId, false);
  setupRevealObserver();
  refreshIcons();
}

function cacheElements() {
  elements.audio = document.querySelector("#radioAudio");
  elements.stationGrid = document.querySelector("#stationGrid");
  elements.stationSearch = document.querySelector("#stationSearch");
  elements.genreFilter = document.querySelector("#genreFilter");
  elements.countryFilter = document.querySelector("#countryFilter");
  elements.favoritesToggle = document.querySelector("#favoritesToggle");
  elements.discoverButton = document.querySelector("#discoverButton");
  elements.libraryNotice = document.querySelector("#libraryNotice");
  elements.heroNowPlaying = document.querySelector("#heroNowPlaying");
  elements.playToggle = document.querySelector("#playToggle");
  elements.playToggleIcon = document.querySelector("#playToggleIcon");
  elements.previousButton = document.querySelector("#previousButton");
  elements.nextButton = document.querySelector("#nextButton");
  elements.muteButton = document.querySelector("#muteButton");
  elements.volumeSlider = document.querySelector("#volumeSlider");
  elements.playerArtwork = document.querySelector("#playerArtwork");
  elements.playerFallback = document.querySelector("#playerFallback");
  elements.playerStatus = document.querySelector("#playerStatus");
  elements.playerTitle = document.querySelector("#playerTitle");
  elements.playerMeta = document.querySelector("#playerMeta");
  elements.customStationForm = document.querySelector("#customStationForm");
  elements.customName = document.querySelector("#customName");
  elements.customUrl = document.querySelector("#customUrl");
  elements.customGenre = document.querySelector("#customGenre");
  elements.customCountry = document.querySelector("#customCountry");
  elements.customFormMessage = document.querySelector("#customFormMessage");
}

function bindEvents() {
  elements.stationSearch.addEventListener("input", () => {
    renderStations();
  });

  elements.genreFilter.addEventListener("change", renderStations);
  elements.countryFilter.addEventListener("change", renderStations);

  elements.favoritesToggle.addEventListener("click", () => {
    state.favoritesOnly = !state.favoritesOnly;
    elements.favoritesToggle.setAttribute("aria-pressed", String(state.favoritesOnly));
    renderStations();
  });

  elements.discoverButton.addEventListener("click", discoverStations);

  elements.stationGrid.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const stationId = button.dataset.stationId;
    if (!stationId) return;

    if (button.dataset.action === "play-station") {
      if (stationId === state.currentStationId && state.isPlaying) {
        pauseCurrentStation();
        return;
      }
      setCurrentStation(stationId, true);
    }

    if (button.dataset.action === "favorite-station") {
      toggleFavorite(stationId);
    }
  });

  document.querySelectorAll("[data-action='hero-play']").forEach((button) => {
    button.addEventListener("click", () => {
      if (!state.currentStationId) {
        setCurrentStation(state.filteredStations[0]?.id || state.stations[0]?.id, true);
        return;
      }
      playCurrentStation();
    });
  });

  elements.playToggle.addEventListener("click", () => {
    if (state.isPlaying) {
      pauseCurrentStation();
      return;
    }
    playCurrentStation();
  });

  elements.previousButton.addEventListener("click", () => jumpStation(-1));
  elements.nextButton.addEventListener("click", () => jumpStation(1));

  elements.muteButton.addEventListener("click", () => {
    state.isMuted = !state.isMuted;
    elements.audio.muted = state.isMuted;
    renderPlayerControls();
  });

  elements.volumeSlider.addEventListener("input", () => {
    const volume = Number(elements.volumeSlider.value) / 100;
    elements.audio.volume = volume;
    localStorage.setItem(STORAGE_KEYS.volume, String(volume));
  });

  elements.customStationForm.addEventListener("submit", handleCustomStationSubmit);

  elements.audio.addEventListener("loadstart", () => setPlayerStatus("Connecting"));
  elements.audio.addEventListener("waiting", () => setPlayerStatus("Buffering"));
  elements.audio.addEventListener("stalled", () => setPlayerStatus("Reconnecting"));
  elements.audio.addEventListener("playing", () => {
    state.isPlaying = true;
    setPlayerStatus("Playing live");
    renderPlayerControls();
    renderStations();
  });
  elements.audio.addEventListener("pause", () => {
    state.isPlaying = false;
    setPlayerStatus("Paused");
    renderPlayerControls();
    renderStations();
  });
  elements.audio.addEventListener("error", () => {
    state.isPlaying = false;
    setPlayerStatus("Stream unavailable");
    showNotice("This stream could not be loaded. Try another station.", true);
    renderPlayerControls();
    renderStations();
  });
}

function normalizeStations(stations) {
  const seen = new Set();
  return stations
    .map((station) => ({
      id: sanitizeId(station.id || station.stationuuid || station.name),
      name: cleanText(station.name, "Untitled station"),
      country: cleanText(station.country, "Global"),
      city: cleanText(station.city || station.state, ""),
      genre: cleanText(station.genre || firstTag(station.tags), "Variety"),
      tags: normalizeTags(station.tags),
      streamUrl: safeUrl(station.streamUrl || station.url_resolved || station.url),
      artwork: safeUrl(station.artwork || station.favicon),
      codec: cleanText(station.codec, "Stream"),
      bitrate: cleanText(station.bitrate, ""),
      source: station.source || "curated",
    }))
    .filter((station) => {
      if (!station.id || !station.streamUrl || seen.has(station.streamUrl)) {
        return false;
      }
      seen.add(station.streamUrl);
      return true;
    });
}

function renderFilters() {
  const genres = uniqueSorted(state.stations.map((station) => station.genre));
  const countries = uniqueSorted(state.stations.map((station) => station.country));
  renderOptions(elements.genreFilter, "All genres", genres);
  renderOptions(elements.countryFilter, "All countries", countries);
}

function renderOptions(select, firstLabel, options) {
  const previousValue = select.value;
  select.innerHTML = [
    `<option value="all">${escapeHtml(firstLabel)}</option>`,
    ...options.map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`),
  ].join("");

  if ([...select.options].some((option) => option.value === previousValue)) {
    select.value = previousValue;
  }
}

function renderStations() {
  const query = elements.stationSearch.value.trim().toLowerCase();
  const selectedGenre = elements.genreFilter.value;
  const selectedCountry = elements.countryFilter.value;

  state.filteredStations = state.stations.filter((station) => {
    const searchable = [
      station.name,
      station.country,
      station.city,
      station.genre,
      station.codec,
      ...station.tags,
    ]
      .join(" ")
      .toLowerCase();

    return (
      (!query || searchable.includes(query)) &&
      (selectedGenre === "all" || station.genre === selectedGenre) &&
      (selectedCountry === "all" || station.country === selectedCountry) &&
      (!state.favoritesOnly || state.favorites.has(station.id))
    );
  });

  if (!state.filteredStations.length) {
    elements.stationGrid.innerHTML = `<div class="notice">No stations match the current filters.</div>`;
    return;
  }

  elements.stationGrid.innerHTML = state.filteredStations.map(renderStationCard).join("");
  refreshIcons();
}

function renderStationCard(station) {
  const isFavorite = state.favorites.has(station.id);
  const isActive = station.id === state.currentStationId;
  const isPlaying = isActive && state.isPlaying;
  const tags = station.tags.slice(0, 3).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
  const artwork = station.artwork ? `src="${escapeAttribute(station.artwork)}"` : `src=""`;
  const location = [station.city, station.country].filter(Boolean).join(", ");
  const actionLabel = isPlaying ? "Pause" : "Play";

  return `
    <article class="station-card${isActive ? " is-active" : ""}${isPlaying ? " is-playing" : ""}">
      <div class="station-card-art">
        <img ${artwork} alt="" loading="lazy" onerror="this.removeAttribute('src')" />
        <span class="art-fallback">${escapeHtml(initials(station.name))}</span>
      </div>
      <div class="station-card-body">
        <h3>${escapeHtml(station.name)}</h3>
        <div class="station-meta">${escapeHtml(station.genre)} - ${escapeHtml(location || "Global")} - ${escapeHtml(formatCodec(station))}</div>
        <div class="station-tags">${tags}</div>
      </div>
      <div class="station-actions">
        <button class="icon-btn station-play" type="button" data-action="play-station" data-station-id="${escapeAttribute(station.id)}" aria-label="${actionLabel} ${escapeAttribute(station.name)}" title="${actionLabel} ${escapeAttribute(station.name)}">
          <i data-lucide="${isPlaying ? "pause" : "play"}"></i>
          <span>${actionLabel}</span>
        </button>
        <button class="icon-btn${isFavorite ? " is-active" : ""}" type="button" data-action="favorite-station" data-station-id="${escapeAttribute(station.id)}" aria-label="${isFavorite ? "Remove favorite" : "Add favorite"}" title="${isFavorite ? "Remove favorite" : "Add favorite"}">
          <i data-lucide="heart"></i>
        </button>
      </div>
    </article>
  `;
}

function setCurrentStation(stationId, autoplay) {
  const station = state.stations.find((item) => item.id === stationId);
  if (!station) return;

  state.currentStationId = station.id;
  if (elements.audio.src !== station.streamUrl) {
    elements.audio.src = station.streamUrl;
    elements.audio.load();
  }

  elements.playerTitle.textContent = station.name;
  elements.playerMeta.textContent = [station.genre, station.country, formatCodec(station)]
    .filter(Boolean)
    .join(" - ");
  elements.heroNowPlaying.textContent = `${autoplay ? "Connecting to" : "Ready to play"} ${station.name}`;
  elements.playerFallback.textContent = initials(station.name);

  if (station.artwork) {
    elements.playerArtwork.src = station.artwork;
  } else {
    elements.playerArtwork.removeAttribute("src");
  }

  elements.playerArtwork.onerror = () => {
    elements.playerArtwork.removeAttribute("src");
  };

  renderPlayerControls();
  renderStations();

  if (autoplay) {
    playCurrentStation();
  } else {
    setPlayerStatus("Ready");
  }
}

async function playCurrentStation() {
  const station = state.stations.find((item) => item.id === state.currentStationId) || state.filteredStations[0] || state.stations[0];
  if (!station) return;

  if (state.currentStationId !== station.id) {
    setCurrentStation(station.id, false);
  }

  try {
    setPlayerStatus("Connecting");
    await elements.audio.play();
  } catch (error) {
    state.isPlaying = false;
    setPlayerStatus("Tap play again");
    showNotice("The browser blocked autoplay. Press play on the selected station.", true);
    renderPlayerControls();
  }
}

function pauseCurrentStation() {
  elements.audio.pause();
}

function jumpStation(direction) {
  const list = state.filteredStations.length ? state.filteredStations : state.stations;
  const currentIndex = Math.max(0, list.findIndex((station) => station.id === state.currentStationId));
  const nextIndex = (currentIndex + direction + list.length) % list.length;
  setCurrentStation(list[nextIndex].id, true);
}

function toggleFavorite(stationId) {
  if (state.favorites.has(stationId)) {
    state.favorites.delete(stationId);
  } else {
    state.favorites.add(stationId);
  }

  localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify([...state.favorites]));
  renderStations();
}

async function discoverStations() {
  if (state.isDiscovering) return;

  const query = elements.stationSearch.value.trim();
  const genre = elements.genreFilter.value !== "all" ? elements.genreFilter.value : "";
  const country = elements.countryFilter.value !== "all" ? elements.countryFilter.value : "";
  const params = new URLSearchParams({
    hidebroken: "true",
    order: "clickcount",
    reverse: "true",
    limit: "24",
  });

  if (query) params.set("name", query);
  if (!query && genre) params.set("tag", genre);
  if (country) params.set("country", country);

  state.isDiscovering = true;
  elements.discoverButton.disabled = true;
  showNotice("Searching live directory...");

  try {
    const response = await fetch(`${RADIO_BROWSER_SEARCH}?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Directory returned ${response.status}`);
    }

    const stations = await response.json();
    const discovered = normalizeStations(
      stations
        .filter((station) => String(station.url_resolved || station.url || "").startsWith("https://"))
        .slice(0, 12)
        .map((station) => ({
          ...station,
          id: station.stationuuid,
          genre: firstTag(station.tags),
          source: "directory",
        }))
    );

    const existingUrls = new Set(state.stations.map((station) => station.streamUrl));
    const fresh = discovered.filter((station) => !existingUrls.has(station.streamUrl));
    state.stations = [...state.stations, ...fresh];
    renderFilters();
    renderStations();

    showNotice(fresh.length ? `Added ${fresh.length} discovered stations.` : "No new secure streams found.");
  } catch (error) {
    showNotice("The live directory is unavailable right now.", true);
  } finally {
    state.isDiscovering = false;
    elements.discoverButton.disabled = false;
    refreshIcons();
  }
}

function handleCustomStationSubmit(event) {
  event.preventDefault();

  const name = elements.customName.value.trim();
  const streamUrl = safeUrl(elements.customUrl.value.trim());
  const genre = cleanText(elements.customGenre.value, "Custom");
  const country = cleanText(elements.customCountry.value, "Global");

  if (!name || !streamUrl) {
    setFormMessage("Add a valid station name and stream URL.", true);
    return;
  }

  const station = {
    id: `custom-${Date.now()}`,
    name,
    streamUrl,
    genre,
    country,
    city: "",
    tags: ["custom"],
    artwork: "",
    codec: "Custom",
    bitrate: "",
    source: "custom",
  };

  state.customStations = [...state.customStations, station];
  state.stations = normalizeStations([...curatedStations, ...state.customStations]);
  localStorage.setItem(STORAGE_KEYS.customStations, JSON.stringify(state.customStations));
  elements.customStationForm.reset();
  renderFilters();
  renderStations();
  setCurrentStation(station.id, true);
  setFormMessage("Station saved.");
}

function renderPlayerControls() {
  const icon = state.isPlaying ? "pause" : "play";
  elements.playToggleIcon.setAttribute("data-lucide", icon);
  elements.playToggle.setAttribute("aria-label", state.isPlaying ? "Pause current station" : "Play current station");
  elements.playToggle.setAttribute("title", state.isPlaying ? "Pause current station" : "Play current station");
  elements.muteButton.classList.toggle("is-active", state.isMuted);
  elements.muteButton.innerHTML = `<i data-lucide="${state.isMuted ? "volume-x" : "volume-2"}"></i>`;
  refreshIcons();
}

function setPlayerStatus(status) {
  elements.playerStatus.textContent = status;
  const station = state.stations.find((item) => item.id === state.currentStationId);
  if (station && status === "Playing live") {
    elements.heroNowPlaying.textContent = `Playing ${station.name}`;
  }
}

function restoreVolume() {
  const savedVolume = Number(localStorage.getItem(STORAGE_KEYS.volume));
  const volume = Number.isFinite(savedVolume) ? savedVolume : 0.72;
  elements.audio.volume = Math.min(1, Math.max(0, volume));
  elements.volumeSlider.value = String(Math.round(elements.audio.volume * 100));
}

function setupRevealObserver() {
  const revealItems = document.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function showNotice(message, isError = false) {
  elements.libraryNotice.textContent = message;
  elements.libraryNotice.classList.toggle("is-error", isError);
}

function setFormMessage(message, isError = false) {
  elements.customFormMessage.textContent = message;
  elements.customFormMessage.classList.toggle("is-error", isError);
}

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
}

function uniqueSorted(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function normalizeTags(tags) {
  if (Array.isArray(tags)) {
    return tags.map((tag) => cleanText(tag, "")).filter(Boolean);
  }

  return String(tags || "")
    .split(",")
    .map((tag) => cleanText(tag, ""))
    .filter(Boolean)
    .slice(0, 6);
}

function firstTag(tags) {
  return normalizeTags(tags)[0] || "Variety";
}

function sanitizeId(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

function safeUrl(value) {
  const url = String(value || "").trim();
  return /^https?:\/\//i.test(url) ? url : "";
}

function cleanText(value, fallback) {
  const text = String(value || "").trim().replace(/\s+/g, " ");
  return text || fallback;
}

function formatCodec(station) {
  return [station.codec, station.bitrate].filter(Boolean).join(" ");
}

function initials(value) {
  return String(value || "MR")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}
