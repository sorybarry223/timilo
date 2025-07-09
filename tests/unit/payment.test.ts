import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import axios from 'axios';
import { generatePaymentLink } from '../../src/payment';
import type { GeneratePaymentLinkInput } from '../../src/types';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Payment Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generatePaymentLink', () => {
    const mockInput: GeneratePaymentLinkInput = {
      merchantKey: 'merchant-key-123',
      orderId: 'order-123',
      totalPrice: 1000,
      currency: 'XOF',
      returnUrl: 'https://example.com/success',
      cancelUrl: 'https://example.com/cancel',
      notifUrl: 'https://example.com/notify'
    };

    it('should successfully generate payment link', async () => {
      const mockResponse = {
        data: {
          payment_url: 'https://payment.example.com/pay/123',
          notif_token: 'notif-token-123'
        }
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const accessToken = 'access-token-123';
      const paymentUrl = 'https://api.example.com/payment';

      const result = await generatePaymentLink(accessToken, paymentUrl, mockInput);

      expect(result).toEqual({
        payment_url: 'https://payment.example.com/pay/123',
        notif_token: 'notif-token-123'
      });

      expect(mockedAxios.post).toHaveBeenCalledWith(
        paymentUrl,
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
            Authorization: 'Bearer access-token-123',
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should use default currency when not provided', async () => {
      const inputWithoutCurrency = { ...mockInput };
      delete inputWithoutCurrency.currency;

      const mockResponse = {
        data: {
          payment_url: 'https://payment.example.com/pay/123',
          notif_token: 'notif-token-123'
        }
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const accessToken = 'access-token-123';
      const paymentUrl = 'https://api.example.com/payment';

      await generatePaymentLink(accessToken, paymentUrl, inputWithoutCurrency);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        paymentUrl,
        expect.objectContaining({
          currency: 'XOF'
        }),
        expect.any(Object)
      );
    });

    it('should throw error when payment_url is missing', async () => {
      const mockResponse = {
        data: {
          notif_token: 'notif-token-123'
          // payment_url is missing
        }
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const accessToken = 'access-token-123';
      const paymentUrl = 'https://api.example.com/payment';

      await expect(generatePaymentLink(accessToken, paymentUrl, mockInput)).rejects.toThrow(
        'payment_url or notif_token missing in response'
      );
    });

    it('should throw error when notif_token is missing', async () => {
      const mockResponse = {
        data: {
          payment_url: 'https://payment.example.com/pay/123'
          // notif_token is missing
        }
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const accessToken = 'access-token-123';
      const paymentUrl = 'https://api.example.com/payment';

      await expect(generatePaymentLink(accessToken, paymentUrl, mockInput)).rejects.toThrow(
        'payment_url or notif_token missing in response'
      );
    });

    it('should throw error when both payment_url and notif_token are missing', async () => {
      const mockResponse = {
        data: {
          error: 'Invalid request'
        }
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const accessToken = 'access-token-123';
      const paymentUrl = 'https://api.example.com/payment';

      await expect(generatePaymentLink(accessToken, paymentUrl, mockInput)).rejects.toThrow(
        'payment_url or notif_token missing in response'
      );
    });

    it('should throw error when axios request fails', async () => {
      const error = new Error('Network error');
      mockedAxios.post.mockRejectedValueOnce(error);

      const accessToken = 'access-token-123';
      const paymentUrl = 'https://api.example.com/payment';

      await expect(generatePaymentLink(accessToken, paymentUrl, mockInput)).rejects.toThrow('Network error');
    });

    it('should handle empty response data', async () => {
      const mockResponse = {
        data: {}
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const accessToken = 'access-token-123';
      const paymentUrl = 'https://api.example.com/payment';

      await expect(generatePaymentLink(accessToken, paymentUrl, mockInput)).rejects.toThrow(
        'payment_url or notif_token missing in response'
      );
    });
  });
});
