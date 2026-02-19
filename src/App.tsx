import { useState, useEffect, useRef, useCallback, createContext, useContext, memo, Suspense, type ReactNode } from 'react';

/* ════════════════════════════════════════════════════════
   TYPES
   ════════════════════════════════════════════════════════ */

interface Track {
  id: string;
  name: string;
  artists: string;
  cover: string;
  audio: string;

  yandex: string | null;
  spotify: string | null;
  apple: string | null;
  vk: string | null;
  ytmusic: string | null;
  rutube: string | null;
  genius: string | null;
}

interface Demo {
  name: string;
  file: string;
}

interface PlaylistItem {
  id: string;
  name: string;
  artist: string;
  audioSrc: string;
  cover: string | null;
  type: 'podcast' | 'track' | 'demo';
}

type PlaybackOrder = 'sequential' | 'shuffle';
type PlayerVisibility = 'hidden' | 'entering' | 'visible' | 'exiting';

interface FirePosition {
  id: number;
  x: number;
  y: number;
  found: boolean;
  poofing: boolean;
}

type GamePhase = 'idle' | 'exploding' | 'hunting' | 'done';

/* ════════════════════════════════════════════════════════
   DATA
   ════════════════════════════════════════════════════════ */

const TRACKS: Track[] = [
  {
    id: 'dermo',
    name: 'Дерьмо',
    artists: 'LIL CYFRAL, frogboi',
    cover: 'Cyfral-site/tracks_covers/Дерьмо/Дерьмо.jpg',
    audio: 'Cyfral-site/tracks_covers/Дерьмо/LIL CYFRAL, frogboi — Дерьмо (www.lightaudio.ru).mp3',
    yandex: 'https://music.yandex.ru/album/33703399/track/132171496?utm_source=web&utm_medium=copy_link',
    spotify: 'https://open.spotify.com/track/14zM5ihN13PYs064sBVSgB?si=vJXIp7erQK-HWjg5kapc9A',
    apple: 'https://music.apple.com/us/album/%D0%B4-%D0%BE-single/1775507047',
    vk: 'https://vk.com/audio-2001645569_131645569',
    ytmusic: null,
    rutube: null,
    genius: null,
  },
  {
    id: 'fl-studio-diss',
    name: 'FL STUDIO DISS',
    artists: 'KOMERSS, RJK, Lil Cyfral, SSinner31',
    cover: 'Cyfral-site/tracks_covers/FL STUDIO DISS/FL STUDIO DISS.jpg',
    audio: 'Cyfral-site/tracks_covers/FL STUDIO DISS/KOMERSS, RJK, Lil Cyfral, SSinner31 — FL STUDIO DISS (www.lightaudio.ru).mp3',
    yandex: 'https://music.yandex.ru/album/38152175/track/142744408?utm_source=web&utm_medium=copy_link',
    spotify: 'https://open.spotify.com/track/0HZGjmmKK07i9ZYhwkF6jY?si=ayD-JPzVSdWj26WDxbanZQ',
    apple: null,
    vk: 'https://vk.com/audio-2001831485_142831485',
    ytmusic: 'https://music.youtube.com/watch?v=Jt2Djzm0WTw&si=h38y8U1O1KPhggmi',
    rutube: null,
    genius: null,
  },
  {
    id: 'fl-diss',
    name: 'FL Diss',
    artists: 'LIL CYFRAL, RJK, ssinner31 feat. Shelby',
    cover: 'Cyfral-site/tracks_covers/FL diss/FL_diss.jpg',
    audio: 'Cyfral-site/tracks_covers/FL diss/LIL CYFRAL, RJK, ssinner31 — Fl Diss (feat. Shelby) (www.lightaudio.ru).mp3',
    yandex: 'https://music.yandex.ru/album/33673041/track/132094660?utm_source=web&utm_medium=copy_link',
    spotify: 'https://open.spotify.com/track/2v6oKYOYL8hYNQTMU3mR9c?si=UNsbQOJOQpOffMztib4HlA',
    apple: 'https://music.apple.com/us/album/fl-diss-feat-shelby-single/1775141211',
    vk: 'https://vk.com/audio-2001582793_131582793',
    ytmusic: null,
    rutube: null,
    genius: 'https://genius.com/Lil-cyfral-rjk-and-31sinnr-fl-diss-lyrics',
  },
  {
    id: 'liga',
    name: 'Лига АШАНного интернета',
    artists: 'LIL CYFRAL',
    cover: 'Cyfral-site/tracks_covers/Лига АШАНного интернета/Лига_АШАНного_интернета.png',
    audio: 'Cyfral-site/tracks_covers/Лига АШАНного интернета/LIL CYFRAL — Лига АШАНного интернета (www.lightaudio.ru).mp3',
    yandex: 'https://music.yandex.ru/album/27407855/track/117440020?utm_source=web&utm_medium=copy_link',
    spotify: 'https://open.spotify.com/track/00PT2QxEzdSNY6kPFZDff9?si=_uPb4N1gR-CYaGdKZSJgcQ',
    apple: 'https://music.apple.com/us/album/%D0%BB%D0%B8%D0%B3%D0%B0-%D0%B0%D1%88%D0%B0%D0%BD%D0%BD%D0%BE%D0%B3%D0%BE-%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D0%BD%D0%B5%D1%82%D0%B0-single/1709088372',
    vk: 'https://vk.com/audio-2001614478_122614478',
    ytmusic: null,
    rutube: null,
    genius: 'https://genius.com/Lil-cyfral--lyrics',
  },
  {
    id: 'ashan-monstry',
    name: 'Ашан-монстры',
    artists: 'lil cyfral, RJK',
    cover: 'Cyfral-site/tracks_covers/Ашан-монстры/Ашан-монстры.jpg',
    audio: 'Cyfral-site/tracks_covers/Ашан-монстры/lil cyfral, RJK — Ашан-монстры (www.lightaudio.ru).mp3',
    yandex: 'https://music.yandex.ru/album/36319100/track/138430749?utm_source=web&utm_medium=copy_link',
    spotify: null,
    apple: 'https://music.apple.com/us/album/%D0%B0%D1%88%D0%B0%D0%BD-%D0%BC%D0%BE%D0%BD%D1%81%D1%82%D1%80%D1%8B-single/1835477210',
    vk: 'https://vk.com/audio-2001097011_136097011',
    ytmusic: null,
    rutube: null,
    genius: null,
  },
  {
    id: 'auchan',
    name: 'Ашан',
    artists: 'Ьомаье, Am-nyam, DJ_писюн, rjk, ssixty (Dj urodou), lil cyfral, ordistate',
    cover: 'Cyfral-site/tracks_covers/Auchan/Ашан.jpg',
    audio: 'Cyfral-site/tracks_covers/Auchan/Auchan.mp3',
    yandex: 'https://music.yandex.ru/album/26069724?utm_source=web&utm_medium=copy_link',
    spotify: 'https://open.spotify.com/album/78z0OnBYJlD1llyxzH4x90?si=Lq2HbnyZQz-3tZkfVc4YJw',
    apple: 'https://music.apple.com/us/album/%D0%B0%D1%88%D0%B0%D0%BD-single/1693062878',
    vk: null,
    ytmusic: 'https://music.youtube.com/watch?v=5K2XWEluSEo&si=CA9NuQGV4oTA9bLo',
    rutube: 'https://rutube.ru/video/b779832dd39f7e29a3be7bd6a49aa61a/',
    genius: 'https://genius.com/Rjk--lyrics',
  },
  {
    id: 'lil-cyfral-is',
    name: 'LIL CYFRAL$i$',
    artists: 'LIL CYFRAL',
    cover: 'Cyfral-site/tracks_covers/Lil Cyfral$i$/Lil Cyfral$i$.jpg',
    audio: 'Cyfral-site/tracks_covers/Lil Cyfral$i$/Lil Cyfral$i$.mp3',
    yandex: null,
    spotify: null,
    apple: null,
    vk: null,
    ytmusic: null,
    rutube: null,
    genius: 'https://genius.com/Lil-cyfral-lil-cyfral-i-lyrics',
  },
  {
    id: 'molodesh-cypher',
    name: "MOLODES'H CYPHER 2",
    artists: 'ИП CHUGUN, Eletr, Hidji 17, LIL CYFRAL, проснулся счастливым, Shelby, Ione, Rouge_Frelon',
    cover: "Cyfral-site/tracks_covers/MOLODES'H CYPHER 2/MOLODES'H CYPHER 2.jpg",
    audio: "Cyfral-site/tracks_covers/MOLODES'H CYPHER 2/ИП CHUGUN, Eletr, Hidji 17, LIL CYFRAL, проснулся счастливым, Shelby, Ione, Rouge_Frelon — MOLODES'H CYPHER 2 (www.lightaudio.ru).mp3",
    yandex: 'https://music.yandex.ru/album/36215430?utm_source=web&utm_medium=copy_link',
    spotify: 'https://open.spotify.com/album/7tKhQOkL1azWD0EySN6Cyt?si=VomgyUTETtqtGQ_A7SA3dA',
    apple: 'https://music.apple.com/us/album/molodesh-cypher-2-single/1807537843',
    vk: 'https://vk.com/audio-2001834916_135834916',
    ytmusic: 'https://music.youtube.com/watch?v=qQg5tqxOh3c&si=2E0ZXTzUdnxrdnaW',
    rutube: null,
    genius: null,
  },
];

/* ════════════════════════════════════════════════════════
   TRACK SEGMENTS — DYNAMIC LOADING FROM тайминги.txt
   ════════════════════════════════════════════════════════ */

interface TrackSegment {
  startSec: number;
  artist: string;
  color: string;
}

// Color name → hex mapping
const COLOR_MAP: Record<string, string> = {
  GRAY: '#666666',
  RED: '#ff0033',
  GREEN: '#00ff41',
  DARK_GREEN: '#008822',
  YELLOW: '#ffcc00',
  LIGHT_BLUE: '#00ccff',
  BLUE: '#0066ff',
  WHITE: '#ffffff',
  PINK: '#ff00ff',
  ORANGE: '#ff6600',
  PURPLE: '#9933ff',
  BLACK: '#333333',
};

// Parse "MM:SS" or "M:SS" to seconds
function parseTimeToSeconds(timeStr: string): number {
  const parts = timeStr.trim().split(':');
  if (parts.length === 2) {
    const mins = parseInt(parts[0], 10);
    const secs = parseInt(parts[1], 10);
    return mins * 60 + secs;
  }
  return 0;
}

// Parse тайминги.txt content
function parseTimingsFile(content: string): TrackSegment[] {
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  const segments: TrackSegment[] = [];
  
  for (const line of lines) {
    // Format: "MM:SS - Artist Name - COLOR"
    const parts = line.split(' - ');
    if (parts.length >= 3) {
      const timeStr = parts[0].trim();
      const artist = parts[1].trim();
      const colorName = parts[2].trim().toUpperCase();
      
      const startSec = parseTimeToSeconds(timeStr);
      const color = COLOR_MAP[colorName] || '#666666';
      
      segments.push({ startSec, artist, color });
    }
  }
  
  // Sort by start time
  segments.sort((a, b) => a.startSec - b.startSec);
  
  return segments;
}

// Map track IDs to their folder paths (for loading тайминги.txt)
const TRACK_FOLDER_MAP: Record<string, string> = {
  'dermo': 'Cyfral-site/tracks_covers/Дерьмо',
  'fl-studio-diss': 'Cyfral-site/tracks_covers/FL STUDIO DISS',
  'fl-diss': 'Cyfral-site/tracks_covers/FL diss',
  'liga': 'Cyfral-site/tracks_covers/Лига АШАНного интернета',
  'ashan-monstry': 'Cyfral-site/tracks_covers/Ашан-монстры',
  'auchan': 'Cyfral-site/tracks_covers/Auchan',
  'lil-cyfral-is': 'Cyfral-site/tracks_covers/Lil Cyfral$i$',
  'molodesh-cypher': "Cyfral-site/tracks_covers/MOLODES'H CYPHER 2",
};

// Cache for loaded segments
const segmentsCache: Record<string, TrackSegment[] | null> = {};
const loadingPromises: Record<string, Promise<TrackSegment[] | null>> = {};

