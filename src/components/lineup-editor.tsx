import { CSSProperties, useCallback, useEffect, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Paper, Text } from '@mantine/core';
import { useStateContext } from '../state';
import { setLineup } from '../actions';

type Props = {
  inning: number;
};

function LineupPlayer({ id }: { id: string }) {
  const { state } = useStateContext();
  const player = state.roster.find((p) => p.id === id);
  if (!player) throw new Error(`Player ${id} not found`);

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: 'none',
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Paper withBorder p="md" shadow="xs">
        <Text>{player.name}</Text>
      </Paper>
    </div>
  );
}

export function LineupEditor(props: Props) {
  const { inning } = props;
  const { dispatch, state } = useStateContext();

  if (!state.game) throw new Error('No game started');

  const lineup = useMemo(() => state.game?.lineups[inning] || [], [state, inning]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (!state.game) return;
  
    if (!state.game.lineups[inning]?.length) {
      dispatch(setLineup(inning, state.game.availablePlayerIds));
    }
  }, [state, inning, dispatch]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const updatedLineup = arrayMove(
          lineup,
          lineup.indexOf(String(active.id)),
          lineup.indexOf(String(over.id))
        );
        dispatch(setLineup(inning, updatedLineup));
      }
    },
    [dispatch, lineup, inning]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={lineup} strategy={verticalListSortingStrategy}>
        {lineup.map((id) => (
          <LineupPlayer key={id} id={id} />
        ))}
      </SortableContext>
    </DndContext>
  );
}
