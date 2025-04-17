import { useEffect, useState } from 'react';
import { Paper, Select, Stack, Text, Title } from '@mantine/core';
import { useStateContext } from '../state';
import { PlayerList } from './player-list';
import { baseInnings, positionLabels } from '../constants';
import { PositionId } from '../types';
import { inningFormat } from '../utils/formatters';
import { getDefensiveChangelog } from '../utils/get-defensive-changelog';
import { getBenchPlayers } from '../utils/state-selectors';
import { DefenseEditor } from './defense-editor';

const defenseOptions = new Array(baseInnings).fill('').map((_, index) => ({
  label: `${inningFormat(index + 1)} inning`,
  value: `${index}`,
}));

export function PlayGame() {
  const { state } = useStateContext();
  if (!state.game) {
    throw new Error('Game not started');
  }

  const [defensiveInning, setDefensiveInning] = useState<string | null>('0');
  const [defensiveRoles, setDefensiveRoles] = useState<string[]>([]);

  const defensiveInningInt = parseInt(defensiveInning || '0', 10);

  useEffect(() => {
    const defensiveLineup = state.game!.defense[defensiveInningInt];
    if (!defensiveLineup) {
      setDefensiveRoles([]);
      return;
    }

    const roles = [
      ...Object.keys(defensiveLineup.positions).map((positionId) => {
        const label = positionLabels[positionId as PositionId];
        const playerId = defensiveLineup.positions[positionId as PositionId];
        const playerName = state.roster.find(
          (player) => player.id === playerId
        )?.name;
        return `${label}: ${playerName}`;
      }),
      ...getBenchPlayers(state, defensiveInningInt).map((player) => `Bench: ${player.name}`),
    ];

    setDefensiveRoles(roles);
  }, [state, defensiveInningInt]);

  return (
    <Stack gap="md">
      <Title order={3}>Lineup</Title>
      <PlayerList
        playerIds={state.game.availablePlayerIds}
        allowDeletion={false}
      />
      <Title order={3}>Defense</Title>
      <Select
        label="Select inning"
        data={defenseOptions}
        value={defensiveInning}
        onChange={setDefensiveInning}
      />
      {defensiveInningInt > 0 && (
        <Paper shadow="xs" p="sm" withBorder>
          {getDefensiveChangelog(state, defensiveInningInt)?.map((text) => (
            <Text key={text}>{text}</Text>
          ))}
        </Paper>
      )}
      <Paper shadow="xs" p="sm" withBorder>
        {!!defensiveRoles.length &&
          defensiveRoles.map((role) => <Text key={role}>{role}</Text>)}
      </Paper>
      <Title order={3}>Edit Defense</Title>
      <DefenseEditor />
      {/* TODO: Button to add an inning */}
    </Stack>
  );
}
