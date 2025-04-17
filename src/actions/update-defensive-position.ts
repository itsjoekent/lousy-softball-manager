import type { PositionId, State } from "../types"

export type UpdateDefensivePositionAction = {
  type: 'UPDATE_DEFENSIVE_POSITION';
  inning: number;
  positionId: PositionId;
  playerId: string;
};

export function updateDefensivePosition(
  inning: number,
  positionId: PositionId,
  playerId: string
): UpdateDefensivePositionAction {
  return {
    type: 'UPDATE_DEFENSIVE_POSITION',
    inning,
    positionId,
    playerId,
  };
}

export function onUpdateDefensivePosition(
  state: State,
  action: UpdateDefensivePositionAction
): State {
  if (!state.game) throw new Error('Game not started');

  const updatedDefense = [...state.game.defense];
  const defensiveConfiguration = updatedDefense[action.inning] || {
    positions: {},
  };

  defensiveConfiguration.positions[action.positionId] = action.playerId;

  return {
    ...state,
    game: {
      ...state.game,
      defense: updatedDefense,
    },
  };
}
