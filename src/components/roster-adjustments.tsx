import { Button, Stack, Title } from '@mantine/core';
import { useStateContext } from '../state';
import { PlayerList } from './player-list';

type Props = {
  onSubmit: () => void;
};

export function RosterAdjustments(props: Props) {
  const { onSubmit } = props;
  const { state } = useStateContext();
  if (!state.game) throw new Error('No game started');

  const gamePlayerIds = state.game.availablePlayerIds;

  return (
    <Stack>
      <Title order={2}>Roster adjustments</Title>
      <PlayerList allowDeletion={false} playerIds={gamePlayerIds} />
      <Button onClick={onSubmit}>
        Next
      </Button>
    </Stack>
  );
}
