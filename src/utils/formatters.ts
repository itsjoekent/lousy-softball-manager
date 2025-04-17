export const inningFormat = (inning: number) =>
  `${
    inning === 1
      ? '1st'
      : inning === 2
      ? '2nd'
      : inning === 3
      ? '3rd'
      : `${inning}th`
  }`;

export function positionRankEmoji(value: number) {
  switch (value) {
    case 0: return '🛑';
    case 1: return '⚠️';
    case 2: return '👍';
    case 3: return '👌';
    case 4: return '⭐';
    case 5: return '🌟';
    default: return '❓';
  }
}
