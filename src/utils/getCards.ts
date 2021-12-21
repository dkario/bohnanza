import * as beans from 'data/beans.json';
import {Bean, Card} from 'types';

export const createCardsOfVariety = (variety: Bean['variety'], amount: number): Card[] => {
  const bean: Bean = (beans as Bean[]).find((bean) => bean.variety === variety);
  const cardsOfVariety: Card[] = [];

  for (let i = 0; i < amount; i++) {
    cardsOfVariety.push({...bean, id: `${variety}-${i}`});
  }

  return cardsOfVariety;
};

export const createCards = (beans: Bean[]): Card[] =>
  beans.reduce((acc, bean) => {
    const {variety, total} = bean;

    acc.push(...createCardsOfVariety(variety, total));

    return acc;
  }, []);

const getCards = () => createCards(beans as Bean[]);

export default getCards;
