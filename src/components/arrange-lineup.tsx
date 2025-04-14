import { useCallback } from 'react';
import { Button, Stack, Title } from '@mantine/core';
import { useStateContext } from '../state';
import { LineupEditor } from './lineup-editor';
import { baseInnings } from '../constants';
import { setLineup } from '../actions';

type Props = {
  onSubmit: () => void;
};

export function ArrangeLineup(props: Props) {
  const { onSubmit } = props;
  const { state, dispatch } = useStateContext();
  if (!state.game) throw new Error('Game not started');

  const handleSubmit = useCallback(() => {
    const lineup = state.game!.lineups[0];
    for (let i = 1; i < baseInnings; i++) {
      dispatch(setLineup(i, lineup));
    }
    onSubmit();
  }, [onSubmit, state, dispatch]);

  return (
    <Stack>
      <Title order={2}>Arrange lineup</Title>
      <LineupEditor inning={0} />
      <Button onClick={handleSubmit} fullWidth>
        Save lineup
      </Button>
    </Stack>
  );
}
