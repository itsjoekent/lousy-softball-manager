import { useCallback } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Button, Modal, Stack } from '@mantine/core';
import type { EditablePlayerFields, Player } from '../types';
import { useStateContext } from '../state';
import { PlayerRosterForm } from './player-roster-form';
import { editPlayerOnRoster, deletePlayerFromRoster } from '../actions';

type Props = {
  allowDeletion?: boolean;
  playerId: Player['id'];
  onCancel: () => void;
};

export function EditPlayerOnRoster(props: Props) {
  const { allowDeletion, playerId, onCancel } = props;
  const { state, dispatch } = useStateContext();

  const [isDeleteModalOpen, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);

  const player = state.roster.find((p) => p.id === playerId);

  const onSubmitWrapper = useCallback(
    (player: EditablePlayerFields) => {
      dispatch(editPlayerOnRoster(playerId, player));
      onCancel();
    },
    [playerId, dispatch, onCancel]
  );

  if (!player) {
    throw new Error(`Player with id ${playerId} not found`);
  }

  return (
    <>
      <Modal
        opened={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Delete player"
      >
        <Stack>
          <p>Are you sure you want to delete {player.name}?</p>
          <Button
            color="red"
            fullWidth
            onClick={() => {
              dispatch(deletePlayerFromRoster(playerId));
              closeDeleteModal();
              onCancel();
            }}
          >
            Delete player
          </Button>
          <Button
            color="dark"
            fullWidth
            variant="outline"
            onClick={closeDeleteModal}
          >
            Cancel
          </Button>
        </Stack>
      </Modal>
      <Stack gap="xl">
        <PlayerRosterForm
          initialValues={player}
          onCancel={onCancel}
          onSubmit={onSubmitWrapper}
          submitLabel="Update player"
        />
        {allowDeletion && (
          <Button color="red" fullWidth onClick={openDeleteModal}>
            Delete player
          </Button>
        )}
      </Stack>
    </>
  );
}
