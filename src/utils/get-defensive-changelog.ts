import type { DefensiveConfiguration, PositionId, State } from '../types';
import { positionLabels } from '../constants';

function getPositionForPlayer(playerId: string, defense: DefensiveConfiguration): PositionId | null {
  const positions = Object.entries(defense.positions); 

  for (const [p, id] of positions) {
    if (id === playerId) {
      return p as PositionId;
    }
  }

  return null;
}

export function getDefensiveChangelog(state: State, inning: number): string[] | null {
  if (inning === 0) return null;
  if (!state.game) return null;

  const defense = state.game.defense[inning];
  if (!defense) return null;

  const priorInningDefense = state.game.defense[inning - 1];

  return state.game.availablePlayerIds.map((playerId) => {
    const playerName = state.roster.find((player) => player.id === playerId)?.name;
    const priorPosition = getPositionForPlayer(playerId, priorInningDefense);
    const currentPosition = getPositionForPlayer(playerId, defense);

    if (priorPosition === currentPosition) return null;

    if (priorPosition === null && currentPosition !== null) {
      return `${playerName} enters at ${positionLabels[currentPosition]}`;
    }

    if (priorPosition !== null && currentPosition === null) {
      return `${playerName} goes to the bench`;
    }

    if (priorPosition !== null && currentPosition !== null) {
      return `${playerName} moves from ${positionLabels[priorPosition]} to ${positionLabels[currentPosition]}`;
    }

    throw new Error('Unexpected state: this should never happen');
  }).filter((line) => line !== null);
}
