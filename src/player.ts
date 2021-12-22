import {Player} from 'types';
import {nanoid} from 'nanoid';

export const createPlayer = ({
  id = `player-${nanoid()}`,
  hand = [],
  gold = [],
  beanFields = [{cards: []}, {cards: []}],
}: Partial<Player> = {}): Player => ({id, hand, gold, beanFields});
