import type {
  SimulateDefenseRequestEvent,
  SimulateDefenseResponseEvent,
} from '../types';
import { generateDefense } from './defense-generator';

self.onmessage = function (event: MessageEvent<SimulateDefenseRequestEvent>) {
  const { fromInning, game, roster } = event.data;

  try {
    const response: SimulateDefenseResponseEvent = {
      defense: generateDefense(roster, game, fromInning),
    };

    self.postMessage(response);
  } catch (error) {
    console.error('Error generating defense:', error);
    self.postMessage({ error: 'Error generating defense' });
  }
};

export {};
