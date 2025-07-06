import axios from 'axios';
import type { GeneratePaymentLinkInput, GeneratePaymentLinkOutput } from './types';

export async function generatePaymentLink(
  accessToken: string,
  paymentUrl: string,
  input: GeneratePaymentLinkInput
): Promise<GeneratePaymentLinkOutput> {
  const body = {
    merchant_key: input.merchantKey,
    currency: input.currency || 'XOF',
    order_id: input.orderId,
    amount: input.totalPrice,
    return_url: input.returnUrl,
    cancel_url: input.cancelUrl,
    notif_url: input.notifUrl,
    lang: 'fr',
    reference: 'MyReference',
  };

  const response = await axios.post(paymentUrl, body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.data?.payment_url || !response.data?.notif_token) {
    throw new Error('payment_url or notif_token missing in response');
  }

  return {
    payment_url: response.data.payment_url,
    notif_token: response.data.notif_token,
  };
}
