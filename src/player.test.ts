import {Player} from 'types';
import {createPlayer} from './player';

describe('player', () => {
  describe('createPlayer', () => {
    it('should create a player with a unique id', () => {
      const players: Player[] = [];

      for (let i = 0; i < 5; i++) {
        players.push(createPlayer());
      }

      const ids = players.map(({id}) => id);

      expect(ids.length).toEqual(Array.from(new Set(ids)).length);
    });
  });
});
