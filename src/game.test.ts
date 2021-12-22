import {ActionTypes, Bean, Game} from 'types';
import {game, initialState} from './game';
import {createCardsOfVariety} from 'utils/getCards';
import {createPlayer} from './player';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toEqualHarvest(expectedGold: number, expectedBeanField: number, expectedDiscard: number): R;
    }
  }
}

describe('game', () => {
  it('should create players and deal to them', () => {
    const state: Game = {
      ...initialState,
      deck: initialState.deck.slice(0, 10),
      settings: {
        numPlayers: 2,
        numHand: 3,
      },
    };

    const {players, deck, discard} = game(state, {type: ActionTypes.SETUP});

    expect(players.length).toEqual(2);
    expect(deck.length).toEqual(4);
    expect(discard.length).toEqual(0);

    expect(players[0].hand.length).toEqual(3);
    expect(players[1].hand.length).toEqual(3);
  });

  describe('harvest', () => {
    const getState = (variety: Bean['variety'], amount: number): Game => ({
      ...initialState,
      players: [
        createPlayer({
          id: 'player0',
          beanFields: [{cards: createCardsOfVariety(variety, amount)}, {cards: []}],
        }),
      ],
    });

    const harvest = (variety: Bean['variety'], amount: number): Game => {
      return game(getState(variety, amount), {
        type: ActionTypes.HARVEST,
        payload: {playerId: 'player0', beanFieldIndex: 0},
      });
    };

    expect.extend({
      toEqualHarvest(
        {players, discard}: Game,
        expectedGold: number,
        expectedBeanField: number,
        expectedDiscard: number,
      ) {
        const receivedGold = players[0].gold.length;
        const receivedBeanField = players[0].beanFields[0].cards.length;
        const receivedDiscard = discard.length;
        let message: string;

        if (receivedGold !== expectedGold) {
          message = `expected gold of length ${expectedGold}, received ${receivedGold}`;
        } else if (receivedBeanField !== expectedBeanField) {
          message = `expected bean field of length ${expectedBeanField}, received ${receivedBeanField}`;
        } else if (receivedDiscard !== expectedDiscard) {
          message = `expected discard of length ${expectedDiscard}, received ${receivedDiscard}`;
        } else {
          return {pass: true, message: () => ''};
        }

        return {message: () => message, pass: false};
      },
    });

    it('should let a player sell the correct amount of beans and discard the rest', () => {
      expect(harvest('stink', 4)).toEqualHarvest(3, 0, 1);
    });

    it('should sell all beans if equal to a beanometer value', () => {
      expect(harvest('stink', 3)).toEqualHarvest(3, 0, 0);
    });

    it('should discard all beans if fewer than first beanometer value', () => {
      expect(harvest('stink', 2)).toEqualHarvest(0, 0, 2);
    });

    it('should sell max beans if greater than last beanometer value and discard the rest', () => {
      expect(harvest('red', 6)).toEqualHarvest(5, 0, 1);
    });

    it('should sell correct beans if duplicate beanometer values (garden)', () => {
      expect(harvest('garden', 3)).toEqualHarvest(3, 0, 0);
    });

    it('should discard single bean if first beanometer value is 0 (cocoa)', () => {
      const state: Game = {
        ...initialState,
        players: [
          createPlayer({
            id: 'player0',
            beanFields: [{cards: createCardsOfVariety('cocoa', 1)}, {cards: createCardsOfVariety('stink', 1)}],
          }),
        ],
      };

      const harvestState = game(state, {
        type: ActionTypes.HARVEST,
        payload: {playerId: 'player0', beanFieldIndex: 0},
      });

      expect(harvestState).toEqualHarvest(0, 0, 1);
    });

    it('should do nothing if beanfield is empty', () => {
      expect(harvest('stink', 0)).toEqualHarvest(0, 0, 0);
    });

    it('should do nothing if beanfield has one card and other beanfields do not', () => {
      expect(harvest('stink', 1)).toEqualHarvest(0, 1, 0);
    });
  });
});
