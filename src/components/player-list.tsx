import { useCallback, useMemo, useState } from 'react';
import { Accordion } from '@mantine/core';
import { Player } from '../types';
import { useStateContext } from '../state';
import { EditPlayerOnRoster } from './edit-player-on-roster';

type Props = {
  allowDeletion?: boolean;
  playerIds: Player['id'][];
};

export function PlayerList(props: Props) {
  const { state } = useStateContext();

  const [accordionValue, setAccordionValue] = useState<string | null>(null);
  const resetAccordion = useCallback(() => setAccordionValue(null), []);

  const { allowDeletion, playerIds } = props;
  const players = useMemo(() => playerIds.map((id) => {
    const player = state.roster.find((player) => player.id === id);
    if (!player) {
      throw new Error(`Player with id ${id} not found in roster`);
    }
    return player;
  }), [playerIds, state.roster]);

  return (
    <Accordion value={accordionValue} onChange={setAccordionValue}>
      {players.map((player) => (
        <Accordion.Item value={player.id} key={player.id}>
          <Accordion.Control>{player.name}</Accordion.Control>
          <Accordion.Panel>
            <EditPlayerOnRoster
              allowDeletion={allowDeletion}
              playerId={player.id}
              onCancel={resetAccordion}
            />
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}