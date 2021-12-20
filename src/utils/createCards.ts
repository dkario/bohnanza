import {Bean, Card} from '..';

const createCards = (beans: Bean[]): Card[] =>
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

export default createCards;
