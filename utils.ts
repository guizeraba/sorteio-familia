import { DrawResult, DecodedSecret } from './types';

// Encodes text to Base64 specifically handling UTF-8 strings
export const encodeSecret = (data: DecodedSecret): string => {
  const json = JSON.stringify(data);
  return btoa(
    encodeURIComponent(json).replace(/%([0-9A-F]{2})/g,
      function toSolidBytes(match, p1) {
        return String.fromCharCode(parseInt(p1, 16));
      })
  );
};

// Decodes Base64 to text handling UTF-8
export const decodeSecret = (str: string): DecodedSecret | null => {
  try {
    const json = decodeURIComponent(
      atob(str)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(json);
  } catch (e) {
    console.error("Failed to decode secret", e);
    return null;
  }
};

// Fisher-Yates shuffle + Derangement check
export const performDraw = (names: string[]): DrawResult[] => {
  if (names.length < 2) return [];

  let shuffled: string[] = [];
  let isValid = false;
  
  // Try to find a valid derangement (no one picks themselves)
  // With small N, this is very fast.
  while (!isValid) {
    shuffled = [...names];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    isValid = names.every((name, index) => name !== shuffled[index]);
  }

  return names.map((name, index) => ({
    giver: name,
    receiver: shuffled[index],
  }));
};
