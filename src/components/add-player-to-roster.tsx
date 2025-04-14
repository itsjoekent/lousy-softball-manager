import { useCallback } from 'react';
import { useStateContext } from '../state';
import { addPlayerToRoster } from '../actions';
import type { EditablePlayerFields } from '../types';
import { PlayerRosterForm } from './player-roster-form';

type Props = {
  onCancel: () => void;
};

export function AddPlayerToRoster(props: Props) {
  const { onCancel } = props;
  const { dispatch } = useStateContext();

  const onSubmitWrapper = useCallback(
    (player: EditablePlayerFields) => {
      dispatch(addPlayerToRoster(player));
      onCancel();
    },
    [dispatch, onCancel]
  );

  return (
    <PlayerRosterForm
      onCancel={onCancel}
      onSubmit={onSubmitWrapper}
      submitLabel="Add player"
    />
  );
}
