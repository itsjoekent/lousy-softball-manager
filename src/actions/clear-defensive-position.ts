import type { PositionId, State } from "../types"

export type ClearDefensivePositionAction = {
  type: 'CLEAR_DEFENSIVE_POSITION';
  inning: number;
  positionId: PositionId;
};

export function clearDefensivePosition(
  inning: number,
  positionId: PositionId,
): ClearDefensivePositionAction {
  return {
    type: 'CLEAR_DEFENSIVE_POSITION',
    inning,
    positionId,
  };
}

export function onClearDefensivePosition(
  state: State,
  action: ClearDefensivePositionAction
): State {
  if (!state.game) throw new Error('Game not started');

  const updatedDefense = [...state.game.defense];
  const defensiveConfiguration = updatedDefense[action.inning] || {
    positions: {},
  };

  delete defensiveConfiguration.positions[action.positionId];

  return {
    ...state,
    game: {
      ...state.game,
      defense: updatedDefense,
    },
  };
}
