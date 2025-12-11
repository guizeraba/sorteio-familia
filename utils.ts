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

// Algoritmo de Sorteio: Fisher-Yates shuffle + Ciclo Único (Circular)
// Garante que A -> B -> C -> ... -> A
export const performDraw = (names: string[]): DrawResult[] => {
  if (names.length < 2) return [];

  // 1. Cria uma cópia da lista para embaralhar
  const shuffled = [...names];

  // 2. Embaralha a lista (Fisher-Yates Shuffle)
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // 3. Cria o Ciclo Único: Pessoa na posição i tira Pessoa na posição i+1
  // A última pessoa da lista tira a primeira.
  const results: DrawResult[] = shuffled.map((giver, index) => {
    // Pega o índice do próximo (ou volta para 0 se for o último)
    const receiverIndex = (index + 1) % shuffled.length;
    
    return {
      giver: giver,
      receiver: shuffled[receiverIndex],
    };
  });

  return results;
};