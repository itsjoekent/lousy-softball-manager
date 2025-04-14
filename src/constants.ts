import type { PositionId } from "./types";

export const positions: PositionId[] = [
  'C',
  'P',
  '1B',
  '2B',
  'SS',
  '3B',
  'RF',
  'CRF',
  'LF',
  'CLF',
  'CF',
  'SCF',
  'DH',
];

export const positionLabels: Record<PositionId, string> = {
  C: 'Catcher',
  P: 'Pitcher',
  '1B': 'First Base',
  '2B': 'Second Base',
  SS: 'Short Stop',
  '3B': 'Third Base',
  RF: 'Right Field',
  CRF: 'Center Right Field',
  LF: 'Left Field',
  CLF: 'Center Left Field',
  CF: 'Center Field',
  SCF: 'Short Center Field',
  DH: 'Designated Hitter',
};

export const skillRange = [0, 5];

export const baseInnings = 7;

export const minPlayers = 7;

export const minNonMalePlayersToCompete = 3;

export const defensiveSimulationsToRun = 100;

export const fieldingStrategies: PositionId[][] = [
  [
    'C',
    'P',
    '1B',
    '2B',
    'SS',
    '3B',
    'RF',
    'LF',
    'CF',
    'SCF',
  ],
  [
    'C',
    'P',
    '1B',
    '2B',
    'SS',
    '3B',
    'RF',
    'CRF',
    'LF',
    'CLF',
  ],
];
