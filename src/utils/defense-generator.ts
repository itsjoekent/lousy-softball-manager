import { baseInnings, fieldingStrategies } from '../constants';
import type { DefensiveConfiguration, Game, Player, PositionId, Roster } from '../types';

function findAllNonMalePlayersInGame(
  roster: Roster,
  game: Game
): Player['id'][] {
  const playerIds = game.availablePlayerIds;
  return roster
    .filter((player) => playerIds.includes(player.id) && !player.isMale)
    .map((player) => player.id);
}

function findAllFieldablePlayersInGame(
  roster: Roster,
  game: Game
): Player['id'][] {
  const playerIds = game.availablePlayerIds;
  return roster
    .filter((player) => playerIds.includes(player.id) && player.positions.DH === 0)
    .map((player) => player.id);
}

export function generateDefense(
  roster: Roster,
  game: Game,
  fromInning: number
): DefensiveConfiguration[] {
  const gameDefense: DefensiveConfiguration[] = game.defense;

  function generateDefenseForInning(inning: number): DefensiveConfiguration {
    const nonMalePlayerIds = findAllNonMalePlayersInGame(roster, game);
    const nonMalePlayersOnField =
      nonMalePlayerIds.length >= 3 ? 3 : nonMalePlayerIds.length;
    const maxDefensivePlayers = nonMalePlayerIds.length >= 3 ? 10 : 9;

    const fieldablePlayerIds = findAllFieldablePlayersInGame(roster, game);
    const fieldablePlayers = fieldablePlayerIds.map((id) => {
      const player = roster.find((player) => player.id === id);
      if (!player) throw new Error(`Player with id ${id} not found in roster`);
      return player;
    });

    function generateDefenseForFieldingStrategy(
      fieldingStrategy: PositionId[]
    ): DefensiveConfiguration {
      const inningDefense: DefensiveConfiguration = {
        positions: {},
        bench: [],
      };

      const positionOptions = fieldingStrategy.map((positionId) => {
        return fieldablePlayers.filter(
          (player) => player.positions[positionId] > 0
        );
      });

      positionOptions.forEach((positionStack, index) => {
        if (positionStack.length === 0) {
          throw new Error(
            `No player found for position ${fieldingStrategy[index]}`
          );
        }

        if (positionStack.length === 1) {
          const player = positionStack[0];
          inningDefense.positions[fieldingStrategy[index]] = player.id;
        }
      });

      const allRemainingPlayers = fieldablePlayers.filter(
        (player) => !Object.values(inningDefense.positions).includes(player.id)
      );

      function generateBench(
        benchSize: number,
        fieldSize: number,
        playerPool: Player[]
      ): Player[] {
        if (benchSize <= 0) return [];

        const minSitOuts = Math.round(playerPool.length / fieldSize);

        const playersBySitouts: Record<number, Player[]> = {};

        playerPool.forEach((player) => {
          let sits = 0;
          for (let i = 0; i < inning; i++) {
            if (
              gameDefense[i].bench &&
              gameDefense[i].bench.includes(player.id)
            ) {
              sits++;
            }
          }

          if (!playersBySitouts[sits]) {
            playersBySitouts[sits] = [];
          }

          playersBySitouts[sits].push(player);
        });

        const bench: Player[] = [];

        function pick() {
          const options: Player[] = [];
          const sits = Object.keys(playersBySitouts).map((sitsStr) =>
            parseInt(sitsStr)
          );

          sits.forEach((totalSits) => {
            if (totalSits <= minSitOuts) {
              const possiblePlayers = playersBySitouts[totalSits].filter(
                (player) =>
                  player && bench.find((p) => p.id === player.id) === undefined
              );
              options.push(...possiblePlayers);
            }
          });

          if (options.length <= 0) {
            const finalPossiblePlayers = sits.reduce<Player[]>((acc, sitKey) => {
              if (acc.length > 0) return acc;
              const possiblePlayers = playersBySitouts[sitKey].filter(
                (player) =>
                  player && bench.find((p) => p.id === player.id) === undefined
              );

              if (possiblePlayers.length > 0) {
                return possiblePlayers;
              }

              return [];
            }, []);

            options.push(...finalPossiblePlayers);
          }

          if (options.length <= 0) {
            throw new Error(`No players available to fill bench`);
          }

          return options[Math.floor(Math.random() * options.length)];
        }

        for (let i = 0; i < benchSize; i++) {
          bench.push(pick());
        }

        return bench;
      }

      function assignRemainingPositions(
        fieldSize: number,
        totalFieldablePlayers: number,
        remainingPlayers: Player[]
      ) {
        const benchSize = Math.max(totalFieldablePlayers - fieldSize, 0);

        const bench = generateBench(benchSize, fieldSize, remainingPlayers);
        inningDefense.bench = bench.map((player) => player.id);

        const nonBenchedPlayers = remainingPlayers.filter(
          (player) => !inningDefense.bench.includes(player.id)
        );

        const playersSortedByVersatility = nonBenchedPlayers.sort((a, b) => {
          const aPositions = Object.values(a.positions).reduce(
            (a, b) => a + b,
            0
          );
          const bPositions = Object.values(b.positions).reduce(
            (a, b) => a + b,
            0
          );
          return aPositions - bPositions;
        });

        playersSortedByVersatility.forEach((player) => {
          const playerPositions = Object.entries(player.positions)
            .filter(([positionId]) =>
              fieldingStrategy.includes(positionId as PositionId)
            )
            .sort(([, a], [, b]) => b - a);

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          for (const [positionId, _] of playerPositions) {
            if (!inningDefense.positions[positionId as PositionId]) {
              inningDefense.positions[positionId as PositionId] = player.id;
              break;
            }
          }
        });
      }

      const totalFieldableNonMalePlayers = fieldablePlayers.filter(
        (player) => player.isMale === false
      ).length;
      const remainingNonMalePlayers = allRemainingPlayers.filter(
        (player) => !player.isMale
      );
      assignRemainingPositions(
        nonMalePlayersOnField,
        totalFieldableNonMalePlayers,
        remainingNonMalePlayers
      );

      const totalFieldableMalePlayers = fieldablePlayers.filter(
        (player) => player.isMale === true
      ).length;
      const remainingMalePlayers = allRemainingPlayers.filter(
        (player) => player.isMale
      );
      assignRemainingPositions(
        maxDefensivePlayers - nonMalePlayersOnField,
        totalFieldableMalePlayers,
        remainingMalePlayers
      );

      const positionIds = Object.keys(inningDefense.positions) as PositionId[];

      for (let swapIndex = 0; swapIndex < 3; swapIndex++) {
        for (const positionId of positionIds) {
          const player = roster.find(
            (player) => player.id === inningDefense.positions[positionId]
          );
          if (!player)
            throw new Error(
              `Player with id ${inningDefense.positions[positionId]} not found in roster`
            );

          const swapWith = positionIds.reduce<{
            score: number;
            playerId: null | Player['id'];
            positionId: PositionId;
          }>(
            (acc, comparePid) => {
              if (positionId === comparePid) return acc;

              const comparePlayer = roster.find(
                (player) => player.id === inningDefense.positions[comparePid]
              );

              if (!comparePlayer)
                throw new Error(
                  `Player at position ${comparePid} with id ${inningDefense.positions[comparePid]} not found in roster`
                );

              const compareScore = comparePlayer.positions[positionId];

              if (compareScore > acc.score) {
                return {
                  score: compareScore,
                  playerId: comparePlayer.id,
                  positionId: comparePid,
                };
              }

              return acc;
            },
            {
              score: player.positions[positionId],
              playerId: null,
              positionId: '1B',
            }
          );

          if (swapWith.playerId) {
            const swapWithPlayer = roster.find(
              (player) => player.id === swapWith.playerId
            );

            if (!swapWithPlayer) {
              throw new Error(
                `Player with id ${swapWith.playerId} not found in roster`
              );
            }

            if (
              player.positions[swapWith.positionId] > 0 &&
              swapWithPlayer.positions[positionId] >
              player.positions[positionId]
            ) {
              inningDefense.positions[positionId] = swapWith.playerId;
              inningDefense.positions[swapWith.positionId] = player.id;
            }
          }

          // if (swapWith.playerId && player.positions[swapWith.positionId] > 0) {
          //   inningDefense.positions[positionId] = swapWith.playerId;
          //   inningDefense.positions[swapWith.positionId] = player.id;
          // }
        }
      }

      return inningDefense;
    }

    const possibleFieldingStrategies = fieldingStrategies.filter(
      (strategy) => strategy.length === maxDefensivePlayers
    );

    const possibleDefenses = possibleFieldingStrategies.map((strategy) => {
      const inningDefense = generateDefenseForFieldingStrategy(strategy);
      return inningDefense;
    });

    return possibleDefenses.reduce<[number, DefensiveConfiguration]>(
      (acc, inningDefense) => {
        const score = Object.keys(inningDefense.positions).reduce(
          (acc, positionId) => {
            const player = roster.find(
              (player) => player.id === inningDefense.positions[positionId as PositionId]
            );
            if (!player)
              throw new Error(
                `Player with id ${inningDefense.positions[positionId as PositionId]} not found in roster`
              );
            return acc + player.positions[positionId as PositionId];
          },
          0
        );

        if (score > acc[0]) {
          return [score, inningDefense];
        }

        return acc;
      }, [0, possibleDefenses[0]])[1];
  }

  for (let inning = fromInning; inning < baseInnings; inning ++) {
    const inningDefense = generateDefenseForInning(inning);
    gameDefense[inning] = inningDefense;
  }

  return gameDefense;
}
