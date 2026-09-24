/**
 * Format date in Indian convention (e.g., "23 Sep 2026", "4:20 PM"):
 * - Uses Asia/Kolkata timezone
 * - Format: DD MMM YYYY (or Today/Yesterday for recent items)
 */
export function formatDate(dateString, includeTime = false) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—';

  const timeZone = 'Asia/Kolkata';

  // Format time in Asia/Kolkata
  const timeStr = date.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone,
  });

  // Check today / yesterday in Kolkata time
  const now = new Date();
  const kolkataNowStr = now.toLocaleDateString('en-CA', { timeZone });
  const kolkataDateStr = date.toLocaleDateString('en-CA', { timeZone });

  const nowDate = new Date(kolkataNowStr);
  const targetDate = new Date(kolkataDateStr);
  const diffDays = Math.round((nowDate - targetDate) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return `Today, ${timeStr}`;
  }

  if (diffDays === 1) {
    return `Yesterday, ${timeStr}`;
  }

  // Consistent DD MMM YYYY format (e.g. "23 Sep 2026")
  const day = date.toLocaleDateString('en-IN', { day: '2-digit', timeZone });
  const month = date.toLocaleDateString('en-IN', { month: 'short', timeZone });
  const year = date.toLocaleDateString('en-IN', { year: 'numeric', timeZone });
  const dateFormatted = `${day} ${month} ${year}`;

  return includeTime ? `${dateFormatted} • ${timeStr}` : dateFormatted;
}

/**
 * Format relative ticket age for Needs Attention (e.g. "2d old", "26h old", "1d old")
 */
export function formatTicketAge(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—';

  const now = new Date();
  const diffMs = Math.max(0, now.getTime() - date.getTime());
  const diffMinutes = Math.floor(diffMs / (60 * 1000));
  const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) {
    return `${Math.max(1, diffMinutes)}m old`;
  }
  if (diffHours < 48) {
    return `${diffHours}h old`;
  }
  return `${diffDays}d old`;
}

/**
 * Returns user initials from full name, e.g. "Rahul Sharma" -> "RS"
 */
export function getInitials(name) {
  if (!name || typeof name !== 'string') return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Returns a consistent soft background color based on name string for avatar
 */
export function getAvatarColor(name) {
  const colors = [
    'bg-indigo-100 text-indigo-700',
    'bg-blue-100 text-blue-700',
    'bg-emerald-100 text-emerald-700',
    'bg-violet-100 text-violet-700',
    'bg-rose-100 text-rose-700',
    'bg-amber-100 text-amber-700',
    'bg-cyan-100 text-cyan-700',
  ];
  if (!name) return colors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
