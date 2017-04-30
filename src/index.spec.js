import test from 'tape';
import index from './index';

test('hello world', (assert) => {
  assert.equal(index, 'hello');

  assert.test('should be lowercase', (t) => {
    t.equal(index, 'hello');
    t.end();
  });
  assert.end();
});
