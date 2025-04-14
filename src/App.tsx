import { Button, Center, Container, Stack, Text, Title } from '@mantine/core';
import { StateContext, useStateReducer } from './state';
import { Roster } from './components/roster';
import { startNewGame } from './actions';
import { minPlayers } from './constants';
import { Game } from './components/game';

export function App() {
  const { state, dispatch } = useStateReducer();
  const hasStartedGame = state.game !== null;

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      <Container
        styles={{
          root: {
            padding: '24px',
          },
        }}
      >
        <Stack gap="xl">
          <Title order={1}>Lousy Softball Software</Title>
          {hasStartedGame && <Game />}
          {!hasStartedGame && (
            <>
              {state.roster.length >= minPlayers && (
                <Container
                  styles={{
                    root: {
                      width: '100%',
                      padding: '24px',
                      backgroundColor: 'var(--mantine-color-teal-1)',
                    },
                  }}
                >
                  <Center>
                    <Stack>
                      <Text size="lg" fw={800}>
                        Play ball! 🥎
                      </Text>
                      <Button onClick={() => dispatch(startNewGame())}>
                        Start game
                      </Button>
                    </Stack>
                  </Center>
                </Container>
              )}
              <Roster />
            </>
          )}
        </Stack>
      </Container>
    </StateContext.Provider>
  );
}
