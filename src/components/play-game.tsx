import { useEffect, useState } from 'react';
import { Button, Paper, Select, Stack, Text, Title } from '@mantine/core';
import { useStateContext } from '../state';
import { PlayerList } from './player-list';
import { baseInnings, positionLabels } from '../constants';
import { PositionId } from '../types';
import { inningFormat } from '../utils/formatters';
import { useDefenseGenerator } from '../utils/use-defense-generator';
import { getDefensiveChangelog } from '../utils/get-defensive-changelog';

const defenseOptions = new Array(baseInnings).fill('').map((_, index) => ({
  label: inningFormat(index + 1),
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
  const defensiveInningDisplay = defensiveInningInt + 1;

  useEffect(() => {
    // TODO: account for NaN
    if (defensiveInningInt < 0) {
      setDefensiveRoles([]);
      return;
    }

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
      ...defensiveLineup.bench.map(
        (playerId) =>
          `Bench: ${
            state.roster.find((player) => player.id === playerId)?.name
          }`
      ),
    ];

    setDefensiveRoles(roles);
  }, [state, defensiveInningInt]);

  const { generate, isGenerating } = useDefenseGenerator();

  return (
    <Stack>
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
      <Button
        disabled={isGenerating}
        onClick={() => generate(defensiveInningInt)}
      >
        Regenerate defense starting at {inningFormat(defensiveInningDisplay)}{' '}
        inning
      </Button>
    </Stack>
  );
}
