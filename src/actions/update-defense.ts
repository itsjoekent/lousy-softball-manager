import type { DefensiveConfiguration, State } from "../types"

export type UpdateDefenseAction = {
  type: 'UPDATE_DEFENSE';
  inning: number;
  defense: DefensiveConfiguration;
};

export function updateDefense(
  inning: number,
  defense: DefensiveConfiguration
): UpdateDefenseAction {
  return {
    type: 'UPDATE_DEFENSE',
    inning,
    defense,
  };
}

export function onUpdateDefense(state: State, action: UpdateDefenseAction): State {
  if (!state.game) throw new Error('Game not started');

  const updatedDefense = [...state.game?.defense || []];
  updatedDefense[action.inning] = action.defense;

  return {
    ...state,
    game: {
      ...state.game,
      defense: updatedDefense,
    },
  };
}
