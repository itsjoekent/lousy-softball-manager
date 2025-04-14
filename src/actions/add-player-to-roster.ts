import type { Player, State } from "../types"

export type AddPlayerToRosterAction = {
  type: 'ADD_PLAYER_TO_ROSTER';
  player: Player;
};

export function addPlayerToRoster(player: Omit<Player, 'id'>): AddPlayerToRosterAction {
  return {
    type: 'ADD_PLAYER_TO_ROSTER',
    player: {
      ...player,
      id: crypto.randomUUID(),
    },
  };
}

export function onAddPlayerToRoster(state: State, action: AddPlayerToRosterAction): State {
  return {
    ...state,
    roster: [...state.roster, action.player],
  };
}
