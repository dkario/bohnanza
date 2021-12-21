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

export const game = (state = initialState, action: Action) => {
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
    default:
      return {...state};
  }
};
