import { type State } from '../types';
import { type AddPlayerToRosterAction, onAddPlayerToRoster } from './add-player-to-roster';
import { type ClearDefensivePositionAction, onClearDefensivePosition } from './clear-defensive-position';
import { type DeletePlayerFromRosterAction, onDeletePlayerFromRoster } from './delete-player-from-roster';
import { type EditPlayerOnRosterAction, onEditPlayerOnRoster } from './edit-player-on-roster';
import { type EndGameAction, onEndGame } from './end-game';
import { type SetLineupAction, onSetLineup } from './set-lineup';
import { type StartNewGameAction, onStartNewGame } from './start-new-game';
import { type TogglePlayerForGameAction, onSelectPlayerForGame } from './toggle-player-for-game';
import { type UpdateDefenseAction, onUpdateDefense } from './update-defense';
import { type UpdateDefensivePositionAction, onUpdateDefensivePosition } from './update-defensive-position';

export type Action =
  | AddPlayerToRosterAction
  | ClearDefensivePositionAction
  | DeletePlayerFromRosterAction
  | EditPlayerOnRosterAction
  | EndGameAction
  | SetLineupAction
  | StartNewGameAction
  | TogglePlayerForGameAction
  | UpdateDefenseAction
  | UpdateDefensivePositionAction;

export const reducerHandlers = {
  ADD_PLAYER_TO_ROSTER: onAddPlayerToRoster,
  CLEAR_DEFENSIVE_POSITION: onClearDefensivePosition,
  DELETE_PLAYER_FROM_ROSTER: onDeletePlayerFromRoster,
  EDIT_PLAYER_ON_ROSTER: onEditPlayerOnRoster,
  END_GAME: onEndGame,
  SET_LINEUP: onSetLineup,
  START_NEW_GAME: onStartNewGame,
  TOGGLE_PLAYER_FOR_GAME: onSelectPlayerForGame,
  UPDATE_DEFENSE: onUpdateDefense,
  UPDATE_DEFENSIVE_POSITION: onUpdateDefensivePosition,
} as Record<Action['type'], (state: State, action: Action) => State>;

export { addPlayerToRoster } from './add-player-to-roster';
export { clearDefensivePosition } from './clear-defensive-position';
export { deletePlayerFromRoster } from './delete-player-from-roster';
export { editPlayerOnRoster } from './edit-player-on-roster';
export { endGame } from './end-game';
export { setLineup } from './set-lineup';
export { startNewGame } from './start-new-game';
export { togglePlayerForGame } from './toggle-player-for-game';
export { updateDefense } from './update-defense';
export { updateDefensivePosition } from './update-defensive-position';
