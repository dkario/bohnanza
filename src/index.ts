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

type BeanFields = [BeanField, BeanField] | [BeanField, BeanField, BeanField];

interface Player {
  id: string;
  beanFields: BeanFields;
  hand: Card[];
  gold: Card[];
}

export interface Game {
  players: Player[];
  deck: Card[];
  discard: Card[];
}
