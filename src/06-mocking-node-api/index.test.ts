import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from './index';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));

jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
}));

jest.mock('path', () => ({
  join: jest.fn().mockReturnValue('/mocked/full/path/to/file'),
}));

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers(); // Set up fake timers before all tests
  });

  afterAll(() => {
    jest.useRealTimers(); // Restore real timers after tests
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();

    doStuffByTimeout(callback, 1000);
    
    // Fast-forward until all timers have been executed
    jest.runAllTimers();

    expect(callback).toHaveBeenCalled();
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();

    doStuffByTimeout(callback, 1000);

    // Move time forward by less than the timeout
    jest.advanceTimersByTime(500);
    expect(callback).not.toHaveBeenCalled();

    // Move time forward to trigger the timeout
    jest.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers(); // Set up fake timers before all tests
  });

  afterAll(() => {
    jest.useRealTimers(); // Restore real timers after tests
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();

    doStuffByInterval(callback, 1000);

    // Fast-forward time by one interval (1000ms)
    jest.advanceTimersByTime(1000);

    expect(callback).toHaveBeenCalled();
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();

    doStuffByInterval(callback, 1000);

    // Fast-forward time by three intervals (3000ms)
    jest.advanceTimersByTime(3000);

    expect(callback).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    await readFileAsynchronously('testFile.txt');
    
    expect(join).toHaveBeenCalledWith(__dirname, 'testFile.txt');
  });

  test('should return null if file does not exist', async () => {
    (existsSync as jest.Mock).mockReturnValue(false);

    const result = await readFileAsynchronously('nonExistentFile.txt');

    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    (existsSync as jest.Mock).mockReturnValue(true);
    (readFile as jest.Mock).mockResolvedValue(Buffer.from('file content'));

    const result = await readFileAsynchronously('existingFile.txt');

    expect(result).toBe('file content');
  });
});
