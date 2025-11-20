export default function unpack(rows, key) {
  // Defensive: empty input
  if (!rows || rows.length === 0) return [];

  // If the exact key exists use it, otherwise try to find a matching key
  const first = rows[0];
  let usedKey = null;
  if (Object.prototype.hasOwnProperty.call(first, key)) {
    usedKey = key;
  } else {
    // try to match by trimmed key or case-insensitive trimmed
    const keys = Object.keys(first);
    usedKey = keys.find((k) => k.trim() === key.trim());
    if (!usedKey) {
      usedKey = keys.find((k) => k.trim().toLowerCase() === key.trim().toLowerCase());
    }
  }

  if (!usedKey) {
    // no matching key found; return array of undefined so caller can handle
    return rows.map(() => undefined);
  }

  // Map and convert numeric-looking strings to numbers; trim strings
  return rows.map((row) => {
    const raw = row[usedKey];
    if (raw === null || raw === undefined) return undefined;
    const str = String(raw).trim();
    // Try numeric conversion. We allow floats and integers. If conversion fails, return trimmed string.
    const num = Number(str);
    if (str === "" || Number.isNaN(num)) return str;
    return num;
  });
}
