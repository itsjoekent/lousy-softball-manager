import type { Player, PositionId, State } from '../types';

export function getPlayerFromRoster(state: State, playerId: string): Player {
  const player = state.roster.find((player) => player.id === playerId);
  if (!player) {
    throw new Error(`Player with id ${playerId} not found in roster`);
  }
  return player;
}

export function getPlayerName(state: State, playerId: string): string {
  const player = getPlayerFromRoster(state, playerId);
  return player.name;
}

export function getMaxFieldablePlayers(state: State): number {
  return (
    state.game?.availablePlayerIds.map((id) => getPlayerFromRoster(state, id)) || []
  ).filter((player) => !!player && !player.isMale).length >= 3
    ? 10
    : 9;
}

export function getAvailablePlayers(state: State): Player[] {
  if (!state.game) {
    throw new Error('Game not initialized');
  }

  return state.game.availablePlayerIds.map((id) => getPlayerFromRoster(state, id));
}

export function getSortedPositionPlayers(state: State, positionId: PositionId): Player[] {
  const players = getAvailablePlayers(state);
  return players.sort((a, b) => b.positions[positionId] - a.positions[positionId]);
}

export function getInningDefensiveConfiguration(state: State, inning: number) {
  if (!state.game) {
    throw new Error('Game not initialized');
  }

  if (inning < 0 || inning >= state.game.defense.length) {
    throw new Error(`Inning ${inning} not found`);
  }

  return state.game.defense[inning];
}

export function getAllPlayersInTheField(state: State, inning: number): Player[] {
  const defensiveConfiguration = getInningDefensiveConfiguration(state, inning);
  const playersInTheField = Object.values(defensiveConfiguration.positions).map((playerId) =>
    getPlayerFromRoster(state, playerId)
  );
  return playersInTheField;
}

export function getPlayerIdForPosition(state: State, inning: number, positionId: PositionId): string | null {
  const defensiveConfiguration = getInningDefensiveConfiguration(state, inning);
  return defensiveConfiguration.positions[positionId] || null;
}

export function getBenchPlayers(state: State, inning: number): Player[] {
  const allAvailablePlayers = getAvailablePlayers(state);
  const allPlayersInField = getAllPlayersInTheField(state, inning).map((player) => player.id);

  return allAvailablePlayers.filter((player) => {
    const isInField = allPlayersInField.includes(player.id);
    return !isInField;
  });
}

export function getBenchStats(state: State): [Player['id'], Player['name'], number][] {
  if (!state.game) {
    throw new Error('Game not initialized');
  }

  const benchStats: [Player['id'], Player['name'], number][] = [];
  state.game.availablePlayerIds.forEach((id) => {
    const player = getPlayerFromRoster(state, id);

    const benchAppearances = state.game!.defense.reduce((total, defensiveConfiguration) => {
      const isFielding = Object.values(defensiveConfiguration.positions).includes(id);
      return isFielding ? total : total + 1;
    }, 0);

    benchStats.push([id, player.name, benchAppearances]);
  });

  return benchStats.sort((a, b) => b[2] - a[2]);
}
