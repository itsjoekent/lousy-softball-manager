import type { Player, State } from "../types"

export type DeletePlayerFromRosterAction = {
  type: 'DELETE_PLAYER_FROM_ROSTER';
  playerId: Player['id'];
};

export function deletePlayerFromRoster(
  playerId: Player['id']
): DeletePlayerFromRosterAction {
  return {
    type: 'DELETE_PLAYER_FROM_ROSTER',
    playerId,
  };
}

export function onDeletePlayerFromRoster(
  state: State,
  action: DeletePlayerFromRosterAction
): State {
  const index = state.roster.findIndex((p) => p.id === action.playerId);
  if (index === -1) throw new Error('Player does not exist');

  const updatedRoster = [...state.roster];
  updatedRoster.splice(index, 1);

  return {
    ...state,
    roster: updatedRoster,
  };
}
