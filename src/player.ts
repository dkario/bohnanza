import {Player} from 'types';

let count = 0;

export const createPlayer = (): Player => {
  return {
    id: `player${count++}`,
    hand: [],
    gold: [],
    beanFields: [null, null],
  };
};
