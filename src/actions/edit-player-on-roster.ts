import type { Player, State } from "../types"

export type EditPlayerOnRosterAction = {
  type: 'EDIT_PLAYER_ON_ROSTER';
  id: Player['id'];
  player: Omit<Player, 'id'>;
};

export function editPlayerOnRoster(
  id: Player['id'],
  player: Omit<Player, 'id'>
): EditPlayerOnRosterAction {
  return {
    type: 'EDIT_PLAYER_ON_ROSTER',
    id,
    player,
  };
}

export function onEditPlayerOnRoster(
  state: State,
  action: EditPlayerOnRosterAction
): State {
  const index = state.roster.findIndex((p) => p.id === action.id);
  if (index === -1) throw new Error('Player does not exist');

  const updatedRoster = [...state.roster];
  updatedRoster[index] = {
    ...updatedRoster[index],
    ...action.player,
  };

  return {
    ...state,
    roster: updatedRoster,
  };
}
