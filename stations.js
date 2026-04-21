/* ============================================================
 * Wavelength Radio · Station catalog
 * Curated list of free, publicly available internet radio streams.
 * ============================================================ */

const STATIONS = [
  // ============== LO-FI / CHILL ==============
  {
    id: 'lofi-girl',
    name: 'Lofi Girl Radio',
    description: 'Lofi hip hop beats to relax/study to',
    genre: 'Lo-Fi',
    country: 'France',
    url: 'https://stream.laut.fm/lofi',
    grad: 'linear-gradient(135deg, #f72585, #7c5cff)'
  },
  {
    id: 'soma-groove',
    name: 'Groove Salad',
    description: 'A chill nicely-blended downtempo soundtrack',
    genre: 'Lo-Fi',
    country: 'USA',
    url: 'https://ice1.somafm.com/groovesalad-128-mp3',
    grad: 'linear-gradient(135deg, #2dd4bf, #4cc9f0)'
  },
  {
    id: 'soma-dronezone',
    name: 'Drone Zone',
    description: 'Atmospheric textures with minimal beats',
    genre: 'Ambient',
    country: 'USA',
    url: 'https://ice1.somafm.com/dronezone-128-mp3',
    grad: 'linear-gradient(135deg, #4cc9f0, #7c5cff)'
  },
  {
    id: 'soma-deepspace',
    name: 'Deep Space One',
    description: 'Deep ambient electronic and space music',
    genre: 'Ambient',
    country: 'USA',
    url: 'https://ice1.somafm.com/deepspaceone-128-mp3',
    grad: 'linear-gradient(135deg, #1a1a2e, #4cc9f0)'
  },

  // ============== ELECTRONIC / DANCE ==============
  {
    id: 'soma-defcon',
    name: 'DEF CON Radio',
    description: 'Music for hacking. Beats for coding.',
    genre: 'Electronic',
    country: 'USA',
    url: 'https://ice1.somafm.com/defcon-128-mp3',
    grad: 'linear-gradient(135deg, #00ff87, #60efff)'
  },
  {
    id: 'soma-beatblender',
    name: 'Beat Blender',
    description: 'Late-night blend of deep house and downtempo',
    genre: 'Electronic',
    country: 'USA',
    url: 'https://ice1.somafm.com/beatblender-128-mp3',
    grad: 'linear-gradient(135deg, #f72585, #ff8c42)'
  },
  {
    id: 'soma-secretagent',
    name: 'Secret Agent',
    description: 'The soundtrack for your stylish, mysterious life',
    genre: 'Electronic',
    country: 'USA',
    url: 'https://ice1.somafm.com/secretagent-128-mp3',
    grad: 'linear-gradient(135deg, #232526, #f72585)'
  },
  {
    id: 'soma-spacestation',
    name: 'Space Station Soma',
    description: 'Tune in, turn on, space out. Ambient and mid-tempo electronica',
    genre: 'Electronic',
    country: 'USA',
    url: 'https://ice1.somafm.com/spacestation-128-mp3',
    grad: 'linear-gradient(135deg, #0f0c29, #7c5cff)'
  },

  // ============== ROCK / INDIE ==============
  {
    id: 'soma-indiepop',
    name: 'Indie Pop Rocks!',
    description: 'New and classic favorite indie pop tracks',
    genre: 'Indie',
    country: 'USA',
    url: 'https://ice1.somafm.com/indiepop-128-mp3',
    grad: 'linear-gradient(135deg, #ee9ca7, #ffdde1)'
  },
  {
    id: 'soma-bagel',
    name: 'BAGeL Radio',
    description: 'What alternative rock radio should sound like',
    genre: 'Rock',
    country: 'USA',
    url: 'https://ice1.somafm.com/bagel-128-mp3',
    grad: 'linear-gradient(135deg, #ff8c42, #f72585)'
  },
  {
    id: 'soma-thetrip',
    name: 'The Trip',
    description: 'Progressive house / trance. Tip top tunes.',
    genre: 'Electronic',
    country: 'USA',
    url: 'https://ice1.somafm.com/thetrip-128-mp3',
    grad: 'linear-gradient(135deg, #6a11cb, #2575fc)'
  },
  {
    id: 'soma-leftcoast',
    name: 'Left Coast 70s',
    description: 'Mellow album rock from the Seventies',
    genre: 'Rock',
    country: 'USA',
    url: 'https://ice1.somafm.com/seventies-128-mp3',
    grad: 'linear-gradient(135deg, #f12711, #f5af19)'
  },

  // ============== JAZZ / BLUES ==============
  {
    id: 'soma-sonic',
    name: 'Sonic Universe',
    description: 'Transcending jazz with eclectic, exotic flavors',
    genre: 'Jazz',
    country: 'USA',
    url: 'https://ice1.somafm.com/sonicuniverse-128-mp3',
    grad: 'linear-gradient(135deg, #c33764, #1d2671)'
  },
  {
    id: 'jazz24',
    name: 'Jazz24',
    description: 'Classic and contemporary jazz · 24/7',
    genre: 'Jazz',
    country: 'USA',
    url: 'https://live.wostreaming.net/direct/ppm-jazz24aac-ibc1',
    grad: 'linear-gradient(135deg, #8e2de2, #4a00e0)'
  },
  {
    id: 'soma-coffitivity',
    name: 'Fluid',
    description: 'Drown in the electronic jazz fusion',
    genre: 'Jazz',
    country: 'USA',
    url: 'https://ice1.somafm.com/fluid-128-mp3',
    grad: 'linear-gradient(135deg, #134e5e, #71b280)'
  },

  // ============== CLASSICAL ==============
  {
    id: 'classical-king',
    name: 'Classical KING FM',
    description: 'Seattle\'s classical music station',
    genre: 'Classical',
    country: 'USA',
    url: 'https://classicalking.streamguys1.com/king-fm-aac-iheart',
    grad: 'linear-gradient(135deg, #283c86, #45a247)'
  },
  {
    id: 'venice-classic',
    name: 'Venice Classic Radio',
    description: 'Italian classical music from Venice',
    genre: 'Classical',
    country: 'Italy',
    url: 'https://uk2.streamingpulse.com/ssl/vcr1',
    grad: 'linear-gradient(135deg, #43cea2, #185a9d)'
  },

  // ============== WORLD / INTERNATIONAL ==============
  {
    id: 'fip',
    name: 'FIP',
    description: 'Eclectic French radio · jazz, rock, world',
    genre: 'World',
    country: 'France',
    url: 'https://icecast.radiofrance.fr/fip-hifi.aac',
    grad: 'linear-gradient(135deg, #0052D4, #4364F7, #6FB1FC)'
  },
  {
    id: 'fip-rock',
    name: 'FIP Rock',
    description: 'Rock, indie and alternative · French selection',
    genre: 'Rock',
    country: 'France',
    url: 'https://icecast.radiofrance.fr/fiprock-hifi.aac',
    grad: 'linear-gradient(135deg, #c31432, #240b36)'
  },
  {
    id: 'fip-electro',
    name: 'FIP Electro',
    description: 'Electronic music · French curation',
    genre: 'Electronic',
    country: 'France',
    url: 'https://icecast.radiofrance.fr/fipelectro-hifi.aac',
    grad: 'linear-gradient(135deg, #16a085, #f4d03f)'
  },
  {
    id: 'fip-jazz',
    name: 'FIP Jazz',
    description: 'Jazz selections from FIP, France',
    genre: 'Jazz',
    country: 'France',
    url: 'https://icecast.radiofrance.fr/fipjazz-hifi.aac',
    grad: 'linear-gradient(135deg, #654ea3, #eaafc8)'
  },
  {
    id: 'fip-world',
    name: 'FIP Monde',
    description: 'World music from across the globe',
    genre: 'World',
    country: 'France',
    url: 'https://icecast.radiofrance.fr/fipworld-hifi.aac',
    grad: 'linear-gradient(135deg, #ff7e5f, #feb47b)'
  },

  // ============== NEWS / TALK ==============
  {
    id: 'bbc-world',
    name: 'BBC World Service',
    description: 'International news, analysis, and information',
    genre: 'News',
    country: 'UK',
    url: 'http://stream.live.vc.bbcmedia.co.uk/bbc_world_service',
    grad: 'linear-gradient(135deg, #BB0000, #5d0000)'
  },
  {
    id: 'npr-news',
    name: 'NPR News',
    description: 'Breaking news, in-depth reporting, and stories',
    genre: 'News',
    country: 'USA',
    url: 'https://npr-ice.streamguys1.com/live.mp3',
    grad: 'linear-gradient(135deg, #232526, #414345)'
  },
  {
    id: 'kexp',
    name: 'KEXP 90.3 FM',
    description: 'Where the music matters · Seattle',
    genre: 'Indie',
    country: 'USA',
    url: 'https://kexp-mp3-128.streamguys1.com/kexp128.mp3',
    grad: 'linear-gradient(135deg, #ff512f, #f09819)'
  },

  // ============== SOMA EXTRA ==============
  {
    id: 'soma-suburbs',
    name: 'Suburbs of Goa',
    description: 'Goa-trance, dub, ambient and downtempo',
    genre: 'Electronic',
    country: 'USA',
    url: 'https://ice1.somafm.com/suburbsofgoa-128-mp3',
    grad: 'linear-gradient(135deg, #ff9966, #ff5e62)'
  },
  {
    id: 'soma-folkforward',
    name: 'Folk Forward',
    description: 'Indie, alternative and classic folk',
    genre: 'Folk',
    country: 'USA',
    url: 'https://ice1.somafm.com/folkfwd-128-mp3',
    grad: 'linear-gradient(135deg, #56ab2f, #a8e063)'
  },
  {
    id: 'soma-illinoisstreet',
    name: 'Illinois Street Lounge',
    description: 'Classic bachelor pad, playful exotica and vintage',
    genre: 'Lounge',
    country: 'USA',
    url: 'https://ice1.somafm.com/illstreet-128-mp3',
    grad: 'linear-gradient(135deg, #f857a6, #ff5858)'
  },
  {
    id: 'soma-poptron',
    name: 'PopTron',
    description: 'Electropop and indie dance rock with sparkle',
    genre: 'Electronic',
    country: 'USA',
    url: 'https://ice1.somafm.com/poptron-128-mp3',
    grad: 'linear-gradient(135deg, #11998e, #38ef7d)'
  },
  {
    id: 'soma-metal',
    name: 'Metal Detector',
    description: 'From black to doom — heavy metal and beyond',
    genre: 'Metal',
    country: 'USA',
    url: 'https://ice1.somafm.com/metal-128-mp3',
    grad: 'linear-gradient(135deg, #232526, #c31432)'
  },
  {
    id: 'soma-7soul',
    name: 'Seven Inch Soul',
    description: 'Vintage soul tracks from the original 45 RPM vinyl',
    genre: 'Soul',
    country: 'USA',
    url: 'https://ice1.somafm.com/7soul-128-mp3',
    grad: 'linear-gradient(135deg, #cc2b5e, #753a88)'
  },
  {
    id: 'soma-u80s',
    name: 'Underground 80s',
    description: 'Early 80s UK Synthpop and a wee bit of New Wave',
    genre: '80s',
    country: 'USA',
    url: 'https://ice1.somafm.com/u80s-128-mp3',
    grad: 'linear-gradient(135deg, #fc466b, #3f5efb)'
  },
  {
    id: 'soma-christmas',
    name: 'Christmas Lounge',
    description: 'Chilled holiday grooves and classic lounge',
    genre: 'Lounge',
    country: 'USA',
    url: 'https://ice1.somafm.com/christmas-128-mp3',
    grad: 'linear-gradient(135deg, #134e5e, #ee0979)'
  },
  {
    id: 'soma-reggae',
    name: 'Heavyweight Reggae',
    description: 'Reggae, Ska, Rocksteady classic and modern',
    genre: 'Reggae',
    country: 'USA',
    url: 'https://ice1.somafm.com/reggae-128-mp3',
    grad: 'linear-gradient(135deg, #f7971e, #ffd200)'
  },
  {
    id: 'soma-vapor',
    name: 'Vaporwaves',
    description: 'All Vaporwave. All the time.',
    genre: 'Electronic',
    country: 'USA',
    url: 'https://ice1.somafm.com/vaporwaves-128-mp3',
    grad: 'linear-gradient(135deg, #ff6e7f, #bfe9ff)'
  }
];
