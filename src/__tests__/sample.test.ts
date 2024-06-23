import { add } from '../sample';

const cases = [
  [1, 2, 3],
  [0, 0, 0],
  [5, -10, -4],
];
describe('Add function should return sum of two numbers', () => {
  test.each(cases)(
    `Sum of %p and %p should be equal to %p`,
    (num1, num2, num3) => {
      const result = add(num1, num2);
      expect(result).toEqual(num3);
    }
  );
});
