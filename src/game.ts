import {Action, BeanFields, Game, Player} from 'types';
import {createPlayer} from 'player';
import getCards from 'utils/getCards';
import {shuffle} from 'pandemonium';

export const initialState: Game = {
  players: [],
  deck: getCards(),
  discard: [],
  settings: {
    players: 4,
    hand: 5,
  },
};

export const game = (state = initialState, action: Action): Game => {
  switch (action.type) {
    case 'SETUP': {
      const {deck} = state;
      const newPlayers: Player[] = [];
      const newDeck = shuffle(deck);

      for (let i = 0; i < state.settings.players; i++) {
        const player = createPlayer();

        for (let j = 0; j < state.settings.hand; j++) {
          player.hand.push(newDeck.shift());
        }

        newPlayers.push(player);
      }

      return {
        ...state,
        players: newPlayers,
        deck: newDeck,
      };
    }
    case 'HARVEST': {
      const {playerId, beanFieldIndex} = action.payload;
      const {beanFields} = state.players.find(({id}) => id === playerId);
      const {cards} = beanFields[beanFieldIndex];

      const numCardsToHarvest = cards.length;
      const doAllBeanFieldsHaveOneCard = beanFields.map(({cards}) => cards.length).every((length) => length === 1);

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
