import type {
  DefensiveConfiguration,
  SimulateDefenseRequestEvent,
  SimulateDefenseResponseEvent,
  PositionId,
} from '../types';
import { generateDefense } from './defense-generator';

self.onmessage = function (event: MessageEvent<SimulateDefenseRequestEvent>) {
  const { fromInning, game, roster } = event.data;

  try {
    const possibleDefenses: DefensiveConfiguration[][] = [];

    for (let i = 0; i < 100; i++) {
      possibleDefenses.push(generateDefense(roster, game, fromInning));
    }

    const highestRatedDefense = possibleDefenses.reduce<[number, ReturnType<typeof generateDefense>]>((highest, current) => {
      const total = current.reduce((inningsTotal, inning) => {
        const inningTotal = Object.keys(inning.positions).reduce(
          (acc, positionId) => {
            const player = roster.find(
              (player) =>
                player.id === inning.positions[positionId as PositionId]
            );
            if (!player)
              throw new Error(
                `Player with id ${
                  inning.positions[positionId as PositionId]
                } not found in roster`
              );
            return acc + Math.pow(2, player.positions[positionId as PositionId]);
          },
          0
        );

        return inningsTotal + inningTotal;
      }, 0);

      if (total > highest[0]) {
        return [total, current];
      }
      return highest;
    }, [0, possibleDefenses[0]]);

    const response: SimulateDefenseResponseEvent = {
      defense: highestRatedDefense[1],
    };

    self.postMessage(response);
  } catch (error) {
    console.error('Error generating defense:', error);
    self.postMessage({ error: 'Error generating defense' });
  }
};

export {};
