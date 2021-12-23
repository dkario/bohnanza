export interface Bean {
  variety: string;
  beanometer: Beanometer;
  total: number;
}

type Beanometer = [number, number, number, number];

export interface Card extends Bean {
  id: string;
}

export interface BeanField {
  cards: Card[]; // TODO: cards must be of same variety
}

export type BeanFields = [BeanField, BeanField] | [BeanField, BeanField, BeanField];
export type BeanFieldIndex = 0 | 1 | 2;

export interface Player {
  id: string;
  beanFields: BeanFields;
  hand: Card[];
  gold: Card[];
}

export interface Game {
  players: Player[];
  deck: Card[];
  discard: Card[];
  round: 0 | 1 | 2 | 3;
  settings: Settings;
}

interface Settings {
  numPlayers: number;
  numHand: number;
  numRounds: number;
}

export enum ActionTypes {
  SETUP = 'SETUP',
  HARVEST = 'HARVEST',
  PLANT = 'PLANT',
  DRAW_TWO = 'DRAW_TWO',
  DRAW_THREE = 'DRAW_THREE',
}

export type Action = SetupAction | HarvestAction | PlantAction | DrawTwoAction | DrawThreeAction;

export interface SetupAction {
  type: ActionTypes.SETUP;
}

export interface HarvestAction {
  type: ActionTypes.HARVEST;
  payload: {
    playerId: string;
    beanFieldIndex: BeanFieldIndex;
  };
}

export interface PlantAction {
  type: ActionTypes.PLANT;
  payload: {
    playerId: string;
    beanFieldIndex: BeanFieldIndex;
    cards: Card[];
  };
}

export interface DrawTwoAction {
  type: ActionTypes.DRAW_TWO;
  payload: {
    playerId: string;
  };
}

export interface DrawThreeAction {
  type: ActionTypes.DRAW_THREE;
  payload: {
    playerId: string;
  };
}
