import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import axios from 'axios';
import { OrangeMoney } from '../../src/index';
import type { OrangeMoneyConfig, GeneratePaymentLinkInput } from '../../src/types';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('OrangeMoney SDK Integration', () => {
  let orangeMoney: OrangeMoney;
  let config: OrangeMoneyConfig;

  beforeEach(() => {
    jest.clearAllMocks();
    
    config = {
      basicToken: 'basic-token-123',
      tokenUrl: 'https://api.example.com/token',
      paymentUrl: 'https://api.example.com/payment'
    };
    
    orangeMoney = new OrangeMoney(config);
  });

  describe('Constructor', () => {
    it('should create instance with correct configuration', () => {
      expect(orangeMoney).toBeInstanceOf(OrangeMoney);
    });
  });

  describe('getToken', () => {
    it('should successfully get access token', async () => {
      const mockTokenResponse = {
        data: {
          access_token: 'mock-access-token-123',
          token_type: 'Bearer',
          expires_in: 3600
        }
      };

      mockedAxios.post.mockResolvedValueOnce(mockTokenResponse);

      const result = await orangeMoney.getToken();

      expect(result).toBe('mock-access-token-123');
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api.example.com/token',
        'grant_type=client_credentials',
        {
          headers: {
            Authorization: 'Basic basic-token-123',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
    });

    it('should throw error when token request fails', async () => {
      const error = new Error('Authentication failed');
      mockedAxios.post.mockRejectedValueOnce(error);

      await expect(orangeMoney.getToken()).rejects.toThrow('Authentication failed');
    });
  });

  describe('createPaymentLink', () => {
    const mockPaymentInput: GeneratePaymentLinkInput = {
      merchantKey: 'merchant-key-123',
      orderId: 'order-123',
      totalPrice: 1000,
      currency: 'XOF',
      returnUrl: 'https://example.com/success',
      cancelUrl: 'https://example.com/cancel',
      notifUrl: 'https://example.com/notify'
    };

    it('should successfully create payment link with complete flow', async () => {
      // Mock token response
      const mockTokenResponse = {
        data: {
          access_token: 'mock-access-token-123',
          token_type: 'Bearer',
          expires_in: 3600
        }
      };

      // Mock payment response
      const mockPaymentResponse = {
        data: {
          payment_url: 'https://payment.example.com/pay/123',
          notif_token: 'notif-token-123'
        }
      };

      // Set up axios to return different responses for different calls
      mockedAxios.post
        .mockResolvedValueOnce(mockTokenResponse)  // First call for token
        .mockResolvedValueOnce(mockPaymentResponse); // Second call for payment

      const result = await orangeMoney.createPaymentLink(mockPaymentInput);

      expect(result).toEqual({
        payment_url: 'https://payment.example.com/pay/123',
        notif_token: 'notif-token-123'
      });

      // Verify token request was made
      expect(mockedAxios.post).toHaveBeenNthCalledWith(
        1,
        'https://api.example.com/token',
        'grant_type=client_credentials',
        {
          headers: {
            Authorization: 'Basic basic-token-123',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      // Verify payment request was made
      expect(mockedAxios.post).toHaveBeenNthCalledWith(
        2,
        'https://api.example.com/payment',
        {
          merchant_key: 'merchant-key-123',
          currency: 'XOF',
          order_id: 'order-123',
          amount: 1000,
          return_url: 'https://example.com/success',
          cancel_url: 'https://example.com/cancel',
          notif_url: 'https://example.com/notify',
          lang: 'fr',
          reference: 'MyReference'
        },
        {
          headers: {
            Authorization: 'Bearer mock-access-token-123',
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should use default currency when not provided', async () => {
      const inputWithoutCurrency = { ...mockPaymentInput };
      delete inputWithoutCurrency.currency;

      const mockTokenResponse = {
        data: {
          access_token: 'mock-access-token-123',
          token_type: 'Bearer',
          expires_in: 3600
        }
      };

      const mockPaymentResponse = {
        data: {
          payment_url: 'https://payment.example.com/pay/123',
          notif_token: 'notif-token-123'
        }
      };

      mockedAxios.post
        .mockResolvedValueOnce(mockTokenResponse)
        .mockResolvedValueOnce(mockPaymentResponse);

      await orangeMoney.createPaymentLink(inputWithoutCurrency);

      // Verify payment request uses default currency
      expect(mockedAxios.post).toHaveBeenNthCalledWith(
        2,
        'https://api.example.com/payment',
        expect.objectContaining({
          currency: 'XOF'
        }),
        expect.any(Object)
      );
    });

    it('should throw error when token request fails', async () => {
      const error = new Error('Authentication failed');
      mockedAxios.post.mockRejectedValueOnce(error);

      await expect(orangeMoney.createPaymentLink(mockPaymentInput)).rejects.toThrow('Authentication failed');
    });

    it('should throw error when payment request fails after successful token', async () => {
      const mockTokenResponse = {
        data: {
          access_token: 'mock-access-token-123',
          token_type: 'Bearer',
          expires_in: 3600
        }
      };

      const paymentError = new Error('Payment creation failed');

      mockedAxios.post
        .mockResolvedValueOnce(mockTokenResponse)
        .mockRejectedValueOnce(paymentError);

      await expect(orangeMoney.createPaymentLink(mockPaymentInput)).rejects.toThrow('Payment creation failed');
    });

    it('should throw error when payment response is invalid', async () => {
      const mockTokenResponse = {
        data: {
          access_token: 'mock-access-token-123',
          token_type: 'Bearer',
          expires_in: 3600
        }
      };

      const mockInvalidPaymentResponse = {
        data: {
          error: 'Invalid request'
          // Missing payment_url and notif_token
        }
      };

      mockedAxios.post
        .mockResolvedValueOnce(mockTokenResponse)
        .mockResolvedValueOnce(mockInvalidPaymentResponse);

      await expect(orangeMoney.createPaymentLink(mockPaymentInput)).rejects.toThrow(
        'payment_url or notif_token missing in response'
      );
    });
  });

  describe('End-to-end flow', () => {
    it('should handle complete payment flow with real-world data', async () => {
      const realConfig: OrangeMoneyConfig = {
        basicToken: 'dGVzdDp0ZXN0', // base64 encoded "test:test"
        tokenUrl: 'https://api.orange.com/oauth/v3/token',
        paymentUrl: 'https://api.orange.com/collection/api/v1/requesttopay'
      };

      const realPaymentInput: GeneratePaymentLinkInput = {
        merchantKey: 'test-merchant-key',
        orderId: 'ORDER-2024-001',
        totalPrice: 5000,
        currency: 'XOF',
        returnUrl: 'https://myapp.com/payment/success',
        cancelUrl: 'https://myapp.com/payment/cancel',
        notifUrl: 'https://myapp.com/payment/webhook'
      };

      const orangeMoneyInstance = new OrangeMoney(realConfig);

      const mockTokenResponse = {
        data: {
          access_token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
          token_type: 'Bearer',
          expires_in: 3600
        }
      };

      const mockPaymentResponse = {
        data: {
          payment_url: 'https://pay.orange.com/pay/abc123',
          notif_token: 'webhook-token-xyz789'
        }
      };

      mockedAxios.post
        .mockResolvedValueOnce(mockTokenResponse)
        .mockResolvedValueOnce(mockPaymentResponse);

      const result = await orangeMoneyInstance.createPaymentLink(realPaymentInput);

      expect(result).toEqual({
        payment_url: 'https://pay.orange.com/pay/abc123',
        notif_token: 'webhook-token-xyz789'
      });

      // Verify the complete flow
      expect(mockedAxios.post).toHaveBeenCalledTimes(2);
    });
  });
});
