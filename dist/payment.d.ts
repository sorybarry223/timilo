import type { GeneratePaymentLinkInput, GeneratePaymentLinkOutput } from './types';
export declare function generatePaymentLink(accessToken: string, paymentUrl: string, input: GeneratePaymentLinkInput): Promise<GeneratePaymentLinkOutput>;
