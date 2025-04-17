import type { State } from './types';
import seedRoster from '../seed-roster.json';

export const seedState: State = {
  game: null,
  roster: seedRoster?.roster || [],
};
