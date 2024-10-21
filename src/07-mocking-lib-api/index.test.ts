import axios from 'axios';
import { throttledGetDataFromApi } from './index';


jest.mock('axios');
jest.mock('lodash', () => ({
  ...jest.requireActual('lodash'),
  throttle: jest.fn((fn) => fn), 
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('throttledGetDataFromApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create instance with provided base url', async () => {
    const mockAxiosInstance = {
      get: jest.fn().mockResolvedValue({ data: {} }),
    };

    mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

    await throttledGetDataFromApi('/posts/1');

    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const mockAxiosInstance = {
      get: jest.fn().mockResolvedValue({ data: { id: 1, title: 'test post' } }),
    };

    mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

    await throttledGetDataFromApi('/posts/1');
    
    // Ensure the throttled function is called immediately
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/posts/1');
  });

  test('should return response data', async () => {
    const mockAxiosInstance = {
      get: jest.fn().mockResolvedValue({ data: { id: 1, title: 'test post' } }),
    };

    mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

    const result = await throttledGetDataFromApi('/posts/1');

    expect(result).toEqual({ id: 1, title: 'test post' });
  });
});
