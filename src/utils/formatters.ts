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