// Load segments from file (with caching)
async function loadTrackSegments(trackId: string): Promise<TrackSegment[] | null> {
  // Check cache first
  if (segmentsCache[trackId] !== undefined) {
    return segmentsCache[trackId];
  }
  
  // Check if already loading
  if (trackId in loadingPromises) {
    return loadingPromises[trackId];
  }
  
  const folderPath = TRACK_FOLDER_MAP[trackId];
  if (!folderPath) {
    segmentsCache[trackId] = null;
    return null;
  }
  
  const timingsUrl = `${folderPath}/тайминги.txt`;
  
  loadingPromises[trackId] = fetch(timingsUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('File not found');
      }
      return response.text();
    })
    .then(content => {
      const segments = parseTimingsFile(content);
      segmentsCache[trackId] = segments.length > 0 ? segments : null;
      return segmentsCache[trackId];
    })
    .catch(() => {
      segmentsCache[trackId] = null;
      return null;
    })
    .finally(() => {
      delete loadingPromises[trackId];
    });
  
  return loadingPromises[trackId];
}

// Hook to use track segments
function useTrackSegments(trackId: string | null): TrackSegment[] | null {
  const [segments, setSegments] = useState<TrackSegment[] | null>(null);
  
  useEffect(() => {
    if (!trackId) {
      setSegments(null);
      return;
    }
    
    // Check cache first (sync)
    if (segmentsCache[trackId] !== undefined) {
      setSegments(segmentsCache[trackId]);
      return;
    }
    
    // Load async
    loadTrackSegments(trackId).then(segs => {
      setSegments(segs);
    });
  }, [trackId]);
  
  return segments;
}

// Helper: get current segment based on time
function getSegmentAtTime(segments: TrackSegment[], currentTime: number): TrackSegment {
  for (let i = segments.length - 1; i >= 0; i--) {
    if (currentTime >= segments[i].startSec) {
      return segments[i];
    }
  }
  return segments[0];
}

const DEMOS: Demo[] = [
  { name: 'babos', file: 'babos.mp3' },
  { name: 'BABY INTALENGENCE', file: 'BABY INTALENGENCE.mp3' },
  { name: 'BIG CYFRAL REP x KYFRALY frystail', file: 'BIG CYFRAL REP x KYFRALY frystail.mp3' },
  { name: 'CHASTYSHKI_4', file: 'CHASTYSHKI_4.mp3' },
  { name: 'COLOR GLITCH CORE cyfral', file: 'COLOR GLITCH CORE cyfral.mp3' },
  { name: 'DEN HOUP DISS 1000000', file: 'DEN HOUP DISS 1000000.mp3' },
  { name: 'DRIILL CYFRAL_2', file: 'DRIILL CYFRAL_2.mp3' },
  { name: 'DRILLOCHEK LIL CYFRAL', file: 'DRILLOCHEK LIL CYFRAL.mp3' },
  { name: 'FINE PRINT LIL FRISTAIL', file: 'FINE PRINT LIL FRISTAIL.mp3' },
  { name: 'FINGER CYFRAL', file: 'FINGER CYFRAL.mp3' },
  { name: 'FOTON 4', file: 'FOTON 4.mp3' },
  { name: 'GLITCH CORE cyfral', file: 'GLITCH CORE cyfral.mp3' },
  { name: 'GTA FREESTYLE', file: 'GTA FREESTYLE.mp3' },
  { name: 'LESHA BISTRIK IDI NAXYI', file: 'LESHA BISTRIK IDI NAXYI.mp3' },
  { name: 'LIL CYFRAL - DEFKA (REMIX by KORMAN ROTELNIKOV)', file: 'LIL CYFRAL - DEFKA (REMIX by KORMAN ROTELNIKOV).mp3' },
  { name: 'LIL CYFRAL nakidal PIZDYLEY', file: 'LIL CYFRAL nakidal PIZDYLEY.mp3' },
  { name: 'LIL CYFRAL x REPER', file: 'LIL CYFRAL x REPER.mp3' },
  { name: 'lyryCAL', file: 'lyryCAL.mp3' },
  { name: 'MAKS NAXYI CYFRAL', file: 'MAKS NAXYI CYFRAL.mp3' },
  { name: 'NIY CIFRALCHIK', file: 'NIY CIFRALCHIK.mp3' },
  { name: 'SPISOK CYFLERRA', file: 'SPISOK CYFLERRA.mp3' },
  { name: 'гриме', file: 'гриме.mp3' },
  { name: 'джерк кал', file: 'джерк кал.mp3' },
  { name: 'еииаеа', file: 'еииаеа.mp3' },
  { name: 'ФИТОК ДЕМКА', file: 'ФИТОК ДЕМКА.mp3' },
  { name: 'чимичанга', file: 'чимичанга.mp3' },
];

/* ════════════════════════════════════════════════════════
   BUILD PLAYLIST
   ════════════════════════════════════════════════════════ */

function buildPlaylist(): PlaylistItem[] {
  const items: PlaylistItem[] = [];
  items.push({
    id: 'podcast',
    name: 'Подкаст с Lil Cyfral',
    artist: 'Lil Cyfral',
    audioSrc: 'Cyfral-site/podcast.mp3',
    cover: null,
    type: 'podcast',
  });
  TRACKS.forEach((t) =>
    items.push({
      id: t.id,
      name: t.name,
      artist: t.artists,
      audioSrc: t.audio,
      cover: t.cover,
      type: 'track',
    })
  );
  DEMOS.forEach((d, i) =>
    items.push({
      id: `demo-${i}`,
      name: d.name,
      artist: 'Lil Cyfral',
      audioSrc: `Cyfral-site/демки/${d.file}`,
      cover: null,
      type: 'demo',
    })
  );
  return items;
}

const MASTER_PLAYLIST = buildPlaylist();

/* ════════════════════════════════════════════════════════
   UTILITIES
   ════════════════════════════════════════════════════════ */

