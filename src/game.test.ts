import {ActionTypes, Bean, BeanFieldIndex, Game} from 'types';
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
        payload: {
          playerId: 'player0',
          beanFieldIndex: 0,
        },
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
        payload: {
          playerId: 'player0',
          beanFieldIndex: 0,
        },
      });

      expect(harvestState).toEqualHarvest(0, 0, 1);
    });

    it('should do nothing if bean field is empty', () => {
      expect(harvest('stink', 0)).toEqualHarvest(0, 0, 0);
    });

    it('should do nothing if bean field has one card and other bean fields do not', () => {
      expect(harvest('stink', 1)).toEqualHarvest(0, 1, 0);
    });
  });

  describe('plant', () => {
    const getState = (): Game => ({
      ...initialState,
      players: [createPlayer({id: 'player0', beanFields: [{cards: createCardsOfVariety('stink', 3)}, {cards: []}]})],
    });

    const plant = (variety: Bean['variety'], amount: number, beanFieldIndex: BeanFieldIndex = 0): Game => {
      return game(getState(), {
        type: ActionTypes.PLANT,
        payload: {
          playerId: 'player0',
          beanFieldIndex,
          cards: createCardsOfVariety(variety, amount),
        },
      });
    };

    it('should add cards to a bean field with cards of the same variety', () => {
      const plantState = plant('stink', 2, 0);

      expect(plantState.players[0].beanFields[0].cards.length).toEqual(5);
      expect(plantState.players[0].beanFields[1].cards.length).toEqual(0);
    });

    it('should add cards to an empty bean field', () => {
      const plantState = plant('stink', 2, 1);

      expect(plantState.players[0].beanFields[0].cards.length).toEqual(3);
      expect(plantState.players[0].beanFields[1].cards.length).toEqual(2);
    });

    it('should remove card from hand', () => {
      const blueBean = createCardsOfVariety('blue', 1);

      const state = {
        ...initialState,
        players: [
          createPlayer({
            id: 'player0',
            hand: blueBean,
            beanFields: [{cards: createCardsOfVariety('stink', 3)}, {cards: []}],
          }),
        ],
      };

      const plantState = game(state, {
        type: ActionTypes.PLANT,
        payload: {
          playerId: 'player0',
          beanFieldIndex: 1,
          cards: blueBean,
        },
      });

      expect(plantState.players[0].beanFields[0].cards.length).toEqual(3);
      expect(plantState.players[0].beanFields[1].cards.length).toEqual(1);
      expect(plantState.players[0].hand.length).toEqual(0);
    });

    it('should do nothing if zero cards provided', () => {
      const plantState = plant('stink', 0, 0);

      expect(plantState.players[0].beanFields[0].cards.length).toEqual(3);
    });

    it('should do nothing if cards have different variety', () => {
      const plantState = game(getState(), {
        type: ActionTypes.PLANT,
        payload: {
          playerId: 'player0',
          beanFieldIndex: 0,
          cards: [...createCardsOfVariety('stink', 1), ...createCardsOfVariety('red', 2)],
        },
      });

      expect(plantState.players[0].beanFields[0].cards.length).toEqual(3);
    });

    it('should do nothing if bean field has cards of different variety', () => {
      const plantState = plant('red', 2, 0);

      expect(plantState.players[0].beanFields[0].cards.length).toEqual(3);
    });
  });
});
