import type { State } from '../types';
import { baseInnings } from '../constants';

export type StartNewGameAction = {
  type: 'START_NEW_GAME';
  innings: number;
};

export function startNewGame(): StartNewGameAction {
  return {
    type: 'START_NEW_GAME',
    innings: baseInnings,
  };
}

export function onStartNewGame(state: State, action: StartNewGameAction): State {
  return {
    ...state,
    game: {
      availablePlayerIds: [],
      lineups: Array.from({ length: action.innings }, () => []),
      defense: Array.from({ length: action.innings }, () => ({
        positions: {},
      })),
    },
  };
}
