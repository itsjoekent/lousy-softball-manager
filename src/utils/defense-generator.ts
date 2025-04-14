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
    const inningDefense: DefensiveConfiguration = {
      positions: {},
      bench: [],
    };

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

    // TODO: Set strategy based on max defensive players (3 out)
    // TODO: Compare short center vs 4 out
    const fieldingStrategy = fieldingStrategies[1];
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
      let options: Player[] = [];

      // TODO: aggregate players by times they've sat out
      // random pick from players that have sat out the least to ensure even distribution

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

        if (sits < minSitOuts) {
          options.push(player);
        }
      });

      const bench: Player[] = [];

      function pick() {
        if (!options.length) {
          options = [...playerPool].filter((player) => !bench.find((p => p.id === player.id)));
          console.log(
            inning,
            options.map((player) => player.name).join(', '),
            bench.map((player) => player.name).join(', ')
          );
        }

        const selectionIndex = Math.floor(Math.random() * options.length);
        const selectedPlayer = options[selectionIndex];
        options = options.filter((_, index) => index !== selectionIndex);

        return selectedPlayer;
      }

      for (let i = 0; i < benchSize; i++) {
        bench.push(pick());
      }

      return bench;
    }
    
    function assignRemainingPositions(fieldSize: number, totalFieldablePlayers: number, remainingPlayers: Player[]) {
      const benchSize = Math.max(totalFieldablePlayers - fieldSize, 0);

      const bench = generateBench(benchSize, fieldSize, remainingPlayers);
      inningDefense.bench = bench.map((player) => player.id);

      const nonBenchedPlayers = remainingPlayers.filter(
        (player) => !inningDefense.bench.includes(player.id)
      );

      const playersSortedByVersatility = nonBenchedPlayers.sort((a, b) => {
        const aPositions = Object.values(a.positions).reduce((a, b) => a + b, 0);
        const bPositions = Object.values(b.positions).reduce((a, b) => a + b, 0);
        return aPositions - bPositions;
      });

      playersSortedByVersatility.forEach((player) => {
        const playerPositions = Object.entries(player.positions)
          .filter(([positionId]) => fieldingStrategy.includes(positionId as PositionId))
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
    const remainingNonMalePlayers = allRemainingPlayers.filter((player) => !player.isMale);
    assignRemainingPositions(nonMalePlayersOnField, totalFieldableNonMalePlayers, remainingNonMalePlayers);

    const totalFieldableMalePlayers = fieldablePlayers.filter(
      (player) => player.isMale === true
    ).length;
    const remainingMalePlayers = allRemainingPlayers.filter((player) => player.isMale);
    assignRemainingPositions(
      maxDefensivePlayers - nonMalePlayersOnField,
      totalFieldableMalePlayers,
      remainingMalePlayers
    );

    // Swap any players that are in the field but might have better available positions if they swap with someone else

    return inningDefense;
  }

  for (let inning = fromInning; inning < baseInnings; inning ++) {
    const inningDefense = generateDefenseForInning(inning);
    gameDefense[inning] = inningDefense;
  }

  return gameDefense;
}
