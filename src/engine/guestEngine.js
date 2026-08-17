const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://code-kshetra.onrender.com';

/**
 * Sequential Guest Handle Engine
 * Generates handles strictly in sequence: Guest1, Guest2, Guest3 ... GuestN
 */
export async function getNextGuestHandle() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/next-guest`);
    const data = await res.json();
    if (data && data.guestHandle) {
      localStorage.setItem('codeclash_guest_number', String(data.guestNumber));
      return data.guestHandle;
    }
  } catch (e) {}

  // Fallback sequential counter via localStorage
  let lastNum = parseInt(localStorage.getItem('codeclash_guest_number') || '0', 10);
  if (isNaN(lastNum) || lastNum < 0) lastNum = 0;
  const nextNum = lastNum + 1;
  localStorage.setItem('codeclash_guest_number', String(nextNum));
  return `Guest${nextNum}`;
}

export function getLocalGuestHandle() {
  const savedUser = localStorage.getItem('codeclash_user');
  if (savedUser) {
    try {
      const parsed = JSON.parse(savedUser);
      if (parsed.username || parsed.name) return parsed.username || parsed.name;
    } catch (e) {}
  }

  let lastNum = parseInt(localStorage.getItem('codeclash_guest_number') || '1', 10);
  if (isNaN(lastNum) || lastNum < 1) lastNum = 1;
  return `Guest${lastNum}`;
}
