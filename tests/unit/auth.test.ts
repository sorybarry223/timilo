import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import axios from 'axios';
import { getAccessToken } from '../../src/auth';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Auth Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAccessToken', () => {
    it('should successfully get access token', async () => {
      const mockResponse = {
        data: {
          access_token: 'mock-access-token-123',
          token_type: 'Bearer',
          expires_in: 3600
        }
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const tokenUrl = 'https://api.example.com/token';
      const basicToken = 'basic-token-123';

      const result = await getAccessToken(tokenUrl, basicToken);

      expect(result).toBe('mock-access-token-123');
      expect(mockedAxios.post).toHaveBeenCalledWith(
        tokenUrl,
        'grant_type=client_credentials',
        {
          headers: {
            Authorization: 'Basic basic-token-123',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
    });

    it('should throw error when no access token in response', async () => {
      const mockResponse = {
        data: {
          error: 'invalid_client',
          error_description: 'Client authentication failed'
        }
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const tokenUrl = 'https://api.example.com/token';
      const basicToken = 'invalid-token';

      await expect(getAccessToken(tokenUrl, basicToken)).rejects.toThrow(
        'No access token found in response'
      );
    });

    it('should throw error when axios request fails', async () => {
      const error = new Error('Network error');
      mockedAxios.post.mockRejectedValueOnce(error);

      const tokenUrl = 'https://api.example.com/token';
      const basicToken = 'basic-token-123';

      await expect(getAccessToken(tokenUrl, basicToken)).rejects.toThrow('Network error');
    });

    it('should handle empty response data', async () => {
      const mockResponse = {
        data: {}
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const tokenUrl = 'https://api.example.com/token';
      const basicToken = 'basic-token-123';

      await expect(getAccessToken(tokenUrl, basicToken)).rejects.toThrow(
        'No access token found in response'
      );
    });
  });
});