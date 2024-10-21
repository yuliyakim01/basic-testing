import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 2, b: 2, action: Action.Add, expected: 4 },
  { a: 3, b: 2, action: Action.Add, expected: 5 },
  { a: 5, b: 3, action: Action.Subtract, expected: 2 },
  { a: 6, b: 2, action: Action.Subtract, expected: 4 },
  { a: 4, b: 2, action: Action.Multiply, expected: 8 },
  { a: 9, b: 3, action: Action.Divide, expected: 3 },
  { a: 2, b: 3, action: Action.Exponentiate, expected: 8 },
];

const invalidTestCases = [
  { a: '1', b: 2, action: Action.Add, expected: null },
  { a: 1, b: '2', action: Action.Multiply, expected: null },
  { a: 1, b: 2, action: 'invalid', expected: null },
];

describe('simpleCalculator', () => {
  // Valid input test cases
  test.each(testCases)(
    'should correctly calculate $a $action $b and return $expected',
    ({ a, b, action, expected }) => {
      const result = simpleCalculator({ a, b, action });
      expect(result).toBe(expected);
    },
  );

  // Invalid input test cases
  test.each(invalidTestCases)(
    'should return null for invalid input: $a $action $b',
    ({ a, b, action, expected }) => {
      const result = simpleCalculator({ a, b, action });
      expect(result).toBe(expected);
    },
  );
});