function formatTime(s: number): string {
  if (isNaN(s) || s < 0) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

const GRAFFITI: React.CSSProperties = { fontFamily: "'Permanent Marker', cursive" };

function SeekFlashBadge({ leftPct }: { leftPct: number }) {
  const { seekFlash } = usePlayer();
  if (!seekFlash) return null;

  const label = seekFlash.deltaSec > 0 ? `+${seekFlash.deltaSec} сек` : `${seekFlash.deltaSec} сек`;

  return (
    <div
      key={seekFlash.id}
      className="seek-flash"
      style={{ left: `${leftPct}%` }}
    >
      {label}
    </div>
  );
}

const GLITCH_CORE_NAMES = ['GLITCH CORE cyfral', 'COLOR GLITCH CORE cyfral'];

/* ════════════════════════════════════════════════════════
   GRUNGE SVG ICONS
   ════════════════════════════════════════════════════════ */

function IconPrev({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 5.5L6 18.5" strokeWidth="3" />
      <path d="M19.5 4.5L9 11.5L10 12.5L9.5 12L19 19.5L19.5 4.5Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
      <line x1="12" y1="9" x2="16" y2="10" strokeWidth="0.7" opacity="0.3" />
    </svg>
  );
}

function IconNext({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 4.5L15 11.5L14 12.5L14.5 12L5 19.5L4.5 4.5Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
      <path d="M17.5 5.5L18 18.5" strokeWidth="3" />
      <line x1="8" y1="9" x2="12" y2="10" strokeWidth="0.7" opacity="0.3" />
    </svg>
  );
}

function IconPlay({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeLinejoin="round">
      <path d="M7 4.5L7.5 5L20 11.5L19.5 12.5L20 12L7.5 19.5L7 19L7 4.5Z" strokeWidth="1" />
    </svg>
  );
}

function IconPause({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeLinejoin="round">
      <path d="M6.5 4L10 4.5L10.5 19.5L6 20L6.5 4Z" strokeWidth="0.8" />
      <path d="M14 4.5L17.5 4L17 20L13.5 19.5L14 4.5Z" strokeWidth="0.8" />
    </svg>
  );
}

function IconQueue({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round">
      <path d="M3.5 6.5L20.5 6" strokeWidth="2.5" />
      <path d="M3 12.5L17 12" strokeWidth="2.5" />
      <path d="M4 18L14.5 18.5" strokeWidth="2.5" />
      <circle cx="19" cy="15" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="18" cy="18.5" r="0.8" fill="currentColor" stroke="none" opacity="0.5" />
    </svg>
  );
}

function IconClose({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round">
      <path d="M4.5 4L20 20.5" strokeWidth="3" />
      <path d="M20 4.5L4 20" strokeWidth="3" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" opacity="0.15" />
    </svg>
  );
}

function IconSequential({ className = 'queue-mode-icon' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12.5L18 12" strokeWidth="2.5" />
      <path d="M14 7L19.5 12L14 17" strokeWidth="2.5" />
    </svg>
  );
}

function IconShuffle({ className = 'queue-mode-icon' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7.5L14 17" strokeWidth="2" />
      <path d="M3 17L14 7" strokeWidth="2" />
      <path d="M17 5L21 7.5L17 10" strokeWidth="2" />
      <path d="M17 14.5L21 17L17 19.5" strokeWidth="2" />
      <path d="M14 7L21 7.5" strokeWidth="2" />
      <path d="M14 17L21 17" strokeWidth="2" />
    </svg>
  );
}

function IconExcursion({ className = 'queue-mode-icon' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="13" r="8.5" strokeWidth="2" />
      <path d="M12 9L12 13.5L15.5 15" strokeWidth="2" />
      <path d="M9 3L15 3.5" strokeWidth="2" />
      <path d="M18 2L16 6.5L19 6L17 10" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function IconAutoOn({ className = 'queue-mode-icon' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 4L20.5 7.5L17 11" strokeWidth="2" />
      <path d="M20 7.5L8 7.5C5.5 7.5 4 9.5 4 12" strokeWidth="2" />
      <path d="M7 20L3.5 16.5L7 13" strokeWidth="2" />
      <path d="M4 16.5L16 16.5C18.5 16.5 20 14.5 20 12" strokeWidth="2" />
    </svg>
  );
}

function IconAutoOff({ className = 'queue-mode-icon' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 5.5L17.5 5L18 19L5.5 18.5L6.5 5.5Z" strokeWidth="2.5" fill="currentColor" fillOpacity="0.15" />
      <line x1="8" y1="9" x2="16" y2="9.5" strokeWidth="0.6" opacity="0.2" />
    </svg>
  );
}

/* ════════════════════════════════════════════════════════
   PLAYER CONTEXT
   ════════════════════════════════════════════════════════ */

interface PlayerCtx {
  currentItem: PlaylistItem | null;
  isPlaying: boolean;
  progress: number;
  currentTime: number;
  duration: number;

  // transient UI hint for keyboard seeking
  seekFlash: { id: number; deltaSec: number } | null;

  playbackOrder: PlaybackOrder;
  excursionOn: boolean;
  autoAdvance: boolean;

  queue: PlaylistItem[];
  currentQueueIndex: number;
  playerVis: PlayerVisibility;
  showQueue: boolean;
  excursionRemaining: number;
  
  // Fullscreen player
  isFullscreen: boolean;
  setIsFullscreen: (v: boolean) => void;
  audioLevel: number; // 0-1 for visualization

  playItemById: (id: string) => void;
  togglePlay: () => void;
  seekTo: (pct: number) => void;
  seekBySec: (deltaSec: number) => void;
  next: () => void;
  prev: () => void;

  setOrder: (o: PlaybackOrder) => void;
  setExcursionOn: (v: boolean) => void;
  setAutoAdvance: (v: boolean) => void;

  moveQueueItem: (fromIdx: number, dir: 'up' | 'down') => void;
  reorderQueue: (fromIdx: number, toIdx: number) => void;
  closePlayer: () => void;
  setShowQueue: (v: boolean) => void;
}

const PlayerContext = createContext<PlayerCtx>(null!);
const usePlayer = () => useContext(PlayerContext);

/* ════════════════════════════════════════════════════════
   PLAYER PROVIDER
   ════════════════════════════════════════════════════════ */

function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [queue, setQueue] = useState<PlaylistItem[]>([...MASTER_PLAYLIST]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [playbackOrder, setPlaybackOrder] = useState<PlaybackOrder>('sequential');
  const [excursionOn, setExcursionOnState] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);

  const [playerVis, setPlayerVis] = useState<PlayerVisibility>('hidden');
  const [showQueue, setShowQueue] = useState(false);
  const [excursionRemaining, setExcursionRemaining] = useState(0);
  
  // Fullscreen player state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  // Keyboard seek flash (±5s)
  const [seekFlash, setSeekFlash] = useState<{ id: number; deltaSec: number } | null>(null);
  const seekFlashIdRef = useRef(0);
  const seekFlashTimeoutRef = useRef<number | null>(null);
  const lastKeyboardSeekRef = useRef(0);



  const queueRef = useRef(queue);
  const indexRef = useRef(currentQueueIndex);
  const orderRef = useRef(playbackOrder);
  const excursionRef = useRef(excursionOn);
  const autoAdvRef = useRef(autoAdvance);
  const visRef = useRef(playerVis);

  const excursionStartRef = useRef(0);
  const excursionAdvancingRef = useRef(false);

  useEffect(() => { queueRef.current = queue; }, [queue]);
  useEffect(() => { indexRef.current = currentQueueIndex; }, [currentQueueIndex]);
  useEffect(() => { orderRef.current = playbackOrder; }, [playbackOrder]);
  useEffect(() => { excursionRef.current = excursionOn; }, [excursionOn]);
  useEffect(() => { autoAdvRef.current = autoAdvance; }, [autoAdvance]);
  useEffect(() => { visRef.current = playerVis; }, [playerVis]);

  // Audio visualization using Web Audio API
  const setupAudioAnalyser = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || sourceRef.current) return; // Already connected
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      
      if (!analyserRef.current) {
        analyserRef.current = ctx.createAnalyser();
        analyserRef.current.fftSize = 256;
        analyserRef.current.smoothingTimeConstant = 0.8;
      }
      
      if (!sourceRef.current) {
        sourceRef.current = ctx.createMediaElementSource(audio);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(ctx.destination);
      }
    } catch (e) {
      console.warn('Web Audio API not supported:', e);
    }
  }, []);

  // Throttled audio level update — only when fullscreen is open
  const lastAudioLevelUpdate = useRef(0);
  const updateAudioLevel = useCallback(() => {
    if (!analyserRef.current || !isPlaying || !isFullscreen) {
      setAudioLevel(0);
      return;
    }

    // Throttle to ~30fps for audio visualization (smoother than 60fps but less CPU)
    const now = performance.now();
    if (now - lastAudioLevelUpdate.current < 33) {
      animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      return;
    }
    lastAudioLevelUpdate.current = now;
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // Calculate average level (focus on bass/mid frequencies for punch)
    let sum = 0;
    const relevantBins = Math.min(bufferLength, 32); // Focus on lower frequencies
    for (let i = 0; i < relevantBins; i++) {
      sum += dataArray[i];
    }
    const average = sum / relevantBins / 255; // Normalize to 0-1
    
    setAudioLevel(average);
    
    animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
  }, [isPlaying, isFullscreen]);

  // Start/stop audio level animation based on playing state
  useEffect(() => {
    if (isPlaying && isFullscreen) {
      setupAudioAnalyser();
      animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      setAudioLevel(0);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, isFullscreen, setupAudioAnalyser, updateAudioLevel]);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'metadata';
      audioRef.current.crossOrigin = 'anonymous'; // Needed for Web Audio API
    }
    const audio = audioRef.current;

    // Throttled time update to reduce re-renders
    let lastTimeUpdateCall = 0;
    const onTimeUpdate = () => {
      const now = performance.now();
      // Throttle to ~10Hz for progress updates (every 100ms)
      if (now - lastTimeUpdateCall < 100) return;
      lastTimeUpdateCall = now;

      setCurrentTime(audio.currentTime);
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);

      if (excursionRef.current) {
        const end = excursionStartRef.current + 10;
        const remaining = Math.max(0, Math.ceil(end - audio.currentTime));
        setExcursionRemaining(remaining);

        if (!excursionAdvancingRef.current && audio.currentTime >= end) {
          excursionAdvancingRef.current = true;
          advance();
        }
      }
    };

    const onMeta = () => {
      setDuration(audio.duration);
      excursionAdvancingRef.current = false;

      if (!excursionRef.current) {
        setExcursionRemaining(0);
        return;
      }

      if (!isNaN(audio.duration) && audio.duration > 10.5) {
        const start = Math.random() * Math.max(0, audio.duration - 10.1);
        audio.currentTime = start;
        excursionStartRef.current = start;
        setExcursionRemaining(10);
      } else {
        audio.currentTime = 0;
        excursionStartRef.current = 0;
        setExcursionRemaining(10);
      }
    };

    const onEnded = () => advance();
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function advance() {
    if (!autoAdvRef.current) {
      audioRef.current?.pause();
      return;
    }
    const q = queueRef.current;
    const idx = indexRef.current;
    const order = orderRef.current;

    if (order === 'shuffle') {
      // Simple shuffle — pick any random track (including podcast)
      if (q.length <= 1) return;
      let nextIdx: number;
      do { nextIdx = Math.floor(Math.random() * q.length); } while (nextIdx === idx);
      loadAndPlay(nextIdx);
    } else {
      // Sequential — just go to next
      const nextIdx = idx + 1;
      if (nextIdx < q.length) loadAndPlay(nextIdx);
      else audioRef.current?.pause();
    }
  }

  function loadAndPlay(index: number) {
    const item = queueRef.current[index];
    if (!item || !audioRef.current) return;
    excursionAdvancingRef.current = false;
    indexRef.current = index;
    setCurrentQueueIndex(index);
    const audio = audioRef.current;
    audio.src = item.audioSrc;
    audio.load();
    audio.play().catch(() => {});
  }

  function playItemById(id: string) {
    const idx = queueRef.current.findIndex((i) => i.id === id);
    if (idx === -1) return;
    const vis = visRef.current;
    if (vis === 'hidden' || vis === 'exiting') {
      setPlayerVis('entering');
      visRef.current = 'entering';
      setTimeout(() => {
        setPlayerVis('visible');
        visRef.current = 'visible';
      }, 2500);
    }
    if (idx === indexRef.current && audioRef.current?.src) {
      audioRef.current.play().catch(() => {});
    } else {
      loadAndPlay(idx);
    }
  }

  function togglePlay() {
    const a = audioRef.current;
    if (!a) return;
    if (isPlaying) a.pause();
    else a.play().catch(() => {});
  }

  function seekTo(pct: number) {
    const a = audioRef.current;
    if (!a || !a.duration) return;
    a.currentTime = (pct / 100) * a.duration;
    if (excursionRef.current) {
      excursionStartRef.current = a.currentTime;
      excursionAdvancingRef.current = false;
      setExcursionRemaining(10);
    }
  }

  function seekBySec(deltaSec: number) {
    const a = audioRef.current;
    if (!a) return;
    const now = performance.now();
    // light throttling for very long key repeat bursts
    if (now - lastKeyboardSeekRef.current < 30) return;
    lastKeyboardSeekRef.current = now;

    const dur = Number.isFinite(a.duration) && a.duration > 0 ? a.duration : 0;
    const nextTime = dur > 0
      ? Math.max(0, Math.min(dur, a.currentTime + deltaSec))
      : Math.max(0, a.currentTime + deltaSec);

    a.currentTime = nextTime;

    if (excursionRef.current) {
      excursionStartRef.current = a.currentTime;
      excursionAdvancingRef.current = false;
      setExcursionRemaining(10);
    }

    // flash label under thumb
    const id = ++seekFlashIdRef.current;
    setSeekFlash({ id, deltaSec });
    if (seekFlashTimeoutRef.current) window.clearTimeout(seekFlashTimeoutRef.current);
    seekFlashTimeoutRef.current = window.setTimeout(() => {
      setSeekFlash((prev) => (prev?.id === id ? null : prev));
    }, 650);
  }

  function next() {
    const q = queueRef.current;
    const idx = indexRef.current;
    if (orderRef.current === 'shuffle') {
      // Shuffle — any random track (podcast included)
      if (q.length <= 1) return;
      let n: number;
      do { n = Math.floor(Math.random() * q.length); } while (n === idx);
      loadAndPlay(n);
    } else {
      if (idx + 1 < q.length) loadAndPlay(idx + 1);
    }
  }

  function prev() {
    const a = audioRef.current;
    if (a && a.currentTime > 3) {
      a.currentTime = 0;
      if (excursionRef.current) {
        excursionStartRef.current = 0;
        excursionAdvancingRef.current = false;
        setExcursionRemaining(10);
      }
    } else {
      const idx = indexRef.current;
      if (idx > 0) loadAndPlay(idx - 1);
    }
  }

  function setOrder(newOrder: PlaybackOrder) {
    // Get current track ID BEFORE any state changes
    const currentTrackId = queueRef.current[indexRef.current]?.id;
    
    orderRef.current = newOrder;
    setPlaybackOrder(newOrder);
    
    if (newOrder === 'shuffle') {
      // Shuffle: put current track at index 0, shuffle the rest
      const currentTrack = queueRef.current.find(t => t.id === currentTrackId);
      const otherTracks = queueRef.current.filter(t => t.id !== currentTrackId);
      
      // Fisher-Yates shuffle
      for (let i = otherTracks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [otherTracks[i], otherTracks[j]] = [otherTracks[j], otherTracks[i]];
      }
      
      const newQueue = currentTrack ? [currentTrack, ...otherTracks] : [...otherTracks];
      const newIndex = currentTrack ? 0 : 0;
      
      queueRef.current = newQueue;
      indexRef.current = newIndex;
      setQueue(newQueue);
      setCurrentQueueIndex(newIndex);
    } else {
      // Sequential: restore original order, find current track's position
      const newQueue = [...MASTER_PLAYLIST];
      const newIndex = currentTrackId 
        ? newQueue.findIndex(t => t.id === currentTrackId)
        : 0;
      
      queueRef.current = newQueue;
      indexRef.current = newIndex >= 0 ? newIndex : 0;
      setQueue(newQueue);
      setCurrentQueueIndex(newIndex >= 0 ? newIndex : 0);
    }
  }

  function setExcursionOn(v: boolean) {
    excursionRef.current = v;
    setExcursionOnState(v);
    const a = audioRef.current;
    if (!a) { setExcursionRemaining(v ? 10 : 0); return; }
    excursionAdvancingRef.current = false;
    if (!v) { setExcursionRemaining(0); return; }
    if (!isNaN(a.duration) && a.duration > 10.5) {
      const start = Math.random() * Math.max(0, a.duration - 10.1);
      a.currentTime = start;
      excursionStartRef.current = start;
      setExcursionRemaining(10);
    } else {
      a.currentTime = 0;
      excursionStartRef.current = 0;
      setExcursionRemaining(10);
    }
    if (!a.paused) a.play().catch(() => {});
  }

  function moveQueueItem(fromIdx: number, dir: 'up' | 'down') {
    const cur = indexRef.current;
    if (fromIdx <= cur) return;
    const toIdx = dir === 'up' ? fromIdx - 1 : fromIdx + 1;
    if (toIdx <= cur || toIdx >= queueRef.current.length) return;
    setQueue((prev) => {
      const nq = [...prev];
      [nq[fromIdx], nq[toIdx]] = [nq[toIdx], nq[fromIdx]];
      queueRef.current = nq;
      return nq;
    });
  }

  function reorderQueue(fromIdx: number, toIdx: number) {
    const cur = indexRef.current;
    // Can only reorder items after the current one
    if (fromIdx <= cur || toIdx <= cur || fromIdx === toIdx) return;
    if (toIdx < 0 || toIdx >= queueRef.current.length) return;
    setQueue((prev) => {
      const nq = [...prev];
      const [item] = nq.splice(fromIdx, 1);
      nq.splice(toIdx, 0, item);
      queueRef.current = nq;
      return nq;
    });
  }

  function closePlayer() {
    setPlayerVis('exiting');
    visRef.current = 'exiting';
    audioRef.current?.pause();
    setShowQueue(false);
    setTimeout(() => {
      setPlayerVis('hidden');
      visRef.current = 'hidden';
    }, 600);
  }

  const currentItem = currentQueueIndex >= 0 && currentQueueIndex < queue.length ? queue[currentQueueIndex] : null;

  return (
    <PlayerContext.Provider
      value={{
        currentItem, isPlaying, progress, currentTime, duration,
        seekFlash,
        playbackOrder, excursionOn, autoAdvance,
        queue, currentQueueIndex, playerVis, showQueue, excursionRemaining,
        isFullscreen, setIsFullscreen, audioLevel,
        playItemById, togglePlay, seekTo, seekBySec, next, prev,
        setOrder, setExcursionOn, setAutoAdvance,
        moveQueueItem, reorderQueue, closePlayer, setShowQueue,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

/* ════════════════════════════════════════════════════════
   SPIN CLOSE BUTTON
   ════════════════════════════════════════════════════════ */

function SpinCloseButton({ onClick }: { onClick: () => void }) {
  const hoveredRef = useRef(false);
  const velocityRef = useRef(0);
  const rotationRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);
  const [rotation, setRotation] = useState(0);

  const animate = useCallback((time: number) => {
    if (lastTimeRef.current === 0) lastTimeRef.current = time;
    const dt = Math.min((time - lastTimeRef.current) / 1000, 0.05);
    lastTimeRef.current = time;

    if (hoveredRef.current) {
      // Acceleration increases proportionally — goes to infinity
      const a = 800 + velocityRef.current * 2.5;
      velocityRef.current += a * dt;
    } else {
      // Deceleration: slow down smoothly
      const d = 600 + velocityRef.current * 0.8;
      velocityRef.current = Math.max(0, velocityRef.current - d * dt);
    }

    rotationRef.current = (rotationRef.current + velocityRef.current * dt) % 360000;
    setRotation(rotationRef.current);

    if (hoveredRef.current || velocityRef.current > 0.5) {
      rafRef.current = requestAnimationFrame(animate);
    } else {
      rafRef.current = null;
      lastTimeRef.current = 0;
      velocityRef.current = 0;
    }
  }, []);

  const startLoopIfNeeded = useCallback(() => {
    if (rafRef.current == null) {
      lastTimeRef.current = 0;
      rafRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  const onEnter = () => { hoveredRef.current = true; startLoopIfNeeded(); };
  const onLeave = () => { hoveredRef.current = false; startLoopIfNeeded(); };

  useEffect(() => {
    return () => { if (rafRef.current != null) cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <button
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="spin-close-btn"
      style={{ transform: `rotate(${rotation}deg)` }}
      title="Закрыть плеер"
    >
      <IconClose />
    </button>
  );
}

/* ════════════════════════════════════════════════════════
   QUEUE PANEL (with click-outside-to-close)
   ════════════════════════════════════════════════════════ */

function QueuePanel() {
  const {
    queue, currentQueueIndex, playbackOrder, excursionOn, autoAdvance,
    showQueue, setOrder, setExcursionOn, setAutoAdvance, moveQueueItem,
    reorderQueue, playItemById, currentItem, setShowQueue,
  } = usePlayer();

  // Drag-and-drop state
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchCurrentEl = useRef<HTMLElement | null>(null);

  const innerRef = useRef<HTMLDivElement>(null);

  if (!showQueue) return null;

  return (
    <div className="queue-overlay">
      <button
        className="queue-backdrop"
        aria-label="Закрыть очередь"
        onClick={() => setShowQueue(false)}
      />

      <div className="queue-panel">
        <div className="queue-panel-inner" ref={innerRef}>
          {/* Header */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="queue-title">
            <span className="queue-title-text" style={GRAFFITI}>ОЧЕРЕДЬ</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setOrder('sequential')}
              className={`queue-mode-btn ${playbackOrder === 'sequential' ? 'active' : ''}`}
              style={GRAFFITI}
              title="Играть по порядку"
            >
              <IconSequential />
              <span className="hidden sm:inline">Порядок</span>
            </button>
            <button
              onClick={() => setOrder('shuffle')}
              className={`queue-mode-btn ${playbackOrder === 'shuffle' ? 'active' : ''}`}
              style={GRAFFITI}
              title="Играть в перемешку"
            >
              <IconShuffle />
              <span className="hidden sm:inline">Микс</span>
            </button>
            <button
              onClick={() => setExcursionOn(!excursionOn)}
              className={`queue-mode-btn ${excursionOn ? 'active' : ''}`}
              style={GRAFFITI}
              title={excursionOn ? 'Экскурсия: ВКЛ (по 10 секунд)' : 'Экскурсия: ВЫКЛ'}
            >
              <IconExcursion />
              <span className="hidden sm:inline">10s</span>
            </button>
            <button
              onClick={() => setAutoAdvance(!autoAdvance)}
              className={`queue-mode-btn ${autoAdvance ? 'active' : 'opacity-40'}`}
              title={autoAdvance ? 'Авто-переключение: ВКЛ' : 'Авто-переключение: ВЫКЛ'}
              style={GRAFFITI}
            >
              {autoAdvance ? <IconAutoOn /> : <IconAutoOff />}
              <span className="hidden sm:inline">{autoAdvance ? 'Авто' : 'Стоп'}</span>
            </button>
          </div>
        </div>

        {/* Queue list */}
        <div className="queue-list">
          {queue.map((item, i) => {
            const isCurrent = i === currentQueueIndex;
            const isPast = i < currentQueueIndex;
            const canDrag = !isPast && !isCurrent;
            const typeIcon = item.type === 'podcast' ? '🎙️' : item.type === 'track' ? '🔥' : '💀';
            const isDragging = draggedIdx === i;
            const isDragOver = dragOverIdx === i && draggedIdx !== i;

            return (
              <div
                key={item.id + '-' + i}
                className={`queue-item ${isCurrent ? 'is-current' : ''} ${isPast ? 'is-past' : ''} ${isDragging ? 'is-dragging' : ''} ${isDragOver ? 'is-drag-over' : ''}`}
                style={{ animationDelay: `${Math.min(i * 0.03, 0.9)}s` }}
                draggable={canDrag}
                onDragStart={(e) => {
                  if (!canDrag) return;
                  setDraggedIdx(i);
                  e.dataTransfer.effectAllowed = 'move';
                  e.dataTransfer.setData('text/plain', String(i));
                }}
                onDragEnd={() => {
                  setDraggedIdx(null);
                  setDragOverIdx(null);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (draggedIdx !== null && i > currentQueueIndex && i !== draggedIdx) {
                    setDragOverIdx(i);
                  }
                }}
                onDragLeave={() => {
                  if (dragOverIdx === i) setDragOverIdx(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggedIdx !== null && i > currentQueueIndex && draggedIdx !== i) {
                    reorderQueue(draggedIdx, i);
                  }
                  setDraggedIdx(null);
                  setDragOverIdx(null);
                }}
                onTouchStart={(e) => {
                  if (!canDrag) return;
                  touchStartY.current = e.touches[0].clientY;
                  touchCurrentEl.current = e.currentTarget as HTMLElement;
                }}
                onTouchMove={() => {
                  if (touchStartY.current === null || draggedIdx === null) return;
                  // Visual feedback handled by CSS
                }}
                onTouchEnd={() => {
                  touchStartY.current = null;
                  touchCurrentEl.current = null;
                }}
              >
                {/* Drag handle for draggable items */}
                {canDrag && (
                  <span className="queue-drag-handle" title="Перетащи для перестановки">
                    ⋮⋮
                  </span>
                )}
                <button
                  onClick={() => playItemById(item.id)}
                  className="flex-1 flex items-center gap-2 text-left min-w-0 cursor-pointer"
                >
                  <span className="text-xs flex-shrink-0 w-5 text-right opacity-50">
                    {isCurrent && currentItem ? '▶' : i + 1}
                  </span>
                  <span className="text-xs flex-shrink-0">{typeIcon}</span>
                  <span className="text-sm truncate">{item.name}</span>
                </button>
                {canDrag && (
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => moveQueueItem(i, 'up')} className="queue-arrow-btn" title="Вверх">▲</button>
                    <button onClick={() => moveQueueItem(i, 'down')} className="queue-arrow-btn" title="Вниз">▼</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   GLOBAL PLAYER BAR (with GLITCH CORE detection)
   ════════════════════════════════════════════════════════ */

function GlobalPlayerBar() {
  const {
    currentItem, isPlaying, progress, currentTime, duration,
    excursionOn, excursionRemaining,
    playerVis, showQueue,
    togglePlay, seekTo, next, prev, closePlayer, setShowQueue,
    playbackOrder, autoAdvance, setOrder,
    setIsFullscreen,
  } = usePlayer();

  // Progress bar: simple range input with visual fill layer
  const progressRef = useRef<HTMLInputElement>(null);

  // Load segments for current track (if тайминги.txt exists)
  const segments = useTrackSegments(currentItem?.id || null);

  if (playerVis === 'hidden') return null;

  const animClass =
    playerVis === 'entering' ? 'player-crawl-up' :
    playerVis === 'exiting' ? 'player-slide-down' : '';

  // Detect GLITCH CORE tracks
  const isGlitchCore = isPlaying && currentItem != null && GLITCH_CORE_NAMES.includes(currentItem.name);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    seekTo(val);
  };

  return (
    <>
      <QueuePanel />

              <div className={`global-player ${animClass} ${isPlaying ? 'is-playing' : ''} ${isGlitchCore ? 'glitch-core-mode' : ''}`}>
        {/* Glitch Core overlay scanlines */}
        {isGlitchCore && <div className="glitch-scanlines" />}

              {/* Top progress bar */}
      {segments ? (
        <SegmentedGlobalProgressBar segments={segments} />
      ) : (
        <div className="player-progress-container">
          {/* Background track */}
          <div className="player-progress-track" />
          {/* Fill (fire texture) */}
          <div className="player-progress-fill" style={{ width: `${progress}%` }} />
          {/* Thumb indicator */}
          <div className="player-progress-thumb" style={{ left: `${progress}%` }} />

          {/* Keyboard seek flash (+5/-5) */}
          <SeekFlashBadge leftPct={progress} />

          {/* Invisible range input on top for interaction */}
          <input
            ref={progressRef}
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={handleSeek}
            className="player-progress-range"
          />
        </div>
      )}



        <div className="player-content">
          {/* Track info — clickable to open fullscreen */}
          <button
            className="player-info cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setIsFullscreen(true)}
            title="Открыть плеер"
          >
            {currentItem?.cover && (
              <img
                src={currentItem.cover}
                alt=""
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded object-cover flex-shrink-0 border border-[#ff0033]/20 ${isGlitchCore ? 'glitch-core-img' : ''}`}
              />
            )}
            {!currentItem?.cover && (
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded flex-shrink-0 border border-[#ff0033]/20 bg-[#ff0033]/10 flex items-center justify-center text-lg">
                {currentItem?.type === 'podcast' ? '🎙️' : currentItem?.type === 'demo' ? '💀' : '🔥'}
              </div>
            )}
            <div className="min-w-0 flex-1 text-left">
              <div className={`text-sm font-bold truncate text-white ${isGlitchCore ? 'glitch-text-fast' : ''}`} style={GRAFFITI}>
                {currentItem?.name || '—'}
              </div>
              <div className="text-xs text-gray-400 truncate">{currentItem?.artist || ''}</div>
            </div>
          </button>

          {/* Controls */}
          <div className="player-controls">
            <button onClick={prev} className="player-nav-btn" title="Назад">
              <IconPrev className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className={`player-play-btn ${isPlaying ? 'is-playing' : ''}`}
              title={isPlaying ? 'Пауза' : 'Играть'}
            >
              {isPlaying ? <IconPause className="w-5 h-5" /> : <IconPlay className="w-5 h-5" />}
            </button>

            <button onClick={next} className="player-nav-btn" title="Далее">
              <IconNext className="w-4 h-4" />
            </button>
          </div>

          {/* Time + excursion */}
          <div className="player-time">
            <span className="text-xs text-gray-400 font-mono whitespace-nowrap">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            {excursionOn && isPlaying && (
              <span className="excursion-badge" style={GRAFFITI}>
                {excursionRemaining}
              </span>
            )}
          </div>

          {/* Right buttons */}
          <div className="player-right-btns">
            <button
              onClick={() => setOrder(playbackOrder === 'sequential' ? 'shuffle' : 'sequential')}
              className={`player-mode-toggle ${playbackOrder === 'shuffle' ? 'is-shuffle' : 'is-seq'}`}
              title={playbackOrder === 'sequential' ? 'Порядок (нажми: включить перемешку)' : 'Перемешка (нажми: включить порядок)'}
            >
              {playbackOrder === 'shuffle' ? <IconShuffle className="w-4 h-4" /> : <IconSequential className="w-4 h-4" />}
            </button>

            {excursionOn && (
              <div className="player-status-icon" title="Экскурсия 10s">
                <IconExcursion className="w-3.5 h-3.5 opacity-50" />
              </div>
            )}
            {!autoAdvance && (
              <div className="player-status-icon" title="Авто-переключение выключено">
                <IconAutoOff className="w-3.5 h-3.5 text-red-400 opacity-60" />
              </div>
            )}

            <button
              onClick={() => setShowQueue(!showQueue)}
              className={`player-queue-btn ${showQueue ? 'active' : ''}`}
              title="Очередь"
            >
              <IconQueue className="w-4 h-4" />
            </button>

            <SpinCloseButton onClick={closePlayer} />
          </div>
        </div>
      </div>
    </>
  );
}

/* ════════════════════════════════════════════════════════
   SEGMENTED PROGRESS BAR — UNIVERSAL (for tracks with тайминги.txt)
   ════════════════════════════════════════════════════════ */

type SegmentLayout = {
  segment: TrackSegment;
  startPct: number;
  endPct: number;
  widthPct: number;
  midPct: number;
};

function hexToRgba(hex: string, a: number) {
  const h = hex.replace('#', '').trim();
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function getSegmentsLayout(segments: TrackSegment[], totalDuration: number): SegmentLayout[] {
  const total = Math.max(totalDuration, segments[segments.length - 1].startSec + 8);
  return segments.map((seg, i) => {
    const nextStart = i < segments.length - 1 ? segments[i + 1].startSec : total;
    const startPct = (seg.startSec / total) * 100;
    const endPct = (nextStart / total) * 100;
    const widthPct = Math.max(0, endPct - startPct);
    const midPct = startPct + widthPct / 2;
    return { segment: seg, startPct, endPct, widthPct, midPct };
  });
}

function buildSegmentsGradient(segments: TrackSegment[], totalDuration: number, alpha = 0.22) {
  const layout = getSegmentsLayout(segments, totalDuration);
  const stops = layout
    .map((l) => {
      const c = hexToRgba(l.segment.color, alpha);
      return `${c} ${l.startPct}%, ${c} ${l.endPct}%`;
    })
    .join(', ');
  return `linear-gradient(90deg, ${stops})`;
}

// Universal segmented progress bar for global player
function SegmentedGlobalProgressBar({ segments }: { segments: TrackSegment[] }) {
  const { progress, currentTime, duration, seekTo } = usePlayer();

  const [hovered, setHovered] = useState<TrackSegment | null>(null);
  const [hoverMidPct, setHoverMidPct] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const [displayedArtist, setDisplayedArtist] = useState(segments[0]?.artist || '');
  const [prevArtist, setPrevArtist] = useState('');
  const [transitioning, setTransitioning] = useState(false);
  const transitioningRef = useRef(false);

  const total = duration || 200;
  const layout = getSegmentsLayout(segments, total);
  const currentSeg = getSegmentAtTime(segments, currentTime);

  // Update artist display when segment changes
  useEffect(() => {
    const newArtist = currentSeg.artist;
    
    // Don't update if already transitioning or same artist
    if (transitioningRef.current || newArtist === displayedArtist) return;
    
    // Start transition
    setPrevArtist(displayedArtist);
    setTransitioning(true);
    transitioningRef.current = true;
    
    const t = window.setTimeout(() => {
      setDisplayedArtist(newArtist);
      setTransitioning(false);
      transitioningRef.current = false;
    }, 260);
    
    return () => {
      window.clearTimeout(t);
    };
  }, [currentSeg.artist, displayedArtist]);

  // Reset when segments change (new track)
  useEffect(() => {
    setHovered(null);
    setPrevArtist('');
    setDisplayedArtist(segments[0]?.artist || '');
    setTransitioning(false);
    transitioningRef.current = false;
  }, [segments]);

  // Get color for displayed artist
  const displayedSeg = segments.find(s => s.artist === displayedArtist) || segments[0];
  const prevSeg = segments.find(s => s.artist === prevArtist) || segments[0];

  const handlePointerMove = (e: React.PointerEvent<HTMLInputElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return;
    const x = Math.min(rect.width, Math.max(0, e.clientX - rect.left));
    const pct = (x / rect.width) * 100;

    const segLayout = layout.find((l) => pct >= l.startPct && pct <= l.endPct) ?? layout[layout.length - 1];
    if (!segLayout) return;

    // Set hovered only if changed
    setHovered((prev) => (prev?.artist === segLayout.segment.artist ? prev : segLayout.segment));
    setHoverMidPct(segLayout.midPct);
  };

  const clearHover = () => setHovered(null);

  return (
    <div className="player-auchan-wrap">
      {/* Имя текущего исполнителя — только в главном плеере */}
      <div className="player-auchan-artistbar">
        <span className="player-auchan-artist-label" style={GRAFFITI}>СЕЙЧАС:</span>
        <span className={`auchan-artist-display ${transitioning ? 'transitioning' : ''}`}>
          {transitioning && (
            <span className="auchan-artist-prev" style={{ color: prevSeg.color }}>
              {prevArtist}
            </span>
          )}
          <span
            className={`auchan-artist-current ${transitioning ? 'entering' : ''}`}
            style={{ color: transitioning ? currentSeg.color : displayedSeg.color }}
          >
            {transitioning ? currentSeg.artist : displayedArtist}
          </span>
        </span>
      </div>

      {/* Главный прогрессбар — сегменты + подсказка */}
              <div className="player-progress-container is-auchan" ref={containerRef}>
        <div className="player-progress-track" />

        {/* Keyboard seek flash (+5/-5) */}
        <SeekFlashBadge leftPct={progress} />


        <div className="player-progress-segments">
          {layout.map((l, i) => (
            <div
              key={l.segment.artist + '-seg-' + i}
              className={`player-progress-seg ${currentSeg.artist === l.segment.artist ? 'is-current' : ''} ${hovered?.artist === l.segment.artist ? 'is-hover' : ''}`}
              style={{
                width: `${l.widthPct}%`,
                backgroundColor: hexToRgba(l.segment.color, 0.22),
              }}
            />
          ))}
        </div>

        <div
          className="player-progress-fill"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${hexToRgba(currentSeg.color, 0.55)}, ${hexToRgba(currentSeg.color, 0.92)})`,
            boxShadow: `0 0 10px ${hexToRgba(currentSeg.color, 0.22)}, 0 0 4px ${hexToRgba(currentSeg.color, 0.35)}`,
          }}
        />

        <div
          className="player-progress-thumb"
          style={{
            left: `${progress}%`,
            background: currentSeg.color,
            boxShadow: `0 0 12px ${hexToRgba(currentSeg.color, 0.55)}, 0 0 4px rgba(0,0,0,0.5)`,
          }}
        />

        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={progress}
          onChange={(e) => seekTo(Number(e.target.value))}
          onPointerMove={handlePointerMove}
          onPointerLeave={clearHover}
          onPointerDown={handlePointerMove}
          className="player-progress-range"
        />

        {/* Tooltip — показывается НАД сегментом */}
        {hovered && (
          <div
            className="player-auchan-tooltip"
            style={{
              left: `${hoverMidPct}%`,
              color: hovered.color,
              borderColor: hovered.color,
              background: `linear-gradient(135deg, rgba(0,0,0,0.9), ${hexToRgba(hovered.color, 0.15)})`,
            }}
          >
            {hovered.artist}
          </div>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   INLINE PLAYER
   ════════════════════════════════════════════════════════ */

function InlinePlayer({ itemId, compact = false }: { itemId: string; compact?: boolean }) {
  const { currentItem, isPlaying, progress, currentTime, duration, playItemById, togglePlay } = usePlayer();

  const isCurrent = currentItem?.id === itemId;
  const isThisPlaying = isCurrent && isPlaying;

  const handleClick = () => {
    if (isCurrent) togglePlay();
    else playItemById(itemId);
  };

  const sz = compact ? 'w-8 h-8' : 'w-11 h-11';

  // For tracks with segments: keep the same inline progress shape as all others,
  // but paint segment colors in the background (no names/tooltips here).
  const inlineSegments = useTrackSegments(itemId);
  const inlineBg = inlineSegments
    ? buildSegmentsGradient(inlineSegments, duration || 200, 0.16)
    : undefined;

  return (
    <div className="flex items-center gap-3 w-full">
      <button
        onClick={handleClick}
        className={`${sz} grunge-play-btn flex-shrink-0 flex items-center justify-center cursor-pointer ${isThisPlaying ? 'pulse-ring is-playing fire-glow' : ''}`}
      >
        {isThisPlaying ? (
          <IconPause className={compact ? 'w-3.5 h-3.5' : 'w-4.5 h-4.5'} />
        ) : (
          <IconPlay className={compact ? 'w-3.5 h-3.5' : 'w-4.5 h-4.5'} />
        )}
      </button>

      <div className="flex-1 flex flex-col gap-1">
        <div
          className={`h-1 rounded-full overflow-hidden ${isCurrent ? 'bg-white/10' : 'bg-white/5'}`}
          style={{ cursor: isCurrent ? 'pointer' : 'default', backgroundImage: inlineBg }}
        >
          <div
            className={`h-full rounded-full transition-all duration-200 ${
              isThisPlaying ? 'progress-fire' : isCurrent ? 'bg-[#ff0033]/60' : 'bg-white/10'
            }`}
            style={{ width: isCurrent ? `${progress}%` : '0%' }}
          />
        </div>
        {!compact && isCurrent && (
          <div className="flex justify-between text-xs text-gray-500 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   SCROLL REVEAL
   ════════════════════════════════════════════════════════ */

function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'scale';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const transforms: Record<string, string> = {
    up: 'translateY(50px)',
    left: 'translateX(-50px)',
    right: 'translateX(50px)',
    scale: 'scale(0.9)',
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translate(0) scale(1)' : transforms[direction],
        transition: `all 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   SECTION TITLE
   ════════════════════════════════════════════════════════ */

function SectionTitle({ children, glitch = false }: { children: ReactNode; glitch?: boolean }) {
  return (
    <h2
      className={`text-4xl md:text-6xl font-bold mb-10 spray-text tracking-wider ${glitch ? 'glitch-text' : ''}`}
      style={GRAFFITI}
    >
      {children}
    </h2>
  );
}

/* ════════════════════════════════════════════════════════
   TRACK CARD
   ════════════════════════════════════════════════════════ */

const TrackCard = memo(function TrackCard({ track, index }: { track: Track; index: number }) {
  const { currentItem, isPlaying } = usePlayer();
  const isCurrent = currentItem?.id === track.id;

  const links = [
    { key: 'yandex', label: 'Yandex', href: track.yandex, logo: 'Cyfral-site/logo_stream_services/icons8-яндекс-музыка-новый-96.png', cls: 'svc-btn svc-ym', colorName: 'Yandex Music' },
    { key: 'spotify', label: 'Spotify', href: track.spotify, logo: 'Cyfral-site/logo_stream_services/Spotify_Primary_Logo_RGB_Green.png', cls: 'svc-btn svc-sp', colorName: 'Spotify' },
    { key: 'apple', label: 'Apple', href: track.apple, logo: 'Cyfral-site/logo_stream_services/Apple_Music__iOS__2020.png', cls: 'svc-btn svc-am', colorName: 'Apple Music' },
    { key: 'vk', label: 'VK', href: track.vk, logo: 'Cyfral-site/logo_stream_services/vk-music-sign-logo.png', cls: 'svc-btn svc-vk', colorName: 'VK Музыка' },
    { key: 'ytmusic', label: 'YTM', href: track.ytmusic, logo: 'Cyfral-site/logo_stream_services/YouTubeMusic_Logo.png', cls: 'svc-btn svc-yt', colorName: 'YouTube Music' },
    { key: 'rutube', label: 'RuTube', href: track.rutube, logo: 'Cyfral-site/logo_stream_services/Icon_RUTUBE_dark_color.png', cls: 'svc-btn svc-rt', colorName: 'RuTube' },
    { key: 'genius', label: 'Genius', href: track.genius, logo: 'Cyfral-site/logo_stream_services/Genius.png', cls: 'svc-btn svc-gn', colorName: 'Genius' },
  ].filter((l) => !!l.href);

  return (
    <ScrollReveal delay={index * 0.1} direction={index % 2 === 0 ? 'left' : 'right'}>
      <div className={`track-card rounded-xl overflow-hidden ${isCurrent ? 'is-current-card' : ''}`}>
        <div className="relative aspect-square overflow-hidden group">
          {/* Zoom wrapper so image + shade scale perfectly together (no visible shade edges) */}
          <div className="absolute inset-0 transition-transform duration-700 will-change-transform group-hover:scale-110">
            <img
              src={track.cover}
              alt={track.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
          </div>
          {isCurrent && isPlaying && (
            <div className="absolute top-3 left-3 now-playing-badge" style={GRAFFITI}>
              ▶ PLAYING
            </div>
          )}

          {/* Small badges on cover */}
          <div className="absolute top-3 right-3 flex flex-wrap gap-2 justify-end max-w-[85%]">
            {track.yandex && (
              <a href={track.yandex} target="_blank" rel="noopener noreferrer" className="grunge-badge-ym" title="Яндекс Музыка">
                <img src="Cyfral-site/logo_stream_services/icons8-яндекс-музыка-новый-96.png" alt="YM" className="w-5 h-5 object-contain" />
              </a>
            )}
            {track.spotify && (
              <a href={track.spotify} target="_blank" rel="noopener noreferrer" className="grunge-badge-sp" title="Spotify">
                <img src="Cyfral-site/logo_stream_services/Spotify_Primary_Logo_RGB_Green.png" alt="SP" className="w-5 h-5 object-contain" />
              </a>
            )}
            {track.apple && (
              <a href={track.apple} target="_blank" rel="noopener noreferrer" className="grunge-badge-am" title="Apple Music">
                <img src="Cyfral-site/logo_stream_services/Apple_Music__iOS__2020.png" alt="AM" className="w-5 h-5 object-contain" />
              </a>
            )}
            {track.vk && (
              <a href={track.vk} target="_blank" rel="noopener noreferrer" className="grunge-badge-vk" title="VK Музыка">
                <img src="Cyfral-site/logo_stream_services/vk-music-sign-logo.png" alt="VK" className="w-5 h-5 object-contain" />
              </a>
            )}
            {track.ytmusic && (
              <a href={track.ytmusic} target="_blank" rel="noopener noreferrer" className="grunge-badge-yt" title="YouTube Music">
                <img src="Cyfral-site/logo_stream_services/YouTubeMusic_Logo.png" alt="YT" className="w-5 h-5 object-contain" />
              </a>
            )}
            {track.rutube && (
              <a href={track.rutube} target="_blank" rel="noopener noreferrer" className="grunge-badge-rt" title="RuTube">
                <img src="Cyfral-site/logo_stream_services/Icon_RUTUBE_dark_color.png" alt="RT" className="w-5 h-5 object-contain" />
              </a>
            )}
            {track.genius && (
              <a href={track.genius} target="_blank" rel="noopener noreferrer" className="grunge-badge-gn" title="Genius">
                <img src="Cyfral-site/logo_stream_services/Genius.png" alt="GN" className="w-5 h-5 object-contain" />
              </a>
            )}
          </div>

          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-xl font-bold text-white drop-shadow-lg leading-tight" style={GRAFFITI}>
              {track.name}
            </h3>
            <p className="text-sm text-gray-300/80 mt-1 line-clamp-2">{track.artists}</p>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <InlinePlayer itemId={track.id} />

          {links.length > 0 ? (
            <div className="flex gap-2 flex-wrap">
              {links.map((l) => (
                <a
                  key={l.key}
                  href={l.href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={l.cls}
                  title={l.colorName}
                  style={GRAFFITI}
                >
                  <img src={l.logo} alt={l.label} className="w-4 h-4 object-contain" />
                  <span>{l.colorName}</span>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-xs text-gray-500 tracking-widest" style={GRAFFITI}>
              НЕТ НА ПЛОЩАДКАХ
            </div>
          )}
        </div>
      </div>
    </ScrollReveal>
  );
});

/* ════════════════════════════════════════════════════════
   DEMO ITEM
   ════════════════════════════════════════════════════════ */

const DemoItem = memo(function DemoItem({ demo, index }: { demo: Demo; index: number }) {
  const demoId = `demo-${index}`;
  const { currentItem, isPlaying } = usePlayer();
  const isCurrent = currentItem?.id === demoId;

  return (
    <ScrollReveal delay={Math.min(index * 0.04, 0.8)}>
      <div className={`demo-item rounded-lg overflow-hidden ${isCurrent ? 'is-current-demo' : ''}`}>
        <div className="flex items-center gap-3 p-3">
          <span
            className="text-sm font-bold text-[#00ff41]/70 flex-shrink-0 w-7 text-right tabular-nums"
            style={GRAFFITI}
          >
            {isCurrent && isPlaying ? '▶' : (index + 1).toString().padStart(2, '0')}
          </span>
          <span className="text-sm text-white truncate flex-1" title={demo.name}>
            {demo.name}
          </span>
          <div className="flex-shrink-0 w-28 sm:w-40">
            <InlinePlayer itemId={demoId} compact />
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
});

/* ════════════════════════════════════════════════════════
   MARQUEE BANNER
   ════════════════════════════════════════════════════════ */

const MarqueeBanner = memo(function MarqueeBanner() {
  const text =
    'LIL CYFRAL • МОЛОДОЙ • STREET RAP • GRUNGE • АНДЕГРАУНД • АШАН МОНСТР • ГОЛУБОЙ • НЕ ГОЛУБОЙ • ';

  return (
    <div className="overflow-hidden py-4 border-y border-[#ff0033]/15 bg-[#ff0033]/[0.03]">
      <div className="marquee-track whitespace-nowrap" style={GRAFFITI}>
        {/* Два одинаковых span — когда первый уезжает, второй занимает его место */}
        <span className="marquee-content text-2xl md:text-3xl text-[#ff0033]/30 tracking-widest inline-block">
          {text}{text}{text}{text}
        </span>
        <span className="marquee-content text-2xl md:text-3xl text-[#ff0033]/30 tracking-widest inline-block">
          {text}{text}{text}{text}
        </span>
      </div>
    </div>
  );
});

/* ════════════════════════════════════════════════════════
   RUSSIAN FLAG
   ════════════════════════════════════════════════════════ */

function RussianFlag() {
  return (
    <div className="absolute top-0 right-0 w-[180px] sm:w-[240px] md:w-[300px] h-[100px] sm:h-[130px] md:h-[160px] z-0 overflow-hidden pointer-events-none">
      <div className="h-1/3 bg-white" />
      <div className="h-1/3 bg-[#0039A6]" />
      <div className="h-1/3 bg-[#D52B1E]" />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to right, #0a0a0a 0%, rgba(10,10,10,0.85) 25%, rgba(10,10,10,0.4) 55%, transparent 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, transparent 30%, rgba(10,10,10,0.7) 80%, #0a0a0a 100%)',
        }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   SCATTERED FIRE GAME
   ════════════════════════════════════════════════════════ */

function ScatteredFires({
  fires,
  onFireClick,
}: {
  fires: FirePosition[];
  onFireClick: (id: number) => void;
}) {
  return (
    <div className="fire-game-overlay">
      {fires.map((fire) => {
        if (fire.found && !fire.poofing) return null;
        return (
          <button
            key={fire.id}
            className={`scattered-fire ${fire.poofing ? 'poof' : 'floating'}`}
            style={{ left: `${fire.x}%`, top: `${fire.y}px` }}
            onClick={() => !fire.poofing && onFireClick(fire.id)}
          >
            🔥
          </button>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   STATS COUNTER (with Fire Easter Egg)
   ════════════════════════════════════════════════════════ */

function StatsBar({
  gamePhase,
  fireClickCount,
  elapsed,
  bestRecord,
  firesFound,
  firesTotal,
  onFireEmojiClick,
}: {
  gamePhase: GamePhase;
  fireClickCount: number;
  elapsed: number;
  bestRecord: number | null;
  firesFound: number;
  firesTotal: number;
  onFireEmojiClick: () => void;
}) {
  const scaleVal = 1 + fireClickCount * 0.1;
  const isExploding = gamePhase === 'exploding';
  const isHunting = gamePhase === 'hunting';
  const isDone = gamePhase === 'done';

  return (
    <ScrollReveal>
      <div className="flex flex-wrap justify-center gap-6 md:gap-12 py-8">
        {[
          { num: TRACKS.length.toString(), label: 'ТРЕКОВ' },
          { num: DEMOS.length.toString(), label: 'ДЕМОК' },
          { num: '1', label: 'ПОДКАСТ' },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-[#ff0033]" style={GRAFFITI}>
              {s.num}
            </div>
            <div className="text-xs text-gray-500 tracking-widest mt-1" style={GRAFFITI}>
              {s.label}
            </div>
          </div>
        ))}

        {/* Fire Easter Egg */}
        <div className="text-center relative">
          <div className="relative inline-block">
            {/* Main fire emoji / stopwatch */}
            <button
              onClick={onFireEmojiClick}
              className={`text-3xl md:text-4xl cursor-pointer transition-transform duration-200 select-none
                ${isExploding ? 'fire-explode' : ''}
                ${isHunting ? 'hidden' : ''}
                ${isDone ? '' : ''}
              `}
              style={{
                transform: !isExploding ? `scale(${scaleVal})` : undefined,
                display: isHunting ? 'none' : 'inline-block',
              }}
            >
              🔥
            </button>

            {/* Explosion particles */}
            {isExploding && (
              <div className="fire-explosion-particles">
                {[...Array(12)].map((_, i) => (
                  <span
                    key={i}
                    className="explosion-particle"
                    style={{
                      '--angle': `${(i * 30)}deg`,
                      '--distance': `${60 + Math.random() * 80}px`,
                      '--delay': `${Math.random() * 0.15}s`,
                    } as React.CSSProperties}
                  >
                    🔥
                  </span>
                ))}
              </div>
            )}

            {/* Stopwatch during hunting */}
            {isHunting && (
              <div className="text-2xl md:text-3xl font-bold text-[#ffcc00] stopwatch-glow" style={GRAFFITI}>
                ⏱️ {elapsed.toFixed(1)}s
              </div>
            )}

            {/* Found counter */}
            {isHunting && (
              <div className="text-xs text-[#ff0033] mt-1 font-bold" style={GRAFFITI}>
                {firesFound}/{firesTotal}
              </div>
            )}

            {/* Best record (shown faintly to the right) */}
            {bestRecord !== null && gamePhase === 'idle' && (
              <span
                className="absolute -right-16 top-1/2 -translate-y-1/2 text-[10px] text-gray-600/40 whitespace-nowrap"
                style={GRAFFITI}
              >
                {bestRecord.toFixed(1)}s
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500 tracking-widest mt-1" style={GRAFFITI}>
            СТИЛЬ
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

/* ════════════════════════════════════════════════════════
   MAIN APP
   ════════════════════════════════════════════════════════ */

export function App() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <PlayerProvider>
      <AppContent scrollY={scrollY} />
    </PlayerProvider>
  );
}

function AppContent({ scrollY }: { scrollY: number }) {
  const { playerVis, currentItem, togglePlay, seekBySec, isFullscreen, setIsFullscreen } = usePlayer();
  const showPadding = playerVis === 'visible' || playerVis === 'entering';

  // ─── Fire Easter Egg Game State ───
  const [fireClickCount, setFireClickCount] = useState(0);
  const [gamePhase, setGamePhase] = useState<GamePhase>('idle');
  const [fires, setFires] = useState<FirePosition[]>([]);
  const [gameStartTime, setGameStartTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [bestRecord, setBestRecord] = useState<number | null>(() => {
    const saved = localStorage.getItem('lc-fire-record');
    return saved ? parseFloat(saved) : null;
  });

  const firesFound = fires.filter((f) => f.found).length;

  // Stopwatch timer
  useEffect(() => {
    if (gamePhase !== 'hunting') return;
    const interval = setInterval(() => {
      setElapsed(( Date.now() - gameStartTime) / 1000);
    }, 50);
    return () => clearInterval(interval);
  }, [gamePhase, gameStartTime]);

  const handleFireEmojiClick = useCallback(() => {
    if (gamePhase !== 'idle') return;
    const newCount = fireClickCount + 1;
    setFireClickCount(newCount);

    if (newCount >= 5) {
      // EXPLODE!
      setGamePhase('exploding');
      setTimeout(() => {
        // Generate 5 random fire positions across the page
        const pageHeight = document.documentElement.scrollHeight;
        const newFires: FirePosition[] = Array.from({ length: 5 }, (_, i) => ({
          id: i,
          x: 8 + Math.random() * 84,
          y: 100 + Math.random() * (pageHeight - 300),
          found: false,
          poofing: false,
        }));
        setFires(newFires);
        setGameStartTime(Date.now());
        setElapsed(0);
        setGamePhase('hunting');
      }, 900);
    }
  }, [fireClickCount, gamePhase]);

  const handleScatteredFireClick = useCallback((id: number) => {
    setFires((prev) => {
      const updated = prev.map((f) =>
        f.id === id ? { ...f, poofing: true } : f
      );
      // After poof animation, mark as found
      setTimeout(() => {
        setFires((curr) => {
          const final = curr.map((f) =>
            f.id === id ? { ...f, found: true, poofing: false } : f
          );
          // Check if all found
          const allFound = final.every((f) => f.found);
          if (allFound) {
            const endTime = (Date.now() - gameStartTime) / 1000;
            setElapsed(endTime);
            // Save record
            setBestRecord((prev) => {
              const best = prev === null ? endTime : Math.min(prev, endTime);
              localStorage.setItem('lc-fire-record', best.toString());
              return best;
            });
            setGamePhase('done');
            // Reset after 2.5 seconds
            setTimeout(() => {
              setGamePhase('idle');
              setFireClickCount(0);
              setFires([]);
            }, 2500);
          }
          return final;
        });
      }, 500);
      return updated;
    });
  }, [gameStartTime]);

  // Global keyboard controls
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const isEditable = !!target && (target.isContentEditable || tag === 'input' || tag === 'textarea' || tag === 'select');
      if (isEditable) return;

      const key = (e.key || '').toLowerCase();

      // Fullscreen open: F (EN) / А (RU)
      if ((key === 'f' || key === 'а') && !isFullscreen) {
        if (currentItem && playerVis !== 'hidden') {
          e.preventDefault();
          setIsFullscreen(true);
        }
        return;
      }

      // Fullscreen close: Esc
      if (key === 'escape') {
        if (isFullscreen) {
          e.preventDefault();
          setIsFullscreen(false);
        }
        return;
      }

      // Play/Pause: Space (no page scroll)
      if (key === ' ') {
        if (currentItem) {
          e.preventDefault();
          e.stopPropagation();
          togglePlay();
        }
        return;
      }

      // Seek: arrows ±5 sec
      if (key === 'arrowleft') {
        if (currentItem) {
          e.preventDefault();
          seekBySec(-5);
        }
        return;
      }
      if (key === 'arrowright') {
        if (currentItem) {
          e.preventDefault();
          seekBySec(5);
        }
        return;
      }
    };

    // Use capture=true to override default browser behaviors (Space scroll, arrows)
    window.addEventListener('keydown', handler, true);
    return () => window.removeEventListener('keydown', handler, true);
  }, [currentItem, isFullscreen, playerVis, seekBySec, setIsFullscreen, togglePlay]);

  return (
    <div className="grain-overlay relative min-h-screen bg-[#0a0a0a] text-white">
      {/* Ambient BG lights */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[700px] h-[700px] bg-[#ff0033] opacity-[0.025] rounded-full blur-[200px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#00ff41] opacity-[0.015] rounded-full blur-[200px]" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#ffcc00] opacity-[0.01] rounded-full blur-[200px]" />
      </div>

      {/* Scattered fire game elements */}
      {gamePhase === 'hunting' && (
        <ScatteredFires fires={fires} onFireClick={handleScatteredFireClick} />
      )}

      {/* Hunting overlay HUD */}
      {gamePhase === 'hunting' && (
        <div className="fire-hunt-hud" style={GRAFFITI}>
          <span className="text-[#ffcc00]">⏱️ {elapsed.toFixed(1)}s</span>
          <span className="text-[#ff0033]">🔥 {firesFound}/5</span>
        </div>
      )}

      {/* ═══ HEADER ═══ */}
      <header className="relative z-10 overflow-hidden">
        <RussianFlag />
        <div className="flex justify-center pt-4 sm:pt-6 pb-2 px-4">
          <ScrollReveal direction="scale">
            <img
              src="Cyfral-site/Logo_sverhu.png"
              alt="Lil Cyfral"
              className="max-w-[600px] w-[85vw] glow-breathe"
            />
          </ScrollReveal>
        </div>
      </header>

      <MarqueeBanner />

      {/* ═══ HERO ═══ */}
      <section className="relative z-10 px-4 md:px-8 py-10 md:py-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <ScrollReveal className="relative w-full md:w-[45%] max-w-md flex-shrink-0" direction="left">
            <div className="relative overflow-hidden rounded-2xl img-glow">
              <img
                src="Cyfral-site/Cyfral-ava.jpg"
                alt="Lil Cyfral"
                className="w-full h-auto block"
                style={{ transform: `translateY(${scrollY * 0.03}px)` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0a0a0a]" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]" />
              <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-transparent to-[#0a0a0a]/40" />
            </div>
            <div className="absolute -bottom-4 left-[20%] w-1 h-12 bg-gradient-to-b from-[#ff0033]/50 to-transparent paint-drip" />
            <div className="absolute -bottom-4 left-[50%] w-0.5 h-8 bg-gradient-to-b from-[#ff0033]/30 to-transparent paint-drip" style={{ animationDelay: '1s' }} />
            <div className="absolute -bottom-4 left-[70%] w-1 h-16 bg-gradient-to-b from-[#ff0033]/40 to-transparent paint-drip" style={{ animationDelay: '2s' }} />
          </ScrollReveal>

          <ScrollReveal delay={0.3} className="flex-1 text-center md:text-left" direction="right">
            <div className="space-y-5">
              <h1
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold glitch-text neon-pulse leading-none"
                style={GRAFFITI}
              >
                Lil<br />Cyfral
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-400 tracking-wider" style={GRAFFITI}>
                🎤 RAP · GRUNGE · STREET
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
                <a href="#tracks" className="grunge-cta grunge-cta-red" style={GRAFFITI}>
                  <span className="grunge-cta-text">🔥 СЛУШАТЬ ТРЕКИ</span>
                  <span className="grunge-cta-scratch" />
                  <span className="grunge-cta-scratch grunge-cta-scratch-2" />
                </a>
                <a href="#demos" className="grunge-cta grunge-cta-green" style={GRAFFITI}>
                  <span className="grunge-cta-text">💀 ДЕМКИ</span>
                  <span className="grunge-cta-scratch" />
                </a>
                <a href="#podcast" className="grunge-cta grunge-cta-yellow" style={GRAFFITI}>
                  <span className="grunge-cta-text">🎙️ ПОДКАСТ</span>
                  <span className="grunge-cta-scratch" />
                </a>
                <a
                  href="https://t.me/lilcyfralchik54"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grunge-cta grunge-cta-tg bg-[#0088cc] hover:bg-[#00aaff]"
                  style={GRAFFITI}
                  title="Telegram"
                >
                  <span className="grunge-cta-text flex items-center gap-2">
                    <img
                      src="Cyfral-site/logo_stream_services/telegram.png"
                      alt="Telegram"
                      className="w-5 h-5 object-contain"
                    />
                    TELEGRAM
                  </span>
                  <span className="grunge-cta-scratch" />
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ Stats ═══ */}
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <div className="section-divider" />
        <StatsBar
          gamePhase={gamePhase}
          fireClickCount={fireClickCount}
          elapsed={elapsed}
          bestRecord={bestRecord}
          firesFound={firesFound}
          firesTotal={5}
          onFireEmojiClick={handleFireEmojiClick}
        />
        <div className="section-divider" />
      </div>

      {/* ═══ PODCAST ═══ */}
      <section id="podcast" className="relative z-10 px-4 md:px-8 py-16 md:py-24 podcast-bg">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <SectionTitle>🎙️ ПОДКАСТ</SectionTitle>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="track-card rounded-2xl p-5 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start gap-5 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#ff0033] to-[#ffcc00] flex items-center justify-center flex-shrink-0 rotate-[-3deg] hover:rotate-[3deg] transition-transform duration-500">
                  <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1c-1.66 0-3 1.34-3 3v8c0 1.66 1.34 3 3 3s3-1.34 3-3V4c0-1.66-1.34-3-3-3zm-1 14.93c-3.94-.49-7-3.85-7-7.93h2c0 3.31 2.69 6 6 6s6-2.69 6-6h2c0 4.08-3.06 7.44-7 7.93V20h4v2H8v-2h4v-4.07z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white spray-text" style={GRAFFITI}>
                    Подкаст с Lil Cyfral
                  </h3>
                  <p className="text-gray-400 mt-2 leading-relaxed">
                    Эксклюзивный подкаст, в котором Lil Cyfral отвечает на вопросы о себе,
                    своём творчестве и жизни на улицах. Узнай всё из первых уст! 🔊
                  </p>
                </div>
              </div>
              <InlinePlayer itemId="podcast" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="section-divider max-w-4xl mx-auto" />

      {/* ═══ TRACKS ═══ */}
      <section id="tracks" className="relative z-10 px-4 md:px-8 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <SectionTitle glitch>🔥 ТРЕКИ</SectionTitle>
            <p className="text-gray-500 -mt-6 mb-10 text-lg" style={GRAFFITI}>
              Официальные релизы. Слушай на площадках или прямо здесь.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
            {TRACKS.map((track, i) => (
              <TrackCard key={track.id} track={track} index={i} />
            ))}
          </div>
        </div>
      </section>

      <MarqueeBanner />

      {/* ═══ DEMOS ═══ */}
      <section id="demos" className="relative z-10 px-4 md:px-8 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <SectionTitle>💀 ДЕМКИ</SectionTitle>
            <p className="text-gray-500 -mt-6 mb-10 text-lg" style={GRAFFITI}>
              {DEMOS.length} треков из андеграунда. Неизданное, сырое, настоящее.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {DEMOS.map((demo, i) => (
              <DemoItem key={demo.file} demo={demo} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="relative z-10 mt-8">
        <div className="section-divider" />
        <div className={`px-4 py-14 text-center space-y-4 ${showPadding ? 'pb-28' : ''}`}>
          <ScrollReveal>
            <p className="text-4xl md:text-5xl font-bold spray-text flicker" style={GRAFFITI}>
              LIL CYFRAL
            </p>
            <p className="text-gray-600 text-sm mt-4">
              © {new Date().getFullYear()} Lil Cyfral. Все права защищены.
            </p>
            <p className="text-gray-700 text-xs mt-2 tracking-widest" style={GRAFFITI}>
              🇷🇺 MADE IN RUSSIA
            </p>
          </ScrollReveal>
        </div>
      </footer>

      <GlobalPlayerBar />
      {/* Lazy render fullscreen player only when needed */}
      <Suspense fallback={null}>
        <FullscreenPlayer />
      </Suspense>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   FULLSCREEN PLAYER
   ════════════════════════════════════════════════════════ */

function FullscreenPlayer() {
  const {
    currentItem, isPlaying, progress, currentTime, duration,
    excursionOn, excursionRemaining,
    isFullscreen, setIsFullscreen, showQueue, setShowQueue,
    togglePlay, seekTo, next, prev,
    playbackOrder, setOrder,
    queue, currentQueueIndex, playItemById, moveQueueItem, reorderQueue,
    audioLevel,
  } = usePlayer();

  // Hide scrollbar while fullscreen is open (no scroll position hacks; should not lag)
  useEffect(() => {
    if (!isFullscreen) return;

    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyPadR = body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - html.clientWidth;

    html.classList.add('fullscreen-open');
    body.classList.add('fullscreen-open');

    // Prevent layout shift when scrollbar disappears
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      html.classList.remove('fullscreen-open');
      body.classList.remove('fullscreen-open');
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.paddingRight = prevBodyPadR;
    };
  }, [isFullscreen]);

  const isGlitchCore = isPlaying && currentItem != null && GLITCH_CORE_NAMES.includes(currentItem.name);

  const segments = useTrackSegments(currentItem?.id || null);
  
  // State for closing animation
  const [isClosing, setIsClosing] = useState(false);
  
  // Drag-and-drop state for fullscreen queue
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);



  
  // Simple “kick” glow when playback starts / track changes
  const [glowKick, setGlowKick] = useState(false);
  useEffect(() => {
    if (!isFullscreen) return;
    if (!isPlaying) {
      setGlowKick(false);
      return;
    }
    setGlowKick(true);
    const t = window.setTimeout(() => setGlowKick(false), 260);
    return () => window.clearTimeout(t);
  }, [isFullscreen, isPlaying, currentItem?.id]);

  if (!isFullscreen || !currentItem) return null;

  // Fullscreen glow is handled by CSS classes (is-playing / is-paused + glow-kick)

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    seekTo(Number(e.target.value));
  };
  
  // Handle close with animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setIsFullscreen(false);
    }, 500);
  };

  return (
    <div
      className={`fullscreen-player ${isClosing ? 'is-closing' : ''} ${isPlaying ? 'is-playing' : 'is-paused'} ${glowKick ? 'glow-kick' : ''} ${isGlitchCore ? 'glitch-core-mode' : ''}`}
      style={{ ['--al' as any]: audioLevel } as React.CSSProperties}
    >
      {/* Background with blur */}
      <div className="fullscreen-bg">
        {currentItem.cover ? (
          <img
            src={currentItem.cover}
            alt=""
            className={`fullscreen-bg-img ${isGlitchCore ? 'glitch-core-img' : ''}`}
          />
        ) : (
          <div className="fullscreen-bg-nocover" />
        )}
        <div className={`fullscreen-bg-overlay ${!currentItem.cover ? 'no-cover' : ''}`} />
      </div>

      {/* GLITCH CORE scanlines overlay */}
      {isGlitchCore && <div className="glitch-scanlines fullscreen-scanlines" />}

      {/* Close button — shifts left when queue is open */}
      <button
        onClick={handleClose}
        className={`fullscreen-close-btn ${showQueue ? 'queue-open' : ''}`}
        title="Свернуть"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
          <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Main content */}
      <div className={`fullscreen-content ${showQueue ? 'with-queue' : ''} ${isGlitchCore ? 'glitch-core-content' : ''}`}>
        {/* Cover + glow (simple, anchored, no gaps) */}
        <div className={`fullscreen-cover-wrap ${isPlaying ? 'is-playing' : 'is-paused'} ${glowKick ? 'glow-kick' : ''} ${isGlitchCore ? 'glitch-core-wrap' : ''}`}>
          <div className="fullscreen-cover-glow" />
          {currentItem.cover ? (
            <img
              src={currentItem.cover}
              alt={currentItem.name}
              className={`fullscreen-cover ${isPlaying ? 'is-playing' : ''} ${isGlitchCore ? 'glitch-core-img' : ''}`}
            />
          ) : (
            <div className="fullscreen-cover fullscreen-cover-placeholder">
              <span className="text-6xl">
                {currentItem.type === 'podcast' ? '🎙️' : currentItem.type === 'demo' ? '💀' : '🔥'}
              </span>
            </div>
          )}
        </div>

        {/* Track info */}
        <div className="fullscreen-info">
          <h2 className={`fullscreen-title ${isGlitchCore ? 'glitch-text-fast' : ''}`} style={GRAFFITI}>
            {currentItem.name}
          </h2>
          <p className={`fullscreen-artist ${isGlitchCore ? 'glitch-text-fast' : ''}`}>{currentItem.artist}</p>
        </div>

        {/* Progress bar */}
        <div className="fullscreen-progress-wrap">
          {segments ? (
            <FullscreenSegmentedProgress segments={segments} />
          ) : (
            <div className="fullscreen-progress-container">
              <div className="fullscreen-progress-track" />
              <div
                className="fullscreen-progress-fill"
                style={{ width: `${progress}%` }}
              />
              <div className="fullscreen-progress-thumb" style={{ left: `${progress}%` }} />

              {/* Keyboard seek flash (+5/-5) */}
              <SeekFlashBadge leftPct={progress} />

              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={progress}
                onChange={handleSeek}
                className="fullscreen-progress-range"
              />
            </div>
          )}
          <div className="fullscreen-time">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="fullscreen-controls">
          <button
            onClick={() => setOrder(playbackOrder === 'sequential' ? 'shuffle' : 'sequential')}
            className={`fullscreen-mode-btn ${playbackOrder === 'shuffle' ? 'is-shuffle' : ''}`}
            title={playbackOrder === 'sequential' ? 'Порядок' : 'Перемешка'}
          >
            {playbackOrder === 'shuffle' ? <IconShuffle className="w-5 h-5" /> : <IconSequential className="w-5 h-5" />}
          </button>

          <button onClick={prev} className="fullscreen-nav-btn" title="Назад">
            <IconPrev className="w-6 h-6" />
          </button>

          <button
            onClick={togglePlay}
            className={`fullscreen-play-btn ${isPlaying ? 'is-playing' : ''}`}
          >
            {isPlaying ? <IconPause className="w-8 h-8" /> : <IconPlay className="w-8 h-8" />}
          </button>

          <button onClick={next} className="fullscreen-nav-btn" title="Далее">
            <IconNext className="w-6 h-6" />
          </button>

          <button
            onClick={() => setShowQueue(!showQueue)}
            className={`fullscreen-queue-btn ${showQueue ? 'active' : ''}`}
            title="Очередь"
          >
            <IconQueue className="w-5 h-5" />
          </button>
        </div>

        {/* Excursion badge */}
        {excursionOn && isPlaying && (
          <div className="fullscreen-excursion">
            <IconExcursion className="w-4 h-4" />
            <span>{excursionRemaining}s</span>
          </div>
        )}
      </div>

      {/* Queue panel (right side) */}
      <div className={`fullscreen-queue-panel ${showQueue ? 'is-open' : ''} ${isGlitchCore ? 'glitch-core-panel' : ''}`}>
        <div className="fullscreen-queue-header">
            <span className="fullscreen-queue-title" style={GRAFFITI}>ОЧЕРЕДЬ</span>
            <button onClick={() => setShowQueue(false)} className="fullscreen-queue-close">
              <IconClose className="w-4 h-4" />
            </button>
          </div>
          <div className="fullscreen-queue-list">
            {queue.map((item, i) => {
              const isCurrent = i === currentQueueIndex;
              const isPast = i < currentQueueIndex;
              const canDrag = !isPast && !isCurrent;
              const isDragging = draggedIdx === i;
              const isDragOver = dragOverIdx === i && draggedIdx !== i;
              
              return (
                <div
                  key={item.id + '-fs-' + i}
                  className={`fullscreen-queue-item ${isCurrent ? 'is-current' : ''} ${isPast ? 'is-past' : ''} ${isDragging ? 'is-dragging' : ''} ${isDragOver ? 'is-drag-over' : ''}`}
                  draggable={canDrag}
                  onDragStart={(e) => {
                    if (!canDrag) return;
                    setDraggedIdx(i);
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/plain', String(i));
                  }}
                  onDragEnd={() => {
                    setDraggedIdx(null);
                    setDragOverIdx(null);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (draggedIdx !== null && i > currentQueueIndex && i !== draggedIdx) {
                      setDragOverIdx(i);
                    }
                  }}
                  onDragLeave={() => {
                    if (dragOverIdx === i) setDragOverIdx(null);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggedIdx !== null && i > currentQueueIndex && draggedIdx !== i) {
                      reorderQueue(draggedIdx, i);
                    }
                    setDraggedIdx(null);
                    setDragOverIdx(null);
                  }}
                >
                  {canDrag && (
                    <span className="fullscreen-queue-drag" title="Перетащи">⋮⋮</span>
                  )}
                  <button
                    onClick={() => playItemById(item.id)}
                    className="fullscreen-queue-btn-play"
                  >
                    <span className="fullscreen-queue-num">{isCurrent ? '▶' : i + 1}</span>
                    <span className="fullscreen-queue-name">{item.name}</span>
                  </button>
                  {canDrag && (
                    <div className="fullscreen-queue-arrows">
                      <button onClick={() => moveQueueItem(i, 'up')}>▲</button>
                      <button onClick={() => moveQueueItem(i, 'down')}>▼</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   FULLSCREEN SEGMENTED PROGRESS
   ════════════════════════════════════════════════════════ */

function FullscreenSegmentedProgress({ segments }: { segments: TrackSegment[] }) {
  const { progress, currentTime, duration, seekTo, audioLevel, isPlaying } = usePlayer();

  const [hovered, setHovered] = useState<TrackSegment | null>(null);
  const [hoverMidPct, setHoverMidPct] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = duration || 200;
  const layout = getSegmentsLayout(segments, total);
  const currentSeg = getSegmentAtTime(segments, currentTime);

  const glowIntensity = Math.min(1, audioLevel * 2.5);

  const handlePointerMove = (e: React.PointerEvent<HTMLInputElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return;
    const x = Math.min(rect.width, Math.max(0, e.clientX - rect.left));
    const pct = (x / rect.width) * 100;

    const segLayout = layout.find((l) => pct >= l.startPct && pct <= l.endPct) ?? layout[layout.length - 1];
    if (!segLayout) return;

    setHovered((prev) => (prev?.artist === segLayout.segment.artist ? prev : segLayout.segment));
    setHoverMidPct(segLayout.midPct);
  };

  const clearHover = () => setHovered(null);

  return (
    <div className="fullscreen-progress-container is-segmented" ref={containerRef}>
      <div className="fullscreen-progress-track" />

      {/* Keyboard seek flash (+5/-5) */}
      <SeekFlashBadge leftPct={progress} />

      {/* Colored segments */}
      <div className="fullscreen-progress-segments">
        {layout.map((l, i) => (
          <div
            key={l.segment.artist + '-fsseg-' + i}
            className={`fullscreen-progress-seg ${currentSeg.artist === l.segment.artist ? 'is-current' : ''} ${hovered?.artist === l.segment.artist ? 'is-hover' : ''}`}
            style={{
              width: `${l.widthPct}%`,
              backgroundColor: hexToRgba(l.segment.color, 0.25),
            }}
          />
        ))}
      </div>

      <div
        className="fullscreen-progress-fill"
        style={{
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${hexToRgba(currentSeg.color, 0.6)}, ${hexToRgba(currentSeg.color, 0.95)})`,
          boxShadow: isPlaying
            ? `0 0 ${12 + glowIntensity * 20}px ${hexToRgba(currentSeg.color, 0.4 + glowIntensity * 0.4)}`
            : `0 0 10px ${hexToRgba(currentSeg.color, 0.3)}`,
        }}
      />

      <div
        className="fullscreen-progress-thumb"
        style={{
          left: `${progress}%`,
          background: currentSeg.color,
          boxShadow: `0 0 14px ${hexToRgba(currentSeg.color, 0.6)}, 0 0 5px rgba(0,0,0,0.5)`,
        }}
      />

      <input
        type="range"
        min="0"
        max="100"
        step="0.1"
        value={progress}
        onChange={(e) => seekTo(Number(e.target.value))}
        onPointerMove={handlePointerMove}
        onPointerLeave={clearHover}
        onPointerDown={handlePointerMove}
        className="fullscreen-progress-range"
      />

      {/* Current artist display */}
      <div className="fullscreen-current-artist" style={{ color: currentSeg.color }}>
        {currentSeg.artist}
      </div>

      {/* Tooltip */}
      {hovered && (
        <div
          className="fullscreen-tooltip"
          style={{
            left: `${hoverMidPct}%`,
            color: hovered.color,
            borderColor: hovered.color,
            background: `linear-gradient(135deg, rgba(0,0,0,0.95), ${hexToRgba(hovered.color, 0.15)})`,
          }}
        >
          {hovered.artist}
        </div>
      )}
    </div>
  );
}
