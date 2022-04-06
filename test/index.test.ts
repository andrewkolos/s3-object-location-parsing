import { fizz } from '../src/index';

describe('fizz', () => {
  it('returns buzz', () => {
    expect(fizz()).toEqual('buzz');
  });
});
