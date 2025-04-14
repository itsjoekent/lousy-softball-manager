import { useCallback, useEffect, useState } from 'react';
import { Button, Checkbox, Stack, Text, Title } from '@mantine/core';
import { useStateContext } from '../state';
import { minPlayers, minNonMalePlayersToCompete } from '../constants';
import { Player } from '../types';
import { togglePlayerForGame } from '../actions/toggle-player-for-game';

type Props = {
  onSubmit: () => void;
};

export function SelectPlayersForGame(props: Props) {
  const { onSubmit } = props;
  const { dispatch, state } = useStateContext();

  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const toggleCheckbox = useCallback((playerId: Player['id']) => {
    dispatch(togglePlayerForGame(playerId));
  }, [dispatch]);

  const handleSubmit = useCallback(() => {
    const selectedPlayerIds = state.game?.availablePlayerIds || [];
    if (selectedPlayerIds.length < minPlayers) {
      setError(`You must select at least ${minPlayers} players`);
      return;
    }

    setError(null);
    onSubmit();
  }, [state, onSubmit]);

  useEffect(() => {
    const selectedPlayerIds = state.game?.availablePlayerIds || [];
    if (!selectedPlayerIds.length) {
      setWarning(null);
      return;
    }

    const nonMalePlayers = state.roster.filter(
      (player) => selectedPlayerIds.includes(player.id) && !player.isMale
    );

    if (nonMalePlayers.length >= minNonMalePlayersToCompete) {
      setWarning(null);
      return;
    }

    setWarning(`${nonMalePlayers.length} non male player(s) are selected, but ${minNonMalePlayersToCompete} are required to compete.`);
  }, [state]);

  return (
    <Stack>
      <Title order={2}>Select available players</Title>
      {state.roster.map((player) => (
        <Checkbox
          key={player.id}
          label={player.name}
          onChange={() => toggleCheckbox(player.id)}
          checked={state.game?.availablePlayerIds.includes(player.id)}
        />
      ))}
      {warning && <Text c="yellow">{warning}</Text>}
      {error && <Text c="red">{error}</Text>}
      <Button onClick={handleSubmit}>Next</Button>
    </Stack>
  );
}
