import { useCallback, useEffect, useState } from 'react';
import { useStateContext } from '../state';
import { updateDefense } from '../actions';
import type {
  SimulateDefenseRequestEvent,
  SimulateDefenseResponseEvent,
} from '../types';
import DefenseSimulator from './defense-simulator?worker';

export function useDefenseGenerator() {
  const { state, dispatch } = useStateContext();
  if (!state.game) throw new Error('Game not started');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generateFromInning, setGenerateFromInning] = useState(0);
  const [onComplete, setOnComplete] = useState<() => void>(() => () => {});

  useEffect(() => {
    if (!isGenerating) return;

    const simulator = new DefenseSimulator();

    const message: SimulateDefenseRequestEvent = {
      roster: state.roster,
      game: state.game!,
      fromInning: generateFromInning,
    };
    simulator.postMessage(message);

    simulator.onmessage = function (
      event: MessageEvent<SimulateDefenseResponseEvent>
    ) {
      setIsGenerating(false);
      const { data } = event;

      if ('error' in data) {
        console.error('Error simulating defense:', data.error);
        return;
      }

      for (let inning = 0; inning < data.defense.length; inning++) {
        const inningDefense = data.defense[inning];
        dispatch(updateDefense(inning, inningDefense));
      }

      if (onComplete) {
        onComplete();
      }
    };

    return () => {
      simulator.terminate();
    };
  }, [state, dispatch, onComplete, isGenerating, generateFromInning]);

  const generate = useCallback((fromInning: number, callback?: () => void) => {
    setGenerateFromInning(fromInning);
    setIsGenerating(true);
    setOnComplete(() => callback);
  }, []);

  return { generate, isGenerating };
}
