import {Action, Game, Player} from 'types';
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
      const {
        payload: {playerId, beanFieldIndex},
      } = action;

      const player = state.players.find(({id}) => id === playerId);
      const {cards} = player.beanFields[beanFieldIndex];
      const numCardsToHarvest = cards.length;
      const doAllBeanFieldsHaveOneCard = player.beanFields
        .map(({cards}) => cards.length)
        .every((length) => length === 1);

      if (!numCardsToHarvest || (numCardsToHarvest === 1 && !doAllBeanFieldsHaveOneCard)) {
        return {...state};
      }

      const {beanometer} = cards[0];
      const numGold = beanometer.reduce(
        (acc, numCardsForGold) => (acc = numCardsToHarvest < numCardsForGold ? acc : numCardsForGold),
        0,
      );
      for (let i = 0; i < numGold; i++) {
        player.gold.push(cards.shift());
      }

      const newDiscard = [...state.discard];
      for (let i = numGold; i < numCardsToHarvest; i++) {
        newDiscard.push(cards.shift());
      }

      return {
        ...state,
        players: state.players.map((p) => (p.id === playerId ? player : p)),
        discard: newDiscard,
      };
    }
    default:
      return {...state};
  }
};
