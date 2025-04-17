export type PositionId =
  | 'C'
  | 'P'
  | '1B'
  | '2B'
  | 'SS'
  | '3B'
  | 'RF'
  | 'CRF'
  | 'LF'
  | 'CLF'
  | 'CF'
  | 'SCF'
  | 'DH';

export type Player = {
  id: string;
  name: string;
  isMale: boolean;
  positions: {
    [key in PositionId]: number;
  };
};

export type EditablePlayerFields = Omit<Player, 'id'>;

export type DefensiveConfiguration = {
  positions: Partial<Record<PositionId, Player['id']>>;
};

export type Game = {
  availablePlayerIds: Player['id'][];
  lineups: Player['id'][][];
  defense: DefensiveConfiguration[];
};

export type Roster = Player[];

export type State = {
  roster: Roster;
  game: Game | null;
};

export type SimulateDefenseRequestEvent = {
  roster: Roster;
  game: Game;
  fromInning: number;
};

export type SimulateDefenseResponseEvent =
  | {
      defense: DefensiveConfiguration[];
    }
  | {
      error: string;
    };
