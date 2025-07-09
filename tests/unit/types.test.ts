import { describe, it, expect } from '@jest/globals';
import type { 
  OrangeMoneyConfig, 
  GeneratePaymentLinkInput, 
  GeneratePaymentLinkOutput 
} from '../../src/types';

describe('Types Module', () => {
  describe('OrangeMoneyConfig', () => {
    it('should have correct structure', () => {
      const config: OrangeMoneyConfig = {
        basicToken: 'basic-token-123',
        tokenUrl: 'https://api.example.com/token',
        paymentUrl: 'https://api.example.com/payment'
      };

      expect(config).toHaveProperty('basicToken');
      expect(config).toHaveProperty('tokenUrl');
      expect(config).toHaveProperty('paymentUrl');
      expect(typeof config.basicToken).toBe('string');
      expect(typeof config.tokenUrl).toBe('string');
      expect(typeof config.paymentUrl).toBe('string');
    });
  });

  describe('GeneratePaymentLinkInput', () => {
    it('should have correct structure with all required fields', () => {
      const input: GeneratePaymentLinkInput = {
        merchantKey: 'merchant-key-123',
        orderId: 'order-123',
        totalPrice: 1000,
        returnUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel',
        notifUrl: 'https://example.com/notify'
      };

      expect(input).toHaveProperty('merchantKey');
      expect(input).toHaveProperty('orderId');
      expect(input).toHaveProperty('totalPrice');
      expect(input).toHaveProperty('returnUrl');
      expect(input).toHaveProperty('cancelUrl');
      expect(input).toHaveProperty('notifUrl');
      expect(typeof input.merchantKey).toBe('string');
      expect(typeof input.orderId).toBe('string');
      expect(typeof input.totalPrice).toBe('number');
      expect(typeof input.returnUrl).toBe('string');
      expect(typeof input.cancelUrl).toBe('string');
      expect(typeof input.notifUrl).toBe('string');
    });

    it('should allow optional currency field', () => {
      const input: GeneratePaymentLinkInput = {
        merchantKey: 'merchant-key-123',
        orderId: 'order-123',
        totalPrice: 1000,
        currency: 'XOF',
        returnUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel',
        notifUrl: 'https://example.com/notify'
      };

      expect(input).toHaveProperty('currency');
      expect(typeof input.currency).toBe('string');
    });

    it('should work without optional currency field', () => {
      const input: GeneratePaymentLinkInput = {
        merchantKey: 'merchant-key-123',
        orderId: 'order-123',
        totalPrice: 1000,
        returnUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel',
        notifUrl: 'https://example.com/notify'
      };

      expect(input).not.toHaveProperty('currency');
    });
  });

  describe('GeneratePaymentLinkOutput', () => {
    it('should have correct structure', () => {
      const output: GeneratePaymentLinkOutput = {
        payment_url: 'https://payment.example.com/pay/123',
        notif_token: 'notif-token-123'
      };

      expect(output).toHaveProperty('payment_url');
      expect(output).toHaveProperty('notif_token');
      expect(typeof output.payment_url).toBe('string');
      expect(typeof output.notif_token).toBe('string');
    });
  });

  describe('Type compatibility', () => {
    it('should allow valid data to be assigned to types', () => {
      // Test OrangeMoneyConfig
      const config: OrangeMoneyConfig = {
        basicToken: 'test-basic-token',
        tokenUrl: 'https://test.com/token',
        paymentUrl: 'https://test.com/payment'
      };
      expect(config).toBeDefined();

      // Test GeneratePaymentLinkInput
      const input: GeneratePaymentLinkInput = {
        merchantKey: 'test-merchant-key',
        orderId: 'test-order-id',
        totalPrice: 5000,
        currency: 'XOF',
        returnUrl: 'https://test.com/return',
        cancelUrl: 'https://test.com/cancel',
        notifUrl: 'https://test.com/notify'
      };
      expect(input).toBeDefined();

      // Test GeneratePaymentLinkOutput
      const output: GeneratePaymentLinkOutput = {
        payment_url: 'https://test.com/payment-url',
        notif_token: 'test-notif-token'
      };
      expect(output).toBeDefined();
    });
  });
});
