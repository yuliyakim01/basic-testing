import { mockOne, mockTwo, mockThree, unmockedFunction } from './index';

jest.mock('./index', () => {
  return {
    mockOne: jest.fn(), // Mock this function
    mockTwo: jest.fn(), // Mock this function
    mockThree: jest.fn(), // Mock this function
    unmockedFunction: jest.requireActual('./index').unmockedFunction, // Leave this unmocked
  };
});

describe('partial mocking', () => {
  afterAll(() => {
    jest.unmock('./index'); // Ensure unmocking after all tests
  });

  test('mockOne, mockTwo, mockThree should not log into console', () => {
    // Spy on console.log
    const consoleSpy = jest.spyOn(console, 'log');

    // Call the mocked functions
    mockOne();
    mockTwo();
    mockThree();

    // Ensure that console.log was not called
    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore(); // Restore original console.log functionality
  });

  test('unmockedFunction should log into console', () => {
    // Spy on console.log
    const consoleSpy = jest.spyOn(console, 'log');

    // Call the unmocked function
    unmockedFunction();

    // Ensure that console.log was called with the expected output
    expect(consoleSpy).toHaveBeenCalledWith('I am not mocked');

    consoleSpy.mockRestore(); // Restore original console.log functionality
  });
});
