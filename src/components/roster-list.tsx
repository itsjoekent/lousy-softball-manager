import { useStateContext } from '../state';
import { PlayerList } from './player-list';

export function RosterList() {
  const { state } = useStateContext();
  const rosterPlayerIds = state.roster.map((player) => player.id);

  return <PlayerList allowDeletion playerIds={rosterPlayerIds} />;
}
