import * as beans from 'data/beans.json';
import {Bean, Card} from 'types';

export const createCardsOfVariety = (variety: Bean['variety'], amount: number): Card[] => {
  const bean: Bean = (beans as Bean[]).find((bean) => bean.variety === variety);

  return Array.from({length: amount}, (_, i) => ({...bean, id: `${variety}-${i}`}));
};

export const createCards = (beans: Bean[]): Card[] =>
  beans.reduce((acc, {variety, total}) => acc.concat(createCardsOfVariety(variety, total)), []);

const getCards = () => createCards(beans as Bean[]);

export default getCards;
