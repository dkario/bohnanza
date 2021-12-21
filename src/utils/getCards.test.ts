import {Bean} from 'types';
import {createCards} from './getCards';

describe('createCards', () => {
  it('should create the correct amount of cards for each bean', () => {
    const beans: Bean[] = [
      {variety: 'cocoa', total: 4, beanometer: null},
      {variety: 'coffee', total: 24, beanometer: null},
    ];
    const cards = createCards(beans);
    const cocoaBeans = cards.filter((card) => card.variety === 'cocoa');
    const coffeeBeans = cards.filter((card) => card.variety === 'coffee');

    expect(cocoaBeans.length).toEqual(4);
    expect(coffeeBeans.length).toEqual(24);
  });

  it('should give each bean a unique id', () => {
    const beans: Bean[] = [
      {variety: 'cocoa', total: 4, beanometer: null},
      {variety: 'coffee', total: 24, beanometer: null},
    ];
    const ids = createCards(beans).map(({id}) => id);

    expect(ids.length).toEqual(Array.from(new Set(ids)).length);
  });
});
