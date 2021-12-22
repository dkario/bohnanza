import {Action, BeanFields, Game} from 'types';
import {createPlayer} from 'player';
import getCards from 'utils/getCards';
import {shuffle} from 'pandemonium';

export const initialState: Game = {
  players: [],
  deck: getCards(),
  discard: [],
  settings: {
    numPlayers: 4,
    numHand: 5,
  },
};

export const game = (state = initialState, action: Action): Game => {
  switch (action.type) {
    case 'SETUP': {
      const deck = shuffle(state.deck);
      const {numPlayers, numHand} = state.settings;
      const players = Array.from({length: numPlayers}, (_, i) =>
        createPlayer({hand: deck.slice(i * numHand, (i + 1) * numHand)}),
      );

      return {
        ...state,
        players,
        deck: deck.slice(numHand * numPlayers),
      };
    }
    case 'HARVEST': {
      const {playerId, beanFieldIndex} = action.payload;
      const {beanFields} = state.players.find(({id}) => id === playerId);
      const {cards} = beanFields[beanFieldIndex];

      const numCardsToHarvest = cards.length;
      const doAllBeanFieldsHaveOneCard = beanFields.map(({cards}) => cards.length).every((length) => length === 1);

      // Can't harvest empty bean field OR bean field with 1 card unless all others have 1 card
      if (!numCardsToHarvest || (numCardsToHarvest === 1 && !doAllBeanFieldsHaveOneCard)) {
        return {...state};
      }

      const {beanometer} = cards[0];
      const numGold = beanometer.filter((numCardsForGold) => numCardsForGold <= numCardsToHarvest).pop() || 0;
      const gold = cards.slice(0, numGold);
      const discard = cards.slice(numGold);

      return {
        ...state,
        players: state.players.map((p) =>
          p.id === playerId
            ? {
                ...p,
                gold: [...p.gold, ...gold],
                beanFields: p.beanFields.map((b, i) => (i === beanFieldIndex ? {cards: []} : b)) as BeanFields,
              }
            : p,
        ),
        discard: [...state.discard, ...discard],
      };
    }
    default:
      return {...state};
  }
};
