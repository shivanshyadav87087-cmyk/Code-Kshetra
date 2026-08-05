// Dynamic Festival & Live Public Calendar API Engine with HD Photography

export const FESTIVALS = [
  {
    id: 'independence-day-india',
    name: 'Independence Day',
    flag: '🇮🇳',
    icon: '🎆',
    imageUrl: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=800&q=80',
    month: 8, // August
    day: 15,
    title: 'Happy Independence Day! 🇮🇳 🎆',
    wishingText: 'Wishing you a proud and joyful 79th Independence Day! Code, innovate & build for the nation on Code क्षेत्र!',
    bgGradient: 'from-amber-600/30 via-slate-900 to-emerald-600/30',
    borderColor: 'border-amber-500/50',
    textColor: 'text-amber-300'
  },
  {
    id: 'janmashtami',
    name: 'Krishna Janmashtami',
    flag: '🪈',
    icon: '✨',
    imageUrl: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=800&q=80',
    month: 8, // August
    day: 16,
    title: 'Happy Krishna Janmashtami! 🪈✨',
    wishingText: 'May Lord Krishna fill your life with joy, wisdom, and victory in every 1v1 coding battle!',
    bgGradient: 'from-cyan-600/30 via-slate-900 to-purple-600/30',
    borderColor: 'border-cyan-500/50',
    textColor: 'text-cyan-300'
  },
  {
    id: 'raksha-bandhan',
    name: 'Raksha Bandhan',
    flag: '🧵',
    icon: '💖',
    imageUrl: 'https://images.unsplash.com/photo-1629813292419-74d39f7a7504?auto=format&fit=crop&w=800&q=80',
    month: 8, // August
    day: 9,
    title: 'Happy Raksha Bandhan! 🧵✨',
    wishingText: 'Celebrating the sacred bond of love, protection, and companionship. Happy Raksha Bandhan from Code क्षेत्र!',
    bgGradient: 'from-rose-600/30 via-slate-900 to-purple-600/30',
    borderColor: 'border-rose-500/50',
    textColor: 'text-rose-300'
  },
  {
    id: 'ganesh-chaturthi',
    name: 'Ganesh Chaturthi',
    flag: '🐘',
    icon: '🌺',
    imageUrl: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80',
    month: 9, // September
    day: 7,
    title: 'Happy Ganesh Chaturthi! 🐘🌸',
    wishingText: 'May Lord Ganesha remove all obstacles and bugs from your code! Wish you wisdom and high ELO ratings!',
    bgGradient: 'from-amber-600/30 via-slate-900 to-rose-600/30',
    borderColor: 'border-amber-500/50',
    textColor: 'text-amber-300'
  },
  {
    id: 'diwali',
    name: 'Diwali',
    flag: '🪔',
    icon: '✨',
    imageUrl: 'https://images.unsplash.com/photo-1605335870020-f5a01bf5788d?auto=format&fit=crop&w=800&q=80',
    month: 11, // November
    day: 1,
    title: 'Happy Diwali! 🪔✨',
    wishingText: 'May the festival of lights illuminate your path with joy, prosperity, and green testcases!',
    bgGradient: 'from-amber-500/35 via-purple-900/50 to-yellow-500/35',
    borderColor: 'border-amber-400/60',
    textColor: 'text-amber-200'
  },
  {
    id: 'republic-day-india',
    name: 'Republic Day',
    flag: '🇮🇳',
    icon: '🕊️',
    imageUrl: 'https://images.unsplash.com/photo-1569083345305-b1a134375b47?auto=format&fit=crop&w=800&q=80',
    month: 1, // January
    day: 26,
    title: 'Happy Republic Day! 🇮🇳 🕊️',
    wishingText: 'Saluting the spirit of India! Wishing everyone a proud Happy Republic Day. Code for progress!',
    bgGradient: 'from-amber-600/30 via-slate-900 to-emerald-600/30',
    borderColor: 'border-emerald-500/50',
    textColor: 'text-emerald-300'
  },
  {
    id: 'new-year',
    name: 'New Year\'s Day',
    flag: '🎆',
    icon: '🥂',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    month: 1, // January
    day: 1,
    title: 'Happy New Year! 🎆🥂',
    wishingText: 'Welcome to the New Year! May your year be filled with 100% testcase acceptance and peak ELO ratings!',
    bgGradient: 'from-cyan-600/30 via-purple-900/50 to-emerald-600/30',
    borderColor: 'border-cyan-400/60',
    textColor: 'text-cyan-200'
  },
  {
    id: 'christmas',
    name: 'Merry Christmas',
    flag: '🎄',
    icon: '🎁',
    imageUrl: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&w=800&q=80',
    month: 12, // December
    day: 25,
    title: 'Merry Christmas! 🎄🎁',
    wishingText: 'Wishing you peace, joy, and happiness this festive season. Merry Christmas from Code क्षेत्र!',
    bgGradient: 'from-rose-600/30 via-slate-900 to-emerald-600/30',
    borderColor: 'border-rose-500/50',
    textColor: 'text-rose-300'
  },
  {
    id: 'holi',
    name: 'Holi',
    flag: '🎨',
    icon: '🌈',
    imageUrl: 'https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?auto=format&fit=crop&w=800&q=80',
    month: 3, // March
    day: 25,
    title: 'Happy Holi! 🎨🌈',
    wishingText: 'May your life be filled with vibrant colors of happiness, good health, and competitive victory!',
    bgGradient: 'from-pink-600/30 via-purple-900/50 to-cyan-600/30',
    borderColor: 'border-pink-500/50',
    textColor: 'text-pink-300'
  }
];

