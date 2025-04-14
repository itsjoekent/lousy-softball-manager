import type { Player, State } from '../types';

export type SetLineupAction = {
  type: 'SET_LINEUP';
  inning: number;
  playerIds: Player['id'][];
};

export function setLineup(inning: number, playerIds: Player['id'][]): SetLineupAction {
  return {
    type: 'SET_LINEUP',
    inning,
    playerIds,
  };
}

export function onSetLineup(state: State, action: SetLineupAction): State {
  if (!state.game) throw new Error('Game not started');

  const updatedLineups = [...state.game.lineups];
  updatedLineups[action.inning] = action.playerIds;

  return {
    ...state,
    game: {
      ...state.game,
      lineups: updatedLineups,
    },
  };
}
