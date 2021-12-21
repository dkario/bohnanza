import {game, initialState} from './game';
import {Game} from 'types';

describe('game', () => {
  it('should create players and deal to them', () => {
    const state: Game = {
      ...initialState,
      deck: initialState.deck.slice(0, 10),
      settings: {
        players: 2,
        hand: 3,
      },
    };

    const {players, deck, discard} = game(state, {type: 'SETUP'});

    expect(players.length).toEqual(2);
    expect(deck.length).toEqual(4);
    expect(discard.length).toEqual(0);

    expect(players[0].hand.length).toEqual(3);
    expect(players[1].hand.length).toEqual(3);
  });
});
