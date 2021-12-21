import * as beans from 'data/beans.json';
import {Bean, Card} from 'types';

export const createCards = (beans: Bean[]): Card[] =>
  beans.reduce((acc, bean) => {
    const {variety, total} = bean;
    const beansOfVariety: Card[] = [];

    for (let i = 0; i < total; i++) {
      beansOfVariety.push({
        ...bean,
        id: `${variety}-${i}`,
      });
    }

    acc.push(...beansOfVariety);

    return acc;
  }, []);

const getCards = () => createCards(beans as Bean[]);

export default getCards;
