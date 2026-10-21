export interface Cover {
  url: string;
  alt: string;
  credit: string;
  creditUrl: string;
}

/**
 * Unsplash API (free key). Their rules: hotlink the returned URL, show credit
 * to the photographer, and ping `download_location` when a photo is used.
 */
export async function findCover(query: string): Promise<Cover | null> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return null;
  const res = await fetch(
    `https://api.unsplash.com/search/photos?per_page=1&orientation=landscape&query=${encodeURIComponent(query)}`,
    { headers: { Authorization: `Client-ID ${key}` } }
  );
  if (!res.ok) return null;
  const photo = (await res.json()).results?.[0];
  if (!photo) return null;
  fetch(photo.links.download_location, { headers: { Authorization: `Client-ID ${key}` } }).catch(() => {});
  return {
    url: `${photo.urls.raw}&w=1600&h=900&fit=crop&auto=format&q=75`,
    alt: photo.alt_description ?? query,
    credit: photo.user.name,
    creditUrl: `${photo.user.links.html}?utm_source=oneclick_tools&utm_medium=referral`,
  };
}
