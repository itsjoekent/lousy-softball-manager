import { useCallback, useState } from 'react';
import { Button, Group, Stack, Text, Title } from '@mantine/core';
import { useStateContext } from '../state';
import { AddPlayerToRoster } from './add-player-to-roster';
import { RosterList } from './roster-list';

export function Roster() {
  const { state } = useStateContext();
  const isEmpty = state.roster.length === 0;

  const [isAddPlayerFormVisible, setIsAddPlayerFormVisible] = useState(false);
  const toggleAddPlayerForm = useCallback(
    () => setIsAddPlayerFormVisible((prev) => !prev),
    []
  );

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={2}>Roster</Title>
        <Button
          size="compact-sm"
          variant="outline"
          onClick={toggleAddPlayerForm}
          disabled={isAddPlayerFormVisible}
        >
          Add player
        </Button>
      </Group>
      {isAddPlayerFormVisible && (
        <AddPlayerToRoster onCancel={toggleAddPlayerForm} />
      )}
      {isEmpty ? (
        <Text>No players on the roster yet!</Text>
      ) : (
        <RosterList />
      )}
    </Stack>
  );
}
