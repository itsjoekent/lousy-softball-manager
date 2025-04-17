import { Accordion, Button, Group, Paper, Select, Stack, Text } from '@mantine/core';
import { useStateContext } from '../state';
import { positionLabels, positions } from '../constants';
import { inningFormat, positionRankEmoji } from '../utils/formatters';
import type { PositionId, State } from '../types';
import {
  getAllPlayersInTheField,
  getSortedPositionPlayers,
  getPlayerIdForPosition,
  getMaxFieldablePlayers,
  getBenchStats,
} from '../utils/state-selectors';
import { clearDefensivePosition, updateDefensivePosition } from '../actions';

function getPositionSelectorData(state: State, positionId: PositionId): { value: string, label: string }[] {
  const sortedPositionPlayers = getSortedPositionPlayers(state, positionId);
  return sortedPositionPlayers.map((player) => ({
    value: player.id,
    label: `${player.name} ${positionRankEmoji(player.positions[positionId])}`,
  }));
}

const fieldablePositions = positions.filter((positionId) => positionId !== 'DH');

function getInningWarnings(state: State, inning: number): string[] {
  const warnings: string[] = [];

  const maxFieldablePlayers = getMaxFieldablePlayers(state);
  const allPlayersInTheField = getAllPlayersInTheField(state, inning);

  if (allPlayersInTheField.length !== maxFieldablePlayers) {
    warnings.push(
      `Expected ${maxFieldablePlayers} players, but found ${allPlayersInTheField.length}.`
    );
  }

  const duplicatePlayers = allPlayersInTheField.filter((player, index, self) =>
    self.findIndex((p) => p.id === player.id) !== index
  );
  if (duplicatePlayers.length > 0) {
    warnings.push(
      `Duplicate players found: ${duplicatePlayers
        .map((player) => player.name)
        .join(', ')}.`
    );
  }

  return warnings;
}

export function DefenseEditor() {
  const { dispatch, state } = useStateContext();
  if (!state.game) {
    throw new Error('Game not found');
  }

  // TODO: Delete the simulation code

  return (
    <Stack>
      <Accordion>
        {state.game?.defense.map((_defensiveConfiguration, inningIndex) => (
          <Accordion.Item value={`defense-${inningIndex}`} key={inningIndex}>
            <Accordion.Control>
              {inningFormat(inningIndex + 1)} inning
            </Accordion.Control>
            <Accordion.Panel>
              <Stack>
                {getInningWarnings(state, inningIndex).map((warning) => (
                  <Text key={warning} c="red">
                    {warning}
                  </Text>
                ))}
                {fieldablePositions.map((positionId) => (
                  <Group key={positionId} grow align="flex-end">
                    <Select
                      label={positionLabels[positionId]}
                      placeholder="Pick player"
                      data={getPositionSelectorData(state, positionId)}
                      value={getPlayerIdForPosition(
                        state,
                        inningIndex,
                        positionId
                      )}
                      onChange={(value) => {
                        if (value) {
                          dispatch(
                            updateDefensivePosition(
                              inningIndex,
                              positionId,
                              value
                            )
                          );
                        }
                      }}
                    />
                    <Button
                      styles={{
                        root: {
                          flexGrow: 0,
                          width: 'fit-content'
                        },
                      }}
                      variant="default"
                      size="compact-md"
                      onClick={() =>
                        dispatch(
                          clearDefensivePosition(inningIndex, positionId)
                        )
                      }
                    >
                      Clear
                    </Button>
                  </Group>
                ))}
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
      <Paper shadow="xs" p="sm" withBorder>
        {getBenchStats(state).map(([playerId, name, stats]) => (
          <Text key={playerId}>
            {name} - {stats} bench appearances
          </Text>
        ))}
      </Paper>
    </Stack>
  );
}
