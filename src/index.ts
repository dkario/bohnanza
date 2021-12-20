interface Card {
  bean: Bean;
}

interface Bean {
  variety: string;
  beanometer: Beanometer;
  total: number;
}

interface Beanometer {
  cardsSold: number[];
}

interface BeanField {
  bean: Bean;
  cards: Card[];
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
