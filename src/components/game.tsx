import { useState } from 'react';
import { Button, Modal, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useStateContext } from '../state';
import type { State } from '../types';
import { SelectPlayersForGame } from './select-players-for-game';
import { RosterAdjustments } from './roster-adjustments';
import { ArrangeLineup } from './arrange-lineup';
import { SetupDefense } from './setup-defense';
import { PlayGame } from './play-game';
import { endGame } from '../actions';

type Step = 'select-players' | 'roster-adjustments' | 'arrange-lineup' | 'generate-defense' | 'play-game';

function getInitialStepFromState(state: State): Step {
  if (!state.game) throw new Error('Game not started');

  if (state.game.availablePlayerIds.length === 0) {
    return 'select-players';
  }

  if (state.game.lineups[1]?.length === 0) {
    return 'arrange-lineup';
  }

  if (state.game.defense.length === 0) {
    return 'generate-defense';
  }

  return 'play-game';
}

export function Game() {
  const { dispatch, state } = useStateContext();
  if (!state.game) {
    throw new Error('Game not started');
  }

  const [isEndGameModalOpen, { open: openEndGameModal, close: closeEndGameModal }] = useDisclosure(false);
  const [step, setStep] = useState<Step>(getInitialStepFromState(state));

  return (
    <>
      <Modal
        opened={isEndGameModalOpen}
        onClose={closeEndGameModal}
        title="End game"
      >
        <Stack>
          <Text>This action cannot be reversed!</Text>
          <Button
            color="red"
            fullWidth
            onClick={() => {
              dispatch(endGame());
              closeEndGameModal();
            }}
          >
            End the game
          </Button>
          <Button
            color="dark"
            fullWidth
            variant="outline"
            onClick={closeEndGameModal}
          >
            Cancel
          </Button>
        </Stack>
      </Modal>
      <Stack gap="xl">
        {step === 'select-players' && (
          <SelectPlayersForGame
            onSubmit={() => setStep('roster-adjustments')}
          />
        )}
        {step === 'roster-adjustments' && (
          <RosterAdjustments onSubmit={() => setStep('arrange-lineup')} />
        )}
        {step === 'arrange-lineup' && (
          <ArrangeLineup onSubmit={() => setStep('generate-defense')} />
        )}
        {step === 'generate-defense' && (
          <SetupDefense
            onSubmit={() => setStep('play-game')}
          />
        )}
        {step === 'play-game' && (
          <PlayGame />
        )}
        <Button color="red" onClick={openEndGameModal}>
          End game
        </Button>
      </Stack>
    </>
  );
}