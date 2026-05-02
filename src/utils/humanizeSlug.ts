export const humanizeSlug = (slug: string): string => {
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};
