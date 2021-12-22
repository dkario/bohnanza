export interface Bean {
  variety: string;
  beanometer: Beanometer;
  total: number;
}

type Beanometer = [number, number, number, number];

export interface Card extends Bean {
  id: string;
}

interface BeanField {
  cards: Card[]; // TODO: cards must be of same variety
}

export type BeanFields = [BeanField, BeanField] | [BeanField, BeanField, BeanField];

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
  settings: Settings;
}

interface Settings {
  players: number;
  hand: number;
}

export enum ActionTypes {
  SETUP = 'SETUP',
  HARVEST = 'HARVEST',
}

export type Action = SetupAction | HarvestAction;

export interface SetupAction {
  type: ActionTypes.SETUP;
}

export interface HarvestAction {
  type: ActionTypes.HARVEST;
  payload: {
    playerId: string;
    beanFieldIndex: 0 | 1 | 2;
  };
}
