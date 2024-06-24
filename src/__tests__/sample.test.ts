import { add } from '../sample';

const cases = [
  [1, 2, 3],
  [0, 0, 0],
  [5, -10, -5],
];
describe('Add function should return sum of two numbers', () => {
  test.each(cases)(
    `Sum of %p and %p should be equal to %p`,
    (num1: number, num2: number, num3: number) => {
      const result = add(num1, num2);
      expect(result).toEqual(num3);
    }
  );
});