// Live Public Calendar API Fetcher (Nager.Date API)
export async function fetchLivePublicHolidays(countryCode = 'IN') {
  const currentYear = new Date().getFullYear();
  const cacheKey = `public_holidays_${countryCode}_${currentYear}`;

  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${currentYear}/${countryCode}`);
    if (!res.ok) return [];

    const data = await res.json();
    sessionStorage.setItem(cacheKey, JSON.stringify(data));
    return data;
  } catch (e) {
    return [];
  }
}

export function getCurrentFestival(customDate = null) {
  const now = customDate ? new Date(customDate) : new Date();
  const currentMonth = now.getMonth() + 1; // 1-indexed
  const currentDay = now.getDate();

  // 1. Exact Date Match
  const exactMatch = FESTIVALS.find(f => f.month === currentMonth && f.day === currentDay);
  if (exactMatch) return exactMatch;

  // 2. Window Match (+/- 3 days around major festival)
  const windowMatch = FESTIVALS.find(f => {
    if (f.month === currentMonth && Math.abs(f.day - currentDay) <= 3) {
      return true;
    }
    return false;
  });
  if (windowMatch) return windowMatch;

  // 3. Fallback: Always return Independence Day / National Pride Greetings for August month!
  if (currentMonth === 8) {
    return FESTIVALS.find(f => f.id === 'independence-day-india');
  }

  return null;
}

export async function getAsyncCurrentFestival(countryCode = 'IN') {
  const localMatch = getCurrentFestival();

  // Fetch live public holidays from Nager.Date API
  const liveHolidays = await fetchLivePublicHolidays(countryCode);
  const todayStr = new Date().toISOString().split('T')[0];

  const todayHoliday = liveHolidays.find(h => h.date === todayStr);

  if (todayHoliday) {
    return {
      id: todayHoliday.name.toLowerCase().replace(/\s+/g, '-'),
      name: todayHoliday.localName || todayHoliday.name,
      flag: '🎆',
      icon: '✨',
      imageUrl: localMatch?.imageUrl || 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=800&q=80',
      title: `Happy ${todayHoliday.localName || todayHoliday.name}! ✨`,
      wishingText: `Celebrating ${todayHoliday.name}! Wishing you happiness, prosperity, and zero bugs from Code क्षेत्र!`,
      bgGradient: localMatch?.bgGradient || 'from-amber-600/30 via-slate-900 to-purple-600/30',
      borderColor: localMatch?.borderColor || 'border-amber-500/50',
      textColor: localMatch?.textColor || 'text-amber-300'
    };
  }

  return localMatch;
}
