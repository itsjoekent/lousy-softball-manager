import type { State } from '../types';

export type EndGameAction = {
  type: 'END_GAME';
};

export function endGame(): EndGameAction {
  return {
    type: 'END_GAME',
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function onEndGame(state: State, action: EndGameAction): State {
  return {
    ...state,
    game: null,
  };
}
