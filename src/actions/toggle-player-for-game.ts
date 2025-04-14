import type { Player, State } from "../types"

export type TogglePlayerForGameAction = {
  type: 'TOGGLE_PLAYER_FOR_GAME';
  playerId: Player['id'];
};

export function togglePlayerForGame(
  playerId: Player['id']
): TogglePlayerForGameAction {
  return {
    type: 'TOGGLE_PLAYER_FOR_GAME',
    playerId,
  };
}

export function onSelectPlayerForGame(
  state: State,
  action: TogglePlayerForGameAction
): State {
  if (!state.game) throw new Error('Game not started');

  const { playerId } = action;
  const selectedPlayers = state.game.availablePlayerIds;
  const isSelected = selectedPlayers.includes(playerId);

  const newAvailablePlayerIds = isSelected
    ? selectedPlayers.filter((id) => id !== playerId)
    : [...selectedPlayers, playerId];

  return {
    ...state,
    game: {
      ...state.game,
      availablePlayerIds: newAvailablePlayerIds,
    },
  };
}
