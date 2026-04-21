/* ============================================================
 * Wavelength · Podcast catalog
 * Curated list of popular podcasts with public RSS feeds.
 * Episodes are fetched live from each feed via a CORS proxy.
 * ============================================================ */

const PODCASTS = [
  // ============== NEWS & CURRENT AFFAIRS ==============
  {
    id: 'the-daily',
    name: 'The Daily',
    publisher: 'The New York Times',
    description: 'The biggest stories of our time, told by the best journalists.',
    category: 'News',
    feed: 'https://feeds.simplecast.com/54nAGcIl',
    grad: 'linear-gradient(135deg, #232526 0%, #414345 100%)'
  },
  {
    id: 'up-first',
    name: 'Up First',
    publisher: 'NPR',
    description: 'The news you need to start your day. In about 10 minutes.',
    category: 'News',
    feed: 'https://feeds.npr.org/510318/podcast.xml',
    grad: 'linear-gradient(135deg, #BB0000 0%, #5d0000 100%)'
  },
  {
    id: 'global-news',
    name: 'Global News Podcast',
    publisher: 'BBC World Service',
    description: 'The day\'s top stories from BBC News compiled twice daily.',
    category: 'News',
    feed: 'https://podcasts.files.bbci.co.uk/p02nq0gn.rss',
    grad: 'linear-gradient(135deg, #c31432 0%, #240b36 100%)'
  },

  // ============== SCIENCE ==============
  {
    id: 'radiolab',
    name: 'Radiolab',
    publisher: 'WNYC Studios',
    description: 'Investigating a strange world through sound and stories.',
    category: 'Science',
    feed: 'https://feeds.simplecast.com/EmVW7VGp',
    grad: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)'
  },
  {
    id: 'hidden-brain',
    name: 'Hidden Brain',
    publisher: 'Hidden Brain Media',
    description: 'Unconscious patterns that drive human behavior.',
    category: 'Science',
    feed: 'https://feeds.simplecast.com/tWvF78ij',
    grad: 'linear-gradient(135deg, #4a00e0 0%, #8e2de2 100%)'
  },
  {
    id: 'science-friday',
    name: 'Science Friday',
    publisher: 'Science Friday',
    description: 'Brain fun for curious people.',
    category: 'Science',
    feed: 'https://feeds.feedburner.com/science-friday',
    grad: 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)'
  },
  {
    id: 'huberman-lab',
    name: 'Huberman Lab',
    publisher: 'Scicomm Media',
    description: 'Neuroscience-based tools for everyday life.',
    category: 'Science',
    feed: 'https://feeds.megaphone.fm/hubermanlab',
    grad: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)'
  },

  // ============== TECH ==============
  {
    id: 'darknet-diaries',
    name: 'Darknet Diaries',
    publisher: 'Jack Rhysider',
    description: 'True stories from the dark side of the internet.',
    category: 'Tech',
    feed: 'https://feeds.megaphone.fm/darknetdiaries',
    grad: 'linear-gradient(135deg, #0a0a0a 0%, #00ff87 100%)'
  },
  {
    id: 'lex-fridman',
    name: 'Lex Fridman Podcast',
    publisher: 'Lex Fridman',
    description: 'Long-form conversations about AI, science, tech, history.',
    category: 'Tech',
    feed: 'https://lexfridman.com/feed/podcast/',
    grad: 'linear-gradient(135deg, #141e30 0%, #243b55 100%)'
  },
  {
    id: 'hard-fork',
    name: 'Hard Fork',
    publisher: 'The New York Times',
    description: 'A show about the future that\'s already here.',
    category: 'Tech',
    feed: 'https://feeds.simplecast.com/l2i9YnTd',
    grad: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)'
  },

  // ============== BUSINESS / ECONOMICS ==============
  {
    id: 'planet-money',
    name: 'Planet Money',
    publisher: 'NPR',
    description: 'The economy, explained. With stories and surprises.',
    category: 'Business',
    feed: 'https://feeds.npr.org/510289/podcast.xml',
    grad: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)'
  },
  {
    id: 'how-i-built-this',
    name: 'How I Built This',
    publisher: 'NPR',
    description: 'Stories behind the world\'s best-known companies.',
    category: 'Business',
    feed: 'https://feeds.npr.org/510313/podcast.xml',
    grad: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)'
  },
  {
    id: 'freakonomics',
    name: 'Freakonomics Radio',
    publisher: 'Freakonomics Radio + Stitcher',
    description: 'Explores the hidden side of everything.',
    category: 'Business',
    feed: 'https://feeds.simplecast.com/Y8lFbOT4',
    grad: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)'
  },

  // ============== STORYTELLING / CULTURE ==============
  {
    id: 'this-american-life',
    name: 'This American Life',
    publisher: 'This American Life',
    description: 'First-person stories and short fiction.',
    category: 'Storytelling',
    feed: 'https://www.thisamericanlife.org/podcast/rss.xml',
    grad: 'linear-gradient(135deg, #cc2b5e 0%, #753a88 100%)'
  },
  {
    id: '99pi',
    name: '99% Invisible',
    publisher: 'Roman Mars',
    description: 'A tiny podcast about design and the built world.',
    category: 'Culture',
    feed: 'https://feeds.simplecast.com/BqbsxVfO',
    grad: 'linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)'
  },
  {
    id: 'song-exploder',
    name: 'Song Exploder',
    publisher: 'Hrishikesh Hirway',
    description: 'Musicians take apart their songs, piece by piece.',
    category: 'Culture',
    feed: 'https://feeds.simplecast.com/RTnvmqaC',
    grad: 'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)'
  },
  {
    id: 'ted-talks-daily',
    name: 'TED Talks Daily',
    publisher: 'TED',
    description: 'Every weekday, a new idea from the world\'s most inspiring speakers.',
    category: 'Culture',
    feed: 'https://feeds.feedburner.com/TEDTalks_audio',
    grad: 'linear-gradient(135deg, #e52d27 0%, #b31217 100%)'
  },

  // ============== HISTORY ==============
  {
    id: 'hardcore-history',
    name: 'Hardcore History',
    publisher: 'Dan Carlin',
    description: 'Deep, marathon-length dives into history\'s turning points.',
    category: 'History',
    feed: 'https://feeds.feedburner.com/dancarlin/history',
    grad: 'linear-gradient(135deg, #4b0000 0%, #141414 100%)'
  },
  {
    id: 'throughline',
    name: 'Throughline',
    publisher: 'NPR',
    description: 'The past is never past. History that connects the now.',
    category: 'History',
    feed: 'https://feeds.npr.org/510333/podcast.xml',
    grad: 'linear-gradient(135deg, #f46b45 0%, #eea849 100%)'
  },

  // ============== COMEDY / INTERVIEW ==============
  {
    id: 'conan-needs-a-friend',
    name: 'Conan O\'Brien Needs a Friend',
    publisher: 'Team Coco',
    description: 'Conan tries to make friends with celebrities he has thirty minutes to know.',
    category: 'Comedy',
    feed: 'https://feeds.simplecast.com/dHoohVNH',
    grad: 'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)'
  },
  {
    id: 'smartless',
    name: 'SmartLess',
    publisher: 'Wondery',
    description: 'Jason Bateman, Sean Hayes, and Will Arnett surprise each other with guests.',
    category: 'Comedy',
    feed: 'https://rss.art19.com/smartless',
    grad: 'linear-gradient(135deg, #16a085 0%, #f4d03f 100%)'
  },

  // ============== TRUE CRIME / INVESTIGATION ==============
  {
    id: 'serial',
    name: 'Serial',
    publisher: 'Serial Productions & The New York Times',
    description: 'One story told week by week. The podcast that launched a genre.',
    category: 'True Crime',
    feed: 'https://feeds.simplecast.com/xl36XBC2',
    grad: 'linear-gradient(135deg, #c94b4b 0%, #4b134f 100%)'
  },
  {
    id: 'criminal',
    name: 'Criminal',
    publisher: 'Vox Media',
    description: 'Stories of people who\'ve done wrong, been wronged, or gotten caught in the middle.',
    category: 'True Crime',
    feed: 'https://feeds.simplecast.com/MsCl_8vw',
    grad: 'linear-gradient(135deg, #232526 0%, #c31432 100%)'
  }
];
