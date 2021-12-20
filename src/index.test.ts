import {Game} from './';

describe('Game', () => {
  it('should work', () => {
    const game: Game = {
      players: [],
      deck: [],
      discard: [],
    };

    expect(game.players.length).toEqual(0);
  });
});
