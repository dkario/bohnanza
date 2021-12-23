import {Action, BeanFields, Card, DrawThreeAction, DrawTwoAction, Game} from 'types';
import {createPlayer} from 'player';
import getCards from 'utils/getCards';
import {shuffle} from 'pandemonium';

export const initialState: Game = {
  players: [],
  deck: getCards(),
  discard: [],
  round: 0,
  settings: {
    numPlayers: 4,
    numHand: 5,
    numRounds: 3,
  },
};

const draw = (state: Game, action: DrawTwoAction | DrawThreeAction, numCards: number): Game => {
  const {playerId} = action.payload;
  const isNextRound = state.deck.length <= numCards;
  const deck: Card[] =
    isNextRound && state.round + 1 < state.settings.numRounds ? state.deck.concat(shuffle(state.discard)) : state.deck;

  return {
    ...state,
    players: state.players.map((p) =>
      p.id === playerId
        ? {
            ...p,
            hand: p.hand.concat(deck.slice(0, numCards)),
          }
        : p,
    ),
    deck: deck.slice(numCards),
    discard: isNextRound ? [] : state.discard,
    round: isNextRound ? (Math.min(state.round + 1, state.settings.numRounds) as Game['round']) : state.round,
  };
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
        return state;
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
    case 'PLANT': {
      const {playerId, beanFieldIndex, cards} = action.payload;
      const {beanFields} = state.players.find(({id}) => id === playerId);
      const beanField = beanFields[beanFieldIndex];
      const {cards: bfCards} = beanField;

      if (
        !cards.length || // Can't plant zero cards
        cards.some(({variety}) => variety !== cards[0].variety) || // Can't plant if cards have different varieties
        bfCards.some(({variety}) => variety !== cards[0].variety) // Can't plant in bean field with cards of different variety
      ) {
        return state;
      }

      return {
        ...state,
        players: state.players.map((p) =>
          p.id === playerId
            ? {
                ...p,
                hand: p.hand.filter((h) => !cards.map(({id}) => id).includes(h.id)), // Remove from hand if there
                beanFields: p.beanFields.map((b, i) =>
                  i === beanFieldIndex ? {cards: [...beanFields[beanFieldIndex].cards, ...cards]} : b,
                ) as BeanFields,
              }
            : p,
        ),
      };
    }
    case 'DRAW_TWO': {
      return draw(state, action, 2);
    }
    case 'DRAW_THREE': {
      return draw(state, action, 3);
    }
    case 'BUY_THIRD_BEAN_FIELD': {
      const {playerId} = action.payload;
      const {beanFields, gold} = state.players.find(({id}) => id === playerId);
      const thirdBeanFieldCost = [6, 7].includes(state.settings.numPlayers) ? 2 : 3; // With 6 or 7 players, bean fields cost 2 gold

      if (beanFields.length === 3 || gold.length < thirdBeanFieldCost) {
        return state;
      }

      return {
        ...state,
        players: state.players.map((p) =>
          p.id === playerId
            ? {
                ...p,
                gold: p.gold.slice(thirdBeanFieldCost),
                beanFields: [...p.beanFields, {cards: []}] as BeanFields,
              }
            : p,
        ),
        discard: state.settings.numPlayers === 2 ? state.discard : gold.slice(0, thirdBeanFieldCost), // With 2 players, destroy 3 gold instead of discarding
      };
    }
    default:
      return state;
  }
};
